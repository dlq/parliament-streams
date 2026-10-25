from __future__ import annotations

import io
import socket
import unittest
from email.message import Message
from http.client import HTTPConnection, IncompleteRead, RemoteDisconnected
from typing import Any
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError, URLError

from tools.institution_inventory_fetch import HostGate, PublicRedirects, fetch_source


def source(url: str = "https://www.parliament.ca/", kind: str = "evidence") -> dict[str, Any]:
    return {"id": "source-canada", "url": url, "kind": kind, "safe": True}


def prior(url: str = "https://www.parliament.ca/") -> dict[str, Any]:
    return {
        "source_id": "source-canada",
        "url": url,
        "final_url": url,
        "fingerprint": "a" * 64,
        "observed_at": "2026-10-01T10:00:00+00:00",
        "etag": '"previous-version"',
    }


def response(
    url: str = "https://www.parliament.ca/",
    body: bytes = b"<main>Legislative Assembly</main>",
    status: int = 200,
    headers: dict[str, str] | None = None,
) -> MagicMock:
    result = MagicMock()
    result.__enter__.return_value = result
    result.status = status
    result.read.return_value = body
    result.geturl.return_value = url
    result.headers = {"Content-Type": "text/html; charset=utf-8", **(headers or {})}
    return result


def http_error(status: int, url: str, **headers: str) -> HTTPError:
    message = Message()
    for name, value in headers.items():
        message[name.replace("_", "-")] = value
    return HTTPError(url, status, "HTTP error", message, io.BytesIO(b"error body"))


