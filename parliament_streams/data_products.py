"""Check the generated publication bundle, including cross-format identifiers."""

from __future__ import annotations

import re
from collections import Counter, defaultdict
from datetime import datetime
from itertools import pairwise
from pathlib import Path
from typing import cast
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

from .catalogue import load_catalogue, load_fallbacks, load_json_object
from .data_contracts import require_json_schema, schema_validator
from .iptv import select_iptv_hls_channels
from .models import Catalogue
from .schedule_collection import ScheduleSnapshot
from .schedule_quality import (
    LINEAR_GUIDE_CHANNELS_BY_SCRAPER,
    QualityReport,
    guide_coverage,
    parsed_time,
)
from .site_data import load_supranational
from .validation import require_valid_catalogue, require_valid_fallbacks

PLAYLIST_ENTRY = re.compile(
    r'#EXTINF:-1 tvg-id="(?P<id>[a-z0-9-]+)" tvg-name="[^"\r\n]+" '
    r'group-title="[^"\r\n]+",[^\r\n]+'
)
HTTP_URL_SCHEMA = {"type": "string", "format": "iri", "pattern": "^https?://"}


def _require_http_url(value: str) -> None:
    parsed = urlsplit(value)
    if (
        not parsed.hostname
        or parsed.port == 0
        or not schema_validator(HTTP_URL_SCHEMA).is_valid(value)
    ):
        raise ValueError("Data product contains an invalid HTTP(S) URL")


def _playlist_channels(path: Path, catalogue: Catalogue) -> tuple[set[str], str]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    header = re.fullmatch(r'#EXTM3U url-tvg="([^"\r\n]+)"', lines[0] if lines else "")
    if header is None or not text.endswith("\n") or len(lines) % 2 != 1:
        raise ValueError(f"Invalid extended-M3U channel list: {path.name}")
    guide_url = header[1]
    _require_http_url(guide_url)
    known = {channel["id"]: channel for channel in catalogue["channels"]}
    ids: set[str] = set()
    for metadata, url in zip(lines[1::2], lines[2::2], strict=True):
        entry = PLAYLIST_ENTRY.fullmatch(metadata)
        if entry is None or entry["id"] in ids or entry["id"] not in known:
            raise ValueError(f"Invalid or repeated playlist source: {path.name}")
        source_id = entry["id"]
        _require_http_url(url)
        if known[source_id]["playback_url"] != url:
            raise ValueError(f"Playlist URL differs from its catalogue source: {source_id}")
        ids.add(source_id)
    if path.read_bytes() != path.with_suffix(".m3u8").read_bytes():
        raise ValueError(f"Playlist compatibility alias differs: {path.name}")
    return ids, guide_url


def _xmltv_time(value: str) -> datetime:
    if not re.fullmatch(r"[0-9]{14} [+-][0-9]{4}", value):
        raise ValueError("XMLTV programme timestamps require a complete time and UTC offset")
    return datetime.strptime(value, "%Y%m%d%H%M%S %z")


