import copy
import json
import tempfile
import unittest
from pathlib import Path
from typing import cast
from xml.etree import ElementTree as ET

from parliament_streams import cli
from parliament_streams.catalogue import load_catalogue
from parliament_streams.iptv import hls_channels, render_playlist, render_xmltv
from parliament_streams.schedule_collection import ScheduleSnapshot

ROOT = Path(__file__).resolve().parents[1]


class IPTVTests(unittest.TestCase):
    def setUp(self):
        self.catalogue = load_catalogue(ROOT / "data/channels.json")
        self.channel = copy.deepcopy(
            next(c for c in self.catalogue["channels"] if c["id"] == "brazil-tv-camara")
        )
        self.catalogue["channels"] = [self.channel]

    def snapshot(self, events, **fields):
        return cast(
            ScheduleSnapshot,
            {"channels": {self.channel["id"]: {"events": events, **fields}}},
        )

    def test_selection_respects_playback_rights_and_stability(self):
        self.assertEqual(len(hls_channels(self.catalogue)), 1)
        for field, value in [
            ("availability", "event_based"),
            ("stability_risk", "high"),
            ("technical_status", "needs_review"),
            ("source_type", "direct_dash"),
            ("playback_policy", "link_out"),
        ]:
            changed = copy.deepcopy(self.catalogue)
            changed["channels"][0][field] = value
            self.assertEqual(hls_channels(changed), [])
        self.channel["availability"] = "sitting_only"
        self.assertEqual(len(hls_channels(self.catalogue, include_event_based=True)), 1)
        for status in ["no_third_party_reuse", "embed_only"]:
            self.channel["permission"]["status"] = status
            self.assertEqual(hls_channels(self.catalogue, include_event_based=True), [])

    def test_playlist_utf8_attributes_and_injection(self):
        self.channel["name"] = 'Câmara "TV"\n#EXTINF: injected'
        result = render_playlist([self.channel], "https://example.org/epg.xml")
        self.assertEqual(len(result.splitlines()), 3)
        self.assertIn('tvg-id="brazil-tv-camara"', result)
        self.assertIn("Câmara 'TV' #EXTINF: injected", result)
        self.channel["playback_url"] = "https://example.org/stream\n#EXTINF:fake"
        with self.assertRaises(ValueError):
            render_playlist([self.channel], "https://example.org/epg.xml")

    def test_xmltv_timezone_escaping_and_incomplete_times(self):
        event = {
            "title": "Budget & <debate>",
            "start": "2026-10-07T09:00:00-03:00",
            "end": "2026-10-07T10:00:00-03:00",
            "status": "scheduled",
            "url": "https://example.org/?a=1&b=2",
        }
        missing_end = {k: v for k, v in event.items() if k != "end"}
        invalid = {**event, "end": event["start"]}
        naive = {**event, "start": "2026-10-07T09:00:00"}
        cancelled = {**event, "status": "cancelled"}
        xml, count, skipped = render_xmltv(
            self.catalogue,
            self.snapshot([event, event, missing_end, invalid, naive, cancelled], stale=True),
        )
        root = ET.fromstring(xml)
        self.assertEqual((count, skipped), (1, 4))
        programme = root.find("programme")
        self.assertEqual(programme.attrib["start"], "20261007120000 +0000")
        self.assertEqual(programme.attrib["stop"], "20261007130000 +0000")
        self.assertEqual(programme.findtext("title"), event["title"])
        self.assertIn("Retained", programme.findtext("desc"))
        self.assertEqual(programme.attrib["channel"], root.find("channel").attrib["id"])

    def test_cli_writes_linked_exports(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            schedules = path / "schedules.json"
            schema = json.loads((ROOT / "schema/schedules.schema.json").read_text())
            schedules.write_text(
                json.dumps(
                    {
                        "schema_version": 3,
                        "generated_at": "2026-10-07T12:00:00Z",
                        "refresh_interval_hours": 6,
                        "channels": {},
                        "sources": {},
                        "counts": {key: 0 for key in schema["properties"]["counts"]["required"]},
                    }
                )
            )
            self.assertEqual(
                cli.main(
                    [
                        "iptv-export",
                        "--schedules",
                        str(schedules),
                        "--output-dir",
                        str(path),
                        "--epg-url",
                        "https://example.org/epg.xml",
                    ]
                ),
                0,
            )
            stable = (path / "stable-hls.m3u8").read_text()
            self.assertIn('url-tvg="https://example.org/epg.xml"', stable)
            all_ids = {c.attrib["id"] for c in ET.parse(path / "epg.xml").findall("channel")}
            self.assertTrue(
                all(
                    c["id"] in all_ids
                    for c in hls_channels(load_catalogue(ROOT / "data/channels.json"))
                )
            )
            self.assertTrue((path / "validated-hls.m3u8").exists())
            schedules.write_text('{"channels": {}}')
            self.assertEqual(
                cli.main(
                    [
                        "iptv-export",
                        "--schedules",
                        str(schedules),
                        "--output-dir",
                        str(path),
                    ]
                ),
                2,
            )
