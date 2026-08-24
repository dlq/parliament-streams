# Channel Information Audit - 2026-08-24

## Scope

The audit covered all 86 canonical channel records, including schema and
semantic consistency, accessibility metadata, primary endpoint health,
schedule sources, and supporting official, rights, and identity links.

## Corrections

- Removed Hebrew caption metadata copied onto Chile Camara TV and attached the
  evidence to Israel Knesset Channel, whose official service exposes a separate
  accessibility HLS stream with Hebrew captions.
- Added validation that rejects caption languages inconsistent with a channel's
  declared languages or caption availability.
- Removed speculative House of Commons ParlVU and Senate SenVu API URLs that
  return 404. Their implemented HTML-based schedule collector remains active.
- Replaced the Netherlands Tweede Kamer singular live-page URL with the current
  plural live-debates page.
- Removed a dead TPchannel evidence URL while retaining the official Thai
  service root and app evidence.
- Changed Nunavut's historical raw HLS endpoint from validated native playback
  to research-only review: the recorded host no longer resolves, although the
  Assembly continues to advertise its official webcast service.

## Live Audit Summary

- Primary endpoints: 71 healthy, 7 warnings, and 8 errors before corrections.
- Schedule sources: 50 reachable, 11 access-blocked, 2 not found, and 3 errors.
- Supporting links: 207 reachable, 19 access-blocked, 2 not found, and 16
  environment or network errors.
- Schedule collection produced current normalized records for 29 channels from
  10 successful sources.

Most remaining warnings and failures concern already documented event-based,
link-only, access-blocked, or high-risk sources. Estonia Live 2 remains an
event-based validated source whose child playlist should be rechecked during a
scheduled sitting. No additional cross-channel metadata contamination was
found.

## Evidence Notes

The audit used official pages wherever available. Access-blocked responses were
not treated as proof that a source is dead, and event-based sources were not
downgraded solely because no programme was live during the audit.
