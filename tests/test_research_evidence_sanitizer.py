from __future__ import annotations

import contextlib
import copy
import io
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, quote, unquote, urlsplit

from tools.sanitize_research_evidence import (
    REDACTED,
    main,
    sanitize_url,
    sanitize_value,
    secret_matches,
)


def synthetic_keys() -> list[str]:
    """Build recognizable dummy values without committing secret-shaped fixtures."""
    return [
        "AIza" + "a" * 35,
        "gh" + "p_" + "b" * 36,
        "github_" + "pat_" + "c" * 82,
        "AK" + "IA" + "D" * 16,
        "AS" + "IA" + "E" * 16,
    ]


class ResearchEvidenceSanitizerTests(unittest.TestCase):
    def test_array_and_dotted_credential_parameters_are_redacted(self) -> None:
        for name in ["token[]", "token%5B%5D", "access_token[]", "auth.token", "refreshToken[]"]:
            with self.subTest(name=name):
                value = sanitize_value(
                    {
                        "page_links": [
                            {"url": f"https://example.org/video?{name}=dummy-private&lang=fr"}
                        ]
                    }
                )
                text = json.dumps(value)
                self.assertNotIn("dummy-private", text)
                self.assertIn(REDACTED, text)

    def test_google_maps_query_is_redacted_without_losing_context(self) -> None:
        url = "https://www.google.com/maps/embed/v1/place?key=" + synthetic_keys()[0]
        url += "&q=Legislature&language=en#map"
        cleaned = sanitize_url(url)
        parts = urlsplit(cleaned)
        self.assertEqual(parts.netloc, "www.google.com")
        self.assertEqual(parts.path, "/maps/embed/v1/place")
        self.assertEqual(
            parse_qs(parts.query), {"key": [REDACTED], "q": ["Legislature"], "language": ["en"]}
        )
        self.assertEqual(parts.fragment, "map")
        self.assertEqual(secret_matches(cleaned), [])

    def test_generic_credentials_are_sanitized_but_not_claimed_as_secrets(self) -> None:
        url = "https://example.org/live?API_KEY=dummy&access_token=dummy&x-amz-signature=dummy"
        url += "&PASSWORD=dummy&credential=dummy&auth=dummy&sessionToken=dummy&apiToken=dummy"
        url += "&lang=fr&monkey=ok"
        self.assertEqual(secret_matches(url), [])
        query = parse_qs(urlsplit(sanitize_url(url)).query)
        for name in [
            "API_KEY",
            "access_token",
            "x-amz-signature",
            "PASSWORD",
            "credential",
            "auth",
            "sessionToken",
            "apiToken",
        ]:
            self.assertEqual(query[name], [REDACTED])
        self.assertEqual(query["lang"], ["fr"])
        self.assertEqual(query["monkey"], ["ok"])

    def test_encoded_urls_and_names_in_errors_and_nested_redirects_are_sanitized(self) -> None:
        inner = "https://example.org/watch?%74oken=private-value&lang=es"
        encoded = quote(quote(inner, safe=""), safe="")
        error = "Request failed for " + encoded
        cleaned = str(sanitize_value(error))
        decoded = unquote(unquote(cleaned))
        self.assertNotIn("private-value", decoded)
        self.assertIn("lang=es", decoded)
        self.assertIn(quote(REDACTED, safe=""), decoded)
        outer = "https://example.net/proxy?next=" + quote(inner, safe="")
        query = parse_qs(urlsplit(sanitize_url(outer)).query)
        nested = parse_qs(urlsplit(query["next"][0]).query)
        self.assertEqual(nested["token"], [REDACTED])
        self.assertEqual(nested["lang"], ["es"])

    def test_all_supported_patterns_are_removed_from_nested_snippets_and_errors(self) -> None:
        keys = synthetic_keys()
        private_header = "-----BEGIN " + "RSA PRIVATE KEY-----"
        private_end = "-----END " + "RSA PRIVATE KEY-----"
        value = {
            "name": "Official legislature",
            "media_elements": [{"url": "https://example.org/?key=" + keys[0]}],
            "error": "network failed: " + ", ".join(keys + [keys[0]]),
            "snippet": private_header + "\nexample-body\n" + private_end,
            "nothing": None,
            "count": 3,
        }
        original = copy.deepcopy(value)
        cleaned = sanitize_value(value)
        self.assertEqual(value, original)
        text = json.dumps(cleaned)
        self.assertEqual(secret_matches(text), [])
        for secret in keys:
            self.assertNotIn(secret, text)
        self.assertNotIn("example-body", text)
        self.assertEqual(cleaned["name"], value["name"])
        self.assertEqual(cleaned["count"], 3)
        self.assertIsNone(cleaned["nothing"])
        self.assertEqual(sanitize_value((keys[0], 2)), (REDACTED, 2))

    def test_scanner_counts_types_without_exposing_values_or_generic_query_names(self) -> None:
        text = " ".join(synthetic_keys() + [synthetic_keys()[0]])
        kinds = secret_matches(text)
        self.assertEqual(kinds.count("google_api_key"), 2)
        self.assertEqual(kinds.count("github_token"), 2)
        self.assertEqual(kinds.count("aws_access_key_id"), 2)
        self.assertEqual(secret_matches("?key=ordinary-map-id&token=unknown-value"), [])
        self.assertEqual(secret_matches("-----BEGIN " + "PRIVATE KEY-----"), ["private_key"])

    def test_encoded_standalone_credentials_are_detected_and_redacted(self) -> None:
        for key in synthetic_keys():
            encoded = "".join(f"%{ord(char):02X}" for char in key)
            double_encoded = quote(encoded, safe="")
            for value in [encoded, double_encoded]:
                with self.subTest(kind=secret_matches(key)):
                    self.assertEqual(secret_matches(value), secret_matches(key))
                    cleaned = str(sanitize_value("Error: " + value))
                    self.assertNotIn(key, unquote(unquote(cleaned)))
                    self.assertEqual(secret_matches(cleaned), [])

    def test_sanitization_is_idempotent_and_preserves_nonsecret_url_values(self) -> None:
        value = {"url": "https://example.org/?q=House+of+Commons&lang=fr&key=private"}
        cleaned = sanitize_value(value)
        self.assertEqual(sanitize_value(cleaned), cleaned)
        self.assertEqual(parse_qs(urlsplit(cleaned["url"]).query)["q"], ["House of Commons"])

    def test_userinfo_empty_values_and_repeated_query_keys_are_sanitized(self) -> None:
        cleaned = sanitize_url("https://user:password@example.org/?key=x&key=y&blank=&page=2")
        self.assertNotIn("user", cleaned)
        self.assertNotIn("password", cleaned)
        self.assertEqual(
            parse_qs(urlsplit(cleaned).query, keep_blank_values=True),
            {"key": [REDACTED, REDACTED], "blank": [""], "page": ["2"]},
        )
        self.assertEqual(sanitize_url("not a URL " + synthetic_keys()[0]), "not a URL " + REDACTED)
        self.assertEqual(
            sanitize_url("https://[invalid/?key=" + synthetic_keys()[0]),
            "https://[invalid/?key=" + REDACTED,
        )

    def test_explicit_sanitize_and_recursive_check_cli_do_not_print_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            evidence = root / "evidence.json"
            evidence.write_text(json.dumps({"key": synthetic_keys()[0]}), encoding="utf-8")
            (root / "binary.dat").write_bytes(b"\x00" + synthetic_keys()[0].encode())
            (root / "invalid.dat").write_bytes(b"\xff")
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(main(["--check", str(root)]), 1)
                self.assertEqual(main(["--sanitize", str(evidence)]), 0)
                self.assertEqual(main(["--check", str(root)]), 0)
            self.assertIn("google_api_key=1", output.getvalue())
            self.assertNotIn(synthetic_keys()[0], output.getvalue())
            self.assertEqual(json.loads(evidence.read_text()), {"key": REDACTED})
            notes = root / "notes.md"
            notes.write_text("Error: " + synthetic_keys()[1], encoding="utf-8")
            with contextlib.redirect_stdout(output):
                self.assertEqual(main(["--sanitize", str(notes)]), 0)
            self.assertEqual(notes.read_text(), "Error: " + REDACTED)

    def test_check_tracked_uses_git_file_list_and_never_modifies_files(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "tracked.txt"
            path.write_text(synthetic_keys()[0], encoding="utf-8")
            original = path.read_bytes()
            output = io.StringIO()
            with (
                patch.object(
                    subprocess, "check_output", side_effect=[directory + "\n", b"tracked.txt\0"]
                ),
                contextlib.redirect_stdout(output),
            ):
                self.assertEqual(main(["--check-tracked"]), 1)
            self.assertEqual(path.read_bytes(), original)
            self.assertNotIn(synthetic_keys()[0], output.getvalue())

    def test_cli_errors_do_not_echo_bad_json_contents(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "bad.json"
            text = "not JSON " + synthetic_keys()[0]
            path.write_text(text, encoding="utf-8")
            errors = io.StringIO()
            with contextlib.redirect_stderr(errors), self.assertRaises(SystemExit):
                main(["--sanitize", str(path)])
            self.assertNotIn(synthetic_keys()[0], errors.getvalue())
            self.assertEqual(path.read_text(), text)


if __name__ == "__main__":
    unittest.main()
