from __future__ import annotations

import copy
import hashlib
import unittest
from urllib.parse import parse_qs, urlsplit

from parliament_streams.inventory.sources import (
    derive_directory_sources,
    extract_directory_links,
    ipu_api_url,
    parse_ipu_page,
    parse_ipu_pages,
    safe_public_url,
    source_fingerprint,
)


def chamber_row(code: str, name: str = "House of Commons") -> dict[str, object]:
    # Mirrors the IPU's retained table_array/row_data export, including HTML URL cells.
    fields = {
        "country_code": code[:2],
        "country_name": "Canada",
        "chamber_code": code,
        "chamber_name": name,
        "parliament_name": "Parliament",
        "structure_of_parliament": "Bicameral",
        "is_suspended_chamber": "No",
        "is_suspended_chamber_notes": "",
        "is_suspended_parliament": "No",
        "parliamentary_website_url": (
            "<a href='https://www.ourcommons.ca/'>Website</a> "
            "<a href='https://www.ourcommons.ca/?utm_source=ipu#top'>English</a>"
        ),
    }
    return {
        "is_suspended": False,
        "row_data": [{"field_id": key, "cell_value": value} for key, value in fields.items()],
    }


def page_payload(
    rows: list[dict[str, object]], page: int = 1, per_page: int = 500, total: int | None = None
) -> dict[str, object]:
    return {
        "table_array": {"header": [], "body": rows},
        "page": str(page),
        "per_page": str(per_page),
        "total_results": len(rows) if total is None else total,
    }


