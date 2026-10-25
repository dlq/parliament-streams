"""Generate IPTV playlists and XMLTV from curated catalogue and schedule data."""

from __future__ import annotations

import json
from pathlib import Path
from xml.etree import ElementTree as ET

from .data_contracts import require_json_schema
from .models import Catalogue, ChannelRecord
from .schedule_collection import ScheduleSnapshot
from .schedule_quality import (
    LINEAR_GUIDE_CHANNELS_BY_SCRAPER,
    ScheduleAssessment,
    assess_schedules,
    parsed_time,
    time_provenance,
)


def _line(value: str) -> str:
    """Keep catalogue text from introducing playlist directives or attributes."""
    return " ".join(value.replace('"', "'").split())


def select_iptv_hls_channels(
    catalogue: Catalogue, *, include_non_always_on: bool = False
) -> list[ChannelRecord]:
    """Select supported, validated, lower-risk HLS for the exported playlists.

    The broader list includes both sitting-only and event-based sources.
    """
    return sorted(
        (
            channel
            for channel in catalogue["channels"]
            if channel["source_type"] == "direct_hls"
            and channel["technical_status"] == "validated"
            and channel["playback_policy"] == "native_playback"
            and channel["stability_risk"] in {"low", "medium"}
            and channel["permission"]["status"] not in {"no_third_party_reuse", "embed_only"}
            and (include_non_always_on or channel["availability"] == "always_on")
        ),
        key=lambda channel: channel["id"],
    )


def render_playlist(channels: list[ChannelRecord], epg_url: str) -> str:
    """Render extended M3U; IDs match XMLTV channel identifiers."""
    lines = [f'#EXTM3U url-tvg="{_line(epg_url)}"']
    for channel in channels:
        url = channel["playback_url"]
        if not url or any(character.isspace() for character in url):
            raise ValueError(f"Invalid IPTV playback URL for {channel['id']}")
        name = _line(channel["name"])
        group = _line(channel["country_or_region"])
        lines.extend(
            [
                f'#EXTINF:-1 tvg-id="{_line(channel["id"])}" '
                f'tvg-name="{name}" group-title="{group}",{name}',
                url,
            ]
        )
    return "\n".join(lines) + "\n"


def render_xmltv(
    catalogue: Catalogue, snapshot: ScheduleSnapshot, assessment: ScheduleAssessment | None = None
) -> tuple[bytes, int, int]:
    """Export reviewed feed schedules with positive, non-conflicting time ranges."""
    assessment = assessment or assess_schedules(catalogue, snapshot)
    root = ET.Element("tv", {"generator-info-name": "Parliament Streams"})
    exported = 0
    skipped = assessment.report["counts"]["excluded"]
    ids = {
        channel["id"] for channel in select_iptv_hls_channels(catalogue, include_non_always_on=True)
    }
    ids.update(
        channel_id for mapped in LINEAR_GUIDE_CHANNELS_BY_SCRAPER.values() for channel_id in mapped
    )
    channels = sorted(
        (channel for channel in catalogue["channels"] if channel["id"] in ids),
        key=lambda channel: channel["id"],
    )
    for channel in channels:
        node = ET.SubElement(root, "channel", {"id": channel["id"]})
        ET.SubElement(node, "display-name").text = channel["name"]
        ET.SubElement(node, "url").text = channel["official_url"]
    for channel in channels:
        schedule = snapshot["channels"].get(channel["id"])
        if not schedule:
            continue
        for event in assessment.exportable_events_by_channel.get(channel["id"], []):
            start, end = parsed_time(event["start"]), parsed_time(event["end"])
            title = event["title"].strip()
            node = ET.SubElement(
                root,
                "programme",
                {
                    "channel": channel["id"],
                    "start": start.strftime("%Y%m%d%H%M%S +0000"),
                    "stop": end.strftime("%Y%m%d%H%M%S +0000"),
                },
            )
            ET.SubElement(node, "title").text = title
            notes = []
            start_basis, end_basis = time_provenance(event, schedule["scraper"])
            if schedule.get("stale"):
                notes.append("Retained schedule; source refresh failed.")
            if start_basis == "collection_date":
                notes.append("Programme date assumed from collection date.")
            if end_basis == "next_listing_start":
                notes.append("End time inferred from the next programme listing.")
            if notes:
                ET.SubElement(node, "desc").text = " ".join(notes)
            if event.get("url"):
                ET.SubElement(node, "url").text = event["url"]
            exported += 1
    ET.indent(root)
    return ET.tostring(root, encoding="utf-8", xml_declaration=True) + b"\n", exported, skipped


def write_iptv_exports(
    catalogue: Catalogue, snapshot: ScheduleSnapshot, output_dir: Path, epg_url: str
) -> dict[str, int]:
    """Write static outputs beside the deployed schedule snapshot."""
    stable = select_iptv_hls_channels(catalogue)
    validated = select_iptv_hls_channels(catalogue, include_non_always_on=True)
    assessment = assess_schedules(catalogue, snapshot)
    require_json_schema(assessment.report, "epg-quality.schema.json", label="EPG quality report")
    xml, programmes, skipped = render_xmltv(catalogue, snapshot, assessment)
    output_dir.mkdir(parents=True, exist_ok=True)
    # A channel list is extended M3U, not an HLS media/master manifest. GitHub
    # Pages serves .m3u8 as application/vnd.apple.mpegurl, which VLC does not
    # import as a channel list over HTTP. Prefer .m3u; retain the old filenames
    # for clients that already handle them or force a playlist importer.
    for name, channels in (("stable-hls", stable), ("validated-hls", validated)):
        playlist = render_playlist(channels, epg_url)
        for extension in ("m3u", "m3u8"):
            (output_dir / f"{name}.{extension}").write_text(playlist, encoding="utf-8")
    (output_dir / "epg.xml").write_bytes(xml)
    (output_dir / "epg-quality.json").write_text(
        json.dumps(assessment.report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return {
        "stable_channels": len(stable),
        "validated_channels": len(validated),
        "programmes": programmes,
        "skipped_events": skipped,
    }
