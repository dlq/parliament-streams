"""Review schedule semantics and quarantine events unsuitable for linear XMLTV."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Literal, NotRequired, TypedDict

from .models import Catalogue
from .schedule_collection import ScheduleSnapshot
from .scrapers.common import NormalizedScheduleEvent

# A public institutional calendar is not evidence of a particular broadcast feed.
# New sources default to unreviewed until their feed mapping is established.
LINEAR_GUIDE_CHANNELS_BY_SCRAPER: dict[str, set[str]] = {
    # The official portal explicitly pairs scheduleChannelId=1 and liveStreamId=1.
    # Only its default feed is covered; the seven other live streams are excluded.
    "rhode-island-cablecast": {"us-ri-capitol-tv"},
    "germany-bundestag-tv1": {"germany-bundestag-1"},
    "ireland-oireachtas-tv-guide": {"ireland-oireachtas-tv"},
    "cpac": {"cpac-ca"},
    "ebs-grid": {"eu-audiovisual-ebs"},
    "italian-senate-palimpsest": {"italy-senate"},
    "dutch-debat-direct": {
        "netherlands-tweede-kamer",
        "netherlands-tweede-kamer-aletta-jacobszaal",
    },
    "brazil-tv-senado-grid": {"brazil-tv-senado-official"},
    "estonia-riigikogu-plenary": {"estonia-riigikogu-live-1"},
    "knesset-tv-guide": {"israel-knesset-channel"},
}
SOURCE_SCOPES = {
    "brazil-camara-events-api": "institutional_agenda",
    "california-assembly-calendar": "institutional_agenda",
    "harmony-json": "event_directory",
    "us-senate-hearings-xml": "institutional_agenda",
    "new-york-senate-calendar": "institutional_agenda",
    "italy-camera-webtv-events": "event_directory",
    "taiwan-parliamentary-tv-programmes": "event_directory",
    "norway-stortinget-calendar": "institutional_agenda",
    "sweden-riksdag-calendar": "institutional_agenda",
    "europarl-webstreaming": "event_directory",
    "quebec-webdiffusion": "event_directory",
    "un-webtv-schedule": "event_directory",
    "new-zealand-parliament": "institutional_agenda",
    "ontario-calendar": "institutional_agenda",
    "portugal-open-data-agenda": "institutional_agenda",
    "uk-parliament": "institutional_agenda",
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
    coverage: NotRequired[GuideCoverage]


CoverageState = Literal[
    "parser_planned",
    "not_collected",
    "empty",
    "collection_error",
    "mapping_unverified",
    "quality_hold",
    "guide_available",
]


class ChannelCoverage(TypedDict):
    parser_ids: list[str]
    reviewed_parser_ids: list[str]
    events: int
    exportable: int
    state: CoverageState


class GuideCoverage(TypedDict):
    counts: dict[str, int]
    channels: dict[str, ChannelCoverage]


def guide_coverage(
    catalogue: Catalogue, snapshot: ScheduleSnapshot, quality: dict[str, ChannelQuality]
) -> GuideCoverage:
    """Describe every catalogue entry, including sources absent from a parsed snapshot."""
    rows: dict[str, ChannelCoverage] = {}
    for channel in catalogue["channels"]:
        channel_id = channel["id"]
        parsers = sorted(
            {
                source["scraper"]
                for source in channel["epg_sources"]
                if source["scraper_status"] == "implemented"
            }
        )
        reviewed = [
            parser
            for parser in parsers
            if channel_id in LINEAR_GUIDE_CHANNELS_BY_SCRAPER.get(parser, set())
        ]
        row = quality.get(channel_id)
        statuses = {
            source["status"]
            for parser in parsers
            if (source := snapshot.get("sources", {}).get(parser)) is not None
        }
        events = row["events"] if row else 0
        exported = row["exportable"] if row else 0
        state: CoverageState
        if exported:
            state = "guide_available"
        elif events:
            state = "quality_hold" if row and row["linear_guide_eligible"] else "mapping_unverified"
        elif not parsers:
            state = "parser_planned"
        elif "error" in statuses:
            state = "collection_error"
        elif statuses:
            state = "empty"
        else:
            state = "not_collected"
        rows[channel_id] = {
            "parser_ids": parsers,
            "reviewed_parser_ids": reviewed,
            "events": events,
            "exportable": exported,
            "state": state,
        }
    return {
        "counts": {
            "catalogue_sources": len(rows),
            "channels_with_parser": sum(bool(row["parser_ids"]) for row in rows.values()),
            "channels_with_reviewed_mapping": sum(
                bool(row["reviewed_parser_ids"]) for row in rows.values()
            ),
            "channels_with_events": sum(row["events"] > 0 for row in rows.values()),
            "channels_with_programmes": sum(row["exportable"] > 0 for row in rows.values()),
        },
        "channels": rows,
    }


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
            if time_provenance(event, scraper_id)[0] == "collection_date":
                reasons[index].add("assumed_broadcast_date")
            if not event.get("start") or not event.get("end"):
                reasons[index].add("missing_time_range")
                continue
            try:
                start, end = parsed_time(event["start"]), parsed_time(event["end"])
            except ValueError:
                reasons[index].add("invalid_timestamp")
                continue
            # XMLTV writes whole seconds; a source interval must remain positive
            # at that precision. Keep original instants for overlap assessment.
            if end.replace(microsecond=0) <= start.replace(microsecond=0):
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
        "channels_with_events": sum(row["events"] > 0 for row in channels),
        **{f"excluded_{reason}": count for reason, count in sorted(total_reasons.items())},
    }
    report["coverage"] = guide_coverage(catalogue, snapshot, report["channels"])
    return ScheduleAssessment(report, exportable_events_by_channel)
