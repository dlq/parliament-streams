"""Contract fixtures; blocked Senate/NY endpoints are not live-payload evidence."""

import json
import unittest
from datetime import UTC, datetime

from parliament_streams.schedule_quality import SOURCE_SCOPES
from parliament_streams.scrapers import (
    brazil_camara_events as brazil,
)
from parliament_streams.scrapers import (
    california_assembly_calendar as california,
)
from parliament_streams.scrapers import (
    harmony_json as harmony,
)
from parliament_streams.scrapers import (
    new_york_senate_calendar as ny,
)
from parliament_streams.scrapers import (
    us_senate_hearings as senate,
)

NOW = datetime(2026, 10, 28, 18, tzinfo=UTC)


def brazil_page(rows=None, following=None):
    return json.dumps(
        {"dados": rows or [], "links": [{"rel": "next", "href": following}] if following else []}
    )


def brazil_row(**changes):
    return {
        "id": 123,
        "descricao": "Audiência",
        "dataHoraInicio": "2026-10-29T08:00",
        "situacao": "Convocada",
        "localCamara": {"nome": "Plenário"},
        **changes,
    }


def harmony_row(**changes):
    return {
        "Id": 123,
        "Title": "Committee",
        "EntityStatus": 0,
        "PublishStatus": 2,
        "ScheduledStart": "2026-10-29T08:00:00",
        "ScheduledEnd": "2026-10-29T10:00:00",
        "Location": "Room 1",
        **changes,
    }


def harmony_payload(rows=None):
    return json.dumps(
        {"ContentEntityDatas": [[], rows or [], [], []], "LastModifiedTime": "2026-10-28T18:00:00Z"}
    )


def calendar_link(query="name=Audit&start=20261029T170000&end=20261029T190000&location=Capitol"):
    return (
        f'<html><div class="events-page"><a href="/api/ics/generate?{query}">'
        "Calendar</a></div></html>"
    )


def ics(properties="UID:123\nSUMMARY:Session\nDTSTART;TZID=America/New_York:20261029T110000"):
    return f"BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n{properties}\nEND:VEVENT\nEND:VCALENDAR"


