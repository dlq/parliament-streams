import contextlib
import copy
import io
import json
import stat
import tempfile
import unittest
from datetime import date
from pathlib import Path
from unittest import mock

from parliament_streams import cli
from parliament_streams.catalogue import (
    DEFAULT_FALLBACKS_PATH,
    load_catalogue,
    load_channel,
    load_fallbacks,
    load_json_object,
)
from parliament_streams.management import (
    CatalogueStore,
    audit_identities,
    compare_health_reports,
    export_csv,
    file_sha256,
    generate_validation_seed,
    load_candidate,
    promote_candidate,
    refresh_validation_history,
    scaffold_candidate,
    validate_candidate_directory,
    validation_history_is_current,
    write_json,
)
from parliament_streams.site_data import (
    render_site_data,
    render_site_data_payload,
    site_data_is_current,
    write_site_data,
)
from parliament_streams.validation import (
    CatalogueValidationError,
    ValidationIssue,
    load_schema,
    require_valid_candidate,
    require_valid_catalogue,
    require_valid_fallbacks,
    validate_candidate,
    validate_catalogue,
    validate_channel,
    validate_fallbacks,
)

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE_PATH = ROOT / "data" / "channels.json"


def canonical_catalogue():
    return json.loads(CATALOGUE_PATH.read_text(encoding="utf-8"))


CANONICAL_CHANNEL_COUNT = len(canonical_catalogue()["channels"])


def cloned_channel(channel_id="test-assembly", qid="Q123456789"):
    channel = copy.deepcopy(canonical_catalogue()["channels"][-19])
    channel["id"] = channel_id
    channel["name"] = "Test Assembly Live"
    channel["external_ids"]["wikidata_qid"] = qid
    channel["identity_sources"] = [
        {
            "source": "wikidata",
            "url": f"https://www.wikidata.org/wiki/{qid}",
            "checked_on": "2026-08-16",
            "confidence": "high",
            "notes": "Test identity source.",
        }
    ]
    return channel


