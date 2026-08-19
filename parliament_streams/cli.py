"""Command-line catalogue management."""

from __future__ import annotations

import argparse
import json
import sys
from collections.abc import Callable, Sequence
from datetime import date
from pathlib import Path
from typing import cast

from .catalogue import (
    DEFAULT_CATALOGUE_PATH,
    DEFAULT_FALLBACKS_PATH,
    load_catalogue,
    load_channel,
    load_fallbacks,
    load_json_object,
)
from .epg_audit import audit_epg_sources
from .healthcheck import DEFAULT_RETRIES, DEFAULT_TIMEOUT_SECONDS, run_healthcheck
from .link_audit import audit_catalogue_links
from .management import (
    CatalogueStore,
    audit_identities,
    compare_health_reports,
    export_csv,
    generate_validation_seed,
    load_candidate,
    promote_candidate,
    refresh_validation_history,
    scaffold_candidate,
    validate_candidate_directory,
    validation_history_is_current,
    write_json,
)
from .models import ChannelRecord
from .playback_policy_audit import audit_playback_policies
from .schedule_collection import (
    DEFAULT_RETRIES as DEFAULT_SCHEDULE_RETRIES,
)
from .schedule_collection import (
    DEFAULT_TIMEOUT_SECONDS as DEFAULT_SCHEDULE_TIMEOUT_SECONDS,
)
from .schedule_collection import (
    collect_schedules,
    write_snapshot,
)
from .site_data import DEFAULT_SITE_DATA_PATH
from .validation import (
    CatalogueValidationError,
    require_valid_candidate,
    validate_candidate,
    validate_catalogue,
    validate_fallbacks,
)


