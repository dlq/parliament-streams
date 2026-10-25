"""Monthly discovery shares bounded HTTP handling without making external requests."""

from __future__ import annotations

import io
import unittest
from http.client import HTTPConnection, RemoteDisconnected
from unittest.mock import patch
from urllib.error import HTTPError

from parliament_streams import healthcheck
from tools import validate_democracy_tier_static as static


class Response(io.BytesIO):
    status = 200
    headers = {"Content-Type": "text/html; charset=utf-8"}

    def __init__(self, body: bytes = b"proceedings", url: str = "https://example.test/final"):
        super().__init__(body)
        self.url = url

    def geturl(self) -> str:
        return self.url


class StaticDiscoveryFetchTests(unittest.TestCase):
    def test_serbian_catalogue_route_is_encoded_for_the_real_http_wire(self):
        original = "https://www.parlament.gov.rs/преноси/архива.2082.html"
        expected = (
            "https://www.parlament.gov.rs/"
            "%D0%BF%D1%80%D0%B5%D0%BD%D0%BE%D1%81%D0%B8/"
            "%D0%B0%D1%80%D1%85%D0%B8%D0%B2%D0%B0.2082.html"
        )

        def open_request(request, *, timeout):
            self.assertEqual(timeout, 8)
            self.assertEqual(request.full_url, expected)
            self.assertEqual(request.get_header("User-agent"), static.USER_AGENT)
            self.assertEqual(request.get_header("Accept"), "*/*")
            # putrequest exercises Python's ASCII request-line encoder, but does
            # not open a socket until endheaders/send (neither is called here).
            connection = HTTPConnection(request.host)
            try:
                connection.putrequest(request.get_method(), request.selector)
            finally:
                connection.close()
            return Response(url=expected)

        with (
            patch.object(healthcheck, "urlopen", side_effect=open_request),
            patch.object(static.time, "time", side_effect=[100.0, 100.12345]),
        ):
            result = static.fetch(original, timeout=8)

        self.assertEqual(
            result,
            {
                "http_status": 200,
                "content_type": "text/html; charset=utf-8",
                "final_url": expected,
                "body": b"proceedings",
                "elapsed_seconds": 0.123,
            },
        )

    def test_ascii_signed_urls_keep_existing_escapes_and_query_spelling(self):
        urls = [
            "https://example.test/live.m3u8?token=A%2BB+CD&x[]=1&next=%2fwatch%3fx%3d1",
            "https://example.test/a?",
        ]
        for url in urls:
            with self.subTest(url=url):

                def open_request(request, *, timeout, expected=url):
                    self.assertEqual(request.full_url, expected)
                    return Response(url=expected)

                with patch.object(healthcheck, "urlopen", side_effect=open_request):
                    result = static.fetch(url, timeout=8)
                self.assertEqual(result["final_url"], url)

    def test_response_and_http_error_limits_preserve_the_monthly_contract(self):
        with patch.object(healthcheck, "urlopen", return_value=Response(b"a" * 310_000)):
            result = static.fetch("https://example.test/", timeout=8)
        self.assertEqual(len(result["body"]), 300_000)
        self.assertNotIn("error", result)

        error = HTTPError(
            "https://example.test/blocked",
            403,
            "Forbidden",
            {"Content-Type": "text/plain"},
            io.BytesIO(b"b" * 90_000),
        )
        with patch.object(healthcheck, "urlopen", side_effect=error):
            result = static.fetch("https://example.test/", timeout=8)
        self.assertEqual(result["http_status"], 403)
        self.assertEqual(result["error"], "HTTP 403")
        self.assertEqual(result["content_type"], "text/plain")
        self.assertEqual(result["final_url"], "https://example.test/blocked")
        self.assertEqual(len(result["body"]), 80_000)

    def test_malformed_url_and_disconnect_do_not_drop_a_healthy_candidate(self):
        urls = ["https://[bad", "https://disconnected.test/", "https://healthy.test/"]

        def open_request(request, *, timeout):
            if request.host == "disconnected.test":
                raise RemoteDisconnected("Remote end closed connection without response")
            return Response(url=request.full_url)

        with patch.object(healthcheck, "urlopen", side_effect=open_request) as opener:
            report = static.check_country(
                {
                    "country": "Test country",
                    "results": [{"kind": "official_page", "url": url} for url in urls],
                },
                timeout=8,
            )

        self.assertEqual([x["status"] for x in report["results"]], ["error", "error", "page_ok"])
        self.assertIn("Invalid IPv6 URL", report["results"][0]["error"])
        self.assertIn("Remote end closed connection", report["results"][1]["error"])
        self.assertEqual(opener.call_count, 2)
        self.assertEqual([x["url"] for x in report["results"]], urls)

    def test_disconnects_while_reading_success_and_error_bodies_are_isolated(self):
        for http_error in (False, True):
            with self.subTest(http_error=http_error):
                if http_error:
                    response = HTTPError(
                        "https://example.test/", 503, "Unavailable", {}, io.BytesIO()
                    )
                    effect = patch.object(healthcheck, "urlopen", side_effect=response)
                else:
                    response = Response()
                    effect = patch.object(healthcheck, "urlopen", return_value=response)
                with (
                    effect,
                    patch.object(
                        response, "read", side_effect=ConnectionResetError("reset by peer")
                    ),
                ):
                    result = static.fetch("https://example.test/", timeout=8)
                self.assertIsNone(result["http_status"])
                self.assertIsNone(result["final_url"])
                self.assertEqual(result["error"], "reset by peer")
                self.assertNotIn("body", result)

    def test_programming_errors_during_response_processing_are_not_swallowed(self):
        with (
            patch.object(healthcheck, "urlopen", return_value=Response()),
            patch.object(healthcheck, "_response_headers", side_effect=ValueError("header bug")),
            self.assertRaisesRegex(ValueError, "header bug"),
        ):
            static.fetch("https://example.test/", timeout=8)


if __name__ == "__main__":
    unittest.main()
