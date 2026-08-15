import json
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE_PATH = ROOT / "data" / "channels.json"
SCHEMA_PATH = ROOT / "schema" / "channels.schema.json"

SOURCE_TYPES = {"direct_hls", "direct_dash", "official_page", "youtube"}
TECHNICAL_STATUSES = {"validated", "needs_review", "link_only"}
PROGRAM_CONFIDENCE = {"low", "medium", "high"}
SCRAPER_STATUSES = {"implemented", "planned"}
PERMISSION_STATUSES = {
    "personal_use_pending_review",
    "noncommercial_pending_review",
    "explicit_reuse_with_conditions",
    "embed_only",
    "no_third_party_reuse",
}


class CatalogueContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalogue = json.loads(CATALOGUE_PATH.read_text(encoding="utf-8"))
        cls.channels = cls.catalogue["channels"]

    def test_catalogue_has_expected_top_level_shape(self):
        self.assertEqual(self.catalogue["schema_version"], 2)
        self.assertEqual(
            self.catalogue["generated_from"], "curated research and live endpoint validation"
        )
        self.assertGreaterEqual(len(self.channels), 45)

    def test_schema_file_is_present_and_aligned(self):
        schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        self.assertEqual(schema["title"], "Parliament Streams Catalogue")
        self.assertEqual(
            set(schema["$defs"]["channel"]["properties"]["source_type"]["enum"]), SOURCE_TYPES
        )
        self.assertEqual(
            set(schema["$defs"]["channel"]["properties"]["technical_status"]["enum"]),
            TECHNICAL_STATUSES,
        )
        self.assertEqual(
            set(schema["$defs"]["permission"]["properties"]["status"]["enum"]),
            PERMISSION_STATUSES,
        )

    def test_channel_records_follow_declared_schema_contract(self):
        seen_ids = set()
        required_channel_keys = {
            "id",
            "name",
            "jurisdiction_level",
            "country_or_region",
            "legislature",
            "language",
            "source_type",
            "playback_url",
            "official_url",
            "attribution_text",
            "technical_status",
            "availability",
            "program",
            "epg_sources",
            "permission",
        }
        required_program_keys = {
            "current_event_title",
            "current_event_time",
            "next_event_title",
            "next_event_time",
            "confidence",
        }
        required_permission_keys = {"status", "summary", "evidence", "recommendation"}

        for channel in self.channels:
            with self.subTest(channel=channel["id"]):
                self.assertEqual(set(channel), required_channel_keys)
                self.assertNotIn(channel["id"], seen_ids)
                seen_ids.add(channel["id"])
                self.assertIn(channel["source_type"], SOURCE_TYPES)
                self.assertIn(channel["technical_status"], TECHNICAL_STATUSES)
                self.assertTrue(urlparse(channel["official_url"]).scheme.startswith("http"))
                if channel["source_type"].startswith("direct_"):
                    self.assertIsInstance(channel["playback_url"], str)
                else:
                    self.assertIsNone(channel["playback_url"])

                self.assertEqual(set(channel["program"]), required_program_keys)
                self.assertIn(channel["program"]["confidence"], PROGRAM_CONFIDENCE)
                self.assertEqual(set(channel["permission"]), required_permission_keys)
                self.assertIn(channel["permission"]["status"], PERMISSION_STATUSES)
                for evidence_url in channel["permission"]["evidence"]:
                    self.assertTrue(urlparse(evidence_url).scheme.startswith("http"))

    def test_hls_and_youtube_endpoints_are_present(self):
        source_types = {channel["source_type"] for channel in self.channels}
        self.assertIn("direct_hls", source_types)
        self.assertIn("youtube", source_types)

        hls_channels = [c for c in self.channels if c["source_type"] == "direct_hls"]
        youtube_channels = [c for c in self.channels if c["source_type"] == "youtube"]

        self.assertGreaterEqual(len(hls_channels), 36)
        self.assertGreaterEqual(len(youtube_channels), 3)
        for channel in hls_channels:
            self.assertTrue(urlparse(channel["playback_url"]).path.endswith(".m3u8"))
        for channel in youtube_channels:
            self.assertIn("youtube", channel["official_url"].lower())

    def test_each_channel_records_permission_status(self):
        for channel in self.channels:
            with self.subTest(channel=channel["id"]):
                self.assertIn("permission", channel)
                self.assertIn("status", channel["permission"])
                self.assertIn("summary", channel["permission"])
                self.assertIn("evidence", channel["permission"])

    def test_uk_devolved_legislatures_are_documented_as_link_out_sources(self):
        expected_permissions = {
            "scottish-parliament-tv": "explicit_reuse_with_conditions",
            "senedd-tv": "explicit_reuse_with_conditions",
            "northern-ireland-assembly-tv": "no_third_party_reuse",
        }
        channels = {channel["id"]: channel for channel in self.channels}

        for channel_id, permission_status in expected_permissions.items():
            with self.subTest(channel=channel_id):
                channel = channels[channel_id]
                self.assertEqual(channel["jurisdiction_level"], "subnational")
                self.assertEqual(channel["source_type"], "official_page")
                self.assertEqual(channel["technical_status"], "link_only")
                self.assertIsNone(channel["playback_url"])
                self.assertEqual(channel["permission"]["status"], permission_status)
                self.assertTrue(channel["epg_sources"])

    def test_epg_sources_are_declared_with_scraper_ids(self):
        epg_sources = [channel for channel in self.channels if channel.get("epg_sources")]

        self.assertGreaterEqual(len(epg_sources), 5)
        for channel in epg_sources:
            for source in channel["epg_sources"]:
                with self.subTest(channel=channel["id"], scraper=source["scraper"]):
                    self.assertIn("url", source)
                    self.assertIn("scraper", source)
                    self.assertIn("scraper_status", source)
                    self.assertIn("method", source)
                    self.assertIn(source["scraper_status"], SCRAPER_STATUSES)
                    if source["scraper_status"] == "implemented":
                        self.assertNotEqual(source["scraper"], "planned")
                    else:
                        self.assertEqual(source["scraper"], "planned")

    def test_healthcheck_cli_is_importable(self):
        module = __import__("parliament_streams.healthcheck", fromlist=["main"])
        self.assertTrue(hasattr(module, "main"))

    def test_healthcheck_can_select_catalogue_ids(self):
        from parliament_streams import healthcheck

        with patch.object(
            healthcheck,
            "check_channel",
            return_value={"id": "cpac-ca", "status": "ok"},
        ) as check_channel:
            report = healthcheck.run_healthcheck(
                CATALOGUE_PATH,
                timeout=1,
                retries=0,
                channel_ids={"cpac-ca"},
            )

        self.assertEqual(report["total"], 1)
        self.assertEqual(report["counts"], {"ok": 1})
        self.assertEqual(check_channel.call_args.args[0]["id"], "cpac-ca")


if __name__ == "__main__":
    unittest.main()
