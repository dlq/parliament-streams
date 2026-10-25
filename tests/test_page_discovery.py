from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path
from typing import cast
from unittest.mock import patch

from parliament_streams.discovery import build_discovery_findings
from parliament_streams.models import Catalogue
from parliament_streams.page_discovery import classify_page_links, extract_page_leads
from tools.validate_democracy_tier_static import run, validate_candidate

SOURCE = "https://assembly.example/"


def observed(url: str, kind: str = "viewing_page", source: str = SOURCE) -> dict[str, str]:
    return {
        "url": url,
        "kind": kind,
        "source_page": source,
        "label": "Source link",
        "observation": "Link observed.",
    }


def static_report(leads: list[dict[str, str]]) -> dict:
    return {
        "tier": "tier1",
        "countries": [
            {
                "country": "Example",
                "results": [{"status": "page_ok", "url": SOURCE, "page_leads": leads}],
            }
        ],
    }


class PageDiscoveryTests(unittest.TestCase):
    def test_owned_page_exposes_all_lead_types_without_fetching_targets(self):
        html = """
        <a href="/watch">Watch proceedings</a>
        <a href="/video-archive">Recorded video archive</a>
        <a href="https://www.youtube.com/@Assembly/videos">Our channel</a>
        <a href="/session.mp4">Recording</a>
        <link rel="alternate" type="text/calendar" href="/agenda.ics">
        <iframe src="https://www.youtube.com/embed/abcdefghijk" title="Session"></iframe>
        """
        leads, omitted = extract_page_leads(html, SOURCE)
        self.assertEqual(
            {lead["kind"] for lead in leads},
            {"viewing_page", "video_archive", "youtube_channel", "recording", "programme_source"},
        )
        self.assertEqual(omitted, 0)
        self.assertTrue(all(lead["source_page"] == SOURCE for lead in leads))
        self.assertTrue(
            all(
                "unverified" in lead["observation"] or "require review" in lead["observation"]
                for lead in leads
            )
        )

    def test_noise_unsafe_links_and_non_media_archives_are_ignored(self):
        html = """
        <a href="javascript:play()">Live video</a><a href="#video">Video</a>
        <a href="http://127.0.0.1/video">Video</a>
        <a href="https://user:password@example.org/video">Video</a>
        <a href="/watch?access_token=private">Video</a>
        <a href="/watch?apiKey=private">Video</a>
        <a href="/watch?token=REDACTED">Video</a>
        <a href="/video-logo.svg">Video</a>
        <a href="/archives">Document archives</a><a href="/delivery">Delivery information</a>
        <a href="https://www.youtube.com/privacy">YouTube privacy</a>
        <iframe src="https://maps.google.com/maps/embed"></iframe>
        """
        self.assertEqual(extract_page_leads(html, SOURCE), ([], 0))

    def test_provider_recommendations_do_not_become_official_leads(self):
        source = "https://www.youtube.com/@Assembly/videos"
        leads, _ = extract_page_leads('<a href="/watch?v=abcdefghijk">Other uploader</a>', source)
        self.assertEqual(
            [(lead["url"], lead["kind"]) for lead in leads], [(source, "youtube_channel")]
        )

    def test_redirect_to_provider_retains_only_designated_page(self):
        final = "https://www.youtube.com/@Assembly/videos"
        leads, _ = extract_page_leads(
            '<a href="/watch?v=abcdefghijk">Recommendation</a>', SOURCE, base_url=final
        )
        self.assertEqual(
            [(lead["url"], lead["kind"]) for lead in leads], [(final, "youtube_channel")]
        )
        self.assertEqual(leads[0]["source_page"], SOURCE)

    def test_advertised_opaque_feeds_and_numeric_vimeo_archives(self):
        leads, _ = extract_page_leads(
            '<link rel="alternate" type="text/calendar" href="/feed">'
            '<link rel="alternate" type="application/xmltv+xml" href="/data">'
            '<a href="/schedule.pdf">TV schedule</a>'
            '<a href="https://vimeo.com/showcase/123456">Archive</a>'
            '<a href="https://vimeo.com/123456">Video</a>',
            SOURCE,
        )
        self.assertEqual(
            {lead["url"]: lead["kind"] for lead in leads},
            {
                SOURCE + "feed": "programme_source",
                SOURCE + "data": "programme_source",
                SOURCE + "schedule.pdf": "programme_source",
                "https://vimeo.com/showcase/123456": "video_archive",
                "https://vimeo.com/123456": "recording",
            },
        )

    def test_local_host_aliases_and_array_credentials_are_rejected(self):
        for url in [
            "http://localhost./video",
            "http://127.1/video",
            "http://2130706433/video",
            "http://0x7f000001/video",
            SOURCE + "video?token[]=dummy",
            SOURCE + "video?Authorization=dummy",
            SOURCE + "video?refreshToken=dummy",
        ]:
            with self.subTest(url=url):
                self.assertEqual(
                    classify_page_links(SOURCE, [{"tag": "a", "url": url, "label": "Watch"}]),
                    ([], 0),
                )

    def test_base_url_redirect_and_original_provenance_are_distinct(self):
        leads, _ = extract_page_leads(
            '<base href="/media/"><a href="replays">Video archive</a>',
            SOURCE,
            base_url="https://new.assembly.example/pages/index",
        )
        self.assertEqual(leads[0]["url"], "https://new.assembly.example/media/replays")
        self.assertEqual(leads[0]["source_page"], SOURCE)

    def test_diacritics_and_non_latin_labels_are_supported(self):
        leads, _ = extract_page_leads(
            '<a href="/one">Záznam jednání</a><a href="/two">録画配信</a>'
            '<a href="/three">Calendário</a>',
            SOURCE,
        )
        self.assertEqual({lead["kind"] for lead in leads}, {"video_archive", "programme_source"})

    def test_caps_and_duplicates_are_explicit(self):
        html = (
            "".join(f'<a href="/watch/{i}">Watch</a>' for i in range(23))
            + '<a href="/watch/1">Watch again</a>'
        )
        leads, omitted = extract_page_leads(html, SOURCE)
        self.assertEqual(len(leads), 20)
        self.assertEqual(omitted, 3)

    def test_video_element_with_ephemeral_source_keeps_only_parent_lead(self):
        leads, _ = extract_page_leads('<video src="blob:temporary"></video>', SOURCE)
        self.assertEqual(
            [(lead["url"], lead["kind"]) for lead in leads], [(SOURCE, "viewing_page")]
        )

    def test_static_validation_retains_leads_without_media_success_claim(self):
        with patch(
            "tools.validate_democracy_tier_static.fetch",
            return_value={
                "http_status": 200,
                "final_url": SOURCE,
                "body": b'<a href="/watch">Watch video</a>',
            },
        ):
            result = validate_candidate("official_page", SOURCE, 1)
        self.assertEqual(result["status"], "page_ok")
        self.assertEqual(result["page_leads"][0]["url"], SOURCE + "watch")
        self.assertNotIn("validated_manifest_count", result)

    def test_saved_report_redacts_credential_leads(self):
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / "targets.json", Path(directory) / "results.json"
            source.write_text(
                json.dumps(
                    {
                        "countries": [
                            {
                                "country": "Example",
                                "results": [{"kind": "official_page", "url": SOURCE}],
                            }
                        ]
                    }
                )
            )
            with patch(
                "tools.validate_democracy_tier_static.fetch",
                return_value={
                    "http_status": 200,
                    "body": b'<a href="/video?token=secret">Watch</a>',
                },
            ):
                report = run(source, output, 1, 1)
            self.assertEqual(report["countries"][0]["results"][0]["page_leads"], [])
            self.assertNotIn("secret", output.read_text())

    def test_findings_separate_manifest_validation_from_unverified_pages(self):
        catalogue = cast(
            Catalogue,
            {
                "channels": [
                    {"official_url": SOURCE + "watch", "playback_url": None, "epg_sources": []}
                ]
            },
        )
        report = static_report(
            [observed(SOURCE + "watch"), observed(SOURCE + "new-archive", "video_archive")]
        )
        original = copy.deepcopy(catalogue)
        findings = build_discovery_findings(catalogue, [("static.json", report)], [])
        self.assertEqual(
            findings["counts"],
            {
                "validated": 0,
                "page_leads": 2,
                "total": 2,
                "catalogued": 1,
                "reviewed": 0,
                "review": 1,
            },
        )
        self.assertTrue(
            all(row["validation"].startswith("Unverified") for row in findings["findings"])
        )
        self.assertEqual(catalogue, original)

    def test_catalogued_channel_and_archive_children_are_not_new_sources(self):
        source = SOURCE + "video-archive"
        catalogue = cast(
            Catalogue,
            {
                "channels": [
                    {"official_url": source},
                    {"official_url": "https://www.youtube.com/@Assembly/videos"},
                ]
            },
        )
        report = static_report(
            [
                observed(source + "/sitting.mp4", "recording", source),
                observed("https://www.youtube.com/@Assembly/streams", "youtube_channel"),
            ]
        )
        findings = build_discovery_findings(catalogue, [("static.json", report)], [])
        self.assertEqual(findings["counts"]["catalogued"], 2)
        self.assertEqual(findings["counts"]["review"], 0)

    def test_browser_observations_and_durable_page_decisions_are_used(self):
        browser = {
            "pages": [
                {
                    "country": "Example",
                    "tier_report": "tier2-targets.json",
                    "page_url": SOURCE,
                    "page_status": 200,
                    "page_links": [{"url": SOURCE + "watch", "label": "Watch video", "tag": "a"}],
                }
            ]
        }
        findings = build_discovery_findings(
            cast(Catalogue, {"channels": []}),
            [],
            [("browser.json", browser)],
            page_decisions=[
                {
                    "country": "Example",
                    "url": SOURCE + "watch",
                    "disposition": "not_legislative_content",
                    "reviewed_on": "2026-10-25",
                    "reason": "Promotional film",
                    "evidence": [SOURCE],
                }
            ],
        )
        self.assertEqual(findings["counts"]["validated"], 0)
        self.assertEqual(findings["counts"]["reviewed"], 1)
        self.assertEqual(findings["findings"][0]["source_page"], SOURCE)
        browser["pages"][0]["load_note"] = "Navigation timeout"
        self.assertEqual(
            build_discovery_findings(
                cast(Catalogue, {"channels": []}), [], [("browser.json", browser)]
            )["counts"]["page_leads"],
            0,
        )

    def test_malformed_page_leads_do_not_break_manifest_findings(self):
        report = static_report([observed("https://[invalid"), {"url": 5, "kind": "recording"}])
        self.assertEqual(
            build_discovery_findings(
                cast(Catalogue, {"channels": []}), [("static.json", report)], []
            )["counts"]["total"],
            0,
        )

    def test_shared_lead_keeps_each_country_and_source_provenance(self):
        first = static_report([observed("https://shared.example/calendar", "programme_source")])
        second = {
            "tier": "tier2",
            "countries": [
                {
                    "country": "Other",
                    "results": [
                        {
                            "status": "page_ok",
                            "page_leads": [
                                observed(
                                    "https://shared.example/calendar",
                                    "programme_source",
                                    "https://other.example/",
                                )
                            ],
                        }
                    ],
                }
            ],
        }
        findings = build_discovery_findings(
            cast(Catalogue, {"channels": []}), [("one.json", first), ("two.json", second)], []
        )
        self.assertEqual(
            {(row["country"], row["source_page"]) for row in findings["findings"]},
            {("Example", SOURCE), ("Other", "https://other.example/")},
        )

    def test_epg_and_query_scoped_parents_do_not_cover_new_recordings(self):
        calendar = SOURCE + "calendar"
        event = SOURCE + "video?event=one"
        catalogue = cast(
            Catalogue, {"channels": [{"official_url": event, "epg_sources": [{"url": calendar}]}]}
        )
        report = static_report(
            [
                observed(calendar + "/session.mp4", "recording", calendar),
                observed(SOURCE + "video/new.mp4", "recording", event),
            ]
        )
        findings = build_discovery_findings(catalogue, [("static.json", report)], [])
        self.assertEqual(findings["counts"]["review"], 2)


if __name__ == "__main__":
    unittest.main()
