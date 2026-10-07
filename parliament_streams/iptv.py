"""Generate IPTV playlists and XMLTV from curated catalogue and schedule data."""

from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from xml.etree import ElementTree as ET

from .models import Catalogue, ChannelRecord
from .schedule_collection import ScheduleSnapshot


def _line(value: str) -> str:
    """Keep catalogue text from introducing playlist directives or attributes."""
    return " ".join(value.replace('"', "'").split())


def hls_channels(catalogue: Catalogue, *, include_event_based: bool = False) -> list[ChannelRecord]:
    """Select supported, validated, lower-risk HLS under the catalogue policy."""
    return sorted(
        (
            channel
            for channel in catalogue["channels"]
            if channel["source_type"] == "direct_hls"
            and channel["technical_status"] == "validated"
            and channel["playback_policy"] == "native_playback"
            and channel["stability_risk"] in {"low", "medium"}
            and channel["permission"]["status"] not in {"no_third_party_reuse", "embed_only"}
            and (include_event_based or channel["availability"] == "always_on")
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


def _timestamp(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("XMLTV requires timezone-aware schedule timestamps")
    return parsed.astimezone(UTC)


def render_xmltv(catalogue: Catalogue, snapshot: ScheduleSnapshot) -> tuple[bytes, int, int]:
    """Export complete event times; never invent durations for parliamentary agendas."""
    root = ET.Element("tv", {"generator-info-name": "Parliament Streams"})
    exported = skipped = 0
    channels = sorted(catalogue["channels"], key=lambda channel: channel["id"])
    for channel in channels:
        node = ET.SubElement(root, "channel", {"id": channel["id"]})
        ET.SubElement(node, "display-name").text = channel["name"]
        ET.SubElement(node, "url").text = channel["official_url"]
    for channel in channels:
        schedule = snapshot["channels"].get(channel["id"])
        if not schedule:
            continue
        seen: set[tuple[str, str, str]] = set()
        for event in schedule.get("events", []):
            try:
                start = _timestamp(event["start"])
                end = _timestamp(event["end"])
                title = event["title"].strip()
                if end <= start or not title or event["status"] == "cancelled":
                    raise ValueError("Incomplete or cancelled event")
            except (KeyError, ValueError):
                skipped += 1
                continue
            key = (start.isoformat(), end.isoformat(), title)
            if key in seen:
                continue
            seen.add(key)
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
            if schedule.get("stale"):
                ET.SubElement(node, "desc").text = "Retained schedule; source refresh failed."
            if event.get("url"):
                ET.SubElement(node, "url").text = event["url"]
            exported += 1
    ET.indent(root)
    return ET.tostring(root, encoding="utf-8", xml_declaration=True) + b"\n", exported, skipped


def write_iptv_exports(
    catalogue: Catalogue, snapshot: ScheduleSnapshot, output_dir: Path, epg_url: str
) -> dict[str, int]:
    """Write static outputs beside the deployed schedule snapshot."""
    stable = hls_channels(catalogue)
    validated = hls_channels(catalogue, include_event_based=True)
    xml, programmes, skipped = render_xmltv(catalogue, snapshot)
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "stable-hls.m3u8").write_text(render_playlist(stable, epg_url), encoding="utf-8")
    (output_dir / "validated-hls.m3u8").write_text(
        render_playlist(validated, epg_url), encoding="utf-8"
    )
    (output_dir / "epg.xml").write_bytes(xml)
    return {
        "stable_channels": len(stable),
        "validated_channels": len(validated),
        "programmes": programmes,
        "skipped_events": skipped,
    }
