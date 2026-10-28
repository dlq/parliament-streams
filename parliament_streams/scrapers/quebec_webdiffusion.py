"""Parsers for Quebec National Assembly live and upcoming webdiffusion endpoints."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from urllib.parse import urljoin, urlsplit

from .common import ParsedSchedule, ScraperSource, clean_html, require_object, require_records

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
    live_items = require_records(
        require_object(json.loads(live_json), "Quebec live response").get("d"), "Quebec live items"
    )
    # Its displayed Date/Heure values do not identify one of the fourteen feeds.
    # Validate the companion response without copying unassigned activities.
    require_records(
        require_object(json.loads(upcoming_json), "Quebec upcoming response").get("d"),
        "Quebec upcoming items",
    )
    schedules: ParsedSchedule = {}

    for item in live_items:
        if item.get("DiffusionDisponible") is False:
            continue
        # A channel number in a query, title or unrelated activity ID is not
        # evidence of a feed. The separate linear TV channel is canal17.
        signal = item.get("UrlSignal")
        if not isinstance(signal, str):
            continue
        match = re.search(r"/canal(0[1-9]|1[0-4])(?:/|$)", urlsplit(signal).path, re.I)
        if not match:
            continue
        channel_id = f"quebec-canal{match.group(1)}"
        schedules[channel_id] = {
            "current_event_title": clean_html(item.get("Titre", "")),
            "current_event_time": clean_html(item.get("Heure", "")) or "Live now",
            "next_event_title": None,
            "next_event_time": None,
            "confidence": "official_live_list",
        }
        schedules[channel_id]["current_event_language"] = "fr"
        activity_id = item.get("IdActivite")
        if isinstance(activity_id, (str, int)) and not isinstance(activity_id, bool):
            identifier = str(activity_id).strip()
            if identifier:
                schedules[channel_id]["current_event_id"] = identifier
        page = item.get("UrlPage")
        if isinstance(page, str) and page.strip():
            page_url = urljoin("https://www.assnat.qc.ca/", page)
            parsed_url = urlsplit(page_url)
            if (
                parsed_url.scheme in {"http", "https"}
                and parsed_url.hostname in {"www.assnat.qc.ca", "assnat.qc.ca", "m.assnat.qc.ca"}
                and not parsed_url.username
                and not parsed_url.password
            ):
                schedules[channel_id]["current_event_url"] = page_url

    return schedules