class StructuredPriorityTests(unittest.TestCase):
    def test_brazil_local_clock_official_id_and_start_only(self):
        result = brazil.parse(brazil_page([brazil_row(dataHoraFim="2026-10-29T12:00")]), now=NOW)[
            brazil.CHANNEL_ID
        ]
        event = result["events"][0]
        self.assertEqual(event["start"], "2026-10-29T11:00:00Z")
        self.assertEqual(event["id"], "123")
        self.assertNotIn("end", event)
        self.assertEqual(event["location"], "Plenário")
        self.assertEqual(brazil.parse(brazil_page([brazil_row(situacao="Cancelada")]), now=NOW), {})
        self.assertEqual(
            brazil.parse(brazil_page([brazil_row(dataHoraInicio="2020-01-01T08:00")]), now=NOW), {}
        )

    def test_brazil_pagination_and_incomplete_windows(self):
        requests = []

        def fetch(request, timeout, retries):
            requests.append(request["url"])
            return (
                brazil_page([brazil_row()], brazil.API_URL + "?pagina=2")
                if len(requests) == 1
                else brazil_page([])
            )

        result, urls = brazil.collect(fetch, NOW, 1, 0)
        self.assertIn(brazil.CHANNEL_ID, result)
        self.assertEqual(len(urls), 2)
        self.assertIn("dataInicio=2026-10-28", urls[0])
        self.assertEqual(brazil.request_specs(NOW)[0]["url"], urls[0])
        for following in (brazil.first_url(NOW), brazil.API_URL + "?pagina=2"):
            with self.assertRaisesRegex(ValueError, "capped or repeating"):
                brazil.collect(
                    lambda *args, following=following: brazil_page([], following), NOW, 1, 0
                )
        for body in (
            brazil_page([], "https://example.com/events"),
            '{"dados": null}',
            brazil_page([brazil_row(id=None)]),
            brazil_page([brazil_row(dataHoraInicio="bad")]),
        ):
            with self.assertRaises(ValueError):
                brazil.parse(body, now=NOW)
        with self.assertRaisesRegex(ValueError, "Conflicting"):
            brazil.parse(brazil_page([brazil_row(), brazil_row(descricao="Other")]), now=NOW)

    def test_california_uses_export_parameters_only(self):
        event = california.parse(calendar_link(), now=NOW)[california.CHANNEL_ID]["events"][0]
        self.assertEqual(event["start"], "2026-10-30T00:00:00Z")
        self.assertEqual(event["title"], "Audit")
        self.assertNotIn("end", event)
        self.assertEqual(
            california.parse('<html><div class="events-page">Tomorrow 9am</div></html>', now=NOW),
            {},
        )
        for body in (
            "<html>Changed</html>",
            calendar_link().replace("</html>", ""),
            calendar_link("name=A&start=bad"),
            calendar_link("name=A&name=B&start=20261029T170000"),
            calendar_link("name=A&start=20261101T013000"),
        ):
            with self.assertRaises(ValueError):
                california.parse(body, now=NOW)
        self.assertEqual(
            california.parse(
                calendar_link().replace(
                    "/api/ics/generate?", "https://evil.example/api/ics/generate?"
                ),
                now=NOW,
            ),
            {},
        )

    def test_harmony_all_publishers_offsets_and_empty(self):
        payload = harmony_payload([harmony_row()])
        result = harmony.parse(payload, payload, payload, now=NOW)
        self.assertEqual(len(result), 3)
        house, senate_id, bermuda = harmony.TARGETS
        self.assertEqual(result[house]["events"][0]["start"], "2026-10-29T12:00:00Z")
        self.assertEqual(result[bermuda]["events"][0]["start"], "2026-10-29T11:00:00Z")
        for request in harmony.request_specs(NOW):
            self.assertTrue(request["url"].endswith("19700101000000000"))
        self.assertEqual(harmony.parse(*[harmony_payload()] * 3, now=NOW), {})
        self.assertTrue(harmony.source_url_for_channel(house, []).startswith("https://parlvu"))
        live = harmony_payload(
            [
                harmony_row(
                    EntityStatus=1,
                    ScheduledStart="2026-10-28T17:00:00Z",
                    ScheduledEnd="2026-10-28T19:00:00Z",
                )
            ]
        )
        self.assertEqual(
            harmony.parse(live, payload, payload, now=NOW)[house]["events"][0]["status"], "live"
        )
        ignored = [
            harmony_row(EntityStatus=2),
            harmony_row(Id=124, PublishStatus=0),
            harmony_row(Id=125, ScheduledStart="2020-01-01T00:00:00"),
            harmony_row(Id=126, ScheduledStart="2026-10-28T01:00:00"),
        ]
        self.assertEqual(
            harmony.parse(harmony_payload(ignored), harmony_payload(), harmony_payload(), now=NOW),
            {},
        )

    def test_harmony_rejects_bad_contract_and_ambiguous_clocks(self):
        for rows in (
            [harmony_row(EntityStatus=None)],
            [harmony_row(Id=None)],
            [harmony_row(ScheduledStart="2026-10-29")],
            [harmony_row(ScheduledStart="2026-11-01T01:30:00")],
            [harmony_row(EntityStatus=1)],
            [harmony_row(), harmony_row(Title="conflict")],
        ):
            with self.assertRaises(ValueError):
                harmony.parse(harmony_payload(rows), harmony_payload(), harmony_payload(), now=NOW)
        for payloads in (
            [],
            ["{}"] * 3,
            [
                json.dumps(
                    {"ContentEntityDatas": [None] * 4, "LastModifiedTime": "2026-10-28T18:00:00Z"}
                )
            ]
            * 3,
        ):
            with self.assertRaises(ValueError):
                harmony.parse(*payloads, now=NOW)

    def test_senate_xml_contract_and_empty_sentinel(self):
        payload = (
            "<hearings><meeting><cmte_code>SSAF00</cmte_code>"
            "<date>29-Oct-2026 10:00 AM</date><matter>Hearing</matter>"
            "<room>SD-1</room></meeting></hearings>"
        )
        event = senate.parse(payload, now=NOW)[senate.CHANNEL_ID]["events"][0]
        self.assertEqual(event["start"], "2026-10-29T14:00:00Z")
        self.assertEqual(event["location"], "SD-1")
        cdata = payload.replace("<matter>Hearing</matter>", "<matter><![CDATA[Hearing]]></matter>")
        self.assertEqual(senate.parse(cdata, now=NOW), senate.parse(payload, now=NOW))
        self.assertNotIn("end", event)
        self.assertEqual(
            senate.parse("<hearings><meeting><cmte_code/></meeting></hearings>", now=NOW), {}
        )
        self.assertEqual(senate.parse(payload.replace("29-Oct-2026", "01-Jan-2020"), now=NOW), {})
        for body in (
            "<html/>",
            "<hearings/>",
            "<hearings>",
            "<!DOCTYPE a><hearings/>",
            "<hearings><meeting/></hearings>",
            payload.replace("<matter>Hearing</matter>", ""),
            payload.replace("SSAF00", ""),
            payload.replace("29-Oct-2026 10:00 AM", "01-Nov-2026 01:30 AM"),
        ):
            with self.assertRaises(ValueError):
                senate.parse(body, now=NOW)

    def test_new_york_ical_timezones_folding_and_start_only(self):
        payload = ics(
            "UID:123\nSUMMARY:Long\\, title\n continued\nDTSTART;TZID=America/New_York:20261029T110000\nDTEND;TZID=America/New_York:20261029T120000\nLOCATION:Capitol\nURL:https://www.nysenate.gov/events/session"
        )
        event = ny.parse(payload, now=NOW)[ny.CHANNEL_ID]["events"][0]
        self.assertEqual(event["start"], "2026-10-29T15:00:00Z")
        self.assertEqual(event["title"], "Long, titlecontinued")
        self.assertNotIn("end", event)
        utc = ics("UID:u\nSUMMARY:Session\nDTSTART:20261029T150000Z")
        self.assertEqual(
            ny.parse(utc, now=NOW)[ny.CHANNEL_ID]["events"][0]["start"], event["start"]
        )
        self.assertEqual(ny.parse("BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR", now=NOW), {})
        self.assertEqual(ny.parse(ics("STATUS:CANCELLED"), now=NOW), {})
        self.assertEqual(ny.parse(utc.replace("20261029", "20200101"), now=NOW), {})

    def test_new_york_unresolved_precision_and_changed_contracts(self):
        for properties in (
            "UID:u\nSUMMARY:S\nDTSTART;VALUE=DATE:20261029",
            "UID:u\nSUMMARY:S\nDTSTART:20261029T110000",
            "UID:u\nSUMMARY:S\nDTSTART;TZID=America/New_York:20261101T013000",
            "UID:u\nSUMMARY:S\nDTSTART:20261029T150000Z\nRRULE:FREQ=WEEKLY",
            "SUMMARY:S\nDTSTART:20261029T150000Z",
            "UID:u\nSUMMARY:S\nDTSTART:20261029T150000Z\nURL:https://evil.example/",
            "UID:u\nUID:v\nSUMMARY:S\nDTSTART:20261029T150000Z",
        ):
            with self.assertRaises(ValueError):
                ny.parse(ics(properties), now=NOW)
        for body in (
            "<html>Forbidden</html>",
            ics().replace("END:VEVENT", "END:OTHER"),
            ics().replace("VERSION:2.0", "VERSION:1.0"),
            ics().replace("UID:123", "invalid"),
        ):
            with self.assertRaises(ValueError):
                ny.parse(body, now=NOW)

    def test_new_sources_do_not_claim_linear_broadcast_mapping(self):
        for module in (brazil, california, harmony, senate, ny):
            self.assertIn(
                SOURCE_SCOPES[module.SOURCE["id"]], {"institutional_agenda", "event_directory"}
            )


if __name__ == "__main__":
    unittest.main()
