from __future__ import annotations

import copy
import json
import unittest
from datetime import date
from typing import Any
from unittest.mock import patch

from tools.check_legislature_inventory import (
    IPU_ID,
    build_report,
    collect_sources,
    compare_evidence,
    compare_ipu,
    decision_ids,
    finding,
    markdown_text,
    plan_sources,
    render_markdown,
    review_dates,
    validate_baseline,
)
from tools.institution_inventory_sources import ipu_api_url
from tools.sanitize_research_evidence import secret_matches

TODAY = date(2026, 11, 1)
CHECKED_AT = "2026-11-01T07:00:00+00:00"


def record(code: str, name: str, website: str) -> dict[str, Any]:
    return {
        "id": "national--" + code.lower(),
        "country": "Canada",
        "name": name,
        "authority_status": "eligible_legislature",
        "primary_urls": [website],
        "source_published_institution_urls": [website],
        "relationships": [],
        "aliases": [],
    }


def inventory_fixture() -> dict[str, Any]:
    return {
        "reviewed_on": "2026-10-24",
        "scope": {"countries": ["Canada"]},
        "country_reconciliations": [
            {
                "country": "Canada",
                "primary_evidence": [{"url": "https://www.parl.ca/directory"}],
            }
        ],
        "records": [
            record("CA-LC01", "House of Commons", "https://www.ourcommons.ca/"),
            record("CA-UC01", "Senate", "https://sencanada.ca/"),
        ],
    }


def directory_fixture() -> dict[str, Any]:
    return {
        "national_chambers": [
            {
                "id": row["id"],
                "ipu_chamber_code": code,
                "ipu_country_code": "CA",
                "institution_name_from_source": row["name"],
                "source_published_parliamentary_urls": row["primary_urls"],
                "suspended_chamber_from_source": "No",
                "suspended_parliament_from_source": "No",
                "structure_from_source": "Bicameral",
                "parliament_name_from_source": "Parliament",
            }
            for code, row in zip(
                ("CA-LC01", "CA-UC01"), inventory_fixture()["records"], strict=True
            )
        ]
    }


def chamber(code: str, name: str, website: str) -> dict[str, Any]:
    return {
        "external_id": code,
        "country_code": "CA",
        "name": name,
        "website_urls": [website],
        "website_urls_known": True,
        "suspended": False,
        "structure": "Bicameral",
        "parliament_name": "Parliament",
    }


def chambers_fixture() -> list[dict[str, Any]]:
    return [
        chamber("CA-LC01", "House of Commons", "https://www.ourcommons.ca/"),
        chamber("CA-UC01", "Senate", "https://sencanada.ca/"),
    ]


def ipu_body(chambers: list[dict[str, Any]], total: int | None = None) -> bytes:
    rows = []
    for row in chambers:
        fields = {
            "country_code": row["country_code"],
            "chamber_code": row["external_id"],
            "chamber_name": row["name"],
            "parliament_name": row["parliament_name"],
            "structure_of_parliament": row["structure"],
            "is_suspended_chamber": "Yes" if row["suspended"] else "No",
            "is_suspended_parliament": "No",
            "parliamentary_website_url": (
                " ".join(f"<a href='{url}'>Website</a>" for url in row["website_urls"])
                if row.get("website_urls_known", True)
                else "No information available"
            ),
        }
        rows.append(
            {"row_data": [{"field_id": key, "cell_value": value} for key, value in fields.items()]}
        )
    return json.dumps(
        {
            "page": "1",
            "per_page": "500",
            "total_results": len(rows) if total is None else total,
            "table_array": {"body": rows},
        }
    ).encode()


def source_fixture(kind: str = "evidence") -> dict[str, Any]:
    return {
        "id": IPU_ID if kind == "ipu" else "country-directory",
        "url": ipu_api_url(TODAY.isoformat()) if kind == "ipu" else "https://www.parl.ca/directory",
        "kind": kind,
        "countries": ["Canada"],
        "record_ids": [] if kind == "ipu" else ["national--ca-lc01"],
        "directory": True,
        "safe": True,
    }


