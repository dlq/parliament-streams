import json
import unittest
from collections import defaultdict
from pathlib import Path
from typing import NotRequired, get_args, get_origin, get_type_hints
from unittest.mock import patch
from urllib.parse import urlparse

from parliament_streams.models import (
    Accessibility,
    Catalogue,
    ChannelRecord,
    Embed,
    EpgSource,
    ExternalIds,
    FallbackCatalogue,
    FallbackSource,
    IdentitySource,
    Permission,
    PermissionStatus,
    PlaybackPolicy,
    SourceKind,
    SourceType,
    StabilityRisk,
    TechnicalStatus,
    ValidationHistoryEntry,
)
from parliament_streams.validation import validate_catalogue

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE_PATH = ROOT / "data" / "channels.json"
SCHEMA_PATH = ROOT / "schema" / "channels.schema.json"
PAGES_WORKFLOW_PATH = ROOT / ".github" / "workflows" / "pages.yml"


class CatalogueContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalogue = json.loads(CATALOGUE_PATH.read_text(encoding="utf-8"))
        cls.channels = cls.catalogue["channels"]

    def test_catalogue_has_expected_top_level_shape(self):
        self.assertEqual(self.catalogue["schema_version"], 9)
        self.assertEqual(
            self.catalogue["generated_from"], "curated research and live endpoint validation"
        )

    def test_schema_and_python_type_contracts_are_aligned(self):
        schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        fallbacks = json.loads((ROOT / "schema/fallbacks.schema.json").read_text())
        contracts = [
            (Catalogue, schema),
            (FallbackCatalogue, fallbacks),
            (FallbackSource, fallbacks["$defs"]["fallback"]),
            *[
                (model, schema["$defs"][name])
                for model, name in [
                    (ChannelRecord, "channel"),
                    (ExternalIds, "external_ids"),
                    (IdentitySource, "identity_source"),
                    (Embed, "embed"),
                    (Accessibility, "accessibility"),
                    (EpgSource, "epg_source"),
                    (Permission, "permission"),
                    (ValidationHistoryEntry, "validation_history_entry"),
                ]
            ],
        ]
        for model, contract in contracts:
            with self.subTest(model=model.__name__):
                hints = get_type_hints(model, include_extras=True)
                self.assertEqual(set(hints), set(contract["properties"]))
                self.assertEqual(
                    {key for key, hint in hints.items() if get_origin(hint) is not NotRequired},
                    set(contract["required"]),
                )
        channel_fields = {
            "source_type": SourceType,
            "source_kind": SourceKind,
            "technical_status": TechnicalStatus,
            "stability_risk": StabilityRisk,
        }
        for field, annotation in channel_fields.items():
            with self.subTest(field=field):
                self.assertEqual(
                    set(schema["$defs"]["channel"]["properties"][field]["enum"]),
                    set(get_args(annotation)),
                )
        self.assertEqual(
            set(schema["$defs"]["permission"]["properties"]["status"]["enum"]),
            set(get_args(PermissionStatus)),
        )
        self.assertEqual(
            set(schema["$defs"]["playback_policy"]["enum"]), set(get_args(PlaybackPolicy))
        )

    def test_pages_workflow_publishes_fallback_data(self):
        workflow = PAGES_WORKFLOW_PATH.read_text(encoding="utf-8")
        self.assertIn('"data/fallbacks.json"', workflow)
        self.assertIn("cp data/fallbacks.json _site/data/fallbacks.json", workflow)

    def test_channel_records_follow_declared_schema_contract(self):
        self.assertEqual(validate_catalogue(self.catalogue), [])

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

        for channel in hls_channels:
            self.assertTrue(urlparse(channel["playback_url"]).path.endswith(".m3u8"))
        for channel in youtube_channels:
            self.assertIn("youtube", channel["official_url"].lower())
            self.assertIsInstance(channel["embed"], dict)

    def test_each_channel_records_playback_policy(self):
        policies = {channel["playback_policy"] for channel in self.channels}
        self.assertIn("native_playback", policies)
        self.assertIn("provider_embed", policies)
        self.assertIn("link_out", policies)
        self.assertIn("research_only", policies)
        for channel in self.channels:
            with self.subTest(channel=channel["id"]):
                policy = channel["playback_policy"]
                if policy == "native_playback":
                    self.assertIsNotNone(channel["playback_url"])
                    self.assertEqual(channel["technical_status"], "validated")
                    self.assertNotEqual(channel["permission"]["status"], "no_third_party_reuse")
                if channel["source_type"] == "youtube":
                    self.assertEqual(policy, "provider_embed")
                if channel["source_type"] == "official_page":
                    self.assertEqual(policy, "link_out")
                if channel["source_kind"] == "direct_dash_research":
                    self.assertEqual(policy, "research_only")

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

    def test_quebec_family_uses_the_official_accented_institution_name(self):
        quebec_channels = [
            channel for channel in self.channels if channel["id"].startswith("quebec-canal")
        ]
        self.assertTrue(quebec_channels)
        self.assertEqual(
            {channel["legislature"] for channel in quebec_channels},
            {"Assemblée nationale du Québec"},
        )

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
