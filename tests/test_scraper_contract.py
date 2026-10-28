import importlib
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE_PATH = ROOT / "data" / "channels.json"


class ScraperContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        catalogue = json.loads(CATALOGUE_PATH.read_text(encoding="utf-8"))
        cls.catalogue = catalogue
        cls.scraper_ids = sorted(
            {
                source["scraper"]
                for channel in catalogue["channels"]
                for source in channel.get("epg_sources", [])
                if source["scraper_status"] == "implemented"
            }
        )

    def test_declared_scrapers_are_importable(self):
        registry = importlib.import_module("parliament_streams.scrapers")
        for scraper_id in self.scraper_ids:
            with self.subTest(scraper=scraper_id):
                module = registry.SCRAPERS[scraper_id]
                self.assertTrue(hasattr(module, "SOURCE"))
                self.assertEqual(module.SOURCE["id"], scraper_id)
                self.assertTrue(hasattr(module, "parse"))

    def test_implemented_associations_have_declared_targets(self):
        registry = importlib.import_module("parliament_streams.scrapers")
        for channel in self.catalogue["channels"]:
            for source in channel.get("epg_sources", []):
                if source["scraper_status"] == "implemented":
                    with self.subTest(channel=channel["id"], scraper=source["scraper"]):
                        self.assertIn(
                            channel["id"],
                            registry.SCRAPERS[source["scraper"]].SOURCE["channel_ids"],
                        )

    def test_scraper_registry_covers_declared_scrapers(self):
        registry = importlib.import_module("parliament_streams.scrapers")
        self.assertEqual(set(self.scraper_ids), set(registry.SCRAPERS))


if __name__ == "__main__":
    unittest.main()