def fetched_fixture(source: dict[str, Any], body: bytes | str) -> dict[str, Any]:
    return {
        "source_id": source["id"],
        "checked_at": CHECKED_AT,
        "ok": True,
        "http_status": 200,
        "body": body.encode() if isinstance(body, str) else body,
        "content_type": "application/json" if source["kind"] == "ipu" else "text/html",
        "final_url": source["url"],
    }


def baseline_for(source: dict[str, Any], body: bytes | str) -> dict[str, Any]:
    _, snapshot = report_for(source, fetched_fixture(source, body))
    return snapshot


def report_for(
    source: dict[str, Any],
    fetched: dict[str, Any],
    baseline: dict[str, Any] | None = None,
    *,
    inventory: dict[str, Any] | None = None,
    decisions: dict[str, Any] | None = None,
    limited: bool = False,
) -> tuple[dict[str, Any], dict[str, Any]]:
    return build_report(
        inventory or inventory_fixture(),
        directory_fixture(),
        [source],
        {source["id"]: fetched},
        baseline,
        decisions or {"schema_version": 1, "decisions": []},
        TODAY,
        limited=limited,
    )


class LegislatureInventoryReviewTests(unittest.TestCase):
    def test_unchanged_national_directory_uses_current_inventory_names_and_aliases(self) -> None:
        inventory = inventory_fixture()
        directory = directory_fixture()
        directory["national_chambers"][0]["institution_name_from_source"] = "Old translation"
        current = {"url": ipu_api_url(TODAY.isoformat()), "chambers": chambers_fixture()}
        self.assertEqual(compare_ipu(current, directory, inventory), [])
        inventory["records"][0]["name"] = "Chambre des communes"
        inventory["records"][0]["aliases"] = ["House of Commons"]
        self.assertEqual(compare_ipu(current, directory, inventory), [])

    def test_national_addition_removal_and_rename_ids_are_stable_across_months(self) -> None:
        current_chambers = [
            chamber("CA-LC01", "Renamed Commons", "https://www.ourcommons.ca/"),
            chamber("CA-LC02", "New chamber", "https://new.parl.ca/"),
        ]
        first = compare_ipu(
            {"url": ipu_api_url("2026-11-01"), "chambers": current_chambers},
            directory_fixture(),
            inventory_fixture(),
        )
        second = compare_ipu(
            {"url": ipu_api_url("2026-12-01"), "chambers": current_chambers},
            directory_fixture(),
            inventory_fixture(),
        )
        self.assertEqual(
            {row["kind"] for row in first},
            {"proposed_addition", "proposed_removal", "proposed_rename"},
        )
        self.assertEqual([row["id"] for row in first], [row["id"] for row in second])

    def test_national_proposals_repeat_until_explicit_canonical_change(self) -> None:
        source = source_fixture("ipu")
        rows = [chambers_fixture()[0], chamber("CA-LC02", "New chamber", "https://new.parl.ca/")]
        fetched = fetched_fixture(source, ipu_body(rows))
        first, snapshot = report_for(source, fetched)
        second, _ = report_for(source, fetched, snapshot)
        self.assertEqual(
            [row["id"] for row in first["findings"]],
            [row["id"] for row in second["findings"]],
        )
        self.assertTrue(
            all(not row["pending_from_prior_observation"] for row in second["findings"])
        )
        self.assertEqual(
            [row["first_seen_at"] for row in first["findings"]],
            [row["first_seen_at"] for row in second["findings"]],
        )
        self.assertEqual(first["counts"]["proposed_addition"], 1)
        self.assertEqual(first["counts"]["proposed_removal"], 1)
        inventory = inventory_fixture()
        inventory["records"][1]["authority_status"] = "historical_institution_superseded"
        added = record("CA-LC02", "New chamber", "https://new.parl.ca/")
        added["external_ids"] = {"ipu_chamber_code": "CA-LC02", "ipu_country_code": "CA"}
        inventory["records"].append(added)
        resolved, _ = report_for(source, fetched, snapshot, inventory=inventory)
        self.assertEqual(resolved["findings"], [])

    def test_unknown_website_information_does_not_propose_removing_recorded_urls(self) -> None:
        rows = chambers_fixture()
        rows[0].update(website_urls=[], website_urls_known=False)
        self.assertEqual(
            compare_ipu(
                {"url": ipu_api_url(TODAY.isoformat()), "chambers": rows},
                directory_fixture(),
                inventory_fixture(),
            ),
            [],
        )

    def test_national_proposals_survive_a_blocked_following_month(self) -> None:
        source = source_fixture("ipu")
        changed = chamber("CA-LC01", "Renamed Commons", "https://new.parl.ca/")
        changed.update(suspended=True, structure="Unicameral", parliament_name="Renamed Parliament")
        rows = [changed, chamber("CA-LC02", "New chamber", "https://new-chamber.parl.ca/")]
        first, baseline = report_for(source, fetched_fixture(source, ipu_body(rows)))
        self.assertEqual(
            {row["kind"] for row in first["findings"]},
            {
                "proposed_addition",
                "proposed_removal",
                "proposed_rename",
                "directory_metadata_changed",
                "activity_review",
            },
        )
        blocked = {"source_id": source["id"], "ok": False, "http_status": 403, "error": "Blocked"}
        second, snapshot = report_for(source, blocked, baseline)
        previous_ids = {row["id"] for row in first["findings"]}
        self.assertTrue(previous_ids <= {row["id"] for row in second["findings"]})
        self.assertEqual(previous_ids, {row["id"] for row in snapshot["pending_findings"]})
        self.assertEqual(second["counts"]["source_gap"], 1)
        self.assertEqual(snapshot["sources"], baseline["sources"])

    def test_explicit_canonical_resolutions_clear_national_proposals_during_outage(self) -> None:
        source = source_fixture("ipu")
        changed = chamber("CA-LC01", "Renamed Commons", "https://new.parl.ca/")
        changed.update(suspended=True, structure="Unicameral", parliament_name="Renamed Parliament")
        rows = [changed, chamber("CA-LC02", "New chamber", "https://new-chamber.parl.ca/")]
        _, baseline = report_for(source, fetched_fixture(source, ipu_body(rows)))
        inventory = inventory_fixture()
        inventory["records"][0].update(
            name="Renamed Commons",
            source_published_institution_urls=["https://new.parl.ca/"],
            ipu_suspended=True,
            ipu_structure="Unicameral",
            ipu_parliament_name="Renamed Parliament",
        )
        inventory["records"][1]["authority_status"] = "historical_institution_superseded"
        added = record("CA-LC02", "New chamber", "https://new-chamber.parl.ca/")
        added["external_ids"] = {"ipu_chamber_code": "CA-LC02", "ipu_country_code": "CA"}
        inventory["records"].append(added)
        blocked = {"source_id": source["id"], "ok": False, "http_status": 403, "error": "Blocked"}
        report, snapshot = report_for(source, blocked, baseline, inventory=inventory)
        self.assertEqual({row["kind"] for row in report["findings"]}, {"source_gap"})
        self.assertEqual(snapshot["pending_findings"], [])
        self.assertEqual(snapshot["sources"], baseline["sources"])

    def test_metadata_and_suspension_changes_are_reviewable_without_removal(self) -> None:
        rows = chambers_fixture()
        rows[0].update(
            suspended=True,
            structure="Unicameral",
            parliament_name="Renamed Parliament",
            website_urls=["https://new.parl.ca/"],
        )
        findings = compare_ipu(
            {"url": ipu_api_url(TODAY.isoformat()), "chambers": rows},
            directory_fixture(),
            inventory_fixture(),
        )
        self.assertEqual(sum(row["kind"] == "activity_review" for row in findings), 1)
        self.assertEqual(sum(row["kind"] == "directory_metadata_changed" for row in findings), 3)
        self.assertFalse(any(row["kind"] == "proposed_removal" for row in findings))

    def test_severe_ipu_coverage_collapse_is_a_gap_not_mass_removals(self) -> None:
        inventory = inventory_fixture()
        directory = directory_fixture()
        for number in range(2, 12):
            code = f"CA-LC{number:02}"
            row = record(code, f"Chamber {number}", f"https://{number}.parl.ca/")
            row["external_ids"] = {"ipu_chamber_code": code, "ipu_country_code": "CA"}
            inventory["records"].append(row)
        with self.assertRaisesRegex(ValueError, "coverage collapsed"):
            compare_ipu(
                {"url": ipu_api_url(TODAY.isoformat()), "chambers": [chambers_fixture()[0]]},
                directory,
                inventory,
            )

    def test_generic_evidence_changes_are_separate_from_institution_decisions(self) -> None:
        source = source_fixture()
        previous = {
            "fingerprint": "old",
            "final_url": source["url"],
            "links": [{"name": "Senate", "url": "https://sencanada.ca/"}],
        }
        current = {
            "fingerprint": "new",
            "final_url": "https://www.parl.ca/new-directory",
            "links": [{"name": "New Legislative Assembly", "url": "https://new.parl.ca/"}],
        }
        findings = compare_evidence(source, current, previous, {"https://sencanada.ca/"})
        self.assertEqual(
            {row["kind"] for row in findings},
            {"evidence_changed", "url_changed", "directory_link_added", "directory_link_removed"},
        )
        self.assertFalse(any(row["kind"] == "proposed_removal" for row in findings))
        known = compare_evidence(
            source, current, previous, {"https://sencanada.ca/", "https://new.parl.ca/"}
        )
        self.assertFalse(any(row["kind"] == "directory_link_added" for row in known))

    def test_first_generic_observation_only_establishes_baseline(self) -> None:
        source = source_fixture()
        report, snapshot = report_for(
            source,
            fetched_fixture(source, "<main><a href='/new'>New Parliament</a></main>"),
        )
        self.assertFalse(report["baseline_available"])
        self.assertEqual(report["findings"], [])
        self.assertIn(source["id"], snapshot["sources"])
        self.assertIn("First observation", render_markdown(report))

    def test_changed_legislature_link_label_is_reported_without_url_change(self) -> None:
        source = source_fixture()
        before = {
            "fingerprint": "before",
            "final_url": source["url"],
            "links": [{"url": "https://sencanada.ca/", "name": "Old Senate name"}],
        }
        after = {
            "fingerprint": "after",
            "final_url": source["url"],
            "links": [{"url": "https://sencanada.ca/", "name": "New Senate name"}],
        }
        findings = compare_evidence(source, after, before, {"https://sencanada.ca/"})
        self.assertEqual(
            {row["kind"] for row in findings}, {"evidence_changed", "directory_label_changed"}
        )
        label = next(row for row in findings if row["kind"] == "directory_label_changed")
        self.assertEqual(label["url"], "https://sencanada.ca/")
        self.assertEqual((label["before"], label["after"]), ("Old Senate name", "New Senate name"))

    def test_blocked_evidence_keeps_last_valid_baseline_and_never_removes(self) -> None:
        source = source_fixture()
        baseline = baseline_for(source, "<main>Official institutional evidence</main>")
        unchanged = copy.deepcopy(baseline)
        report, snapshot = report_for(
            source,
            {"source_id": source["id"], "ok": False, "http_status": 403, "error": "Blocked"},
            baseline,
        )
        self.assertEqual(report["counts"]["unresolved_sources"], 1)
        self.assertEqual({row["kind"] for row in report["findings"]}, {"source_gap"})
        self.assertEqual(snapshot["sources"], baseline["sources"])
        self.assertEqual(baseline, unchanged)

    def test_malformed_or_partial_ipu_payload_retains_last_complete_observation(self) -> None:
        source = source_fixture("ipu")
        baseline = baseline_for(source, ipu_body(chambers_fixture()))
        for body in (b"{invalid", ipu_body(chambers_fixture(), total=3)):
            with self.subTest(body=body):
                report, snapshot = report_for(source, fetched_fixture(source, body), baseline)
                self.assertEqual({row["kind"] for row in report["findings"]}, {"source_gap"})
                self.assertEqual(snapshot["sources"], baseline["sources"])

    def test_challenge_pages_and_unsupported_content_preserve_previous_evidence(self) -> None:
        source = source_fixture()
        baseline = baseline_for(source, "<main>Official institutional evidence</main>")
        responses = [
            fetched_fixture(
                source, "<html><title>Just a moment</title>Verify you are human</html>"
            ),
            fetched_fixture(
                source, "<html><script>renderApplication()</script><div id='app'></div></html>"
            ),
            {
                **fetched_fixture(source, "<html>PDF download unavailable</html>"),
                "content_type": "application/pdf",
            },
            {
                **fetched_fixture(source, b"image bytes"),
                "content_type": "image/png",
            },
        ]
        for fetched in responses:
            with self.subTest(fetched=fetched):
                report, snapshot = report_for(source, fetched, baseline)
                self.assertEqual({row["kind"] for row in report["findings"]}, {"source_gap"})
                self.assertEqual(snapshot["sources"], baseline["sources"])

    def test_normal_institution_page_with_captcha_script_is_observed(self) -> None:
        source = source_fixture()
        fetched = fetched_fixture(
            source,
            """<html><head><script src='https://www.google.com/recaptcha/api.js'></script>
            <script>const challengeMessage = 'verify you are human';</script>
            <style>.captcha::before { content: 'checking your browser'; }</style></head>
            <body><main><h1>Parliament</h1><p>Our legislature and official directory.</p>
            <a href='https://sencanada.ca/'>Senate</a></main></body></html>""",
        )
        report, snapshot = report_for(source, fetched)
        self.assertEqual(report["counts"]["observed"], 1)
        self.assertEqual(report["findings"], [])
        self.assertIn(source["id"], snapshot["sources"])

    def test_time_budget_reports_skipped_sources_without_discarding_observations(self) -> None:
        first = source_fixture()
        sources = [
            first,
            {**first, "id": "second-directory", "url": "https://www.parl.ca/second"},
            {**first, "id": "third-directory", "url": "https://www.parl.ca/third"},
        ]
        with (
            patch("tools.check_legislature_inventory.time.monotonic", side_effect=[0, 1, 11, 12]),
            patch(
                "tools.check_legislature_inventory.fetch_source",
                return_value=fetched_fixture(first, "<main>Official legislature evidence</main>"),
            ) as fetch,
        ):
            responses = collect_sources(
                sources, {}, timeout=3, workers=1, max_bytes=1024, budget_seconds=10
            )
        fetch.assert_called_once()
        self.assertEqual(fetch.call_args.args[0], first)
        self.assertTrue(responses[first["id"]]["ok"])
        for source in sources[1:]:
            self.assertFalse(responses[source["id"]]["ok"])
            self.assertIn("Run time budget reached", responses[source["id"]]["error"])
        report, snapshot = build_report(
            inventory_fixture(),
            directory_fixture(),
            sources,
            responses,
            None,
            {"schema_version": 1, "decisions": []},
            TODAY,
        )
        self.assertEqual(report["counts"]["observed"], 1)
        self.assertEqual(report["counts"]["unresolved_sources"], 2)
        self.assertEqual({row["kind"] for row in report["findings"]}, {"source_gap"})
        self.assertEqual(set(snapshot["sources"]), {first["id"]})

    def test_corrupt_baselines_are_rejected_before_comparison(self) -> None:
        source = source_fixture()
        baseline = baseline_for(source, "<main>Official institutional evidence</main>")
        corrupt_source = copy.deepcopy(baseline)
        corrupt_source["sources"][source["id"]]["fingerprint"] = "not-a-checksum"
        unsafe_link = copy.deepcopy(baseline)
        unsafe_link["sources"][source["id"]]["links"] = [
            {"name": "Parliament", "url": "http://localhost/secrets"}
        ]
        duplicate_pending = copy.deepcopy(baseline)
        pending = finding(
            "evidence_changed", "Changed evidence", source["id"], before="a", after="b"
        )
        duplicate_pending["pending_findings"] = [pending, pending]
        for value in (corrupt_source, unsafe_link, duplicate_pending, {"schema_version": 2}):
            with self.subTest(value=value), self.assertRaises(ValueError):
                validate_baseline(value)

    def test_partial_generic_directory_keeps_complete_baseline(self) -> None:
        source = source_fixture()
        body = (
            "<main>"
            + "".join(
                f"<a href='/{number}'>Legislative Assembly {number}</a>" for number in range(12)
            )
            + "</main>"
        )
        baseline = baseline_for(source, body)
        report, snapshot = report_for(
            source,
            fetched_fixture(source, "<main><a href='/0'>Legislative Assembly 0</a></main>"),
            baseline,
        )
        self.assertEqual({row["kind"] for row in report["findings"]}, {"source_gap"})
        self.assertEqual(snapshot["sources"], baseline["sources"])

    def test_pending_generic_changes_persist_until_acknowledged(self) -> None:
        source = source_fixture()
        baseline = baseline_for(source, "<main>Old institutional evidence</main>")
        fetched = fetched_fixture(
            source, "<main>Updated evidence <a href='/new'>New Legislative Assembly</a></main>"
        )
        first, snapshot = report_for(source, fetched, baseline)
        second, next_snapshot = report_for(source, fetched, snapshot)
        self.assertEqual(
            [row["id"] for row in first["findings"]],
            [row["id"] for row in second["findings"]],
        )
        self.assertTrue(all(row["pending_from_prior_observation"] for row in second["findings"]))
        self.assertEqual(
            [row["first_seen_at"] for row in first["findings"]],
            [row["first_seen_at"] for row in second["findings"]],
        )
        self.assertEqual(len(second["findings"]), 2)
        decisions = {
            "schema_version": 1,
            "decisions": [
                {
                    "finding_id": row["id"],
                    "decision": "dismissed",
                    "reviewed_on": TODAY.isoformat(),
                    "note": "Reviewed against current institutional records.",
                }
                for row in first["findings"]
            ],
        }
        resolved, snapshot = report_for(source, fetched, next_snapshot, decisions=decisions)
        self.assertEqual(resolved["findings"], [])
        self.assertEqual(snapshot["pending_findings"], [])

    def test_pending_added_link_resolves_when_canonical_inventory_documents_it(self) -> None:
        source = source_fixture()
        baseline = baseline_for(source, "<main>Old evidence</main>")
        fetched = fetched_fixture(
            source, "<main><a href='https://new.parl.ca/'>New Parliament</a></main>"
        )
        _, snapshot = report_for(source, fetched, baseline)
        inventory = inventory_fixture()
        inventory["records"][0]["primary_urls"].append("https://new.parl.ca/")
        report, snapshot = report_for(source, fetched, snapshot, inventory=inventory)
        self.assertFalse(any(row["kind"] == "directory_link_added" for row in report["findings"]))
        self.assertEqual(
            {row["kind"] for row in snapshot["pending_findings"]}, {"evidence_changed"}
        )

    def test_limited_run_preserves_unmonitored_pending_changes(self) -> None:
        source = source_fixture()
        baseline = baseline_for(source, "<main>Evidence</main>")
        pending = finding(
            "evidence_changed", "Other source changed", "unmonitored-source", before="a", after="b"
        )
        baseline["pending_findings"] = [pending]
        report, snapshot = report_for(
            source, fetched_fixture(source, "<main>Evidence</main>"), baseline, limited=True
        )
        self.assertTrue(report["limited_run"])
        retained = next(row for row in report["findings"] if row["id"] == pending["id"])
        self.assertTrue(retained["pending_from_prior_observation"])
        self.assertIn(pending, snapshot["pending_findings"])
        self.assertEqual(report["counts"]["coverage_gap"], 1)

    def test_not_modified_keeps_observation_date_but_records_recheck(self) -> None:
        source = source_fixture()
        baseline = baseline_for(source, "<main>Evidence</main>")
        previous = baseline["sources"][source["id"]]
        fetched = {
            "source_id": source["id"],
            "ok": True,
            "not_modified": True,
            "http_status": 304,
            "checked_at": "2026-12-01T07:00:00+00:00",
        }
        report, snapshot = report_for(source, fetched, baseline)
        current = snapshot["sources"][source["id"]]
        self.assertEqual(current["observed_at"], previous["observed_at"])
        self.assertEqual(current["last_checked_at"], fetched["checked_at"])
        self.assertEqual(report["checks"][0]["status"], "unchanged_cached")

    def test_review_dates_distinguish_stale_invalid_future_and_latest_specific_review(self) -> None:
        inventory = inventory_fixture()
        inventory["reviewed_on"] = "2025-11-01"
        recent, future, invalid = (copy.deepcopy(inventory["records"][0]) for _ in range(3))
        recent.update(id="recent", latest_legal_hold_review={"reviewed_on": "2026-10-31"})
        future.update(id="future", latest_legal_hold_review={"reviewed_on": "2026-11-02"})
        invalid.update(id="invalid", latest_legal_hold_review={"reviewed_on": "unknown"})
        inventory["records"].extend([recent, future, invalid])
        findings = review_dates(inventory, TODAY, 365)
        by_kind = {row["kind"]: row["record_ids"] for row in findings}
        self.assertEqual(by_kind["stale_review"], ["national--ca-lc01", "national--ca-uc01"])
        self.assertEqual(by_kind["future_review_date"], ["future"])
        self.assertEqual(by_kind["invalid_review_date"], ["invalid"])
        self.assertNotIn("recent", str(findings))

    def test_markdown_neutralizes_source_mentions_html_and_formatting(self) -> None:
        unsafe = "@everyone <img src=x> [link](javascript:alert(1)) | **urgent**\n# heading"
        text = markdown_text(unsafe)
        self.assertNotIn("@everyone", text)
        self.assertIn("＠everyone", text)
        self.assertIn("&lt;img", text)
        self.assertNotIn("<img", text)
        self.assertIn(r"\[link\]", text)
        self.assertIn(r"\|", text)
        self.assertNotIn("\n", text)

    def test_per_record_review_date_does_not_freshen_other_institutions(self) -> None:
        inventory = inventory_fixture()
        inventory["reviewed_on"] = "2025-11-01"
        inventory["records"][0]["institution_reviewed_on"] = TODAY.isoformat()
        inventory["records"][0]["latest_legal_hold_review"] = {"reviewed_on": "2024-11-01"}
        findings = review_dates(inventory, TODAY, 365)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["kind"], "stale_review")
        self.assertEqual(findings[0]["record_ids"], ["national--ca-uc01"])
        self.assertEqual(inventory["reviewed_on"], "2025-11-01")

    def test_review_decisions_reject_duplicates_unknown_outcomes_and_empty_rationale(self) -> None:
        decision = {
            "finding_id": "a" * 24,
            "decision": "accepted",
            "reviewed_on": TODAY.isoformat(),
            "note": "Applied after primary-source review.",
        }
        self.assertEqual(decision_ids({"schema_version": 1, "decisions": [decision]}), {"a" * 24})
        invalid = [
            {"schema_version": 1, "decisions": [decision, decision]},
            {"schema_version": 2, "decisions": []},
            {"schema_version": 1, "decisions": [{**decision, "decision": "automatic"}]},
            {"schema_version": 1, "decisions": [{**decision, "note": " "}]},
            {"schema_version": 1, "decisions": [{**decision, "reviewed_on": "yesterday"}]},
        ]
        for value in invalid:
            with self.subTest(value=value), self.assertRaises(ValueError):
                decision_ids(value)

    def test_report_and_snapshot_redact_scraped_query_credentials(self) -> None:
        source = source_fixture()
        key = "AIza" + "A" * 35
        body = (
            "<main>Institution evidence "
            f"<a href='https://maps.example.org/embed?key={key}&amp;q=Assembly'>Map</a>"
            "</main>"
        )
        report, snapshot = report_for(source, fetched_fixture(source, body))
        encoded = json.dumps([report, snapshot])
        self.assertEqual(secret_matches(encoded), [])
        self.assertNotIn(key, encoded)
        self.assertIn("key=REDACTED", snapshot["sources"][source["id"]]["links"][0]["url"])
        changed_key = body.replace(key, "AIza" + "B" * 35)
        repeated, _ = report_for(source, fetched_fixture(source, changed_key), snapshot)
        self.assertEqual(repeated["findings"], [])

    def test_report_redacts_credentials_inside_fetch_errors(self) -> None:
        source = source_fixture()
        response = {
            "source_id": source["id"],
            "checked_at": CHECKED_AT,
            "ok": False,
            "error": "Failed https://maps.example.org/?key=" + "AIza" + "A" * 35,
        }
        report, snapshot = report_for(source, response)
        self.assertEqual(secret_matches(json.dumps([report, snapshot])), [])
        self.assertIn("key=REDACTED", report["checks"][0]["error"])

    def test_source_plan_includes_current_exact_catalogue_and_reviewed_institution_routes(
        self,
    ) -> None:
        inventory = inventory_fixture()
        inventory["records"][0]["catalogue_crosswalk"] = {
            "catalogue_ids": ["house"],
            "reviewed_on": "2026-10-24",
            "report": "reports/discovery/publication.json",
        }
        catalogue = {
            "channels": [{"id": "house", "official_url": "https://www.ourcommons.ca/watch"}]
        }
        reviews = [
            (
                "reports/discovery/followup.json",
                {
                    "records": [
                        {
                            "id": "national--ca-lc01",
                            "metadata": {"institutional_url": "https://www.ourcommons.ca/about"},
                        }
                    ]
                },
            )
        ]
        planned = plan_sources(inventory, {}, TODAY.isoformat(), reviews, catalogue)
        sources = {row["url"]: row for row in planned}
        for url in ("https://www.ourcommons.ca/watch", "https://www.ourcommons.ca/about"):
            self.assertEqual(sources[url]["record_ids"], ["national--ca-lc01"])
        self.assertNotIn(
            "national--ca-uc01", sources["https://www.ourcommons.ca/watch"]["record_ids"]
        )

    def test_source_plan_deduplicates_references_and_never_reuses_dated_ipu_request(self) -> None:
        inventory = inventory_fixture()
        inventory["records"][0]["primary_urls"].extend(
            ["https://www.parl.ca/directory#top", ipu_api_url("2026-10-24")]
        )
        services = {
            "eligible_bodies": [
                {
                    "body_id": "national--ca-lc01",
                    "country": "Canada",
                    "official_reference_url": "https://www.parl.ca/directory",
                }
            ]
        }
        sources = plan_sources(inventory, services, TODAY.isoformat())
        ipu_sources = [row for row in sources if row["kind"] == "ipu"]
        self.assertEqual(len(ipu_sources), 1)
        self.assertIn("date=2026-11-01", ipu_sources[0]["url"])
        directory_sources = [
            row for row in sources if row["url"] == "https://www.parl.ca/directory"
        ]
        self.assertEqual(len(directory_sources), 1)
        self.assertEqual(directory_sources[0]["record_ids"], ["national--ca-lc01"])
        self.assertTrue(directory_sources[0]["directory"])


if __name__ == "__main__":
    unittest.main()