class ValidationTests(unittest.TestCase):
    def test_canonical_catalogue_and_channel_validate(self):
        catalogue = canonical_catalogue()
        self.assertEqual(validate_catalogue(catalogue), [])
        self.assertEqual(validate_channel(catalogue["channels"][0]), [])
        self.assertEqual(load_schema()["title"], "Parliament Streams Catalogue")
        require_valid_catalogue(catalogue)

    def test_fallback_catalogue_validates_against_channels(self):
        catalogue = canonical_catalogue()
        fallbacks = load_fallbacks(DEFAULT_FALLBACKS_PATH)
        self.assertEqual(validate_fallbacks(fallbacks, catalogue), [])
        require_valid_fallbacks(fallbacks, catalogue)

    def test_fallback_validation_reports_cross_record_errors(self):
        catalogue = canonical_catalogue()
        fallbacks = load_fallbacks(DEFAULT_FALLBACKS_PATH)
        fallbacks["fallbacks"][0]["related_channel_ids"] = ["missing-channel"]
        fallbacks["fallbacks"][1]["id"] = fallbacks["fallbacks"][0]["id"]
        fallbacks["fallbacks"][2]["integration_mode"] = "provider_embed"
        fallbacks["fallbacks"][2]["playback_claim"] = "no_direct_stream_claim"
        codes = {issue.code for issue in validate_fallbacks(fallbacks, catalogue)}
        self.assertIn("unknown-channel", codes)
        self.assertIn("duplicate-id", codes)
        self.assertIn("fallback-playback-claim", codes)

    def test_schema_and_duplicate_errors_are_actionable(self):
        catalogue = canonical_catalogue()
        catalogue["generated_on"] = "not-a-date"
        duplicate = copy.deepcopy(catalogue["channels"][0])
        catalogue["channels"].append(duplicate)
        issues = validate_catalogue(catalogue)
        codes = {issue.code for issue in issues}
        self.assertIn("schema", codes)
        self.assertIn("duplicate-id", codes)
        self.assertIn("duplicate-playback", codes)
        self.assertIn("$.generated_on", "\n".join(issue.render() for issue in issues))
        with self.assertRaises(CatalogueValidationError) as raised:
            require_valid_catalogue(catalogue)
        self.assertTrue(raised.exception.issues)

    def test_malformed_nested_values_return_issues_instead_of_crashing(self):
        catalogue = canonical_catalogue()
        channel = catalogue["channels"][0]
        channel["external_ids"] = []
        channel["identity_sources"] = "invalid"
        channel["epg_sources"] = ["invalid"]
        channel["permission"] = []
        issues = validate_catalogue(catalogue)
        self.assertTrue(issues)
        self.assertEqual({issue.code for issue in issues}, {"schema", "wikidata-required"})

    def test_source_and_embed_invariants(self):
        direct = cloned_channel()
        direct["source_type"] = "direct_hls"
        direct["playback_url"] = None
        self.assertIn("direct-playback", {issue.code for issue in validate_channel(direct)})

        wrong_kind = cloned_channel()
        wrong_kind["source_type"] = "youtube"
        wrong_kind["source_kind"] = "official_page"
        self.assertIn("source-kind", {issue.code for issue in validate_channel(wrong_kind)})

        wrong_stability = cloned_channel()
        wrong_stability["technical_status"] = "needs_review"
        wrong_stability["stability_risk"] = "low"
        self.assertIn("stability-risk", {issue.code for issue in validate_channel(wrong_stability)})

        page = cloned_channel()
        page["playback_url"] = "https://example.test/live.m3u8"
        self.assertIn("platform-playback", {issue.code for issue in validate_channel(page)})

        youtube = cloned_channel()
        youtube["source_type"] = "youtube"
        self.assertIn("youtube-embed", {issue.code for issue in validate_channel(youtube)})

        unexpected = cloned_channel()
        unexpected["embed"] = {
            "provider": "youtube",
            "kind": "uploads_playlist",
            "content_id": "UUexample",
            "url": "https://www.youtube-nocookie.com/embed/videoseries?list=UUexample",
            "live_url": "https://www.youtube.com/channel/example/live",
            "notes": "Test embed.",
        }
        self.assertIn("unexpected-embed", {issue.code for issue in validate_channel(unexpected)})

    def test_identity_rights_and_scraper_invariants(self):
        channel = cloned_channel()
        channel["external_ids"]["wikidata_qid"] = None
        channel["identity_sources"] = []
        self.assertIn("wikidata-required", {issue.code for issue in validate_channel(channel)})
        self.assertNotIn(
            "wikidata-required",
            {issue.code for issue in validate_channel(channel, require_identity=False)},
        )

        bad_source = cloned_channel()
        bad_source["identity_sources"][0]["url"] = "https://www.wikidata.org/wiki/Q1"
        self.assertIn("wikidata-source", {issue.code for issue in validate_channel(bad_source)})

        subnational_ipu = cloned_channel()
        subnational_ipu["external_ids"].update(
            ipu_country_code="CA", ipu_parliament_code="CA", ipu_chamber_code=None
        )
        subnational_ipu["identity_sources"].append(
            {
                "source": "ipu_parline",
                "url": "https://data.ipu.org/parliament/CA/",
                "checked_on": "2026-08-16",
                "confidence": "high",
                "notes": "Test Parline source.",
            }
        )
        self.assertIn("ipu-scope", {issue.code for issue in validate_channel(subnational_ipu)})

        incomplete_ipu = cloned_channel()
        incomplete_ipu["jurisdiction_level"] = "national"
        incomplete_ipu["external_ids"]["ipu_country_code"] = "CA"
        incomplete_codes = {issue.code for issue in validate_channel(incomplete_ipu)}
        self.assertIn("ipu-coherence", incomplete_codes)
        self.assertIn("ipu-source", incomplete_codes)

        unexpected_ipu = cloned_channel()
        unexpected_ipu["jurisdiction_level"] = "national"
        unexpected_ipu["identity_sources"].append(
            {
                "source": "ipu_parline",
                "url": "https://data.ipu.org/parliament/CA/",
                "checked_on": "2026-08-16",
                "confidence": "high",
                "notes": "Unexpected source.",
            }
        )
        self.assertIn(
            "unexpected-ipu-source", {issue.code for issue in validate_channel(unexpected_ipu)}
        )

        no_rights = cloned_channel()
        no_rights["permission"]["evidence"] = []
        self.assertIn("rights-evidence", {issue.code for issue in validate_channel(no_rights)})

        scraper = cloned_channel()
        scraper["epg_sources"] = [
            {
                "scraper": "missing",
                "scraper_status": "implemented",
                "url": "https://example.test/schedule",
                "method": "GET",
                "kind": "schedule",
            },
            {
                "scraper": "named-but-planned",
                "scraper_status": "planned",
                "url": "https://example.test/calendar",
                "method": "GET",
                "kind": "calendar",
            },
        ]
        codes = {issue.code for issue in validate_channel(scraper)}
        self.assertIn("unknown-scraper", codes)
        self.assertIn("planned-scraper", codes)

    def test_candidate_metadata_and_promotion_requirements(self):
        candidate = scaffold_candidate(
            channel_id="candidate",
            name="Candidate",
            jurisdiction_level="subnational",
            country_or_region="Example",
            legislature="Example Assembly",
            language="English",
            official_url="https://example.test/watch",
            wikidata_qid=None,
            today=date(2026, 8, 16),
        )
        self.assertEqual(validate_candidate(candidate), [])
        self.assertEqual(candidate["channel"]["source_kind"], "official_page")
        self.assertEqual(candidate["channel"]["stability_risk"], "unknown")
        candidate["status"] = "ready"
        self.assertIn("wikidata-required", {issue.code for issue in validate_candidate(candidate)})

        malformed = copy.deepcopy(candidate)
        malformed["candidate_version"] = 2
        malformed["status"] = "invalid"
        malformed["decision_notes"] = [""]
        malformed["extra"] = True
        del malformed["created_on"]
        codes = {issue.code for issue in validate_candidate(malformed)}
        self.assertTrue(
            {"candidate-fields", "candidate-version", "candidate-status", "candidate-notes"}
            <= codes
        )
        malformed["channel"] = "invalid"
        self.assertIn("candidate-channel", {issue.code for issue in validate_candidate(malformed)})
        with self.assertRaises(CatalogueValidationError):
            require_valid_candidate(candidate)

        bad_dates = scaffold_candidate(
            channel_id="bad-dates",
            name="Bad dates",
            jurisdiction_level="subnational",
            country_or_region="Example",
            legislature="Example Legislature",
            language="English",
            official_url="https://example.test/watch",
            today=date(2026, 8, 16),
        )
        bad_dates["created_on"] = "not-a-date"
        self.assertIn("candidate-date", {issue.code for issue in validate_candidate(bad_dates)})
        bad_dates["created_on"] = "2026-08-17"
        self.assertIn(
            "candidate-date-order", {issue.code for issue in validate_candidate(bad_dates)}
        )
        bad_dates["decision_notes"] = []
        self.assertIn("candidate-notes", {issue.code for issue in validate_candidate(bad_dates)})

    def test_candidate_directory_validation_collects_errors(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            candidates = root / "candidates"
            write_json(
                candidates / "valid.json",
                scaffold_candidate(
                    channel_id="candidate",
                    name="Candidate",
                    jurisdiction_level="subnational",
                    country_or_region="Example",
                    legislature="Example",
                    language="English",
                    official_url="https://example.test/watch",
                ),
            )
            (candidates / "broken.json").write_text("{broken", encoding="utf-8")
            results = validate_candidate_directory(candidates)
            self.assertEqual(results[candidates / "valid.json"], [])
            self.assertEqual(results[candidates / "broken.json"][0].code, "candidate-json")
            with self.assertRaisesRegex(ValueError, "does not exist"):
                validate_candidate_directory(root / "missing")

    def test_validation_issue_render(self):
        self.assertEqual(
            ValidationIssue("$.id", "test", "bad value").render(), "$.id: bad value [test]"
        )


class ManagementTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.root = Path(self.directory.name)
        self.catalogue_path = self.root / "channels.json"
        self.fallbacks_path = self.root / "fallbacks.json"
        self.site_path = self.root / "catalogue-data.js"
        write_json(self.catalogue_path, canonical_catalogue())
        write_json(self.fallbacks_path, load_fallbacks(DEFAULT_FALLBACKS_PATH))
        self.store = CatalogueStore(
            catalogue_path=self.catalogue_path,
            fallbacks_path=self.fallbacks_path,
            site_data_path=self.site_path,
        )

    def tearDown(self):
        self.directory.cleanup()

    def test_json_loaders_site_data_and_hash(self):
        catalogue = load_catalogue(self.catalogue_path)
        fallbacks = load_fallbacks(self.fallbacks_path)
        self.assertEqual(len(catalogue["channels"]), CANONICAL_CHANNEL_COUNT)
        self.assertEqual(load_json_object(self.catalogue_path)["schema_version"], 8)
        self.assertIn(
            "PARLIAMENT_STREAMS_FALLBACKS",
            render_site_data(self.catalogue_path, self.fallbacks_path),
        )
        self.assertEqual(
            render_site_data_payload(catalogue, fallbacks),
            render_site_data(self.catalogue_path, self.fallbacks_path),
        )
        write_site_data(self.catalogue_path, self.fallbacks_path, self.site_path)
        self.assertTrue(
            site_data_is_current(self.catalogue_path, self.fallbacks_path, self.site_path)
        )
        self.site_path.write_text("stale", encoding="utf-8")
        self.assertFalse(
            site_data_is_current(self.catalogue_path, self.fallbacks_path, self.site_path)
        )
        self.assertEqual(len(file_sha256(self.catalogue_path)), 64)

        array_path = self.root / "array.json"
        array_path.write_text("[]", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "JSON object"):
            load_json_object(array_path)

        record = self.root / "record.json"
        write_json(record, cloned_channel())
        self.assertEqual(load_channel(record)["id"], "test-assembly")
        record.chmod(0o640)
        write_json(record, cloned_channel("replacement"))
        self.assertEqual(stat.S_IMODE(record.stat().st_mode), 0o640)

    def test_store_add_replace_update_remove_and_dry_runs(self):
        added = self.store.add(cloned_channel())
        self.assertEqual(len(added["channels"]), CANONICAL_CHANNEL_COUNT + 1)
        self.assertTrue(self.site_path.exists())
        self.assertEqual(self.store.load()["channels"][-1]["id"], "test-assembly")
        with self.assertRaisesRegex(ValueError, "already exists"):
            self.store.add(cloned_channel())

        replacement = cloned_channel()
        replacement["name"] = "Replacement"
        self.assertEqual(
            self.store.add(replacement, replace=True)["channels"][-1]["name"], "Replacement"
        )

        update = cloned_channel()
        update["name"] = "Updated"
        preview = self.store.update("test-assembly", update, persist=False)
        self.assertEqual(preview["channels"][-1]["name"], "Updated")
        self.assertEqual(self.store.load()["channels"][-1]["name"], "Replacement")
        self.store.update("test-assembly", update)
        self.assertEqual(self.store.load()["channels"][-1]["name"], "Updated")

        mismatch = cloned_channel("different")
        with self.assertRaisesRegex(ValueError, "does not match"):
            self.store.update("test-assembly", mismatch)
        with self.assertRaisesRegex(KeyError, "Unknown catalogue id"):
            self.store.update("missing", cloned_channel("missing"))

        preview_removed = self.store.remove("test-assembly", persist=False)
        self.assertEqual(len(preview_removed["channels"]), CANONICAL_CHANNEL_COUNT)
        self.assertEqual(len(self.store.load()["channels"]), CANONICAL_CHANNEL_COUNT + 1)
        self.store.remove("test-assembly")
        self.assertEqual(len(self.store.load()["channels"]), CANONICAL_CHANNEL_COUNT)
        with self.assertRaisesRegex(KeyError, "Unknown catalogue id"):
            self.store.remove("missing")

    def test_store_without_site_data_and_invalid_commit(self):
        store = CatalogueStore(catalogue_path=self.catalogue_path, site_data_path=None)
        preview = store.add(cloned_channel(), persist=False)
        self.assertEqual(len(preview["channels"]), CANONICAL_CHANNEL_COUNT + 1)
        invalid = canonical_catalogue()
        invalid["channels"][0]["id"] = "INVALID"
        with self.assertRaises(CatalogueValidationError):
            store.commit(invalid)

    def test_validation_history_current_check(self):
        reports_dir = self.root / "reports" / "health"
        reports_dir.mkdir(parents=True)
        write_json(
            reports_dir / "2026-08-19-catalogue-health.json",
            {
                "checked_at": "2026-08-19T12:00:00Z",
                "results": [
                    {
                        "id": "cpac-ca",
                        "checked_at": "2026-08-19T12:00:00Z",
                        "status": "ok",
                        "note": "HLS manifest detected.",
                    }
                ],
            },
        )
        catalogue = load_catalogue(self.catalogue_path)
        for channel in catalogue["channels"]:
            channel.pop("validation_history", None)

        self.assertFalse(validation_history_is_current(catalogue, reports_dir, root=self.root))
        refreshed = refresh_validation_history(catalogue, reports_dir, root=self.root)
        self.assertTrue(validation_history_is_current(refreshed, reports_dir, root=self.root))

    def test_candidate_scaffolding_loading_and_promotion(self):
        candidate = scaffold_candidate(
            channel_id="candidate",
            name="Candidate",
            jurisdiction_level="subnational",
            country_or_region="Example",
            legislature="Example Assembly",
            language="English",
            official_url="https://example.test/watch",
            wikidata_qid="Q987654321",
            today=date(2026, 8, 16),
        )
        candidate_path = self.root / "candidate.json"
        write_json(candidate_path, candidate)
        self.assertEqual(load_candidate(candidate_path)["channel"]["id"], "candidate")
        with self.assertRaisesRegex(ValueError, "status 'ready'"):
            promote_candidate(candidate, self.store)
        candidate["status"] = "ready"
        promoted = promote_candidate(candidate, self.store)
        self.assertEqual(promoted["channels"][-1]["id"], "candidate")

        direct = scaffold_candidate(
            channel_id="direct",
            name="Direct",
            jurisdiction_level="national",
            country_or_region="Example",
            legislature="Example Assembly",
            language="English",
            official_url="https://example.test/watch",
            source_type="direct_hls",
            playback_url="https://example.test/live.m3u8",
            wikidata_qid="Q987654322",
        )
        self.assertEqual(direct["channel"]["technical_status"], "needs_review")
        self.assertEqual(direct["channel"]["source_kind"], "official_vendor_hls")
        self.assertEqual(direct["channel"]["stability_risk"], "high")
        with self.assertRaisesRegex(ValueError, "require --playback-url"):
            scaffold_candidate(
                channel_id="direct",
                name="Direct",
                jurisdiction_level="national",
                country_or_region="Example",
                legislature="Example",
                language="English",
                official_url="https://example.test",
                source_type="direct_dash",
            )
        with self.assertRaisesRegex(ValueError, "cannot use --playback-url"):
            scaffold_candidate(
                channel_id="page",
                name="Page",
                jurisdiction_level="national",
                country_or_region="Example",
                legislature="Example",
                language="English",
                official_url="https://example.test",
                playback_url="https://example.test/live.m3u8",
            )
        with self.assertRaisesRegex(ValueError, "youtube-playlist-id"):
            scaffold_candidate(
                channel_id="youtube",
                name="YouTube",
                jurisdiction_level="national",
                country_or_region="Example",
                legislature="Example",
                language="English",
                official_url="https://youtube.com/example",
                source_type="youtube",
            )
        youtube = scaffold_candidate(
            channel_id="youtube",
            name="YouTube",
            jurisdiction_level="national",
            country_or_region="Example",
            legislature="Example",
            language="English",
            official_url="https://www.youtube.com/@example/live",
            source_type="youtube",
            youtube_playlist_id="UUexample123",
        )
        self.assertEqual(youtube["channel"]["embed"]["content_id"], "UUexample123")
        self.assertEqual(youtube["channel"]["source_kind"], "official_youtube_embed")
        self.assertEqual(youtube["channel"]["stability_risk"], "medium")
        with self.assertRaisesRegex(ValueError, "only valid"):
            scaffold_candidate(
                channel_id="page-with-playlist",
                name="Page",
                jurisdiction_level="national",
                country_or_region="Example",
                legislature="Example",
                language="English",
                official_url="https://example.test",
                youtube_playlist_id="UUexample123",
            )

    def test_seed_identity_audit_health_diff_and_csv(self):
        catalogue = canonical_catalogue()
        seed = generate_validation_seed(
            catalogue,
            channel_ids={"jalisco-canal-parlamento"},
            checked_at="2026-08-16T00:00:00Z",
        )
        self.assertEqual(seed["countries"][0]["country"], "Jalisco")
        self.assertEqual(
            [item["kind"] for item in seed["countries"][0]["results"]], ["hls", "official_page"]
        )
        subnational = generate_validation_seed(catalogue, jurisdiction_level="subnational")
        self.assertTrue(subnational["countries"])
        with self.assertRaisesRegex(ValueError, "Unknown catalogue ids"):
            generate_validation_seed(catalogue, channel_ids={"missing"})

        audit = audit_identities(catalogue, checked_at="2026-08-16T00:00:00Z")
        self.assertEqual(audit["counts"], {"ok": CANONICAL_CHANNEL_COUNT, "error": 0})
        broken = copy.deepcopy(catalogue)
        broken["channels"][0]["identity_sources"][0]["url"] = "https://example.test/Q1"
        broken_audit = audit_identities(broken)
        self.assertEqual(broken_audit["counts"]["error"], 1)

        before = {
            "checked_at": "before",
            "results": [
                {
                    "id": "a",
                    "status": "ok",
                    "source_kind": "official_vendor_hls",
                    "stability_risk": "low",
                },
                {"id": "b", "status": "error"},
                {"id": "removed", "status": "warning", "availability": "always_on"},
            ],
        }
        after = {
            "checked_at": "after",
            "results": [
                {
                    "id": "a",
                    "status": "error",
                    "source_kind": "official_vendor_hls",
                    "availability": "always_on",
                    "stability_risk": "low",
                },
                {"id": "b", "status": "ok"},
                {"id": "added", "status": "ok", "stability_risk": "medium"},
            ],
        }
        diff = compare_health_reports(before, after)
        self.assertEqual([item["id"] for item in diff["regressions"]], ["a"])
        self.assertEqual(diff["regressions"][0]["stability_risk"], "low")
        self.assertEqual(diff["regressions"][0]["source_kind"], "official_vendor_hls")
        self.assertEqual([item["id"] for item in diff["recoveries"]], ["b"])
        self.assertEqual(diff["added"][0]["id"], "added")
        self.assertEqual(diff["added"][0]["stability_risk"], "medium")
        self.assertEqual(diff["removed"][0]["id"], "removed")

        with self.assertRaisesRegex(ValueError, "repeats id"):
            compare_health_reports(
                {"results": [{"id": "a", "status": "ok"}, {"id": "a", "status": "error"}]},
                {"results": []},
            )
        with self.assertRaisesRegex(ValueError, "results array"):
            compare_health_reports({}, {"results": []})

        output = io.StringIO()
        export_csv(catalogue, output)
        self.assertIn("permission_status", output.getvalue().splitlines()[0])
        self.assertIn("source_kind", output.getvalue().splitlines()[0])
        self.assertIn("stability_risk", output.getvalue().splitlines()[0])
        self.assertIn("cpac-ca", output.getvalue())


class CliTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.root = Path(self.directory.name)
        self.catalogue = self.root / "channels.json"
        write_json(self.catalogue, canonical_catalogue())

    def tearDown(self):
        self.directory.cleanup()

    def run_cli(self, *arguments):
        stdout = io.StringIO()
        stderr = io.StringIO()
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            result = cli.main(["--catalogue", str(self.catalogue), *arguments])
        return result, stdout.getvalue(), stderr.getvalue()

    def test_validate_list_and_show_commands(self):
        result, output, _ = self.run_cli("validate")
        self.assertEqual(result, 0)
        self.assertIn(f"{CANONICAL_CHANNEL_COUNT} channels", output)

        result, output, _ = self.run_cli("list", "--level", "subnational")
        self.assertEqual(result, 0)
        self.assertIn("jalisco-canal-parlamento", output)
        result, output, _ = self.run_cli(
            "list",
            "--source-type",
            "youtube",
            "--permission",
            "embed_only",
            "--json",
        )
        self.assertEqual(result, 0)
        self.assertIn('"source_type": "youtube"', output)

        result, output, _ = self.run_cli("show", "cpac-ca")
        self.assertEqual(result, 0)
        self.assertIn('"id": "cpac-ca"', output)
        result, _, error = self.run_cli("show", "missing")
        self.assertEqual(result, 2)
        self.assertIn("Unknown catalogue id", error)

        broken = canonical_catalogue()
        broken["generated_on"] = "invalid"
        write_json(self.catalogue, broken)
        result, _, error = self.run_cli("validate")
        self.assertEqual(result, 1)
        self.assertIn("$.generated_on", error)

    def test_candidate_lifecycle_commands(self):
        candidate = self.root / "candidate.json"
        arguments = (
            "candidate-new",
            "example-candidate",
            "--name",
            "Example Candidate",
            "--level",
            "subnational",
            "--country-or-region",
            "Example",
            "--legislature",
            "Example Assembly",
            "--language",
            "English",
            "--official-url",
            "https://example.test/watch",
            "--wikidata-qid",
            "Q987654321",
            "--output",
            str(candidate),
        )
        result, _, _ = self.run_cli(*arguments)
        self.assertEqual(result, 0)
        self.assertTrue(candidate.exists())
        result, _, error = self.run_cli(*arguments)
        self.assertEqual(result, 2)
        self.assertIn("already exists", error)
        self.assertEqual(self.run_cli(*arguments, "--force")[0], 0)
        self.assertEqual(self.run_cli("candidate-validate", str(candidate))[0], 0)
        self.assertEqual(
            self.run_cli(
                "candidate-status", str(candidate), "ready", "--note", "Evidence complete."
            )[0],
            0,
        )
        result, output, _ = self.run_cli("candidate-promote", str(candidate))
        self.assertEqual(result, 0)
        self.assertIn(f"{CANONICAL_CHANNEL_COUNT + 1} channels", output)
        self.assertEqual(load_candidate(candidate)["status"], "promoted")
        self.assertIn("Promoted to", load_candidate(candidate)["decision_notes"][-1])

        invalid = load_candidate(candidate)
        invalid["status"] = "invalid"
        write_json(candidate, invalid)
        result, _, error = self.run_cli("candidate-validate", str(candidate))
        self.assertEqual(result, 1)
        self.assertIn("candidate-status", error)

        candidates = self.root / "candidates"
        write_json(candidates / "valid.json", load_candidate(candidate))
        result, _, error = self.run_cli("candidates-validate", str(candidates))
        self.assertEqual(result, 1)
        self.assertIn("candidate-status", error)
        valid = load_candidate(candidate)
        valid["status"] = "researching"
        write_json(candidates / "valid.json", valid)
        self.assertEqual(self.run_cli("candidates-validate", str(candidates))[0], 0)

    def test_add_update_remove_and_dry_run_commands(self):
        record = self.root / "record.json"
        write_json(record, cloned_channel())
        result, output, _ = self.run_cli("add", str(record), "--dry-run")
        self.assertEqual(result, 0)
        self.assertIn(f"Would write {CANONICAL_CHANNEL_COUNT + 1}", output)
        self.assertEqual(len(load_catalogue(self.catalogue)["channels"]), CANONICAL_CHANNEL_COUNT)
        self.assertEqual(self.run_cli("add", str(record))[0], 0)

        changed = cloned_channel()
        changed["name"] = "Changed Name"
        write_json(record, changed)
        self.assertEqual(self.run_cli("update", "test-assembly", str(record), "--dry-run")[0], 0)
        self.assertEqual(self.run_cli("update", "test-assembly", str(record))[0], 0)
        self.assertEqual(load_catalogue(self.catalogue)["channels"][-1]["name"], "Changed Name")

        result, _, error = self.run_cli("remove", "test-assembly")
        self.assertEqual(result, 2)
        self.assertIn("requires --yes", error)
        self.assertEqual(self.run_cli("remove", "test-assembly", "--dry-run")[0], 0)
        self.assertEqual(self.run_cli("remove", "test-assembly", "--yes")[0], 0)

        candidate = self.root / "candidate.json"
        write_json(
            candidate,
            scaffold_candidate(
                channel_id="candidate-bypass",
                name="Candidate",
                jurisdiction_level="subnational",
                country_or_region="Example",
                legislature="Example",
                language="English",
                official_url="https://example.test/watch",
            ),
        )
        result, _, error = self.run_cli("add", str(candidate))
        self.assertEqual(result, 2)
        self.assertIn("candidate-promote", error)
        result, _, error = self.run_cli("update", "candidate-bypass", str(candidate))
        self.assertEqual(result, 2)
        self.assertIn("candidate-promote", error)

    def test_seed_identity_diff_and_export_commands(self):
        seed = self.root / "seed.json"
        result, output, _ = self.run_cli(
            "seed", "--id", "jalisco-canal-parlamento", "--output", str(seed)
        )
        self.assertEqual(result, 0)
        self.assertIn("1 validation groups", output)
        self.assertEqual(load_json_object(seed)["countries"][0]["country"], "Jalisco")

        identity = self.root / "identity.json"
        self.assertEqual(self.run_cli("identity-audit", "--output", str(identity))[0], 0)
        self.assertEqual(load_json_object(identity)["counts"]["error"], 0)
        result, output, _ = self.run_cli("identity-audit")
        self.assertEqual(result, 0)
        self.assertIn(f'"total": {CANONICAL_CHANNEL_COUNT}', output)

        before = self.root / "before.json"
        after = self.root / "after.json"
        write_json(before, {"checked_at": "before", "results": [{"id": "a", "status": "ok"}]})
        write_json(after, {"checked_at": "after", "results": [{"id": "a", "status": "error"}]})
        result, output, _ = self.run_cli(
            "health-diff", str(before), str(after), "--fail-on-regression"
        )
        self.assertEqual(result, 1)
        self.assertIn('"regressions"', output)
        diff_path = self.root / "diff.json"
        self.assertEqual(
            self.run_cli("health-diff", str(before), str(after), "--output", str(diff_path))[0],
            0,
        )

        csv_path = self.root / "channels.csv"
        self.assertEqual(self.run_cli("export", "--output", str(csv_path))[0], 0)
        self.assertIn("cpac-ca", csv_path.read_text(encoding="utf-8"))
        result, output, _ = self.run_cli("export")
        self.assertEqual(result, 0)
        self.assertTrue(output.startswith("id,name,"))

    def test_health_check_command(self):
        report = {
            "checked_at": "2026-08-16T12:00:00Z",
            "counts": {"error": 1},
            "results": [{"id": "cpac-ca", "status": "error"}],
        }
        output_path = self.root / "health.json"
        with mock.patch("parliament_streams.cli.run_healthcheck", return_value=report) as check:
            result, _, _ = self.run_cli(
                "health-check",
                "--id",
                "cpac-ca",
                "--timeout",
                "3",
                "--retries",
                "2",
                "--workers",
                "4",
                "--output",
                str(output_path),
                "--fail-on-error",
            )
        self.assertEqual(result, 1)
        self.assertEqual(load_json_object(output_path), report)
        check.assert_called_once_with(
            self.catalogue,
            timeout=3,
            retries=2,
            channel_ids={"cpac-ca"},
            workers=4,
        )

    def test_schedules_collect_command(self):
        snapshot = {
            "schema_version": 1,
            "generated_at": "2026-08-17T12:00:00Z",
            "refresh_interval_hours": 6,
            "counts": {"ok": 1, "empty": 0, "error": 0, "channels": 1},
            "channels": {},
            "sources": {},
        }
        output_path = self.root / "schedules.json"
        with mock.patch("parliament_streams.cli.collect_schedules", return_value=snapshot):
            result, output, _ = self.run_cli(
                "schedules-collect", "--output", str(output_path), "--timeout", "3"
            )
        self.assertEqual(result, 0)
        self.assertIn("from 1 sources", output)
        self.assertEqual(load_json_object(output_path)["schema_version"], 1)

        with mock.patch("parliament_streams.cli.collect_schedules", return_value=snapshot):
            result, _, error = self.run_cli(
                "schedules-collect", "--minimum-successful-sources", "2"
            )
        self.assertEqual(result, 2)
        self.assertIn("minimum is 2", error)

    def test_epg_audit_command_writes_report(self):
        report = {
            "generated_at": "2026-08-17T12:00:00Z",
            "counts": {
                "reachable": 1,
                "access_blocked": 0,
                "not_found": 0,
                "error": 0,
                "sources": 1,
            },
            "sources": [],
        }
        output_path = self.root / "epg-audit.json"
        with mock.patch("parliament_streams.cli.audit_epg_sources", return_value=report) as audit:
            result, _, _ = self.run_cli(
                "epg-audit",
                "--timeout",
                "3",
                "--retries",
                "2",
                "--workers",
                "4",
                "--output",
                str(output_path),
            )
        self.assertEqual(result, 0)
        self.assertEqual(load_json_object(output_path), report)
        audit.assert_called_once()
        self.assertEqual(audit.call_args.kwargs, {"timeout": 3, "retries": 2, "workers": 4})
        self.assertEqual(audit.call_args.args[0]["schema_version"], 8)

    def test_links_audit_command_writes_report_and_can_fail(self):
        report = {
            "generated_at": "2026-08-17T12:00:00Z",
            "counts": {
                "reachable": 1,
                "access_blocked": 0,
                "not_found": 0,
                "error": 0,
                "links": 1,
            },
            "links": [],
        }
        output_path = self.root / "links-audit.json"
        with mock.patch(
            "parliament_streams.cli.audit_catalogue_links", return_value=report
        ) as audit:
            result, _, _ = self.run_cli(
                "links-audit",
                "--timeout",
                "3",
                "--retries",
                "2",
                "--workers",
                "4",
                "--output",
                str(output_path),
            )
        self.assertEqual(result, 0)
        self.assertEqual(load_json_object(output_path), report)
        audit.assert_called_once()
        self.assertEqual(audit.call_args.kwargs, {"timeout": 3, "retries": 2, "workers": 4})

        report["counts"]["not_found"] = 1
        with mock.patch("parliament_streams.cli.audit_catalogue_links", return_value=report):
            result, _, _ = self.run_cli("links-audit", "--fail-on-error")
        self.assertEqual(result, 1)

    def test_validation_history_refresh_command_can_check_drift(self):
        reports_dir = self.root / "reports" / "health"
        reports_dir.mkdir(parents=True)
        write_json(
            reports_dir / "2026-08-19-catalogue-health.json",
            {
                "checked_at": "2026-08-19T12:00:00Z",
                "results": [
                    {
                        "id": "cpac-ca",
                        "checked_at": "2026-08-19T12:00:00Z",
                        "status": "ok",
                        "note": "HLS manifest detected.",
                    }
                ],
            },
        )
        catalogue = load_catalogue(self.catalogue)
        for channel in catalogue["channels"]:
            channel.pop("validation_history", None)
        write_json(self.catalogue, catalogue)

        result, _, error = self.run_cli(
            "validation-history-refresh", "--reports-dir", str(reports_dir), "--check"
        )
        self.assertEqual(result, 1)
        self.assertIn("stale", error)

        result, output, _ = self.run_cli(
            "validation-history-refresh", "--reports-dir", str(reports_dir)
        )
        self.assertEqual(result, 0)
        self.assertIn("1 of", output)
        self.assertEqual(
            load_catalogue(self.catalogue)["channels"][0]["validation_history"][0]["report_path"],
            "reports/health/2026-08-19-catalogue-health.json",
        )

        result, output, _ = self.run_cli(
            "validation-history-refresh", "--reports-dir", str(reports_dir), "--check"
        )
        self.assertEqual(result, 0)
        self.assertIn("current", output)


if __name__ == "__main__":
    unittest.main()
