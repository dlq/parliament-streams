"""The published locale files are data contracts, including named placeholders."""

import json
import re
import unittest
from pathlib import Path

from parliament_streams.data_contracts import require_json_schema

ROOT = Path(__file__).resolve().parents[1]


class InterfaceLocaleTests(unittest.TestCase):
    def test_all_packs_have_valid_shapes_and_preserve_message_placeholders(self):
        directory = ROOT / "site/locales"
        english = json.loads((directory / "en.json").read_text())
        for path in directory.glob("*.json"):
            with self.subTest(locale=path.stem):
                pack = json.loads(path.read_text())
                require_json_schema(pack, "ui-locale.schema.json", label=path.name)
                self.assertEqual(pack["locale"], path.stem)
                for domain in [
                    "common",
                    "map",
                    "schedule",
                    "institutions",
                    "viewer",
                    "project",
                    "iptv",
                ]:
                    for key, text in english[domain].items():
                        if key == "labels":
                            self.assertLessEqual(set(text), set(pack[domain][key]))
                            continue
                        self.assertIn(key, pack[domain])
                        self.assertEqual(
                            sorted(re.findall(r"\{\w+\}", text)),
                            sorted(re.findall(r"\{\w+\}", pack[domain][key])),
                            f"{domain}.{key}",
                        )
