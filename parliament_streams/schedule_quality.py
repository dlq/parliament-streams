"""Review schedule semantics and quarantine events unsuitable for linear XMLTV."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import TypedDict

from .models import Catalogue
from .schedule_collection import ScheduleSnapshot
from .scrapers.common import NormalizedScheduleEvent

# A public institutional calendar is not evidence of a particular broadcast feed.
# New sources default to unreviewed until their feed mapping is established.
LINEAR_GUIDE_CHANNELS_BY_SCRAPER: dict[str, set[str]] = {
    "cpac": {"cpac-ca"},
    "brazil-tv-camara": {"brazil-tv-camara"},
    "ebs-grid": {"eu-audiovisual-ebs"},
    "italian-senate-palimpsest": {"italy-senate"},
}
SOURCE_SCOPES = {
    "europarl-webstreaming": "event_directory",
    "canada-harmony": "event_directory",
    "quebec-webdiffusion": "event_directory",
    "un-webtv-schedule": "event_directory",
    "new-zealand-parliament": "institutional_agenda",
    "ontario-calendar": "institutional_agenda",
    "portugal-open-data-agenda": "institutional_agenda",
    "uk-parliament": "institutional_agenda",
    "youtube-live": "live_event_metadata",
}


class ChannelQuality(TypedDict):
    source: str
    scope: str
    linear_guide_eligible: bool
    events: int
    exportable: int
    overlap_pairs: int
    inferred_ends: int
    assumed_dates: int
    stale: bool
    exclusions: dict[str, int]
    excluded_events: list[dict[str, object]]


class QualityReport(TypedDict):
    schema_version: int
    generated_at: str
    counts: dict[str, int]
    channels: dict[str, ChannelQuality]


@dataclass
class ScheduleAssessment:
    report: QualityReport
    exportable_events_by_channel: dict[str, list[NormalizedScheduleEvent]]


def parsed_time(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("Schedule timestamps require an explicit timezone")
    return parsed.astimezone(UTC)


def time_provenance(event: NormalizedScheduleEvent, scraper_id: str) -> tuple[str, str]:
    """Recognize legacy cached records from the two known inferring parsers."""
    start = event.get(
        "start_basis", "collection_date" if scraper_id == "brazil-tv-camara" else "unknown"
    )
    end = event.get(
        "end_basis",
        "next_listing_start" if scraper_id in {"cpac", "brazil-tv-camara"} else "unknown",
    )
    return start, end


def assess_schedules(catalogue: Catalogue, snapshot: ScheduleSnapshot) -> ScheduleAssessment:
    """Use the same exclusion decisions in the audit and the guide exporter."""
    known = {channel["id"] for channel in catalogue["channels"]}
    report: QualityReport = {
        "schema_version": 1,
        "generated_at": snapshot.get("generated_at", ""),
        "counts": {},
        "channels": {},
    }
    exportable_events_by_channel: dict[str, list[NormalizedScheduleEvent]] = {}
    total_reasons: Counter[str] = Counter()
    for channel_id, schedule in sorted(snapshot["channels"].items()):
        scraper_id = schedule.get("scraper", "")
        eligible = channel_id in known and channel_id in LINEAR_GUIDE_CHANNELS_BY_SCRAPER.get(
            scraper_id, set()
        )
        events = schedule.get("events", [])
        reasons: list[set[str]] = [set() for _ in events]
        intervals: dict[int, tuple[datetime, datetime]] = {}
        identities = Counter(event["id"] for event in events)
        seen: set[tuple[str, str, str]] = set()
        for index, event in enumerate(events):
            if not eligible:
                reasons[index].add("unverified_channel_mapping")
            if identities[event["id"]] > 1:
                reasons[index].add("duplicate_id")
            if event["status"] == "cancelled":
                reasons[index].add("cancelled")
            if not event["title"].strip():
                reasons[index].add("empty_title")
            if not event.get("start") or not event.get("end"):
                reasons[index].add("missing_time_range")
                continue
            try:
                start, end = parsed_time(event["start"]), parsed_time(event["end"])
            except ValueError:
                reasons[index].add("invalid_timestamp")
                continue
            if end <= start:
                reasons[index].add("nonpositive_duration")
                continue
            key = (start.isoformat(), end.isoformat(), event["title"].strip())
            if key in seen:
                reasons[index].add("duplicate_programme")
                continue
            seen.add(key)
            if event["status"] != "cancelled":
                intervals[index] = (start, end)
        overlap_pairs = 0
        # Quarantine every conflicting event; choosing one by input order would
        # silently invent a broadcast decision. Parallel directories stay intact
        # in schedules.json but are already excluded by their source mapping.
        ordered = sorted(intervals, key=lambda index: intervals[index][0])
        for position, left in enumerate(ordered):
            for right in ordered[position + 1 :]:
                if intervals[right][0] >= intervals[left][1]:
                    break
                overlap_pairs += 1
                if eligible:
                    reasons[left].add("overlapping_programme")
                    reasons[right].add("overlapping_programme")
        exclusions = Counter(reason for excluded in reasons for reason in excluded)
        total_reasons.update(exclusions)
        exportable_events_by_channel[channel_id] = [
            event for event, excluded in zip(events, reasons, strict=True) if not excluded
        ]
        report["channels"][channel_id] = {
            "source": scraper_id,
            "scope": "broadcast_schedule"
            if scraper_id in LINEAR_GUIDE_CHANNELS_BY_SCRAPER
            else SOURCE_SCOPES.get(scraper_id, "unreviewed"),
            "linear_guide_eligible": eligible,
            "events": len(events),
            "exportable": len(exportable_events_by_channel[channel_id]),
            "overlap_pairs": overlap_pairs,
            "inferred_ends": sum(
                bool(event.get("end"))
                and time_provenance(event, scraper_id)[1] == "next_listing_start"
                for event in events
            ),
            "assumed_dates": sum(
                time_provenance(event, scraper_id)[0] == "collection_date" for event in events
            ),
            "stale": schedule.get("stale", False),
            "exclusions": dict(sorted(exclusions.items())),
            "excluded_events": [
                {"id": event["id"], "reasons": sorted(excluded)}
                for event, excluded in zip(events, reasons, strict=True)
                if excluded
            ],
        }
    channels = report["channels"].values()
    total = sum(row["events"] for row in channels)
    exported = sum(len(events) for events in exportable_events_by_channel.values())
    report["counts"] = {
        "events": total,
        "exportable": exported,
        "excluded": total - exported,
        "channels_with_events": len(report["channels"]),
        **{f"excluded_{reason}": count for reason, count in sorted(total_reasons.items())},
    }
    return ScheduleAssessment(report, exportable_events_by_channel)