class InstitutionInventoryFetchTests(unittest.TestCase):
    def setUp(self) -> None:
        self.dns = patch(
            "tools.institution_inventory_fetch.socket.getaddrinfo",
            return_value=[
                (socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", ("93.184.216.34", 443))
            ],
        ).start()
        self.build = patch("tools.institution_inventory_fetch.build_opener").start()
        self.ssl = patch("tools.institution_inventory_fetch.ssl.create_default_context").start()
        self.sleep = patch("tools.institution_inventory_fetch.time.sleep").start()
        self.clock = patch(
            "tools.institution_inventory_fetch.time.monotonic", return_value=100.0
        ).start()
        self.addCleanup(patch.stopall)
        self.opener = self.build.return_value
        self.opener.open.return_value = response()
        self.gate = HostGate()

    def fetch(
        self, entry: dict[str, Any] | None = None, previous: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        return fetch_source(entry or source(), previous, self.gate, timeout=5.0, max_bytes=1000)

    def test_bounded_success_uses_verified_tls_and_identifies_client(self) -> None:
        result = self.fetch()
        self.assertTrue(result["ok"])
        self.assertEqual(result["http_status"], 200)
        self.assertEqual(result["content_type"], "text/html; charset=utf-8")
        self.assertEqual(result["final_url"], "https://www.parliament.ca/")
        request = self.opener.open.call_args.args[0]
        self.assertTrue(
            request.get_header("User-agent").startswith("ParliamentStreamsInventoryReview")
        )
        self.assertIsNone(request.get_header("Authorization"))
        self.assertEqual(self.opener.open.call_args.kwargs["timeout"], 5.0)
        self.opener.open.return_value.read.assert_called_once_with(1001)
        self.assertIn("cafile", self.ssl.call_args.kwargs)
        self.dns.assert_called_with("www.parliament.ca", 443, type=socket.SOCK_STREAM)

    def test_international_path_uses_http_encoding_after_public_host_checks(self) -> None:
        original = "https://www.parlament.gov.rs/преноси/архива.2082.html"
        encoded = (
            "https://www.parlament.gov.rs/"
            "%D0%BF%D1%80%D0%B5%D0%BD%D0%BE%D1%81%D0%B8/"
            "%D0%B0%D1%80%D1%85%D0%B8%D0%B2%D0%B0.2082.html"
        )
        item = source(original)

        def open_request(request, *, timeout):
            self.dns.assert_called_with("www.parlament.gov.rs", 443, type=socket.SOCK_STREAM)
            self.assertEqual(request.full_url, encoded)
            self.assertEqual(timeout, 5.0)
            connection = HTTPConnection(request.host)
            try:
                connection.putrequest(request.get_method(), request.selector)
            finally:
                connection.close()
            return response(url=encoded)

        self.opener.open.side_effect = open_request
        result = self.fetch(item)
        self.assertTrue(result["ok"])
        self.assertEqual(result["source_id"], item["id"])
        self.assertEqual(item["url"], original)
        self.assertEqual(result["final_url"], encoded)

        previous = {**prior(original), "final_url": encoded}
        self.opener.open.side_effect = http_error(304, encoded)
        result = self.fetch(item, previous)
        self.assertTrue(result["ok"])
        self.assertTrue(result["not_modified"])
        self.assertEqual(result["source_id"], item["id"])
        request = self.opener.open.call_args.args[0]
        self.assertEqual(request.full_url, encoded)
        self.assertEqual(request.get_header("If-none-match"), '"previous-version"')

    def test_initial_url_safety_is_rechecked_even_if_plan_claims_safe(self) -> None:
        for url in ("file:///private/data", "http://localhost/", "https://u:p@parl.ca/"):
            with self.subTest(url=url):
                result = self.fetch(source(url))
                self.assertFalse(result["ok"])
        self.opener.open.assert_not_called()
        self.dns.assert_not_called()

    def test_dns_private_mixed_missing_and_failed_answers_are_gaps(self) -> None:
        public = (socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", ("8.8.8.8", 443))
        private = (socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", ("10.1.2.3", 443))
        private_v6 = (
            socket.AF_INET6,
            socket.SOCK_STREAM,
            socket.IPPROTO_TCP,
            "",
            ("::1", 443, 0, 0),
        )
        for answers in ([private], [public, private], [public, private_v6], []):
            with self.subTest(answers=answers):
                self.dns.return_value = answers
                self.assertFalse(self.fetch()["ok"])
        self.dns.side_effect = socket.gaierror("Directory DNS unavailable")
        self.assertFalse(self.fetch()["ok"])
        self.opener.open.assert_not_called()

    def test_public_redirect_handler_validates_dns_and_stops_automatic_following(self) -> None:
        handler = PublicRedirects()
        self.assertIsNone(
            handler.redirect_request(None, None, 302, "Found", {}, "https://www.parl.ca/")
        )
        self.dns.return_value = [
            (socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", ("192.168.1.1", 443))
        ]
        with self.assertRaises(ValueError):
            handler.redirect_request(None, None, 302, "Found", {}, "https://www.parl.ca/")

    def test_redirects_validate_each_target_and_return_observed_final_url(self) -> None:
        target = "https://assembly.gov.ca/current"
        self.opener.open.side_effect = [
            http_error(302, "https://www.parliament.ca/", Location=target),
            response(target),
        ]
        result = self.fetch()
        self.assertTrue(result["ok"])
        self.assertEqual(result["final_url"], target)
        self.assertEqual(self.opener.open.call_count, 2)
        self.assertEqual(self.dns.call_args_list[-1].args[:2], ("assembly.gov.ca", 443))
        self.assertIsNot(
            self.gate.host_lock("www.parliament.ca"), self.gate.host_lock("assembly.gov.ca")
        )

    def test_redirect_to_private_dns_is_never_requested(self) -> None:
        self.opener.open.side_effect = http_error(
            302, "https://www.parliament.ca/", Location="https://assembly.gov.ca/private"
        )
        self.dns.side_effect = [
            [(socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", ("8.8.8.8", 443))],
            [(socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", ("127.0.0.1", 443))],
        ]
        result = self.fetch()
        self.assertFalse(result["ok"])
        self.assertIn("non-public", result["error"])
        self.assertEqual(self.opener.open.call_count, 1)

    def test_redirect_loops_and_excessive_chains_are_gaps(self) -> None:
        url = "https://www.parliament.ca/"
        self.opener.open.side_effect = http_error(302, url, Location=url)
        self.assertFalse(self.fetch()["ok"])
        self.assertEqual(self.opener.open.call_count, 1)
        self.opener.open.reset_mock()
        self.opener.open.side_effect = [
            http_error(302, f"{url}{i}", Location=f"{url}{i + 1}") for i in range(12)
        ]
        result = self.fetch(source(f"{url}0"))
        self.assertFalse(result["ok"])
        self.assertIn("redirect limit", result["error"])
        self.assertEqual(self.opener.open.call_count, 11)

    def test_invalid_redirect_and_missing_location_are_gaps(self) -> None:
        for headers in ({}, {"Location": "http://127.0.0.1/private"}):
            self.opener.open.side_effect = http_error(302, "https://www.parliament.ca/", **headers)
            with self.subTest(headers=headers):
                self.assertFalse(self.fetch()["ok"])
        self.assertEqual(self.opener.open.call_count, 2)

    def test_access_blocks_pause_only_that_host_without_retries(self) -> None:
        for status in (401, 403, 429, 503):
            with self.subTest(status=status):
                self.gate = HostGate()
                self.opener.open.reset_mock()
                self.opener.open.side_effect = http_error(
                    status, "https://www.parliament.ca/", Retry_After="3600"
                )
                first = self.fetch()
                second = self.fetch()
                self.assertFalse(first["ok"])
                self.assertEqual(first["http_status"], status)
                self.assertTrue(second["skipped_host_block"])
                self.assertIn("Retry-After: 3600", second["error"])
                self.assertEqual(self.opener.open.call_count, 1)
                self.assertNotIn("another.gov.ca", self.gate.blocked)

    def test_redirect_block_pauses_destination_host(self) -> None:
        self.opener.open.side_effect = [
            http_error(301, "https://www.parliament.ca/", Location="https://assembly.gov.ca/"),
            http_error(403, "https://assembly.gov.ca/"),
        ]
        self.assertFalse(self.fetch()["ok"])
        self.assertIn("assembly.gov.ca", self.gate.blocked)
        self.assertNotIn("www.parliament.ca", self.gate.blocked)

    def test_nonblocking_errors_can_be_checked_again_but_do_not_retry(self) -> None:
        self.opener.open.side_effect = http_error(404, "https://www.parliament.ca/")
        result = self.fetch()
        self.assertFalse(result["ok"])
        self.assertEqual(self.opener.open.call_count, 1)
        self.assertEqual(self.gate.blocked, {})

    def test_per_host_spacing_and_lock_identity(self) -> None:
        self.assertIs(self.gate.host_lock("parl.ca"), self.gate.host_lock("parl.ca"))
        self.assertTrue(self.fetch()["ok"])
        self.assertTrue(self.fetch()["ok"])
        self.sleep.assert_called_once_with(0.3)

    def test_content_limits_empty_non200_and_truncated_bodies_are_gaps(self) -> None:
        cases = [
            response(body=b"x" * 1001),
            response(body=b" "),
            response(status=206),
            response(headers={"Content-Length": "2000"}),
            response(headers={"Content-Length": "5"}),
            response(headers={"Content-Length": "unknown"}),
            response(url="https://unexpected.gov.ca/"),
        ]
        for item in cases:
            with self.subTest(headers=item.headers, status=item.status):
                self.opener.open.return_value = item
                self.assertFalse(self.fetch()["ok"])

    def test_transport_and_incomplete_read_exceptions_become_gaps(self) -> None:
        for error in (
            IncompleteRead(b"partial", 300),
            RemoteDisconnected("Connection closed"),
            TimeoutError("Request timed out"),
            URLError("Name resolution failed"),
        ):
            with self.subTest(error=error):
                self.opener.open.side_effect = error
                self.assertFalse(self.fetch()["ok"])
        self.opener.open.side_effect = None
        broken = response()
        broken.read.side_effect = IncompleteRead(b"partial", 300)
        self.opener.open.return_value = broken
        self.assertFalse(self.fetch()["ok"])

    def test_304_requires_matched_valid_prior_and_a_conditional_request(self) -> None:
        self.opener.open.side_effect = http_error(304, "https://www.parliament.ca/")
        result = self.fetch(previous=prior())
        self.assertTrue(result["ok"])
        self.assertTrue(result["not_modified"])
        request = self.opener.open.call_args.args[0]
        self.assertEqual(request.get_header("If-none-match"), '"previous-version"')
        for previous in (
            None,
            {},
            {**prior(), "source_id": "different-source"},
            {**prior(), "url": "https://different.gov.ca/"},
            {**prior(), "fingerprint": "malformed"},
            {**prior(), "etag": None},
            {**prior(), "etag": "injected\r\nHeader: value"},
            {**prior(), "final_url": "https://different.gov.ca/"},
        ):
            with self.subTest(previous=previous):
                self.assertFalse(self.fetch(previous=previous)["ok"])
        self.assertFalse(self.fetch(source(kind="ipu"), prior())["ok"])

    def test_conditional_headers_are_only_sent_to_previous_final_resource(self) -> None:
        target = "https://assembly.gov.ca/"
        previous = {**prior(), "final_url": target}
        self.opener.open.side_effect = [
            http_error(302, "https://www.parliament.ca/", Location=target),
            http_error(304, target),
        ]
        self.assertTrue(self.fetch(previous=previous)["not_modified"])
        initial_request, final_request = [call.args[0] for call in self.opener.open.call_args_list]
        self.assertIsNone(initial_request.get_header("If-none-match"))
        self.assertEqual(final_request.get_header("If-none-match"), '"previous-version"')


if __name__ == "__main__":
    unittest.main()
