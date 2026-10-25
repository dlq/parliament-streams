"""Canal Parlamento uses dated broadcast slots, with uncertain boundaries retained."""

from __future__ import annotations

import unittest
from datetime import UTC, datetime
from unittest.mock import Mock
from urllib.parse import parse_qs, urlsplit

from parliament_streams.scrapers import spain_canal_parlamento as source


def week(
    rows: str = "", label: str = "Semana del 19 de Octubre de 2026 al 25 de Octubre de 2026"
) -> str:
    # Structure observed on the official 25 October weekly response; programme
    # titles are synthetic and the indexed official rows use the same clock/day
    # structure. No cookies, live addresses, media or source secrets are fixtures.
    return (
        "<h2><strong>Programación del Canal Parlamento</strong></h2>"
        f'<h3 id="titularagenda">{label}</h3>'
        f'<div class="table-responsive">{rows}</div>'
    )


def day(name: str, rows: list[tuple[str, str]]) -> str:
    return (
        f"<h3>{name}</h3><table>"
        + "".join(f"<tr><td>{clock}</td><td>{title}</td></tr>" for clock, title in rows)
        + "</table>"
    )


MONDAY = datetime(2026, 10, 19, 8, tzinfo=UTC)


class SpainCanalParlamentoTests(unittest.TestCase):
    def events(self, html: str, now: datetime = MONDAY):
        return source.parse(html, now=now)[source.CHANNEL_ID]["events"]

    def test_linear_channel_dates_and_next_start_boundaries(self):
        html = week(
            day("Lunes", [("11:00 h.", "Committee &amp; scrutiny"), ("15:00 h.", "Plenary")])
        )
        result = source.parse(html, now=MONDAY)
        self.assertEqual(set(result), {"spain-canal-parlamento"})
        events = result[source.CHANNEL_ID]["events"]
        self.assertEqual(events[0]["start"], "2026-10-19T09:00:00Z")
        self.assertEqual(events[0]["end"], "2026-10-19T13:00:00Z")
        self.assertEqual(events[0]["end_basis"], "next_listing_start")
        self.assertEqual(events[0]["start_basis"], "source")
        self.assertEqual(events[0]["source_timezone"], "Europe/Madrid")
        self.assertEqual(events[0]["title"], "Committee & scrutiny")
        self.assertNotIn("end", events[1])

    def test_unknown_starts_and_day_changes_never_supply_previous_end(self):
        html = week(
            day(
                "Lunes",
                [
                    ("09:00 h.", "Plenary"),
                    ("Fin Anterior", "Untimed committee"),
                    ("15:00 h.", "Debate"),
                ],
            )
            + day("Martes", [("10:00 h.", "Next day")])
        )
        events = self.events(html)
        self.assertEqual(len(events), 3)
        self.assertTrue(all("end" not in event for event in events))
        self.assertNotIn("Untimed committee", [event["title"] for event in events])

    def test_current_slot_survives_and_past_week_is_not_made_current(self):
        html = week(day("Lunes", [("11:00 h.", "Committee"), ("15:00 h.", "Plenary")]))
        result = source.parse(html, now=datetime(2026, 10, 19, 10, tzinfo=UTC))[source.CHANNEL_ID]
        self.assertEqual(result["current_event_title"], "Committee")
        self.assertEqual(result["next_event_title"], "Plenary")
        self.assertEqual(source.parse(html, now=datetime(2026, 10, 26, tzinfo=UTC)), {})

    def test_true_empty_week_differs_from_missing_or_changed_markup(self):
        self.assertEqual(source.parse(week(), now=MONDAY), {})
        for html in (
            "<html>Access denied</html>",
            week().replace("table-responsive", "new-layout"),
            week().replace("Semana del", "Changed heading"),
            week().replace("Canal Parlamento", "Agenda del Congreso"),
            week("<table><tr><td>11:00 h.</td><td>Unattached row</td></tr></table>"),
            week('<h3>Lunes</h3><p class="changed-layout">11:00 h. Programme</p>'),
            week(day("Lunes", [("Fin Anterior", "Only unresolved start")])),
        ):
            with self.subTest(html=html), self.assertRaises(ValueError):
                source.parse(html, now=MONDAY)

    def test_galician_months_weekdays_and_cross_year_dates(self):
        html = week(
            day("Mércores", [("11:00 h.", "Committee"), ("12:00 h.", "Debate")]),
            "Semana do 29 de decembro de 2025 ao 4 de xaneiro de 2026",
        )
        events = self.events(html, datetime(2025, 12, 29, tzinfo=UTC))
        self.assertEqual(events[0]["start"], "2025-12-31T10:00:00Z")
        self.assertEqual(events[0]["end"], "2025-12-31T11:00:00Z")
        with self.assertRaisesRegex(ValueError, "Monday-to-Sunday"):
            source.parse(
                week(label="Semana del 20 de Octubre de 2026 al 25 de Octubre de 2026"), now=MONDAY
            )

    def test_dst_ambiguous_or_missing_hours_are_not_guessed(self):
        for label, monday, now in (
            ("Semana del 19 de Octubre de 2026 al 25 de Octubre de 2026", "Lunes", MONDAY),
            (
                "Semana del 23 de Marzo de 2026 al 29 de Marzo de 2026",
                "Lunes",
                datetime(2026, 3, 23, tzinfo=UTC),
            ),
        ):
            with self.subTest(label=label):
                html = week(
                    day(monday, [("11:00 h.", "Known slot")])
                    + day(
                        "Domingo",
                        [("02:30 h.", "Unresolved clock"), ("04:00 h.", "Known later slot")],
                    ),
                    label,
                )
                events = self.events(html, now)
                self.assertEqual(len(events), 2)
                self.assertNotIn("Unresolved clock", [event["title"] for event in events])
                self.assertTrue(all("end" not in event for event in events))

    def test_explicit_midnight_boundary_and_unknown_rollover(self):
        html = week(
            day("Lunes", [("23:30 h.", "Late programme"), ("24:00 h.", "End of transmission")])
        )
        events = self.events(html)
        self.assertEqual(events[0]["end"], "2026-10-19T22:00:00Z")
        self.assertEqual(events[1]["start"], "2026-10-19T22:00:00Z")
        html = week(
            day(
                "Lunes",
                [
                    ("23:30 h.", "Late programme"),
                    ("00:30 h.", "Undated rollover"),
                    ("01:00 h.", "Still unresolved"),
                ],
            )
        )
        events = self.events(html)
        self.assertEqual(len(events), 1)
        self.assertNotIn("end", events[0])

    def test_collection_follows_only_official_link_and_selects_local_date(self):
        homepage = (
            '<a href="https://www.congreso.es:443/es/programacion?'
            "p_p_id=canalParlamentoPortlet_INSTANCE_example&amp;"
            "_canal_fechaSeleccionada=2026-10-18&amp;"
            '_canal_mvcPath=%2Fview_semanal.jsp">Ver semana completa</a>'
        )
        fetcher = Mock(side_effect=[homepage, week()])
        now = datetime(2026, 10, 18, 23, tzinfo=UTC)
        result, urls = source.collect(fetcher, now, 8, 1)
        self.assertEqual(result, {})
        self.assertEqual(len(urls), 2)
        self.assertEqual(fetcher.call_count, 2)
        query = parse_qs(urlsplit(urls[1]).query)
        self.assertEqual(query["_canal_fechaSeleccionada"], ["2026-10-19"])
        self.assertEqual(query["_canal_mvcPath"], ["/view_semanal.jsp"])
        self.assertEqual(fetcher.call_args.args[1:], (8, 1))
        self.assertEqual(fetcher.call_args.args[0]["headers"]["User-Agent"], "Mozilla/5.0")

    def test_http_errors_propagate_instead_of_becoming_empty_schedules(self):
        fetcher = Mock(side_effect=RuntimeError("HTTP 403"))
        with self.assertRaisesRegex(RuntimeError, "HTTP 403"):
            source.collect(fetcher, MONDAY, 8, 0)
        self.assertEqual(fetcher.call_count, 1)

    def test_collection_rejects_foreign_links_missing_date_and_stale_week(self):
        for base in (
            "https://attacker.test/es/programacion",
            "https://user:password@www.congreso.es/es/programacion",
            "https://www.congreso.es/agenda",
        ):
            homepage = (
                f'<a href="{base}?_canal_fechaSeleccionada=2026-10-19&amp;'
                '_canal_mvcPath=%2Fview_semanal.jsp">Week</a>'
            )
            fetcher = Mock(return_value=homepage)
            with self.subTest(base=base), self.assertRaises(ValueError):
                source.collect(fetcher, MONDAY, 8, 0)
            self.assertEqual(fetcher.call_count, 1)
        homepage = (
            '<a href="/es/programacion?_canal_fechaSeleccionada=2026-10-19&amp;'
            '_canal_mvcPath=%2Fview_semanal.jsp">Week</a>'
        )
        fetcher = Mock(
            side_effect=[
                homepage,
                week(label="Semana del 12 de Octubre de 2026 al 18 de Octubre de 2026"),
            ]
        )
        with self.assertRaisesRegex(ValueError, "different week"):
            source.collect(fetcher, MONDAY, 8, 0)


if __name__ == "__main__":
    unittest.main()
