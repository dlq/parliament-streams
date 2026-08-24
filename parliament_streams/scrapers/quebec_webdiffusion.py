"""Parsers for Quebec National Assembly live and upcoming webdiffusion endpoints."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime

from .common import ParsedSchedule, ScraperSource, clean_html

SOURCE: ScraperSource = {
    "id": "quebec-webdiffusion",
    "channel_ids": [f"quebec-canal{i:02d}" for i in range(1, 15)],
    "urls": [
        "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
        "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
    ],
    "method": "POST",
    "headers": {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
    },
    "body": {"codeLangue": "fr"},
    "notes": "Official ASP.NET JSON endpoints used by the live webdiffusion page.",
}


def parse(
    live_json: str, upcoming_json: str = '{"d":[]}', now: datetime | None = None
) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    live_items = json.loads(live_json).get("d", [])
    json.loads(upcoming_json)  # Validate the companion endpoint response.
    schedules: ParsedSchedule = {}

    for item in live_items:
        if item.get("DiffusionDisponible") is False:
            continue
        match = re.search(r"canal(\d{2})", item.get("UrlSignal", ""))
        if not match:
            continue
        channel_id = f"quebec-canal{match.group(1)}"
        schedules[channel_id] = {
            "current_event_title": clean_html(item.get("Titre", "")),
            "current_event_time": "Live now",
            "next_event_title": None,
            "next_event_time": None,
            "confidence": "official_live_list",
        }

    return schedules
