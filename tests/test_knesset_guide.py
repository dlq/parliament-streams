import html
import unittest
from datetime import UTC, datetime

from parliament_streams.scrapers import knesset_tv as knesset


def guide(rows, dates=("2026-10-25", "2026-10-26", "2026-10-27")):
    calendar = "".join(f'<div class="day-div" data-date="{day}"></div>' for day in dates)
    fields = "".join(
        (
            '<img data-rowrid="{}" data-programdate="{}" '
            'data-programtime="{}" data-programname="{}">'
        ).format(*[html.escape(value, quote=True) for value in row])
        for row in rows
    )
    return calendar + '<table class="broadcasts-table">' + fields + "</table>"


class KnessetGuideTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 25, 20, tzinfo=UTC)
        self.row = ("273696", "25/10/2026 00:00:00", "23:00-00:00", "המדד")

    def events(self, rows, **kwargs):
        return knesset.parse(guide(rows, **kwargs), now=self.now)[knesset.CHANNEL_ID]["events"]

    def test_explicit_ranges_official_ids_and_duplicate_mobile_cards(self):
        event = self.events([self.row, self.row])[0]
        self.assertEqual(event["id"], "273696")
        self.assertEqual(event["identifier_kind"], "official")
        self.assertEqual(event["title"], "המדד")
        self.assertNotIn("language", event)
        self.assertEqual(event["start"], "2026-10-25T21:00:00Z")
        self.assertEqual(event["end"], "2026-10-25T22:00:00Z")
        self.assertEqual(event["source_timezone"], "Asia/Jerusalem")
        self.assertEqual(event["end_basis"], "source")
        self.assertTrue(event["url"].endswith("#broadcasts-div-273696"))
        self.assertEqual(len(self.events([self.row, self.row])), 1)

    def test_broadcast_day_continues_only_across_an_explicit_midnight_boundary(self):
        rows = [
            ("one", "26/10/2026 00:00:00", "21:00-01:00", "ערב"),
            ("two", "26/10/2026 00:00:00", "01:00-02:00", "לילה"),
            ("three", "26/10/2026 00:00:00", "02:00-03:00", "שידור חוזר"),
        ]
        events = self.events(rows)
        self.assertEqual(events[0]["start"], "2026-10-26T19:00:00Z")
        self.assertEqual(events[1]["start"], "2026-10-26T23:00:00Z")
        self.assertEqual(events[2]["start"], "2026-10-27T00:00:00Z")
        with self.assertRaisesRegex(ValueError, "rollover"):
            self.events([rows[0], ("bad", rows[1][1], "00:30-02:00", "לא ידוע")])

    def test_dst_gap_and_fold_stay_unresolved_while_known_offsets_change(self):
        summer = knesset.parse(
            guide(
                [("summer", "24/10/2026 00:00:00", "07:00-08:00", "Summer")], dates=("2026-10-24",)
            ),
            now=datetime(2026, 10, 24, 3, tzinfo=UTC),
        )
        self.assertEqual(summer[knesset.CHANNEL_ID]["events"][0]["start"], "2026-10-24T04:00:00Z")
        folded = ("fold", "25/10/2026 00:00:00", "01:30-02:30", "Unresolved")
        self.assertEqual(knesset.parse(guide([folded]), now=self.now), {})
        missing_end = self.events([("end-fold", folded[1], "00:30-01:30", "Partial")])[0]
        self.assertNotIn("end", missing_end)
        self.assertEqual(
            knesset.parse(
                guide(
                    [("gap", "27/03/2026 00:00:00", "02:30-03:30", "Gap")], dates=("2026-03-27",)
                ),
                now=datetime(2026, 3, 27, tzinfo=UTC),
            ),
            {},
        )

    def test_unknown_or_zero_end_is_not_invented(self):
        for time_range in ("23:00-unknown", "23:00-23:00"):
            with self.subTest(time_range=time_range):
                event = self.events([("partial", self.row[1], time_range, "Partial")])[0]
                self.assertNotIn("end", event)

    def test_stale_layout_conflicting_identity_and_bad_clock_fail(self):
        for payload in (
            "<html>No guide</html>",
            guide([], dates=("2025-01-01",)),
            guide([self.row, (*self.row[:2], "22:00-23:00", self.row[3])]),
            guide([("bad", self.row[1], "25:00-26:00", "Bad")]),
        ):
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                knesset.parse(payload, now=self.now)
        self.assertEqual(knesset.parse(guide([]), now=self.now), {})

    def test_source_today_is_jerusalem_date_and_current_event_uses_real_range(self):
        now = datetime(2026, 10, 25, 22, 30, tzinfo=UTC)
        row = ("current", "26/10/2026 00:00:00", "00:00-01:00", "Current")
        schedule = knesset.parse(guide([row], dates=("2026-10-26",)), now=now)[knesset.CHANNEL_ID]
        self.assertEqual(schedule["current_event_title"], "Current")
        self.assertEqual(schedule["events"][0]["status"], "live")
        self.assertIsNone(schedule["next_event_title"])
