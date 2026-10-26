"""Keep public inventory scope and exact service identities distinct in the snapshot."""

from __future__ import annotations

import copy
import io
import json
import tempfile
import unittest
from collections import Counter
from contextlib import redirect_stderr
from pathlib import Path
from typing import Any

from parliament_streams.catalogue import load_json_object
from parliament_streams.data_contracts import require_json_schema
from parliament_streams.inventory.projection import (
    REPORT_BASE_URL,
    build_payload,
    countries_for_scope,
    http_urls,
    report_urls,
)
from parliament_streams.inventory.reviews import load_reviews
from tools.build_institution_site_data import (
    ASSIGNMENT,
    DEFAULT_CATALOGUE_PATH,
    DEFAULT_DIRECTORY_PATH,
    DEFAULT_INVENTORY_PATH,
    DEFAULT_SERVICE_REGISTER_PATH,
    DEFAULT_TARGET_PATH,
    main,
    render_site_data,
)


def institution(institution_id: str, **changes: Any) -> dict[str, Any]:
    result = {
        "id": institution_id,
        "country": "Canada",
        "name": "Assembly",
        "level": "national",
        "inventory_grain": "chamber",
        "authority_status": "eligible_legislature",
        "decision_basis": "Confirmed legislative authority; service validation is separate.",
        "primary_urls": ["https://example.test/authority"],
        "provenance": [{"report": "reports/discovery/source.json", "record_id": institution_id}],
    }
    result.update(changes)
    return result


def sources() -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    inventory = {
        "reviewed_on": "2026-10-24",
        "scope": {
            "countries": ["Canada"],
            "country_baseline": "Fixed research baseline",
            "territorial_boundary": "First-level and autonomous special-status legislatures",
        },
        "records": [
            institution("national--ca-lc01", name="House of Commons"),
            institution("national--ca-uc01", name="Senate"),
            institution("canada--regional-parent", existing_catalogue_ids=["regional-stream"]),
            institution(
                "canada--regional-child",
                name="Assembly",
                relationships=[{"type": "chamber_of", "institution_id": "canada--regional-parent"}],
            ),
        ],
        # These are intentionally tempting but are not an exact chamber crosswalk.
        "country_reconciliations": [{"country": "Canada", "catalogue_ids": ["cpac"]}],
    }
    catalogue = {
        "channels": [
            {
                "id": "commons-stream",
                "country_or_region": "Canada",
                "jurisdiction_level": "national",
                "external_ids": {"ipu_country_code": "CA", "ipu_chamber_code": "CA-LC01"},
                "identity_sources": [
                    {
                        "source": "ipu_parline",
                        "confidence": "high",
                        "url": "https://data.ipu.org/parliament/CA/CA-LC01/",
                    }
                ],
            },
            {
                "id": "cpac",
                "name": "Parliament of Canada",
                "country_or_region": "Canada",
                "jurisdiction_level": "national",
                "external_ids": {"ipu_country_code": "CA", "ipu_chamber_code": None},
            },
            {"id": "regional-stream", "country_or_region": "Canada"},
        ]
    }
    directory = {
        "national_chambers": [
            {
                "id": "national--ca-lc01",
                "country": "Canada",
                "ipu_country_code": "CA",
                "ipu_chamber_code": "CA-LC01",
            },
            {
                "id": "national--ca-uc01",
                "country": "Canada",
                "ipu_country_code": "CA",
                "ipu_chamber_code": "CA-UC01",
            },
        ],
        "countries": [{"country": "Canada", "national_catalogue_source_ids": ["cpac"]}],
    }
    return inventory, catalogue, directory