def _write_json_stdout(value: object) -> None:
    json.dump(value, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")


def _store(args: argparse.Namespace) -> CatalogueStore:
    catalogue_path = args.catalogue
    if args.site_data:
        site_data_path = args.site_data
    elif catalogue_path.resolve() == DEFAULT_CATALOGUE_PATH.resolve():
        site_data_path = DEFAULT_SITE_DATA_PATH
    else:
        site_data_path = None
    return CatalogueStore(catalogue_path=catalogue_path, site_data_path=site_data_path)


def _cmd_validate(args: argparse.Namespace) -> int:
    catalogue = load_catalogue(args.catalogue)
    issues = validate_catalogue(catalogue)
    if issues:
        for issue in issues:
            print(issue.render(), file=sys.stderr)
        return 1
    print(f"Catalogue valid: {len(catalogue['channels'])} channels")
    return 0


def _cmd_fallbacks_validate(args: argparse.Namespace) -> int:
    issues = validate_fallbacks(load_fallbacks(args.fallbacks), load_catalogue(args.catalogue))
    if issues:
        for issue in issues:
            print(issue.render(), file=sys.stderr)
        return 1
    print(f"Fallbacks valid: {args.fallbacks}")
    return 0


def _filtered_channels(args: argparse.Namespace) -> list[ChannelRecord]:
    channels = list(load_catalogue(args.catalogue)["channels"])
    if args.level:
        channels = [channel for channel in channels if channel["jurisdiction_level"] == args.level]
    if args.source_type:
        channels = [channel for channel in channels if channel["source_type"] == args.source_type]
    if args.permission:
        channels = [
            channel for channel in channels if channel["permission"]["status"] == args.permission
        ]
    return channels


def _cmd_list(args: argparse.Namespace) -> int:
    channels = _filtered_channels(args)
    if args.json:
        _write_json_stdout(channels)
    else:
        for channel in channels:
            print(
                "\t".join(
                    (
                        channel["id"],
                        channel["country_or_region"],
                        channel["source_type"],
                        channel["playback_policy"],
                        channel["technical_status"],
                        channel["permission"]["status"],
                    )
                )
            )
    return 0


def _cmd_show(args: argparse.Namespace) -> int:
    for channel in load_catalogue(args.catalogue)["channels"]:
        if channel["id"] == args.channel_id:
            _write_json_stdout(channel)
            return 0
    raise KeyError(f"Unknown catalogue id: {args.channel_id}")


def _cmd_candidate_new(args: argparse.Namespace) -> int:
    candidate = scaffold_candidate(
        channel_id=args.channel_id,
        name=args.name,
        jurisdiction_level=args.level,
        country_or_region=args.country_or_region,
        legislature=args.legislature,
        language=args.language,
        official_url=args.official_url,
        source_type=args.source_type,
        playback_url=args.playback_url,
        youtube_playlist_id=args.youtube_playlist_id,
        wikidata_qid=args.wikidata_qid,
    )
    require_valid_candidate(candidate)
    if args.output.exists() and not args.force:
        raise ValueError(f"Candidate file already exists: {args.output}")
    write_json(args.output, candidate)
    print(args.output)
    return 0


def _cmd_candidate_validate(args: argparse.Namespace) -> int:
    issues = validate_candidate(load_candidate(args.candidate))
    if issues:
        for issue in issues:
            print(issue.render(), file=sys.stderr)
        return 1
    print(f"Candidate valid: {args.candidate}")
    return 0


def _cmd_candidates_validate(args: argparse.Namespace) -> int:
    results = validate_candidate_directory(args.directory)
    failures = 0
    for path, issues in results.items():
        for issue in issues:
            failures += 1
            print(f"{path}: {issue.render()}", file=sys.stderr)
    if failures:
        print(f"Candidate validation failed: {failures} issue(s)", file=sys.stderr)
        return 1
    print(f"Candidates valid: {len(results)} file(s)")
    return 0


def _cmd_candidate_status(args: argparse.Namespace) -> int:
    candidate = load_candidate(args.candidate)
    candidate["status"] = args.status
    candidate["updated_on"] = date.today().isoformat()
    if args.note:
        candidate["decision_notes"].append(args.note)
    require_valid_candidate(candidate)
    write_json(args.candidate, candidate)
    print(f"Candidate status: {args.status}")
    return 0


def _cmd_candidate_promote(args: argparse.Namespace) -> int:
    candidate = load_candidate(args.candidate)
    catalogue = promote_candidate(candidate, _store(args))
    candidate["status"] = "promoted"
    candidate["updated_on"] = date.today().isoformat()
    candidate["decision_notes"].append(
        f"Promoted to the canonical catalogue on {candidate['updated_on']}."
    )
    require_valid_candidate(candidate)
    write_json(args.candidate, candidate)
    print(f"Promoted candidate; catalogue now has {len(catalogue['channels'])} channels")
    return 0


def _cmd_add(args: argparse.Namespace) -> int:
    catalogue = _store(args).add(
        load_channel(args.record), replace=args.replace, persist=not args.dry_run
    )
    action = "Would write" if args.dry_run else "Wrote"
    print(f"{action} {len(catalogue['channels'])} channels")
    return 0


def _cmd_update(args: argparse.Namespace) -> int:
    catalogue = _store(args).update(
        args.channel_id, load_channel(args.record), persist=not args.dry_run
    )
    action = "Would update" if args.dry_run else "Updated"
    print(f"{action} {args.channel_id}; catalogue has {len(catalogue['channels'])} channels")
    return 0


def _cmd_remove(args: argparse.Namespace) -> int:
    if not args.yes and not args.dry_run:
        raise ValueError("Removal requires --yes; use --dry-run to preview")
    catalogue = _store(args).remove(args.channel_id, persist=not args.dry_run)
    action = "Would remove" if args.dry_run else "Removed"
    print(f"{action} {args.channel_id}; catalogue has {len(catalogue['channels'])} channels")
    return 0


def _cmd_seed(args: argparse.Namespace) -> int:
    seed = generate_validation_seed(
        load_catalogue(args.catalogue),
        channel_ids=set(args.channel_ids) if args.channel_ids else None,
        jurisdiction_level=args.level,
    )
    write_json(args.output, seed)
    print(f"Wrote {len(seed['countries'])} validation groups to {args.output}")
    return 0


def _cmd_identity_audit(args: argparse.Namespace) -> int:
    report = audit_identities(load_catalogue(args.catalogue))
    if args.output:
        write_json(args.output, report)
    else:
        _write_json_stdout(report)
    return 1 if report["counts"]["error"] else 0


def _cmd_health_diff(args: argparse.Namespace) -> int:
    report = compare_health_reports(load_json_object(args.before), load_json_object(args.after))
    if args.output:
        write_json(args.output, report)
    else:
        _write_json_stdout(report)
    return 1 if args.fail_on_regression and report["regressions"] else 0


def _cmd_health_check(args: argparse.Namespace) -> int:
    report = run_healthcheck(
        args.catalogue,
        timeout=args.timeout,
        retries=args.retries,
        channel_ids=set(args.channel_ids) if args.channel_ids else None,
        workers=args.workers,
    )
    if args.output:
        write_json(args.output, report)
    else:
        _write_json_stdout(report)
    return 1 if args.fail_on_error and report["counts"].get("error", 0) else 0


def _cmd_export(args: argparse.Namespace) -> int:
    catalogue = load_catalogue(args.catalogue)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open("w", encoding="utf-8", newline="") as handle:
            export_csv(catalogue, handle)
    else:
        export_csv(catalogue, sys.stdout)
    return 0


def _cmd_schedules_collect(args: argparse.Namespace) -> int:
    snapshot = collect_schedules(timeout=args.timeout, retries=args.retries)
    successful = snapshot["counts"].get("ok", 0)
    if successful < args.minimum_successful_sources:
        raise ValueError(
            f"Only {successful} schedule sources succeeded; "
            f"minimum is {args.minimum_successful_sources}"
        )
    write_snapshot(args.output, snapshot)
    print(
        f"Wrote {len(snapshot['channels'])} channel schedules from {successful} sources "
        f"to {args.output}"
    )
    return 0


def _cmd_epg_audit(args: argparse.Namespace) -> int:
    report = audit_epg_sources(
        load_catalogue(args.catalogue),
        timeout=args.timeout,
        retries=args.retries,
        workers=args.workers,
    )
    if args.output:
        write_json(args.output, report)
    else:
        _write_json_stdout(report)
    return 1 if args.fail_on_error and report["counts"]["error"] else 0


def _cmd_links_audit(args: argparse.Namespace) -> int:
    report = audit_catalogue_links(
        load_catalogue(args.catalogue),
        timeout=args.timeout,
        retries=args.retries,
        workers=args.workers,
    )
    if args.output:
        write_json(args.output, report)
    else:
        _write_json_stdout(report)
    failures = report["counts"]["error"] + report["counts"]["not_found"]
    return 1 if args.fail_on_error and failures else 0


def _cmd_playback_policy_audit(args: argparse.Namespace) -> int:
    report = audit_playback_policies(load_catalogue(args.catalogue))
    if args.output:
        write_json(args.output, report)
    else:
        _write_json_stdout(report)
    if args.fail_on_error and report["counts"]["error"]:
        return 1
    return 1 if args.fail_on_review and report["counts"]["review"] else 0


def _cmd_validation_history_refresh(args: argparse.Namespace) -> int:
    reports_root = args.reports_dir.parents[1] if len(args.reports_dir.parents) > 1 else Path(".")
    catalogue = load_catalogue(args.catalogue)
    if args.check:
        if validation_history_is_current(
            catalogue,
            args.reports_dir,
            root=reports_root,
            limit=args.limit,
        ):
            print("Validation history is current")
            return 0
        print("Validation history is stale; run validation-history-refresh", file=sys.stderr)
        return 1
    catalogue = refresh_validation_history(
        catalogue,
        args.reports_dir,
        root=reports_root,
        limit=args.limit,
    )
    populated = sum(1 for channel in catalogue["channels"] if channel.get("validation_history"))
    if not args.dry_run:
        _store(args).commit(catalogue)
    action = "Would refresh" if args.dry_run else "Refreshed"
    print(f"{action} validation history for {populated} of {len(catalogue['channels'])} channels")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="parliament-streams",
        description="Validate, research, and safely manage the parliamentary stream catalogue.",
    )
    parser.add_argument(
        "--catalogue", type=Path, default=DEFAULT_CATALOGUE_PATH, help="Catalogue JSON path."
    )
    parser.add_argument(
        "--site-data",
        type=Path,
        help=(
            "Generated site snapshot path; defaults to the repository snapshot for the "
            "canonical catalogue."
        ),
    )
    commands = parser.add_subparsers(dest="command", required=True)

    validate_parser = commands.add_parser(
        "validate", help="Validate schema and cross-record rules."
    )
    validate_parser.set_defaults(handler=_cmd_validate)

    fallbacks_validate = commands.add_parser(
        "fallbacks-validate", help="Validate the event and provider fallback catalogue."
    )
    fallbacks_validate.add_argument(
        "--fallbacks", type=Path, default=DEFAULT_FALLBACKS_PATH, help="Fallback JSON path."
    )
    fallbacks_validate.set_defaults(handler=_cmd_fallbacks_validate)

    list_parser = commands.add_parser("list", help="List catalogue entries.")
    list_parser.add_argument("--level", choices=["national", "subnational", "supranational"])
    list_parser.add_argument(
        "--source-type", choices=["direct_hls", "direct_dash", "official_page", "youtube"]
    )
    list_parser.add_argument("--permission")
    list_parser.add_argument("--json", action="store_true")
    list_parser.set_defaults(handler=_cmd_list)

    show_parser = commands.add_parser("show", help="Print one channel record as JSON.")
    show_parser.add_argument("channel_id")
    show_parser.set_defaults(handler=_cmd_show)

    candidate_new = commands.add_parser(
        "candidate-new", help="Create a tracked research candidate."
    )
    candidate_new.add_argument("channel_id")
    candidate_new.add_argument("--name", required=True)
    candidate_new.add_argument(
        "--level", choices=["national", "subnational", "supranational"], required=True
    )
    candidate_new.add_argument("--country-or-region", required=True)
    candidate_new.add_argument("--legislature", required=True)
    candidate_new.add_argument("--language", required=True)
    candidate_new.add_argument("--official-url", required=True)
    candidate_new.add_argument(
        "--source-type",
        choices=["direct_hls", "direct_dash", "official_page", "youtube"],
        default="official_page",
    )
    candidate_new.add_argument("--playback-url")
    candidate_new.add_argument(
        "--youtube-playlist-id",
        help="Official uploads playlist id beginning with UU; required for YouTube candidates.",
    )
    candidate_new.add_argument("--wikidata-qid")
    candidate_new.add_argument("--output", type=Path, required=True)
    candidate_new.add_argument("--force", action="store_true")
    candidate_new.set_defaults(handler=_cmd_candidate_new)

    candidate_validate = commands.add_parser(
        "candidate-validate", help="Validate a candidate file."
    )
    candidate_validate.add_argument("candidate", type=Path)
    candidate_validate.set_defaults(handler=_cmd_candidate_validate)

    candidates_validate = commands.add_parser(
        "candidates-validate", help="Validate every candidate JSON file in a directory."
    )
    candidates_validate.add_argument("directory", type=Path, nargs="?", default=Path("candidates"))
    candidates_validate.set_defaults(handler=_cmd_candidates_validate)

    candidate_status = commands.add_parser(
        "candidate-status", help="Change candidate workflow status."
    )
    candidate_status.add_argument("candidate", type=Path)
    candidate_status.add_argument("status", choices=["researching", "ready", "rejected"])
    candidate_status.add_argument("--note")
    candidate_status.set_defaults(handler=_cmd_candidate_status)

    candidate_promote = commands.add_parser(
        "candidate-promote", help="Promote one ready candidate."
    )
    candidate_promote.add_argument("candidate", type=Path)
    candidate_promote.set_defaults(handler=_cmd_candidate_promote)

    add_parser = commands.add_parser("add", help="Add a standalone channel record.")
    add_parser.add_argument("record", type=Path)
    add_parser.add_argument("--replace", action="store_true")
    add_parser.add_argument("--dry-run", action="store_true")
    add_parser.set_defaults(handler=_cmd_add)

    update_parser = commands.add_parser("update", help="Replace one channel record by id.")
    update_parser.add_argument("channel_id")
    update_parser.add_argument("record", type=Path)
    update_parser.add_argument("--dry-run", action="store_true")
    update_parser.set_defaults(handler=_cmd_update)

    remove_parser = commands.add_parser("remove", help="Remove one channel record by id.")
    remove_parser.add_argument("channel_id")
    remove_parser.add_argument("--dry-run", action="store_true")
    remove_parser.add_argument("--yes", action="store_true")
    remove_parser.set_defaults(handler=_cmd_remove)

    seed_parser = commands.add_parser("seed", help="Generate static/browser validation inputs.")
    seed_parser.add_argument("--id", dest="channel_ids", action="append")
    seed_parser.add_argument("--level", choices=["national", "subnational", "supranational"])
    seed_parser.add_argument("--output", type=Path, required=True)
    seed_parser.set_defaults(handler=_cmd_seed)

    identity_parser = commands.add_parser(
        "identity-audit", help="Audit Wikidata and IPU coherence."
    )
    identity_parser.add_argument("--output", type=Path)
    identity_parser.set_defaults(handler=_cmd_identity_audit)

    health_diff = commands.add_parser("health-diff", help="Compare two catalogue health reports.")
    health_diff.add_argument("before", type=Path)
    health_diff.add_argument("after", type=Path)
    health_diff.add_argument("--output", type=Path)
    health_diff.add_argument("--fail-on-regression", action="store_true")
    health_diff.set_defaults(handler=_cmd_health_diff)

    health_check = commands.add_parser(
        "health-check", help="Run live HTTP and manifest checks for catalogue sources."
    )
    health_check.add_argument("--id", dest="channel_ids", action="append")
    health_check.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT_SECONDS)
    health_check.add_argument("--retries", type=int, default=DEFAULT_RETRIES)
    health_check.add_argument("--workers", type=int, default=8)
    health_check.add_argument("--output", type=Path)
    health_check.add_argument("--fail-on-error", action="store_true")
    health_check.set_defaults(handler=_cmd_health_check)

    export_parser = commands.add_parser("export", help="Export a flattened CSV catalogue.")
    export_parser.add_argument("--output", type=Path)
    export_parser.set_defaults(handler=_cmd_export)

    schedules_collect = commands.add_parser(
        "schedules-collect", help="Fetch and normalize implemented schedule sources."
    )
    schedules_collect.add_argument("--output", type=Path, default=Path("data/schedules.json"))
    schedules_collect.add_argument("--timeout", type=int, default=DEFAULT_SCHEDULE_TIMEOUT_SECONDS)
    schedules_collect.add_argument("--retries", type=int, default=DEFAULT_SCHEDULE_RETRIES)
    schedules_collect.add_argument("--minimum-successful-sources", type=int, default=1)
    schedules_collect.set_defaults(handler=_cmd_schedules_collect)

    epg_audit = commands.add_parser(
        "epg-audit", help="Check every unique schedule/EPG endpoint in the catalogue."
    )
    epg_audit.add_argument("--timeout", type=int, default=DEFAULT_SCHEDULE_TIMEOUT_SECONDS)
    epg_audit.add_argument("--retries", type=int, default=0)
    epg_audit.add_argument("--workers", type=int, default=8)
    epg_audit.add_argument("--output", type=Path)
    epg_audit.add_argument("--fail-on-error", action="store_true")
    epg_audit.set_defaults(handler=_cmd_epg_audit)

    links_audit = commands.add_parser(
        "links-audit",
        help="Check official, rights, identity, and embed links recorded in the catalogue.",
    )
    links_audit.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT_SECONDS)
    links_audit.add_argument("--retries", type=int, default=0)
    links_audit.add_argument("--workers", type=int, default=8)
    links_audit.add_argument("--output", type=Path)
    links_audit.add_argument("--fail-on-error", action="store_true")
    links_audit.set_defaults(handler=_cmd_links_audit)

    playback_policy_audit = commands.add_parser(
        "playback-policy-audit",
        help="Report playback policy, rights, and technical-state review tensions.",
    )
    playback_policy_audit.add_argument("--output", type=Path)
    playback_policy_audit.add_argument("--fail-on-review", action="store_true")
    playback_policy_audit.add_argument("--fail-on-error", action="store_true")
    playback_policy_audit.set_defaults(handler=_cmd_playback_policy_audit)

    validation_history = commands.add_parser(
        "validation-history-refresh",
        help="Attach compact validation-report references to catalogue entries.",
    )
    validation_history.add_argument(
        "--reports-dir",
        type=Path,
        default=Path("reports/health"),
        help="Directory containing retained health report JSON files.",
    )
    validation_history.add_argument(
        "--limit",
        type=int,
        default=3,
        help="Maximum validation-history entries to retain per channel.",
    )
    validation_history.add_argument(
        "--check",
        action="store_true",
        help="Fail if catalogue validation-history references are stale.",
    )
    validation_history.add_argument("--dry-run", action="store_true")
    validation_history.set_defaults(handler=_cmd_validation_history_refresh)
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        handler = cast(Callable[[argparse.Namespace], int], args.handler)
        return handler(args)
    except (CatalogueValidationError, KeyError, ValueError) as error:
        print(str(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
