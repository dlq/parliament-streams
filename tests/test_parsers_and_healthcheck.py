import contextlib
import io
import json
import tempfile
import unittest
from datetime import UTC, datetime
from http.client import RemoteDisconnected
from pathlib import Path
from unittest.mock import patch

from parliament_streams import healthcheck
from parliament_streams.scrapers import __main__ as scraper_cli
from parliament_streams.scrapers import (
    brazil_tv_camara,
    cpac,
    ebs,
    european_parliament,
    italian_senate,
    new_zealand_parliament,
    ontario_calendar,
    portugal_agenda,
    quebec_webdiffusion,
)
from parliament_streams.scrapers.common import clean_html, first_match, parse_iso


class ParserTests(unittest.TestCase):
    def test_italian_senate_json_schedule(self):
        payload = json.dumps(
            [
                {"title": "Seduta di Assemblea n. 448", "field_date": "13:00"},
                {"title": "Commissione Affari costituzionali", "field_date": "15.30"},
            ]
        )
        parsed = italian_senate.parse(
            payload,
            "[]",
            "[]",
            now=datetime(2026, 8, 17, 10, tzinfo=UTC),
        )
        schedule = parsed["italy-senate"]
        self.assertEqual(schedule["current_event_title"], "Seduta di Assemblea n. 448")
        self.assertEqual(schedule["next_event_title"], "Commissione Affari costituzionali")

    def test_italian_senate_requests_cover_three_days(self):
        requests = italian_senate.request_specs(datetime(2026, 8, 17, 10, tzinfo=UTC))
        self.assertEqual(len(requests), 3)
        self.assertIn("field_date_value%5Bmin%5D=2026-08-17T00%3A00%3A00", requests[0]["url"])

    def test_portugal_open_data_agenda(self):
        payload = json.dumps(
            [
                {
                    "EventStartDate": "18/08/2026",
                    "EventStartTime": "10:00:00",
                    "Section": "Plenário",
                    "Title": "Reunião Plenária",
                },
                {
                    "EventStartDate": "18/08/2026",
                    "EventStartTime": "14:30:00",
                    "Section": "Comissões Parlamentares",
                    "Title": "Comissão de Assuntos Europeus",
                },
                {
                    "EventStartDate": "18/08/2026",
                    "EventStartTime": None,
                    "Section": "Grupos Parlamentares",
                    "Title": "Not a broadcast schedule",
                },
            ]
        )
        schedule = portugal_agenda.parse(payload, now=datetime(2026, 8, 17, 12, tzinfo=UTC))[
            "portugal-artv"
        ]
        self.assertEqual(schedule["current_event_title"], "Reunião Plenária")
        self.assertEqual(schedule["next_event_title"], "Comissão de Assuntos Europeus")

    def test_portugal_resolves_current_open_data_download(self):
        responses = {
            portugal_agenda.INDEX_URL: (
                '<a title="Pasta XVII Legislatura" href="/legislature?Path=current">XVII</a>'
            ),
            "https://www.parlamento.pt/legislature?Path=current": (
                '<a href="https://app.parlamento.pt/AgendaParlamentar_json.txt?token=current">'
                "JSON</a>"
            ),
            "https://app.parlamento.pt/AgendaParlamentar_json.txt?token=current": "[]",
        }

        def fetcher(spec, _timeout, _retries):
            return responses[spec["url"]]

        parsed, urls = portugal_agenda.collect(fetcher, datetime(2026, 8, 17, 12, tzinfo=UTC), 3, 0)
        self.assertEqual(parsed, {})
        self.assertEqual(
            urls[-1], "https://app.parlamento.pt/AgendaParlamentar_json.txt?token=current"
        )

    def test_common_helpers_handle_html_and_invalid_dates(self):
        self.assertEqual(
            clean_html("<strong>Hello</strong><br>world &amp; friends"), "Hello world & friends"
        )
        self.assertEqual(first_match("A schedule starts at noon", r"starts at (\w+)"), "noon")
        self.assertIsNone(first_match("no match", r"starts at (\w+)"))
        self.assertEqual(parse_iso("2026-08-15T12:00:00Z"), datetime(2026, 8, 15, 12, tzinfo=UTC))
        self.assertIsNone(parse_iso("not a date"))

    def test_cpac_parser_selects_current_and_next_event(self):
        html = (
            '<div data-airdate="2026-01-15T14:00:00Z">'
            '<button class="schedule-item-btn">Morning <b>committee</b></button></div>'
            '<div data-airdate="2026-01-15T16:00:00Z">'
            '<button class="schedule-item-btn">Question Period</button></div>'
        )
        result = cpac.parse(html, datetime(2026, 1, 15, 15, tzinfo=UTC))["cpac-ca"]
        self.assertEqual(result["current_event_title"], "Morning committee")
        self.assertEqual(result["next_event_title"], "Question Period")

    def test_quebec_parser_combines_live_and_upcoming_entries(self):
        live = (
            '{"d":[{"DiffusionDisponible":true,'
            '"UrlSignal":"https://example.test/canal01/live",'
            '"Titre":"Commission &amp; finances"}]}'
        )
        upcoming = '{"d":[{"Titre":"Question <b>Period</b>","Date":"16 August","Heure":"10:00"}]}'
        result = quebec_webdiffusion.parse(live, upcoming, datetime(2026, 8, 15, tzinfo=UTC))
        self.assertEqual(result["quebec-canal01"]["current_event_title"], "Commission & finances")
        self.assertEqual(result["quebec-canal01"]["next_event_time"], "16 August, 10:00")
        self.assertEqual(result["quebec-canal02"]["current_event_title"], "No live webcast listed")

    def test_ontario_parser_handles_event_and_empty_calendar_states(self):
        events = """
        <time datetime="2026-01-15T14:00:00Z">ignored</time><h2>Morning <em>sitting</em></h2>
        <time datetime="2026-01-15T16:00:00Z">ignored</time><h2>Question Period</h2>
        """
        scheduled = ontario_calendar.parse(events, datetime(2026, 1, 15, 15, tzinfo=UTC))
        self.assertEqual(scheduled["ontario-house-en"]["current_event_title"], "Morning sitting")
        self.assertEqual(scheduled["ontario-house-en"]["next_event_title"], "Question Period")

        empty = ontario_calendar.parse(
            "There are no events today", datetime(2026, 1, 15, tzinfo=UTC)
        )
        self.assertEqual(len(empty), len(ontario_calendar.CHANNEL_IDS))
        self.assertEqual(
            empty["ontario-house-en"]["current_event_title"], "No calendar events listed today"
        )

    def test_brazil_and_new_zealand_parsers(self):
        brazil_html = """<tr><td><span>09:00</span></td><td><span>News</span></td></tr>
        <tr><td><span>12:00</span></td><td><span>Chamber <b>session</b></span></td></tr>"""
        brazil = brazil_tv_camara.parse(brazil_html, datetime(2026, 1, 15, 14, tzinfo=UTC))[
            "brazil-tv-camara"
        ]
        self.assertEqual(brazil["current_event_title"], "News")
        self.assertEqual(brazil["next_event_title"], "Chamber session")
        self.assertEqual(brazil_tv_camara.parse("<p>No programme</p>"), {})

        calendar = "<p>The House next meets on Tuesday at 2pm.</p>"
        new_zealand = new_zealand_parliament.parse(calendar, datetime(2026, 1, 15, 15, tzinfo=UTC))
        self.assertEqual(
            new_zealand["new-zealand-parliament"]["next_event_time"], "Tuesday at 2pm."
        )
        self.assertEqual(new_zealand_parliament.parse("No calendar listing"), {})
        for blocked_html in (
            "<title>CAPTCHA page</title>",
            '<script src="https://verify.perfdrive.com/challenge.js"></script>',
        ):
            with (
                self.subTest(blocked_html=blocked_html),
                self.assertRaisesRegex(ValueError, "bot-protection page"),
            ):
                new_zealand_parliament.parse(blocked_html)

    def test_european_parliament_parser_selects_current_and_next(self):
        payload = """{
          "pageProps": {"mediaItems": [
            {"title": "Committee", "room": "Brussels", "statusName": "LIVE",
             "EventDateStart": "2026-08-17T13:00:00Z",
             "EventDateEnd": "2026-08-17T15:00:00Z"},
            {"title": "Plenary", "room": "Strasbourg", "statusName": "UPCOMING",
             "EventDateStart": "2026-08-17T16:00:00Z",
             "EventDateEnd": "2026-08-17T18:00:00Z"}
          ]}
        }"""
        result = european_parliament.parse(payload, datetime(2026, 8, 17, 14, tzinfo=UTC))[
            "european-parliament-multimedia-centre"
        ]
        self.assertEqual(result["current_event_title"], "Committee - Brussels")
        self.assertEqual(result["next_event_title"], "Plenary - Strasbourg")

    def test_ebs_parser_selects_current_and_next(self):
        payload = """[{"programs": [
          {"startDatetime": "2026-08-17T13:00:00Z", "duration": 7200,
           "titles": [{"language": "EN", "content": "<p>Live briefing</p>"}]},
          {"startDatetime": "2026-08-17T16:00:00Z", "duration": 3600,
           "titles": [{"language": "EN", "content": "Next briefing"}]}
        ]}]"""
        result = ebs.parse(payload, datetime(2026, 8, 17, 14, tzinfo=UTC))["eu-audiovisual-ebs"]
        self.assertEqual(result["current_event_title"], "Live briefing")
        self.assertEqual(result["next_event_title"], "Next briefing")

    def test_scraper_cli_writes_json_from_saved_input(self):
        with tempfile.TemporaryDirectory() as directory:
            input_path = Path(directory) / "calendar.html"
            input_path.write_text("The House next meets on Wednesday.", encoding="utf-8")
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(scraper_cli.main(["new-zealand-parliament", str(input_path)]), 0)
        self.assertIn('"new-zealand-parliament"', output.getvalue())

    def test_scraper_cli_rejects_wrong_number_of_input_files(self):
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / "first.html"
            second = Path(directory) / "second.html"
            third = Path(directory) / "third.html"
            for path in (first, second, third):
                path.write_text("The House next meets on Wednesday.", encoding="utf-8")
            with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
                scraper_cli.main(["cpac", str(first), str(second)])
            with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
                scraper_cli.main(["quebec-webdiffusion", str(first), str(second), str(third)])


