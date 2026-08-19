import json
import unittest
from collections import defaultdict
from pathlib import Path
from unittest.mock import patch
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE_PATH = ROOT / "data" / "channels.json"
SCHEMA_PATH = ROOT / "schema" / "channels.schema.json"

SOURCE_TYPES = {"direct_hls", "direct_dash", "official_page", "youtube"}
SOURCE_KINDS = {
    "first_party_hls",
    "official_vendor_hls",
    "third_party_relay_hls",
    "direct_dash_research",
    "official_youtube_embed",
    "official_page",
}
TECHNICAL_STATUSES = {"validated", "needs_review", "link_only"}
STABILITY_RISKS = {"low", "medium", "high", "unknown"}
PROGRAM_CONFIDENCE = {"low", "medium", "high"}
SCRAPER_STATUSES = {"implemented", "planned"}
ACCESSIBILITY_STATUSES = {"available", "source_dependent", "unavailable", "unknown"}
IDENTITY_SOURCES = {"wikidata", "ipu_parline"}
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
        self.assertEqual(self.catalogue["schema_version"], 7)
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
            set(schema["$defs"]["channel"]["properties"]["source_kind"]["enum"]), SOURCE_KINDS
        )
        self.assertEqual(
            set(schema["$defs"]["channel"]["properties"]["technical_status"]["enum"]),
            TECHNICAL_STATUSES,
        )
        self.assertEqual(
            set(schema["$defs"]["channel"]["properties"]["stability_risk"]["enum"]),
            STABILITY_RISKS,
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
            "external_ids",
            "identity_sources",
            "language",
            "source_type",
            "source_kind",
            "playback_url",
            "official_url",
            "provenance_note",
            "technical_status",
            "stability_risk",
            "availability",
            "accessibility",
            "epg_sources",
            "permission",
        }
        required_permission_keys = {"status", "summary", "evidence", "recommendation"}
        required_accessibility_keys = {
            "captions",
            "caption_languages",
            "sign_language",
            "audio_description",
            "notes",
        }
        required_embed_keys = {"provider", "kind", "content_id", "url", "live_url", "notes"}
        required_external_id_keys = {
            "wikidata_qid",
            "ipu_country_code",
            "ipu_parliament_code",
            "ipu_chamber_code",
        }
        required_identity_source_keys = {
            "source",
            "url",
            "checked_on",
            "confidence",
            "notes",
        }

        for channel in self.channels:
            with self.subTest(channel=channel["id"]):
                self.assertEqual(set(channel) - {"embed"}, required_channel_keys)
                self.assertNotIn(channel["id"], seen_ids)
                seen_ids.add(channel["id"])
                self.assertIn(channel["source_type"], SOURCE_TYPES)
                self.assertIn(channel["source_kind"], SOURCE_KINDS)
                self.assertIn(channel["technical_status"], TECHNICAL_STATUSES)
                self.assertIn(channel["stability_risk"], STABILITY_RISKS)
                self.assertEqual(set(channel["external_ids"]), required_external_id_keys)
                self.assertRegex(channel["external_ids"]["wikidata_qid"], r"^Q[1-9][0-9]*$")
                self.assertTrue(channel["identity_sources"])
                for identity_source in channel["identity_sources"]:
                    self.assertEqual(set(identity_source), required_identity_source_keys)
                    self.assertIn(identity_source["source"], IDENTITY_SOURCES)
                    self.assertIn(identity_source["confidence"], PROGRAM_CONFIDENCE)
                    self.assertTrue(urlparse(identity_source["url"]).scheme.startswith("http"))
                self.assertEqual(set(channel["accessibility"]), required_accessibility_keys)
                for status_key in ("captions", "sign_language", "audio_description"):
                    self.assertIn(channel["accessibility"][status_key], ACCESSIBILITY_STATUSES)
                self.assertIsInstance(channel["accessibility"]["caption_languages"], list)
                accessibility_note = channel["accessibility"]["notes"]
                self.assertTrue(accessibility_note is None or accessibility_note.strip())
                self.assertIsInstance(channel["provenance_note"], str)
                self.assertTrue(channel["provenance_note"].strip())
                self.assertNotIn("attribution_text", channel)
                self.assertNotIn("program", channel)
                self.assertTrue(urlparse(channel["official_url"]).scheme.startswith("http"))
                if channel["source_type"].startswith("direct_"):
                    self.assertIsInstance(channel["playback_url"], str)
                else:
                    self.assertIsNone(channel["playback_url"])

                if channel["source_type"] == "youtube":
                    self.assertEqual(set(channel["embed"]), required_embed_keys)
                    self.assertEqual(channel["embed"]["provider"], "youtube")
                    self.assertEqual(channel["embed"]["kind"], "uploads_playlist")
                    self.assertTrue(channel["embed"]["content_id"].startswith("UU"))
                    self.assertIn("youtube-nocookie.com/embed", channel["embed"]["url"])
                else:
                    self.assertNotIn("embed", channel)

                self.assertEqual(set(channel["permission"]), required_permission_keys)
                self.assertIn(channel["permission"]["status"], PERMISSION_STATUSES)
                for evidence_url in channel["permission"]["evidence"]:
                    self.assertTrue(urlparse(evidence_url).scheme.startswith("http"))

    def test_external_identity_scope_and_links_are_coherent(self):
        for channel in self.channels:
            with self.subTest(channel=channel["id"]):
                ids = channel["external_ids"]
                sources = {source["source"]: source for source in channel["identity_sources"]}
                self.assertEqual(
                    sources["wikidata"]["url"],
                    f"https://www.wikidata.org/wiki/{ids['wikidata_qid']}",
                )

                has_ipu = ids["ipu_parliament_code"] is not None
                self.assertEqual("ipu_parline" in sources, has_ipu)
                if has_ipu:
                    self.assertEqual(ids["ipu_country_code"], ids["ipu_parliament_code"])
                    self.assertIn(
                        f"/parliament/{ids['ipu_country_code']}/",
                        sources["ipu_parline"]["url"],
                    )
                else:
                    self.assertIsNone(ids["ipu_country_code"])
                    self.assertIsNone(ids["ipu_chamber_code"])

                if (
                    channel["jurisdiction_level"] != "national"
                    or channel["country_or_region"] == "Taiwan"
                ):
                    self.assertFalse(has_ipu)

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
            self.assertIsInstance(channel["embed"], dict)

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

    def test_2026_subnational_promotions_are_documented(self):
        expected_link_out_ids = {
            "british-columbia-legislature-webcasts",
            "alberta-assembly-online",
            "saskatchewan-legislative-proceedings",
            "manitoba-house-broadcasts",
            "prince-edward-island-assembly-live",
            "northwest-territories-watch-session",
            "newfoundland-labrador-house-webcast",
            "new-south-wales-parliament-webcasts",
            "victoria-parliament-watch",
            "queensland-parliament-live",
            "western-australia-parliament-live",
            "north-rhine-westphalia-landtag-live",
            "baden-wurttemberg-landtag-live",
            "bavaria-landtag-plenum-online",
            "catalonia-canal-parlament",
            "valencia-canal-corts",
            "andalusia-parliament-tv-live",
            "navarre-parliament-live",
        }
        channels = {channel["id"]: channel for channel in self.channels}

        self.assertTrue(expected_link_out_ids.issubset(channels))
        for channel_id in expected_link_out_ids:
            with self.subTest(channel=channel_id):
                channel = channels[channel_id]
                self.assertEqual(channel["jurisdiction_level"], "subnational")
                self.assertEqual(channel["source_type"], "official_page")
                self.assertEqual(channel["technical_status"], "link_only")
                self.assertIsNone(channel["playback_url"])
                self.assertTrue(channel["epg_sources"])

        jalisco = channels["jalisco-canal-parlamento"]
        self.assertEqual(jalisco["source_type"], "direct_hls")
        self.assertEqual(jalisco["technical_status"], "validated")
        self.assertEqual(jalisco["jurisdiction_level"], "subnational")
        self.assertNotIn("colima-icrtv", channels)

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

    def test_channel_presentation_text_is_clean(self):
        for channel in self.channels:
            with self.subTest(channel=channel["id"]):
                for key in ("name", "country_or_region", "legislature", "language"):
                    value = channel[key]
                    self.assertEqual(value, value.strip())
                    self.assertNotIn("  ", value)
                self.assertNotIn("_", channel["name"])
                self.assertNotIn("_", channel["legislature"])

    def test_repeated_official_service_families_share_identity(self):
        families = defaultdict(list)
        for channel in self.channels:
            families[channel["official_url"]].append(channel)

        for official_url, channels in families.items():
            if len(channels) < 2:
                continue
            with self.subTest(official_url=official_url):
                self.assertEqual(len({channel["country_or_region"] for channel in channels}), 1)
                self.assertEqual(len({channel["legislature"] for channel in channels}), 1)
                self.assertEqual(
                    len(
                        {
                            json.dumps(channel["external_ids"], sort_keys=True)
                            for channel in channels
                        }
                    ),
                    1,
                )

    def test_source_type_and_technical_status_are_coherent(self):
        for channel in self.channels:
            with self.subTest(channel=channel["id"]):
                if channel["source_type"] == "official_page":
                    self.assertEqual(channel["technical_status"], "link_only")
                    self.assertEqual(channel["source_kind"], "official_page")
                if channel["technical_status"] == "link_only":
                    self.assertEqual(channel["source_type"], "official_page")
                if channel["source_type"] == "youtube":
                    self.assertEqual(channel["technical_status"], "validated")
                    self.assertEqual(channel["source_kind"], "official_youtube_embed")
                if channel["source_type"] == "direct_dash":
                    self.assertEqual(channel["source_kind"], "direct_dash_research")
                if channel["source_type"] == "direct_hls":
                    self.assertIn(
                        channel["source_kind"],
                        {"first_party_hls", "official_vendor_hls", "third_party_relay_hls"},
                    )
                if channel["technical_status"] == "needs_review":
                    self.assertNotEqual(channel["stability_risk"], "low")

    def test_quebec_family_uses_the_official_accented_institution_name(self):
        quebec_channels = [
            channel for channel in self.channels if channel["id"].startswith("quebec-canal")
        ]
        self.assertEqual(len(quebec_channels), 14)
        self.assertEqual(
            {channel["legislature"] for channel in quebec_channels},
            {"Assemblée nationale du Québec"},
        )

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