class InstitutionInventorySourcesTests(unittest.TestCase):
    def test_country_sources_retain_all_explicit_url_forms_without_prose_guessing(self) -> None:
        inventory: dict[str, object] = {
            "country_reconciliations": [
                {
                    "country": "Canada",
                    "primary_evidence": [
                        {"url": "https://www.parl.ca/directory#top", "finding": "Reviewed"},
                        "https://www.parl.ca/directory?utm_source=mail",
                    ],
                    "retained_primary_sources": [
                        {"sources": ["https://www.canada.ca/constitution.pdf"]},
                        "https://127.0.0.1/secrets",
                    ],
                },
                {
                    "country": "Australia",
                    "primary_sources": ["https://www.parl.ca/directory"],
                    "finding": "https://should-not-be-read.gov/",
                },
            ]
        }
        sources = derive_directory_sources(inventory)
        self.assertEqual(len(sources), 3)
        self.assertEqual(len({source.id for source in sources}), 3)
        self.assertEqual(sources, derive_directory_sources(copy.deepcopy(inventory)))
        self.assertEqual({source.country for source in sources}, {"Canada", "Australia"})
        self.assertNotIn("should-not-be-read", str(sources))
        invalid_inputs: list[dict[str, object]] = [{}, {"country_reconciliations": [{}]}]
        for invalid in invalid_inputs:
            with self.subTest(invalid=invalid), self.assertRaises(ValueError):
                derive_directory_sources(invalid)

    def test_urls_require_public_http_and_strip_tracking_and_fragments(self) -> None:
        self.assertEqual(
            safe_public_url("HTTPS://WWW.PARL.CA/a?lang=en&utm_source=x&fbclid=y#main"),
            "https://www.parl.ca/a?lang=en",
        )
        for url in (
            "javascript:alert(1)",
            "file:///etc/passwd",
            "https://user:password@parl.ca/",
            "https://parl.ca:8443/",
            "http://localhost/",
            "http://foo.local/",
            "http://127.0.0.1/",
            "http://127.1/",
            "http://2130706433/",
            "https://[::1]/",
            "http://10.2.3.4/",
            "http://169.254.169.254/latest/meta-data/",
            "http://127.0.0.1.nip.io:1234/",
            "https://parl.ca\\@127.0.0.1/",
            "https://parl.ca/\nheader",
            "https://parl.ca:bad/",
        ):
            with self.subTest(url=url):
                self.assertIsNone(safe_public_url(url))
        self.assertEqual(safe_public_url("https://8.8.8.8/"), "https://8.8.8.8/")
        self.assertEqual(
            safe_public_url("https://www.parlament.hu:443/"), "https://www.parlament.hu/"
        )

    def test_ipu_request_selects_fields_and_current_date_not_a_dated_source_url(self) -> None:
        url = ipu_api_url("2026-11-01", page=2, per_page=250)
        parts = urlsplit(url)
        params = parse_qs(parts.query)
        self.assertEqual(parts.hostname, "data.ipu.org")
        self.assertEqual(params["date"], ["2026-11-01"])
        self.assertEqual(params["current_page"], ["2"])
        self.assertEqual(params["per_page"], ["250"])
        self.assertIn("is_suspended_parliament", params["fields"][0])
        for args in (("20261101", 1, 500), ("2026-11-01", 0, 500), ("2026-11-01", 1, 501)):
            with self.subTest(args=args), self.assertRaises(ValueError):
                ipu_api_url(*args)

    def test_ipu_exact_codes_names_urls_and_scope(self) -> None:
        payload = page_payload(
            [chamber_row("CA-LC01"), chamber_row("CA-UC01", "Senate"), chamber_row("US-LC01")]
        )
        parsed = parse_ipu_page(payload, {"CA"})
        self.assertTrue(parsed.complete)
        self.assertEqual(parsed.row_count, 3)
        self.assertEqual(parsed.all_external_ids, ("CA-LC01", "CA-UC01", "US-LC01"))
        lower, upper = parsed.chambers
        self.assertEqual(
            (lower.external_id, lower.country_code, lower.name),
            ("CA-LC01", "CA", "House of Commons"),
        )
        self.assertEqual(lower.website_urls, ("https://www.ourcommons.ca/",))
        self.assertEqual((lower.parliament_name, lower.structure), ("Parliament", "Bicameral"))
        self.assertEqual(upper.name, "Senate")
        self.assertFalse(lower.suspended)

    def test_ipu_suspension_is_retained_as_activity_evidence(self) -> None:
        row = chamber_row("CA-LC01")
        cells = row["row_data"]
        assert isinstance(cells, list)
        for cell in cells:
            if cell["field_id"] == "is_suspended_parliament":
                cell["cell_value"] = "Yes"
        parsed = parse_ipu_pages([page_payload([row])], {"CA"})
        self.assertTrue(parsed[0].suspended)
        self.assertEqual(parsed[0].external_id, "CA-LC01")

    def test_ipu_missing_provider_website_information_is_explicitly_unknown(self) -> None:
        row = chamber_row("TV-LC01")
        cells = row["row_data"]
        assert isinstance(cells, list)
        for cell in cells:
            if cell["field_id"] == "parliamentary_website_url":
                cell["cell_value"] = "No information available"
        chamber = parse_ipu_pages([page_payload([row])], {"TV"})[0]
        self.assertEqual(chamber.website_urls, ())
        self.assertFalse(chamber.website_urls_known)

    def test_ipu_valid_paginated_results_require_all_pages(self) -> None:
        first = page_payload([chamber_row("CA-LC01"), chamber_row("CA-UC01")], 1, 2, 3)
        second = page_payload([chamber_row("US-LC01")], 2, 2, 3)
        self.assertFalse(parse_ipu_page(first, {"CA"}).complete)
        self.assertEqual(len(parse_ipu_pages([second, first], {"CA", "US"})), 3)
        for pages in ([first], [second], [first, first], [first, second, second]):
            with self.subTest(pages=len(pages)), self.assertRaises(ValueError):
                parse_ipu_pages(pages, {"CA"})

    def test_ipu_rejects_empty_malformed_partial_and_duplicate_responses(self) -> None:
        invalid: list[object] = [
            None,
            [],
            {"error": "Access denied"},
            page_payload([]),
            page_payload([chamber_row("CA-LC01")], total=2),
            page_payload([chamber_row("CA-LC01"), chamber_row("CA-LC01")]),
            {**page_payload([chamber_row("CA-LC01")]), "page": True},
            {**page_payload([chamber_row("CA-LC01")]), "total_results": -1},
            {**page_payload([chamber_row("CA-LC01")]), "per_page": "01"},
            page_payload([chamber_row("XX-0000")]),
        ]
        for payload in invalid:
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                parse_ipu_page(payload, {"CA"})
        with self.assertRaises(ValueError):
            parse_ipu_pages([], {"CA"})
        first = page_payload([chamber_row("CA-LC01")], 1, 1, 2)
        duplicate = page_payload([chamber_row("CA-LC01")], 2, 1, 2)
        changed_total = page_payload([chamber_row("US-LC01")], 2, 1, 3)
        for second in (duplicate, changed_total):
            with self.subTest(second=second), self.assertRaises(ValueError):
                parse_ipu_pages([first, second], {"CA"})

    def test_ipu_does_not_silently_accept_missing_or_unsafe_fields(self) -> None:
        for field, value in (
            ("chamber_name", ""),
            ("country_code", "US"),
            ("is_suspended_chamber", "Unknown"),
            ("parliamentary_website_url", "<a href='http://localhost/x'>Parliament</a>"),
            ("parliamentary_website_url", "Unavailable"),
        ):
            row = chamber_row("CA-LC01")
            cells = row["row_data"]
            assert isinstance(cells, list)
            for cell in cells:
                if cell["field_id"] == field:
                    cell["cell_value"] = value
            with self.subTest(field=field, value=value), self.assertRaises(ValueError):
                parse_ipu_page(page_payload([row]), {"CA"})
        row = chamber_row("CA-LC01")
        cells = row["row_data"]
        assert isinstance(cells, list)
        cells.append(cells[0])
        with self.assertRaises(ValueError):
            parse_ipu_page(page_payload([row]), {"CA"})

    def test_directory_links_exclude_navigation_boilerplate_and_unsafe_routes(self) -> None:
        html = """<header><a href='/unrelated'>Parliament elsewhere</a></header>
        <nav><a href='/menu'>Assembly menu</a></nav><a href='/outside-main'>Outside main</a>
        <main><a href='/alberta#assembly'>Legislative Assembly of <b>Alberta</b></a>
        <a href='/alberta?utm_source=directory'>Duplicate label</a>
        <a href='https://www.parl.ca/'>Parliament of Canada</a>
        <a href='/privacy'>Privacy policy</a><a href='#top'>Back to top</a>
        <a href='javascript:alert(1)'>An assembly</a>
        <div class='cookie-banner'><a href='/consent'>Consent assembly</a></div>
        <div hidden><a href='/hidden'>Hidden legislature</a></div>
        <a href='https://facebook.com/assembly'>Assembly social page</a>
        <script>document.write('council')</script></main>
        <footer><a href='/footer'>Footer legislature</a></footer>"""
        self.assertEqual(
            extract_directory_links(html, "https://www.canada.ca/directory"),
            [
                {"name": "Legislative Assembly of Alberta", "url": "https://www.canada.ca/alberta"},
                {"name": "Parliament of Canada", "url": "https://www.parl.ca/"},
            ],
        )
        with self.assertRaises(ValueError):
            extract_directory_links(html, "file:///tmp/local.html")

    def test_directory_links_work_without_main_and_are_only_leads(self) -> None:
        html = "<div><a href='/council'>New regional council</a></div>"
        links = extract_directory_links(html, "https://www.gov.ca/")
        self.assertEqual(
            links, [{"name": "New regional council", "url": "https://www.gov.ca/council"}]
        )
        self.assertEqual(set(links[0]), {"name", "url"})

    def test_fingerprint_ignores_scripts_navigation_and_retain_substantive_changes(self) -> None:
        before = """<html><header>Today 2026-10-01</header><nav>Menu one</nav>
        <main><h1>Legislatures</h1><a href='/old'>Provincial Assembly</a>
        <div>Last updated: 2026-10-01</div></main><script>nonce=1</script></html>"""
        after = before.replace("2026-10-01", "2026-11-01").replace("nonce=1", "nonce=99")
        after = after.replace("Menu one", "Menu two")
        self.assertEqual(source_fingerprint(before), source_fingerprint(after.encode()))
        self.assertNotEqual(
            source_fingerprint(before), source_fingerprint(after.replace("/old", "/new"))
        )
        self.assertNotEqual(
            source_fingerprint(before),
            source_fingerprint(before.replace("Provincial", "Autonomous")),
        )
        self.assertEqual(
            source_fingerprint(b"%PDF-binary", "application/pdf"),
            hashlib.sha256(b"%PDF-binary").hexdigest(),
        )


if __name__ == "__main__":
    unittest.main()