def validate_data_products(directory: Path) -> dict[str, int]:
    """Validate schemas, playlist/XMLTV structure and shared publication contracts.

    The XMLTV check covers this generator's channel/programme subset and temporal
    semantics; it is not a general XMLTV DTD validator or a stream playback check.
    """
    catalogue = load_catalogue(directory / "channels.json")
    require_valid_catalogue(catalogue)
    require_valid_fallbacks(load_fallbacks(directory / "fallbacks.json"), catalogue)
    load_supranational(directory / "supranational.json")
    require_json_schema(
        load_json_object(directory / "institutions.json"),
        "institution-site-data.schema.json",
        label="public legislature inventory",
    )
    snapshot = cast(ScheduleSnapshot, load_json_object(directory / "schedules.json"))
    require_json_schema(snapshot, "schedules.schema.json", label="published schedules")
    quality = cast(QualityReport, load_json_object(directory / "epg-quality.json"))
    require_json_schema(quality, "epg-quality.schema.json", label="published EPG quality report")
    known_ids = {channel["id"] for channel in catalogue["channels"]}
    if set(snapshot["channels"]) - known_ids or set(quality["channels"]) != set(
        snapshot["channels"]
    ):
        raise ValueError("Schedule/quality sources do not match the published catalogue")
    if quality["generated_at"] != snapshot["generated_at"]:
        raise ValueError("Schedule and EPG quality snapshots have different timestamps")
    if "coverage" in quality and quality["coverage"] != guide_coverage(
        catalogue, snapshot, quality["channels"]
    ):
        raise ValueError("EPG coverage differs from catalogue parsers and collected programmes")
    if any(row["scraper"] not in snapshot["sources"] for row in snapshot["channels"].values()):
        raise ValueError("Schedule channel refers to an unrecorded source")
    expected_counts = {
        "channels": len(snapshot["channels"]),
        "events": sum(len(row["events"]) for row in snapshot["channels"].values()),
    }
    for status in ("ok", "empty", "error"):
        expected_counts[status] = sum(
            row["status"] == status for row in snapshot["sources"].values()
        )
    if any(snapshot["counts"][field] != count for field, count in expected_counts.items()):
        raise ValueError("Schedule counters disagree with their source/channel records")

    stable, guide_url = _playlist_channels(directory / "stable-hls.m3u", catalogue)
    broad, broad_guide_url = _playlist_channels(directory / "validated-hls.m3u", catalogue)
    if stable != {channel["id"] for channel in select_iptv_hls_channels(catalogue)}:
        raise ValueError("Stable playlist does not match its catalogue eligibility rules")
    if broad != {
        channel["id"] for channel in select_iptv_hls_channels(catalogue, include_non_always_on=True)
    }:
        raise ValueError("Broader playlist does not match its catalogue eligibility rules")
    if not stable <= broad or guide_url != broad_guide_url:
        raise ValueError("Published playlists disagree on source inclusion or guide URL")

    try:
        xml = (directory / "epg.xml").read_bytes().decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise ValueError("Generated XMLTV must use UTF-8") from error
    declaration = re.match(r"<\?xml\s+[^>]*encoding=['\"]([^'\"]+)", xml)
    if "\x00" in xml or (declaration and declaration[1].lower() != "utf-8"):
        raise ValueError("Generated XMLTV must use UTF-8")
    if "<!DOCTYPE" in xml or "<!ENTITY" in xml:
        raise ValueError("Generated XMLTV must not declare external content or entities")
    try:
        root = ET.fromstring(xml)
    except ET.ParseError as error:
        raise ValueError("Generated XMLTV is not well-formed XML") from error
    if root.tag != "tv" or any(child.tag not in {"channel", "programme"} for child in root):
        raise ValueError("Generated XMLTV must contain only channel and programme records")
    channels = root.findall("channel")
    xml_ids = [channel.get("id", "") for channel in channels]
    if (
        len(xml_ids) != len(set(xml_ids))
        or not set(xml_ids) <= known_ids
        or not broad <= set(xml_ids)
    ):
        raise ValueError("XMLTV channel IDs are repeated, unknown or missing from the playlists")
    if any(not channel.findtext("display-name", "").strip() for channel in channels):
        raise ValueError("XMLTV channel display names must be present")
    programme_counts: Counter[str] = Counter()
    intervals: dict[str, list[tuple[datetime, datetime]]] = defaultdict(list)
    source_events = {
        source_id: {
            (
                event["title"].strip(),
                parsed_time(event["start"]).replace(microsecond=0),
                parsed_time(event["end"]).replace(microsecond=0),
            )
            for event in schedule["events"]
            if event.get("start") and event.get("end") and event["status"] != "cancelled"
        }
        for source_id, schedule in snapshot["channels"].items()
    }
    for programme in root.findall("programme"):
        source_id = programme.get("channel", "")
        if source_id not in xml_ids or not programme.findtext("title", "").strip():
            raise ValueError("XMLTV programme has an unknown channel or empty title")
        start = _xmltv_time(programme.get("start", ""))
        stop = _xmltv_time(programme.get("stop", ""))
        if stop <= start:
            raise ValueError("XMLTV programme has a nonpositive duration")
        if (programme.findtext("title", "").strip(), start, stop) not in source_events.get(
            source_id, set()
        ):
            raise ValueError("XMLTV programme content does not match its collected schedule")
        intervals[source_id].append((start, stop))
        programme_counts[source_id] += 1
    for channel_intervals in intervals.values():
        ordered = sorted(channel_intervals)
        if any(left[1] > right[0] for left, right in pairwise(ordered)):
            raise ValueError("XMLTV contains overlapping programmes for one channel")
    for source_id in set(quality["channels"]) | programme_counts.keys():
        report = quality["channels"].get(source_id)
        if report is not None:
            scraper_id = snapshot["channels"][source_id]["scraper"]
            eligible = source_id in LINEAR_GUIDE_CHANNELS_BY_SCRAPER.get(scraper_id, set())
            if report["source"] != scraper_id or report["linear_guide_eligible"] != eligible:
                raise ValueError("EPG quality feed mapping differs from the reviewed allowlist")
        expected = report["exportable"] if report is not None else 0
        if programme_counts[source_id] != expected:
            raise ValueError("XMLTV programmes disagree with the EPG quality report")
        if report is not None and report["events"] != len(
            snapshot["channels"][source_id]["events"]
        ):
            raise ValueError("EPG quality events disagree with their schedule source")
        if report is not None and report["exportable"] > report["events"]:
            raise ValueError("EPG quality exports exceed the source event count")
        if (
            report is not None
            and programme_counts[source_id]
            and not report["linear_guide_eligible"]
        ):
            raise ValueError("XMLTV exports a source without a reviewed linear-guide mapping")
    if sum(programme_counts.values()) != quality["counts"]["exportable"]:
        raise ValueError("XMLTV programme total disagrees with the EPG quality report")
    for field, actual in (
        ("events", sum(row["events"] for row in quality["channels"].values())),
        (
            "excluded",
            sum(row["events"] - row["exportable"] for row in quality["channels"].values()),
        ),
        ("channels_with_events", sum(row["events"] > 0 for row in quality["channels"].values())),
    ):
        if quality["counts"][field] != actual:
            raise ValueError(f"EPG quality count is inconsistent: {field}")
    return {
        "catalogue_sources": len(known_ids),
        "scheduled_sources": len(snapshot["channels"]),
        "stable_channels": len(stable),
        "validated_channels": len(broad),
        "xmltv_channels": len(xml_ids),
        "programmes": sum(programme_counts.values()),
    }