class InstitutionSnapshotTests(unittest.TestCase):
    def setUp(self) -> None:
        self.inventory, self.catalogue, self.directory = sources()

    def payload_records(self) -> dict[str, dict[str, Any]]:
        data = build_payload(self.inventory, self.catalogue, self.directory)
        return {row["id"]: row for row in data["records"]}

    def test_exact_chamber_id_does_not_spread_to_other_chambers_or_country(self) -> None:
        rows = self.payload_records()
        self.assertEqual(rows["national--ca-lc01"]["catalogue_ids"], ["commons-stream"])
        self.assertEqual(rows["national--ca-uc01"]["catalogue_ids"], [])
        self.assertNotIn("cpac", {value for row in rows.values() for value in row["catalogue_ids"]})

    def test_explicit_parent_service_does_not_propagate_to_a_child(self) -> None:
        rows = self.payload_records()
        self.assertEqual(rows["canada--regional-parent"]["catalogue_ids"], ["regional-stream"])
        self.assertEqual(rows["canada--regional-child"]["catalogue_ids"], [])
        self.assertEqual(
            rows["canada--regional-child"]["relationships"],
            [{"type": "chamber_of", "institution_id": "canada--regional-parent"}],
        )

    def test_service_register_pointer_and_same_name_do_not_create_a_service_link(self) -> None:
        self.inventory["records"].append(
            institution(
                "canada--new-assembly",
                name="House of Commons",
                service_validation_register="reports/discovery/old-service-cohort.json",
            )
        )
        self.assertEqual(self.payload_records()["canada--new-assembly"]["catalogue_ids"], [])

    def test_unknown_catalogue_ids_are_not_published(self) -> None:
        self.inventory["records"][2]["existing_catalogue_ids"] = [
            "regional-stream",
            "regional-stream",
            "removed-source",
        ]
        self.assertEqual(
            self.payload_records()["canada--regional-parent"]["catalogue_ids"], ["regional-stream"]
        )

    def test_newer_exact_body_crosswalk_supersedes_old_links_without_child_inheritance(
        self,
    ) -> None:
        self.catalogue["channels"].append({"id": "newer-regional-source"})
        register = {
            "eligible_bodies": [
                {
                    "body_id": "canada--regional-parent",
                    "catalogue_ids": ["newer-regional-source", "missing-source"],
                }
            ]
        }
        data = build_payload(self.inventory, self.catalogue, self.directory, register)
        rows = {row["id"]: row for row in data["records"]}
        self.assertEqual(
            rows["canada--regional-parent"]["catalogue_ids"], ["newer-regional-source"]
        )
        self.assertEqual(rows["canada--regional-child"]["catalogue_ids"], [])
        self.assertTrue(
            any(
                "current-validation-register.json" in url
                for url in rows["canada--regional-parent"]["report_urls"]
            )
        )
        register["eligible_bodies"][0]["catalogue_ids"] = []
        data = build_payload(self.inventory, self.catalogue, self.directory, register)
        rows = {row["id"]: row for row in data["records"]}
        self.assertEqual(rows["canada--regional-parent"]["catalogue_ids"], [])

    def test_current_dated_crosswalk_supersedes_historical_empty_match(self) -> None:
        body = self.inventory["records"][2]
        body["catalogue_crosswalk"] = {
            "catalogue_ids": ["regional-stream"],
            "reviewed_on": "2026-10-24",
            "report": "reports/discovery/publication.json",
        }
        register = {"eligible_bodies": [{"body_id": body["id"], "catalogue_ids": []}]}
        payload = build_payload(self.inventory, self.catalogue, self.directory, register)
        rows = {row["id"]: row for row in payload["records"]}
        self.assertEqual(rows[body["id"]]["catalogue_ids"], ["regional-stream"])
        self.assertEqual(rows["canada--regional-child"]["catalogue_ids"], [])
        self.assertIn(
            REPORT_BASE_URL + "reports/discovery/publication.json", rows[body["id"]]["report_urls"]
        )
        body["catalogue_crosswalk"]["catalogue_ids"] = ["missing"]
        with self.assertRaisesRegex(ValueError, "unknown catalogue"):
            build_payload(self.inventory, self.catalogue, self.directory, register)

    def test_source_followup_exposes_own_routes_and_dated_gaps_without_new_catalogue_match(
        self,
    ) -> None:
        review = (
            "reports/discovery/followup.json",
            {
                "reviewed_on": "2026-10-24",
                "scope": "Scoped source findings",
                "records": [
                    {
                        "id": "canada--regional-child",
                        "metadata": {"institutional_url": "https://assembly.ca/"},
                        "unresolved": ["Programme-to-media mapping remains unresolved."],
                    }
                ],
            },
        )
        payload = build_payload(self.inventory, self.catalogue, self.directory, None, [review])
        rows = {row["id"]: row for row in payload["records"]}
        child = rows["canada--regional-child"]
        self.assertEqual(child["catalogue_ids"], [])
        self.assertIn("https://assembly.ca/", child["primary_urls"])
        self.assertEqual(child["service_review"]["stage"], "partial_source_followup")
        self.assertEqual(
            child["service_review"]["followups"][0]["unresolved"],
            ["Programme-to-media mapping remains unresolved."],
        )
        self.assertNotIn("https://assembly.ca/", rows["canada--regional-parent"]["primary_urls"])
        self.assertEqual(rows["canada--regional-parent"]["service_review"]["followups"], [])

    def test_unknown_or_duplicate_body_crosswalk_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown institution ID"):
            build_payload(
                self.inventory,
                self.catalogue,
                self.directory,
                {"eligible_bodies": [{"body_id": "unknown", "catalogue_ids": []}]},
            )
        body = {"body_id": "canada--regional-parent", "catalogue_ids": []}
        with self.assertRaisesRegex(ValueError, "duplicate service crosswalk"):
            build_payload(
                self.inventory, self.catalogue, self.directory, {"eligible_bodies": [body, body]}
            )

    def test_chamber_crosswalk_requires_matching_country_level_and_primary_identity(self) -> None:
        original = copy.deepcopy(self.catalogue["channels"][0])
        changes = [
            {"country_or_region": "France"},
            {"jurisdiction_level": "subnational"},
            {"external_ids": {"ipu_country_code": "US", "ipu_chamber_code": "CA-LC01"}},
            {"identity_sources": []},
            {
                "identity_sources": [
                    {
                        "source": "ipu_parline",
                        "confidence": "low",
                        "url": "https://data.ipu.org/parliament/CA/CA-LC01/",
                    }
                ]
            },
            {
                "identity_sources": [
                    {
                        "source": "ipu_parline",
                        "confidence": "high",
                        "url": "https://data.ipu.org/parliament/CA/",
                    }
                ]
            },
        ]
        for change in changes:
            with self.subTest(change=change):
                self.catalogue["channels"][0] = {**original, **change}
                self.assertEqual(self.payload_records()["national--ca-lc01"]["catalogue_ids"], [])

    def test_status_and_missing_legal_instrument_are_preserved(self) -> None:
        record = self.inventory["records"][0]
        record["authority_status"] = "specific_authority_evidence_hold"
        record["remaining_authority_instruments"] = ["Final assented Act and commencement notice"]
        snapshot = self.payload_records()["national--ca-lc01"]
        self.assertEqual(snapshot["status"], "specific_authority_evidence_hold")
        self.assertEqual(
            snapshot["remaining_authority_instruments"], record["remaining_authority_instruments"]
        )
        self.assertNotIn("metadata_stream_epg_rights_validation_complete", snapshot)

    def test_urls_cannot_publish_executable_schemes_credentials_or_report_traversal(self) -> None:
        self.assertEqual(
            http_urls(
                [
                    "javascript:alert(1)",
                    "data:text/html,hello",
                    "//example.test/relative",
                    "https://user:secret@example.test/",
                    "https://example.test:invalid/",
                    "https://exa mple.test/",
                    "https://example.test/\nscript",
                    "file:///tmp/a",
                    "https://example.test/ok",
                    "http://example.test/ok",
                    "https://example.test/ok",
                ]
            ),
            ["http://example.test/ok", "https://example.test/ok"],
        )
        self.assertEqual(
            report_urls(
                [
                    {"report": "reports/discovery/source.json"},
                    {"report": "reports/../../outside.md"},
                    {"report": "/reports/absolute.json"},
                    {"report": "https://example.test/not-a-source.json"},
                    {"report": "reports/source.json#fragment"},
                    {"report": "reports/source.json?q=1"},
                ]
            ),
            [REPORT_BASE_URL + "reports/discovery/source.json"],
        )

    def test_missing_country_code_and_unknown_status_fail_instead_of_guessing(self) -> None:
        with self.assertRaisesRegex(ValueError, "Missing country codes"):
            countries_for_scope(["Unverified country"], self.directory)
        self.inventory["records"][0]["authority_status"] = "validated_stream"
        with self.assertRaisesRegex(ValueError, "unknown status"):
            self.payload_records()

    def test_projection_rejects_wrong_public_field_types_before_rendering(self) -> None:
        self.inventory["records"][0]["aliases"] = "A single string is not an alias list"
        with self.assertRaisesRegex(ValueError, "Invalid institution site data.*aliases"):
            build_payload(self.inventory, self.catalogue, self.directory)

    def test_public_schema_rejects_unknown_fields_invalid_dates_and_completion_claims(self) -> None:
        payload = build_payload(self.inventory, self.catalogue, self.directory)
        variants = []
        unknown = copy.deepcopy(payload)
        unknown["records"][0]["unreviewed_stream"] = "https://example.test/live"
        variants.append(unknown)
        invalid_date = copy.deepcopy(payload)
        invalid_date["records"][0]["service_review"]["reviewed_on"] = "yesterday"
        variants.append(invalid_date)
        false_claim = copy.deepcopy(payload)
        false_claim["scope"]["complete_exhaustive_institutional_census_certified"] = True
        variants.append(false_claim)
        for variant in variants:
            with (
                self.subTest(variant=variant),
                self.assertRaisesRegex(ValueError, "Invalid institution site data"),
            ):
                require_json_schema(
                    variant, "institution-site-data.schema.json", label="institution site data"
                )

    def test_broken_relationship_and_duplicate_identity_fail(self) -> None:
        self.inventory["records"][3]["relationships"][0]["institution_id"] = "missing-parent"
        with self.assertRaisesRegex(ValueError, "broken institution relationship"):
            self.payload_records()
        self.inventory["records"].append(self.inventory["records"][0])
        with self.assertRaisesRegex(ValueError, "Duplicate institution ID"):
            self.payload_records()

    def test_cli_detects_stale_snapshot_and_write_is_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            files = [root / name for name in ["inventory.json", "catalogue.json", "directory.json"]]
            for file, data in zip(
                files, [self.inventory, self.catalogue, self.directory], strict=True
            ):
                file.write_text(json.dumps(data), encoding="utf-8")
            register = root / "register.json"
            register.write_text('{"eligible_bodies": []}', encoding="utf-8")
            output = root / "snapshot.js"
            arguments = [
                "--inventory",
                str(files[0]),
                "--catalogue",
                str(files[1]),
                "--directory",
                str(files[2]),
                "--output",
                str(output),
                "--service-register",
                str(register),
            ]
            with redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as error:
                main([*arguments, "--check"])
            self.assertEqual(error.exception.code, 2)
            self.assertEqual(main([*arguments, "--write"]), 0)
            generated = output.read_text(encoding="utf-8")
            self.assertEqual(main([*arguments, "--check"]), 0)
            self.assertEqual(main(arguments), 0)
            self.assertEqual(generated, output.read_text(encoding="utf-8"))
            self.inventory["records"][0]["name"] = "Changed name"
            files[0].write_text(json.dumps(self.inventory), encoding="utf-8")
            with redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
                main([*arguments, "--check"])

    def test_source_text_cannot_terminate_an_embedded_script(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.inventory["records"][0]["name"] = "Assembly </script>\u2028next\u2029line"
            files = [
                root / f"{name}.json"
                for name in ["inventory", "catalogue", "directory", "register"]
            ]
            for file, data in zip(
                files,
                [self.inventory, self.catalogue, self.directory, {"eligible_bodies": []}],
                strict=True,
            ):
                file.write_text(json.dumps(data), encoding="utf-8")
            rendered = render_site_data(*files)
            self.assertNotIn("</script>", rendered)
            self.assertNotIn("\u2028", rendered)
            self.assertNotIn("\u2029", rendered)
            payload = json.loads(rendered.split(ASSIGNMENT, 1)[1].removesuffix(";\n"))
            row = next(row for row in payload["records"] if row["id"] == "national--ca-lc01")
            self.assertEqual(row["name"], self.inventory["records"][0]["name"])


class CurrentInstitutionSnapshotTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.inventory = load_json_object(DEFAULT_INVENTORY_PATH)
        cls.payload = build_payload(
            cls.inventory,
            load_json_object(DEFAULT_CATALOGUE_PATH),
            load_json_object(DEFAULT_DIRECTORY_PATH),
            load_json_object(DEFAULT_SERVICE_REGISTER_PATH),
            load_reviews(),
        )

    def test_all_inventory_records_and_four_statuses_survive(self) -> None:
        original = self.inventory["records"]
        actual = self.payload["records"]
        self.assertEqual(len(actual), 1412)
        self.assertEqual({row["id"] for row in actual}, {row["id"] for row in original})
        self.assertEqual(
            Counter(row["status"] for row in actual),
            Counter(row["authority_status"] for row in original),
        )
        self.assertEqual(
            self.payload["scope"]["default_statuses"],
            ["eligible_legislature", "specific_authority_evidence_hold"],
        )

    def test_all_71_country_codes_include_canonical_name_exceptions(self) -> None:
        codes = {row["name"]: row["code"] for row in self.payload["countries"]}
        self.assertEqual(len(codes), 71)
        self.assertEqual(set(codes), set(self.inventory["scope"]["countries"]))
        for name, code in {
            "Taiwan": "TW",
            "Cape Verde": "CV",
            "Czech Republic": "CZ",
            "South Korea": "KR",
            "United Kingdom": "GB",
            "Timor-Leste": "TL",
        }.items():
            self.assertEqual(codes[name], code)

    def test_known_exact_services_do_not_imply_other_chamber_coverage(self) -> None:
        rows = {row["id"]: row for row in self.payload["records"]}
        self.assertEqual(
            rows["national--ca-lc01"]["catalogue_ids"], ["canada-house-of-commons-parlvu"]
        )
        self.assertEqual(rows["national--ca-uc01"]["catalogue_ids"], ["canada-senate-senvu"])
        self.assertEqual(
            rows["national--ch-lc01"]["catalogue_ids"], ["swiss-national-council-live"]
        )
        self.assertEqual(rows["national--ch-uc01"]["catalogue_ids"], [])
        self.assertEqual(
            rows["switzerland--bern"]["catalogue_ids"], ["switzerland-bern-grand-council-archive"]
        )
        self.assertEqual(
            rows["india--frontier-nagaland-territorial-authority"]["catalogue_ids"], []
        )
        self.assertEqual(rows["hungary--budapest"]["catalogue_ids"], [])

    def test_historical_crosswalks_only_link_current_catalogue_sources(self) -> None:
        rows = {row["id"]: row for row in self.payload["records"]}
        published_ids = {
            channel["id"] for channel in load_json_object(DEFAULT_CATALOGUE_PATH)["channels"]
        }
        register = load_json_object(DEFAULT_SERVICE_REGISTER_PATH)
        self.assertEqual(
            sum(bool(body["catalogue_ids"]) for body in register["eligible_bodies"]), 143
        )
        for body in register["eligible_bodies"]:
            with self.subTest(body=body["body_id"]):
                current = next(
                    row for row in self.inventory["records"] if row["id"] == body["body_id"]
                )
                expected = current.get("catalogue_crosswalk", {}).get(
                    "catalogue_ids", body["catalogue_ids"]
                )
                self.assertEqual(
                    rows[body["body_id"]]["catalogue_ids"], sorted(set(expected) & published_ids)
                )

    def test_generated_classic_script_matches_sources_and_has_no_fetch_or_module_dependency(
        self,
    ) -> None:
        rendered = render_site_data()
        self.assertEqual(DEFAULT_TARGET_PATH.read_text(encoding="utf-8"), rendered)
        self.assertIn(ASSIGNMENT, rendered)
        self.assertNotIn("fetch(", rendered)
        self.assertNotIn("\nexport ", rendered)
        json_text = rendered.split(ASSIGNMENT, 1)[1].removesuffix(";\n")
        self.assertEqual(json.loads(json_text), self.payload)
        self.assertLess(len(rendered.encode("utf-8")), DEFAULT_INVENTORY_PATH.stat().st_size)


if __name__ == "__main__":
    unittest.main()