class HealthcheckTests(unittest.TestCase):
    def test_fetch_once_reads_successful_response(self):
        class Response:
            status = 200
            headers = {"Content-Type": "text/plain"}

            def read(self, _limit):
                return b"ok"

            def geturl(self):
                return "https://example.test/final"

            def __enter__(self):
                return self

            def __exit__(self, *_args):
                return False

        with patch.object(healthcheck, "urlopen", return_value=Response()):
            result = healthcheck._fetch_once("https://example.test", timeout=1)
        self.assertEqual(
            result, (200, {"content-type": "text/plain"}, b"ok", "https://example.test/final")
        )

    def test_fetch_once_records_remote_disconnect(self):
        with patch.object(
            healthcheck,
            "urlopen",
            side_effect=RemoteDisconnected("Remote end closed connection without response"),
        ):
            result = healthcheck._fetch_once("https://example.test", timeout=1)
        self.assertEqual(result[0], None)
        self.assertEqual(result[1], {})
        self.assertIn(b"Remote end closed connection", result[2])
        self.assertEqual(result[3], None)

    def test_fetch_retries_http_errors(self):
        response = (200, {"content-type": "text/plain"}, b"ok", "https://example.test")
        with (
            patch.object(
                healthcheck,
                "_fetch_once",
                side_effect=[(404, {}, b"transient redirect miss", None), response],
            ),
            patch.object(healthcheck.time, "sleep") as sleep,
        ):
            result = healthcheck.fetch_url("https://example.test", timeout=1, retries=1)
        self.assertEqual(result, (*response, 2))
        sleep.assert_called_once_with(0.5)

    def test_direct_hls_checks_a_sample_variant(self):
        channel = {
            "id": "sample",
            "source_type": "direct_hls",
            "playback_url": "https://example.test/master.m3u8",
        }
        master = b"#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=1\nvariant.m3u8\n"
        variant = b"#EXTM3U\n#EXTINF:6,\nsegment.ts\n"
        with patch.object(
            healthcheck,
            "fetch_url",
            side_effect=[
                (
                    200,
                    {"content-type": "application/vnd.apple.mpegurl"},
                    master,
                    channel["playback_url"],
                    1,
                ),
                (
                    200,
                    {"content-type": "application/vnd.apple.mpegurl"},
                    variant,
                    "https://example.test/variant.m3u8",
                    1,
                ),
            ],
        ):
            result = healthcheck.check_channel(channel, timeout=1, retries=0)
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["hls_variant_count"], 1)
        self.assertTrue(result["sample_variant"]["looks_like_hls"])

    def test_healthcheck_covers_skip_error_and_success_states(self):
        skipped = {"id": "skipped", "source_type": "official_page", "official_url": None}
        self.assertEqual(healthcheck.check_channel(skipped, 1, 0)["status"], "skipped")

        broken = {
            "id": "broken",
            "source_type": "official_page",
            "official_url": "https://example.test",
        }
        with patch.object(healthcheck, "fetch_url", return_value=(None, {}, b"timeout", None, 2)):
            self.assertEqual(healthcheck.check_channel(broken, 1, 1)["status"], "error")

        with patch.object(healthcheck, "fetch_url", return_value=(404, {}, b"missing", None, 1)):
            self.assertEqual(healthcheck.check_channel(broken, 1, 0)["note"], "HTTP 404")

        hls = {
            "id": "hls",
            "source_type": "direct_hls",
            "playback_url": "https://example.test/live.m3u8",
        }
        with patch.object(
            healthcheck,
            "fetch_url",
            return_value=(200, {}, b"not a manifest", hls["playback_url"], 1),
        ):
            self.assertEqual(healthcheck.check_channel(hls, 1, 0)["status"], "warning")

        dash = {
            "id": "dash",
            "source_type": "direct_dash",
            "playback_url": "https://example.test/live.mpd",
        }
        with patch.object(
            healthcheck,
            "fetch_url",
            return_value=(200, {}, b"not an MPD", dash["playback_url"], 1),
        ):
            self.assertEqual(healthcheck.check_channel(dash, 1, 0)["status"], "warning")

        with patch.object(
            healthcheck,
            "fetch_url",
            return_value=(200, {}, b"<MPD></MPD>", dash["playback_url"], 1),
        ):
            self.assertEqual(healthcheck.check_channel(dash, 1, 0)["status"], "ok")

        with patch.object(
            healthcheck,
            "fetch_url",
            return_value=(200, {}, b"page", broken["official_url"], 1),
        ):
            self.assertEqual(healthcheck.check_channel(broken, 1, 0)["status"], "ok")

    def test_run_healthcheck_rejects_unknown_ids(self):
        with self.assertRaisesRegex(ValueError, "Unknown catalogue ids: missing"):
            healthcheck.run_healthcheck(Path("data/channels.json"), 1, 0, {"missing"})

    def test_healthcheck_cli_writes_report(self):
        report = {"counts": {}, "results": [], "checked_at": "2026-01-15T00:00:00Z"}
        with tempfile.TemporaryDirectory() as directory:
            output_path = Path(directory) / "health.json"
            with patch.object(healthcheck, "run_healthcheck", return_value=report):
                self.assertEqual(healthcheck.main(["--output", str(output_path)]), 0)
            self.assertIn('"counts": {}', output_path.read_text(encoding="utf-8"))

    def test_healthcheck_cli_handles_errors_and_writes_stdout(self):
        error_report = {"counts": {"error": 1}, "results": [], "checked_at": "2026-01-15T00:00:00Z"}
        output = io.StringIO()
        with (
            patch.object(healthcheck, "run_healthcheck", return_value=error_report),
            contextlib.redirect_stdout(output),
        ):
            self.assertEqual(healthcheck.main([]), 1)
        self.assertIn('"error": 1', output.getvalue())

        with (
            patch.object(
                healthcheck,
                "run_healthcheck",
                side_effect=ValueError("Unknown catalogue ids: missing"),
            ),
            contextlib.redirect_stderr(io.StringIO()),
            self.assertRaises(SystemExit),
        ):
            healthcheck.main([])
