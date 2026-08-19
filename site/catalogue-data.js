window.PARLIAMENT_STREAMS_CATALOGUE = {
  "schema_version": 9,
  "generated_from": "curated research and live endpoint validation",
  "generated_on": "2026-08-19",
  "description": "Public parliamentary stream and source catalogue maintained through research notes, official pages, and live endpoint validation.",
  "channels": [
    {
      "id": "cpac-ca",
      "name": "CPAC Canada",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "Parliament of Canada",
      "external_ids": {
        "wikidata_qid": "Q475689",
        "ipu_country_code": "CA",
        "ipu_parliament_code": "CA",
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q475689",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/CA/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "English / French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cpac-ca-live.cdn.vustreams.com/groupa/live/f9809cea-1e07-47cd-a94d-2ddd3e1351db/live.isml/.m3u8",
      "official_url": "https://www.cpac.ca/en/",
      "provenance_note": "Official CPAC stream endpoint discovered from CPAC metadata.",
      "technical_status": "validated",
      "stability_risk": "low",
      "availability": "always_on",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en",
          "fr"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "CPAC HLS variants have documented English and French audio groups and closed captions."
      },
      "epg_sources": [
        {
          "scraper": "cpac",
          "url": "https://www.cpac.ca/schedule/",
          "method": "GET",
          "kind": "daily_schedule_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "CPAC terms, rechecked on 2026-08-15, limit viewing to personal, non-commercial use on CPAC.ca and prohibit retransmission, embedding, hotlinking, inline linking, scraping, caching, and similar uses without prior written consent.",
        "evidence": [
          "https://www.cpac.ca/terms-of-use"
        ],
        "recommendation": "Link to CPAC.ca only. Do not use the catalogued HLS endpoint in a third-party player unless CPAC gives written consent."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:36Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:39Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:28:44Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "canada-house-of-commons-parlvu",
      "name": "Canada House of Commons ParlVU",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "House of Commons of Canada",
      "external_ids": {
        "wikidata_qid": "Q383590",
        "ipu_country_code": "CA",
        "ipu_parliament_code": "CA",
        "ipu_chamber_code": "CA-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q383590",
          "checked_on": "2026-08-19",
          "confidence": "high",
          "notes": "Matched to the House of Commons of Canada; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/CA/CA-LC01/",
          "checked_on": "2026-08-19",
          "confidence": "high",
          "notes": "Matched to the IPU Parline House of Commons chamber identifier; used for institutional identity only."
        }
      ],
      "language": "English / French / Floor audio",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://parlvu.parl.gc.ca/Harmony/en",
      "provenance_note": "Official House of Commons ParlVU Harmony event platform. Landing and event pages expose live, upcoming, and on-demand proceedings, but this review did not find a published stable first-party HLS endpoint.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "source_dependent",
        "caption_languages": [
          "en",
          "fr"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "ParlVU documents English, French, and floor audio options; caption availability should be confirmed per event."
      },
      "epg_sources": [
        {
          "scraper": "canada-harmony",
          "url": "https://parlvu.parl.gc.ca/Harmony/en",
          "method": "GET",
          "kind": "harmony_upcoming_events_and_powerbrowser_pages",
          "scraper_status": "implemented"
        },
        {
          "scraper": "planned",
          "url": "https://parlvu.parl.gc.ca/Harmony/en/api/Data/GetUpcomingEvents",
          "method": "GET",
          "kind": "harmony_upcoming_events_api",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "ParlVU is an official House of Commons live and on-demand proceedings surface, but this review found no permission for third-party native playback or redistribution of any underlying stream URL.",
        "evidence": [
          "https://parlvu.parl.gc.ca/Harmony/en",
          "https://www.ourcommons.ca/en/important-notices#SpeakersPermission",
          "https://www.ourcommons.ca/procedure-and-practice-4/ch24-3-e.html"
        ],
        "recommendation": "Use official link-out and event metadata only. Do not extract or replay Harmony media manifests unless the House confirms permission and stability."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "canada-senate-senvu",
      "name": "Canada Senate SenVu",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "Senate of Canada",
      "external_ids": {
        "wikidata_qid": "Q841180",
        "ipu_country_code": "CA",
        "ipu_parliament_code": "CA",
        "ipu_chamber_code": "CA-UC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q841180",
          "checked_on": "2026-08-19",
          "confidence": "high",
          "notes": "Matched to the Senate of Canada; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/CA/CA-UC01/",
          "checked_on": "2026-08-19",
          "confidence": "high",
          "notes": "Matched to the IPU Parline Senate chamber identifier; used for institutional identity only."
        }
      ],
      "language": "English / French / Floor audio",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://senparlvu.parl.gc.ca/Harmony/",
      "provenance_note": "Official Senate SenVu Harmony event platform. Event pages expose scheduled proceedings and stable-looking Azure CDN base paths for room streams, but this review did not find complete published stable HLS manifest URLs.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "source_dependent",
        "caption_languages": [
          "en",
          "fr"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "SenVu documents audio, video, and closed-captioning features; only floor audio and official transcripts are identified as the official record."
      },
      "epg_sources": [
        {
          "scraper": "canada-harmony",
          "url": "https://senparlvu.parl.gc.ca/Harmony/",
          "method": "GET",
          "kind": "harmony_upcoming_events_and_powerbrowser_pages",
          "scraper_status": "implemented"
        },
        {
          "scraper": "planned",
          "url": "https://senparlvu.parl.gc.ca/Harmony/en/api/Data/GetUpcomingEvents",
          "method": "GET",
          "kind": "harmony_upcoming_events_api",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "SenVu is an official Senate live and on-demand proceedings surface, but this review found no permission for third-party native playback or redistribution of any underlying stream URL.",
        "evidence": [
          "https://senparlvu.parl.gc.ca/Harmony/",
          "https://sencanada.ca/en/intellectual-property/#permission",
          "https://sencanada.ca/en/newsroom/the-speaker-of-the-senate-senate-chamber-launches-video-broadcasting/"
        ],
        "recommendation": "Use official link-out and event metadata only. Do not extract or replay Harmony media manifests unless the Senate confirms permission and stability."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "new-zealand-parliament",
      "name": "New Zealand Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "New Zealand",
      "legislature": "New Zealand Parliament",
      "external_ids": {
        "wikidata_qid": "Q1520966",
        "ipu_country_code": "NZ",
        "ipu_parliament_code": "NZ",
        "ipu_chamber_code": "NZ-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1520966",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/NZ/NZ-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://ptvlive.kordia.net.nz/out/v1/daf20b9a9ec5449dadd734e50ce52b74/index.m3u8",
      "official_url": "https://www.parliament.nz/en/watch-parliament/",
      "provenance_note": "New Zealand Parliament TV. Attribute the source and link to the official Parliament TV terms.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "sitting_only",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "new-zealand-parliament",
          "url": "https://www3.parliament.nz/en/calendar/",
          "method": "GET",
          "kind": "calendar_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "New Zealand Parliament TV terms expressly make live House proceedings available for television broadcast, webcast, and recording in other media, subject to legal obligations, no commercial sponsorship or advertising, and no misleading use. Parliament may direct a broadcaster to stop or alter coverage.",
        "evidence": [
          "https://videos.parliament.nz/",
          "https://www3.parliament.nz/en/get-involved/information-for-the-press/parliament-tv-terms-and-conditions/",
          "https://www3.parliament.nz/en/footer/copyright/"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with clear source attribution. Do not add sponsorship or advertising, misrepresent the proceedings, or continue use contrary to a Parliament direction."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:36Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:40Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:28:45Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "norway-stortinget",
      "name": "Norway Stortinget",
      "jurisdiction_level": "national",
      "country_or_region": "Norway",
      "legislature": "Stortinget",
      "external_ids": {
        "wikidata_qid": "Q109016",
        "ipu_country_code": "NO",
        "ipu_parliament_code": "NO",
        "ipu_chamber_code": "NO-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q109016",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/NO/NO-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Norwegian",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://httpcache1.dna.contentdelivery.net/90415-cachemn1/stortinget_n/stortingssalen_web/playlist_dvr_timeshift-0-43200.m3u8",
      "official_url": "https://www.stortinget.no/nett-tv",
      "provenance_note": "Official Stortinget Nett-TV page exposed this HLS manifest during browser validation.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.stortinget.no/nett-tv",
          "method": "GET",
          "kind": "nett_tv_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "Stortinget documents a formal retransmission arrangement for Nett-TV that supplies a dedicated publication point and requires an agreement, attribution, non-commercial use, and reporting. That documented route does not authorize use of the catalogued browser-discovered HLS manifest.",
        "evidence": [
          "https://www.stortinget.no/nett-tv",
          "https://www.stortinget.no/no/Stottemeny/Hjelp/Nett-TV/Videreformidling-av-Stortingets-nett-TV/",
          "https://httpcache1.dna.contentdelivery.net/90415-cachemn1/stortinget_n/stortingssalen_web/playlist_dvr_timeshift-0-43200.m3u8"
        ],
        "recommendation": "Link to Stortinget Nett-TV. Do not enable third-party playback of the browser-discovered HLS endpoint unless Stortinget supplies the dedicated publishing point and retransmission agreement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:38Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:41Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "brazil-tv-camara",
      "name": "Brazil TV Camara",
      "jurisdiction_level": "national",
      "country_or_region": "Brazil",
      "legislature": "Camara dos Deputados",
      "external_ids": {
        "wikidata_qid": "Q1834804",
        "ipu_country_code": "BR",
        "ipu_parliament_code": "BR",
        "ipu_chamber_code": "BR-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1834804",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/BR/BR-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Portuguese",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.camara.leg.br/tv/aovivo",
      "provenance_note": "Official TV Camara live page. The page still embeds the previously catalogued HLS URL, but that manifest returned HTTP 404 on 2026-08-19, so native playback is disabled until a replacement first-party stream is validated.",
      "technical_status": "link_only",
      "stability_risk": "high",
      "availability": "always_on",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "brazil-tv-camara",
          "url": "https://www.camara.leg.br/tv/programacao-semanal",
          "method": "GET",
          "kind": "weekly_schedule_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Camara portal terms say public portal information is public-domain, free, and reproducible with source and author credit where applicable. A 2022 Camara order says direct plenary and committee transmissions are under CC BY 4.0 for broad and unrestricted use when the production depicts reality and preserves the original speaking context. The previously catalogued TV Camara HLS endpoint returned HTTP 404 on 2026-08-19, so this remains link-out until a supported playback route is validated.",
        "evidence": [
          "https://www.camara.leg.br/tv/aovivo",
          "https://www.camara.leg.br/tv/aovivo/embed",
          "https://www2.camara.leg.br/termo-de-uso-e-politica-de-privacidade/termos-gerais",
          "https://www2.camara.leg.br/legin/int/ordser/2022/ordemdeservico-2-30-maio-2022-792759-publicacaooriginal-165427-direx.html"
        ],
        "recommendation": "Link to the official TV Camara page and preserve Camara dos Deputados attribution, CC BY 4.0 conditions for plenary/committee transmissions, reality/context requirements, and YouTube terms where portal video uses YouTube. Do not restore native playback until a replacement first-party route is validated."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:39Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:42Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:28:46Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "ireland-oireachtas-tv",
      "name": "Ireland Oireachtas TV",
      "jurisdiction_level": "national",
      "country_or_region": "Ireland",
      "legislature": "Houses of the Oireachtas",
      "external_ids": {
        "wikidata_qid": "Q129821",
        "ipu_country_code": "IE",
        "ipu_parliament_code": "IE",
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q129821",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/IE/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "English / Irish",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.oireachtas.ie/en/oireachtas-tv/",
      "provenance_note": "Official Oireachtas TV page with live channel, Dail, Seanad, and committee-room embed codes.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.oireachtas.ie/en/oireachtas-tv/",
          "method": "GET",
          "kind": "tv_guide_and_live_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://www.oireachtas.ie/en/committees/schedule/",
          "method": "GET",
          "kind": "committee_schedule_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The official Oireachtas embed-code page provides live-stream iframe snippets, requires credit to the Houses of the Oireachtas Service, and states use is subject to rules of coverage. Raw CloudFront HLS URLs returned 403 from this environment on 2026-07-29, so this is recorded as an official embed/link-out source rather than direct HLS.",
        "evidence": [
          "https://www.oireachtas.ie/en/oireachtas-tv/",
          "https://www.oireachtas.ie/en/oireachtas-tv/embed-codes/",
          "https://www.oireachtas.ie/en/committees/schedule/"
        ],
        "recommendation": "Use official embed codes or link out; do not list raw HLS unless a source-supported direct playback path is confirmed."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:41Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:28:44Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-07-29T15:28:48Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "denmark-folketinget",
      "name": "Denmark Folketinget",
      "jurisdiction_level": "national",
      "country_or_region": "Denmark",
      "legislature": "Folketinget",
      "external_ids": {
        "wikidata_qid": "Q209151",
        "ipu_country_code": "DK",
        "ipu_parliament_code": "DK",
        "ipu_chamber_code": "DK-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q209151",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/DK/DK-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Danish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdnapi.kaltura.com/p/2158211/sp/327418300/playManifest/entryId/1_24gfa7qq/protocol/https/format/applehttp/a.m3u8",
      "official_url": "https://www.ft.dk/",
      "provenance_note": "Folketinget. Link to the Folketinget sharing and rights terms; do not use the Folketinget logo.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.ft.dk/da/aktuelt/tv-fra-folketinget",
          "method": "GET",
          "kind": "upcoming_broadcasts_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Folketinget grants a global, royalty-free, non-exclusive right to reproduce, disseminate, publicly show, and transmit its TV productions in all media and formats, including webcasts. Conditions include correct attribution, no modification except technically necessary changes, no endorsement, no use of parliamentary logos, and no access restrictions inconsistent with the source terms.",
        "evidence": [
          "https://www.ft.dk/da/aktuelt/tv-fra-folketinget/deling-og-rettigheder"
        ],
        "recommendation": "Native playback is permitted where the source is attributed and the public is linked to the Folketinget sharing and rights terms. Preserve the unmodified feed, do not use the logo, and do not imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:42Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:45Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:28:49Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "netherlands-tweede-kamer",
      "name": "Netherlands Tweede Kamer",
      "jurisdiction_level": "national",
      "country_or_region": "Netherlands",
      "legislature": "Tweede Kamer",
      "external_ids": {
        "wikidata_qid": "Q233262",
        "ipu_country_code": "NL",
        "ipu_parliament_code": "NL",
        "ipu_chamber_code": "NL-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q233262",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/NL/NL-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Dutch",
      "source_type": "direct_hls",
      "source_kind": "first_party_hls",
      "playback_url": "https://livestreaming.b67buv2.tweedekamer.nl/live/plenairezaal/index.m3u8?hd=1&keyframes=1&subtitles=live",
      "official_url": "https://www.tweedekamer.nl/debat_en_vergadering/livedebat",
      "provenance_note": "Official Tweede Kamer live room stream.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "nl"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Tweede Kamer documents automatic live captions for all debates, manual live captions for Question Time and selected debates, and a linked Dutch Sign Language interpreter stream for Question Time. Audio-description coverage is not confirmed."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.tweedekamer.nl/debat_en_vergadering/livedebatten",
          "method": "GET",
          "kind": "live_debates_and_agenda_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official-looking public HLS source, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.tweedekamer.nl/debat_en_vergadering/livedebat"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:43Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:46Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:28:50Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "spain-canal-parlamento",
      "name": "Spain Canal Parlamento",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "external_ids": {
        "wikidata_qid": "Q539149",
        "ipu_country_code": "ES",
        "ipu_parliament_code": "ES",
        "ipu_chamber_code": "ES-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q539149",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/ES/ES-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2037973/canalparlamento/master.m3u8",
      "official_url": "https://www.congreso.es/",
      "provenance_note": "Official Congreso/Canal Parlamento HLS candidate.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/programacion",
          "method": "GET",
          "kind": "canal_parlamento_weekly_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Congress legal notice allows reuse of information on congreso.es when content is not altered, meaning is not distorted, source is cited, last-update date is mentioned, and use is diligent and lawful. The Congress FAQ says the institutional signal for Plenary and committee proceedings is distributed free to media and citizens through the web and Canal Parlamento, and that archived videos may be downloaded by debate or intervention and used freely after the session. This supports the prototype playback posture, while raw live-HLS reuse should still preserve source context and avoid implying broader authorization than the official pages describe.",
        "evidence": [
          "https://www.congreso.es/es/web/guest/cem/aviso-legal",
          "https://www.congreso.es/es/cem/faqs",
          "https://www.congreso.es/es/cem/mas-informacion",
          "https://www.congreso.es/es/actualidad/canal-parlamento"
        ],
        "recommendation": "Native playback may remain enabled under the prototype opt-out policy with clear Congreso/Canal Parlamento attribution, no alteration or distortion, and source/date links. Prefer official Congreso en Directo, Canal Parlamento, or Archivo Audiovisual links for uses requiring fully documented reuse routes."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:22Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-15T18:26:44Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:47Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "spain-congreso-directo-1",
      "name": "Spain Congreso en Directo 1",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "external_ids": {
        "wikidata_qid": "Q539149",
        "ipu_country_code": "ES",
        "ipu_parliament_code": "ES",
        "ipu_chamber_code": "ES-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q539149",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/ES/ES-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038274/canal1/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "provenance_note": "Official Congreso en Directo signal 1; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "method": "GET",
          "kind": "weekly_live_signals_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/programacion",
          "method": "GET",
          "kind": "canal_parlamento_weekly_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Congreso documentation says Congreso en Directo provides Plenary and up to five committee/live signals through the Congress website, and FAQ text says institutional signals and downloadable videos are provided free to media and citizens. Native HLS reuse should still preserve attribution and avoid implying endorsement.",
        "evidence": [
          "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "https://www.congreso.es/es/cem/mas-informacion",
          "https://www.congreso.es/es/cem/faqs"
        ],
        "recommendation": "Strong technical and rights candidate; preserve source attribution and revisit terms before redistribution beyond research/catalogue use."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:23Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:27:48Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:26:46Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "spain-congreso-directo-2",
      "name": "Spain Congreso en Directo 2",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "external_ids": {
        "wikidata_qid": "Q539149",
        "ipu_country_code": "ES",
        "ipu_parliament_code": "ES",
        "ipu_chamber_code": "ES-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q539149",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/ES/ES-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038275/canal2/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "provenance_note": "Official Congreso en Directo signal 2; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "method": "GET",
          "kind": "weekly_live_signals_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/programacion",
          "method": "GET",
          "kind": "canal_parlamento_weekly_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Congreso documentation says Congreso en Directo provides Plenary and up to five committee/live signals through the Congress website, and FAQ text says institutional signals and downloadable videos are provided free to media and citizens. Native HLS reuse should still preserve attribution and avoid implying endorsement.",
        "evidence": [
          "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "https://www.congreso.es/es/cem/mas-informacion",
          "https://www.congreso.es/es/cem/faqs"
        ],
        "recommendation": "Strong technical and rights candidate; preserve source attribution and revisit terms before redistribution beyond research/catalogue use."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:25Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:27:49Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:26:47Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "spain-congreso-directo-3",
      "name": "Spain Congreso en Directo 3",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "external_ids": {
        "wikidata_qid": "Q539149",
        "ipu_country_code": "ES",
        "ipu_parliament_code": "ES",
        "ipu_chamber_code": "ES-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q539149",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/ES/ES-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038276/canal3/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "provenance_note": "Official Congreso en Directo signal 3; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "method": "GET",
          "kind": "weekly_live_signals_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/programacion",
          "method": "GET",
          "kind": "canal_parlamento_weekly_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Congreso documentation says Congreso en Directo provides Plenary and up to five committee/live signals through the Congress website, and FAQ text says institutional signals and downloadable videos are provided free to media and citizens. Native HLS reuse should still preserve attribution and avoid implying endorsement.",
        "evidence": [
          "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "https://www.congreso.es/es/cem/mas-informacion",
          "https://www.congreso.es/es/cem/faqs"
        ],
        "recommendation": "Strong technical and rights candidate; preserve source attribution and revisit terms before redistribution beyond research/catalogue use."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:26Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:27:51Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:26:49Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "spain-congreso-directo-4",
      "name": "Spain Congreso en Directo 4",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "external_ids": {
        "wikidata_qid": "Q539149",
        "ipu_country_code": "ES",
        "ipu_parliament_code": "ES",
        "ipu_chamber_code": "ES-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q539149",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/ES/ES-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038277/canal4/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "provenance_note": "Official Congreso en Directo signal 4; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "method": "GET",
          "kind": "weekly_live_signals_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/programacion",
          "method": "GET",
          "kind": "canal_parlamento_weekly_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Congreso documentation says Congreso en Directo provides Plenary and up to five committee/live signals through the Congress website, and FAQ text says institutional signals and downloadable videos are provided free to media and citizens. Native HLS reuse should still preserve attribution and avoid implying endorsement.",
        "evidence": [
          "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "https://www.congreso.es/es/cem/mas-informacion",
          "https://www.congreso.es/es/cem/faqs"
        ],
        "recommendation": "Strong technical and rights candidate; preserve source attribution and revisit terms before redistribution beyond research/catalogue use."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:27Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:27:52Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:26:51Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "spain-congreso-directo-5",
      "name": "Spain Congreso en Directo 5",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "external_ids": {
        "wikidata_qid": "Q539149",
        "ipu_country_code": "ES",
        "ipu_parliament_code": "ES",
        "ipu_chamber_code": "ES-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q539149",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/ES/ES-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038278/canal5/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "provenance_note": "Official Congreso en Directo signal 5; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "method": "GET",
          "kind": "weekly_live_signals_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://www.congreso.es/es/programacion",
          "method": "GET",
          "kind": "canal_parlamento_weekly_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Congreso documentation says Congreso en Directo provides Plenary and up to five committee/live signals through the Congress website, and FAQ text says institutional signals and downloadable videos are provided free to media and citizens. Native HLS reuse should still preserve attribution and avoid implying endorsement.",
        "evidence": [
          "https://www.congreso.es/es/web/guest/congreso-en-directo",
          "https://www.congreso.es/es/cem/mas-informacion",
          "https://www.congreso.es/es/cem/faqs"
        ],
        "recommendation": "Strong technical and rights candidate; preserve source attribution and revisit terms before redistribution beyond research/catalogue use."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:28Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:27:52Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-15T18:26:52Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "france-national-assembly",
      "name": "France National Assembly",
      "jurisdiction_level": "national",
      "country_or_region": "France",
      "legislature": "Assemblee nationale",
      "external_ids": {
        "wikidata_qid": "Q193582",
        "ipu_country_code": "FR",
        "ipu_parliament_code": "FR",
        "ipu_chamber_code": "FR-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q193582",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/FR/FR-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://assemblee-nationale.akamaized.net/live/live36/stream36.m3u8",
      "official_url": "https://videos.assemblee-nationale.fr/direct.php",
      "provenance_note": "Official National Assembly HLS candidate; July 2026 health check reached the URL but received a malformed/minimal manifest.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.assemblee-nationale.fr/dyn/seance-publique",
          "method": "GET",
          "kind": "public_sitting_agenda",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The Assembly site states that public or official documents and multimedia resources, including debates and parliamentary documents, may be reproduced freely under conditions including no commercial/advertising use, free redistribution, document integrity, attribution, source citation, and a link to the original online document.",
        "evidence": [
          "https://videos.assemblee-nationale.fr/direct.php",
          "https://www.assemblee-nationale.fr/dyn/info-site"
        ],
        "recommendation": "Native playback may remain enabled only with clear Assembly attribution and source links, no advertising, no paywall, and no modification beyond technically necessary playback handling."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:29Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "warning",
          "note": "Response did not start with #EXTM3U."
        },
        {
          "checked_at": "2026-08-15T18:27:54Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "Response did not start with #EXTM3U."
        },
        {
          "checked_at": "2026-08-15T18:26:54Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "Response did not start with #EXTM3U."
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "chile-camara-tv",
      "name": "Chile Camara TV",
      "jurisdiction_level": "national",
      "country_or_region": "Chile",
      "legislature": "Camara de Diputadas y Diputados",
      "external_ids": {
        "wikidata_qid": "Q2119518",
        "ipu_country_code": "CL",
        "ipu_parliament_code": "CL",
        "ipu_chamber_code": "CL-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q2119518",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/CL/CL-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://tls-cl.cdnz.cl/streamdiptudadosa/live/playlist.m3u8",
      "official_url": "https://www.camara.cl/prensa/television.aspx",
      "provenance_note": "Official Camara television page exposed this HLS manifest during browser validation.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "he"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The official Knesset Channel site publishes a live captioned broadcast page for Hebrew captions."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.camara.cl/prensa/television.aspx",
          "method": "GET",
          "kind": "television_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "The official Camara television page exposed a public HLS manifest, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.camara.cl/prensa/television.aspx",
          "https://tls-cl.cdnz.cl/streamdiptudadosa/live/playlist.m3u8"
        ],
        "recommendation": "Link out or keep as pending until terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:55Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:57Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "israel-knesset-channel",
      "name": "Israel Knesset Channel",
      "jurisdiction_level": "national",
      "country_or_region": "Israel",
      "legislature": "Knesset",
      "external_ids": {
        "wikidata_qid": "Q133396",
        "ipu_country_code": "IL",
        "ipu_parliament_code": "IL",
        "ipu_chamber_code": "IL-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q133396",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/IL/IL-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Hebrew",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://kneset.gostreaming.tv/p2-kneset/_definst_/myStream/playlist.m3u8",
      "official_url": "https://www.knesset.tv/live/",
      "provenance_note": "Official Knesset Channel live page exposed this HLS manifest during browser validation.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.knesset.tv/live/",
          "method": "GET",
          "kind": "live_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Knesset Channel terms say the site/app service is personal by default, while also noting that Knesset broadcast law and regulations permit use of Knesset broadcasts, including committee and plenary broadcasts, with visible credit. The channel also carries non-proceeding programming that may require prior authorization.",
        "evidence": [
          "https://www.knesset.tv/live/",
          "https://kneset.gostreaming.tv/p2-kneset/_definst_/myStream/playlist.m3u8",
          "https://www.knesset.tv/documents/terms-and-privacy/",
          "https://www.knesset.tv/committees/digitalknesset/35478/47690/"
        ],
        "recommendation": "Keep permission pending or link out unless the app can distinguish official Knesset proceedings from other Knesset Channel programming and display the required Hebrew credit."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:56Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:28:58Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "portugal-artv",
      "name": "Portugal ARTV Canal Parlamento",
      "jurisdiction_level": "national",
      "country_or_region": "Portugal",
      "legislature": "Assembleia da Republica",
      "external_ids": {
        "wikidata_qid": "Q740564",
        "ipu_country_code": "PT",
        "ipu_parliament_code": "PT",
        "ipu_chamber_code": "PT-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q740564",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/PT/PT-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Portuguese",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://playout172.livextend.cloud/liveiframe/_definst_/liveartvabr/playlist.m3u8",
      "official_url": "https://www.parlamento.pt/",
      "provenance_note": "Canal Parlamento HLS candidate; pair with official agenda metadata.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "portugal-open-data-agenda",
          "url": "https://www.parlamento.pt/Cidadania/Paginas/DABoletimInformativo.aspx",
          "method": "GET",
          "kind": "official_open_data_agenda_index",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Assembly of the Republic ownership rules state that the Assembly owns material production resulting from its work and that public bodies, companies, and private entities may not edit or commercialize that production without prior assent of the President of the Assembly. This confirms source ownership but does not clearly authorize third-party live playback.",
        "evidence": [
          "https://www.parlamento.pt/",
          "https://www.parlamento.pt/Paginas/propriedade.aspx",
          "https://www.parlamento.pt/Paginas/2015/dezembro/ARTV-Canal-Parlamento-na-Web-TV.aspx"
        ],
        "recommendation": "Link to ARTV/Canal Parlamento pending written clarification for third-party live playback. Do not edit or commercialize Assembly video without prior assent."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:57Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:00Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:28:59Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "greece-hellenic-parliament-tv",
      "name": "Greece Hellenic Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "Greece",
      "legislature": "Hellenic Parliament",
      "external_ids": {
        "wikidata_qid": "Q477089",
        "ipu_country_code": "GR",
        "ipu_parliament_code": "GR",
        "ipu_chamber_code": "GR-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q477089",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/GR/GR-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Greek",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://ert-ucdn.broadpeak-aas.com/bpk-tv/VOULITV/default/index.m3u8",
      "official_url": "https://www.hellenicparliament.gr/",
      "provenance_note": "Hellenic Parliament TV HLS candidate distributed through public broadcaster infrastructure.",
      "technical_status": "validated",
      "stability_risk": "low",
      "availability": "always_on",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.hellenicparliament.gr/Enimerosi/Vouli-Tileorasi/",
          "method": "GET",
          "kind": "television_programme_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Hellenic Parliament terms say portal content is freely available for public reading while available, and allow republication of parts of portal content if unaltered, explicitly credited to the Hellenic Parliament portal, dated, and linked where feasible. The terms do not clearly authorize full third-party live-stream playback or reuse of third-party content.",
        "evidence": [
          "https://www.hellenicparliament.gr/",
          "https://www.hellenicparliament.gr/termsOfUse",
          "https://www.hellenicparliament.gr/Dioikitiki-Organosi/Ypiresies/Other-Services/Tileoptikos-Stathmos-tis-Voulis-ton-Ellinon/"
        ],
        "recommendation": "Link to the official Hellenic Parliament TV/player while direct HLS reuse remains pending. If excerpts are used, preserve context, attribution, date, and source link."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:26:59Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:01Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:00Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "luxembourg-chamber-tv",
      "name": "Luxembourg Chamber TV",
      "jurisdiction_level": "national",
      "country_or_region": "Luxembourg",
      "legislature": "Chambre des Deputes",
      "external_ids": {
        "wikidata_qid": "Q517449",
        "ipu_country_code": "LU",
        "ipu_parliament_code": "LU",
        "ipu_chamber_code": "LU-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q517449",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/LU/LU-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "French / Luxembourgish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://media02.webtvlive.eu/chd-edge/smil:chamber_tv_hd.smil/playlist.m3u8",
      "official_url": "https://www.chd.lu/",
      "provenance_note": "Chamber TV HLS candidate from official player infrastructure.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.chd.lu/fr/agenda",
          "method": "GET",
          "kind": "parliamentary_agenda",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official player HLS candidate without recorded reuse permission. The endpoint was not reachable from the 2026-08-14 validation environment.",
        "evidence": [
          "https://www.chd.lu/"
        ],
        "recommendation": "Link-out or pending until current availability and terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:29Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "<urlopen error [Errno 51] Network is unreachable>"
        },
        {
          "checked_at": "2026-08-15T18:27:54Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "error",
          "note": "<urlopen error [Errno 51] Network is unreachable>"
        },
        {
          "checked_at": "2026-08-15T18:27:01Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "error",
          "note": "<urlopen error [Errno 51] Network is unreachable>"
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "estonia-riigikogu-live-1",
      "name": "Estonia Riigikogu Live 1",
      "jurisdiction_level": "national",
      "country_or_region": "Estonia",
      "legislature": "Riigikogu",
      "external_ids": {
        "wikidata_qid": "Q217799",
        "ipu_country_code": "EE",
        "ipu_parliament_code": "EE",
        "ipu_chamber_code": "EE-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q217799",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/EE/EE-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Estonian",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://router.euddn.net/862366dd346d6b6392d5231546f3d179/smil:rk_live_1.smil/playlist.m3u8?c=8005",
      "official_url": "https://www.riigikogu.ee/live/1/en",
      "provenance_note": "Official Riigikogu live page exposes this HLS manifest through its player.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.riigikogu.ee/en/news-and-publications/multimedia/live-broadcast/",
          "method": "GET",
          "kind": "live_broadcast_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official Riigikogu live page exposes a public HLS manifest, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.riigikogu.ee/en/news-and-publications/multimedia/live-broadcast/",
          "https://www.riigikogu.ee/live/1/en"
        ],
        "recommendation": "Link out or keep as pending until terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:12Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:15Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "estonia-riigikogu-live-2",
      "name": "Estonia Riigikogu Live 2",
      "jurisdiction_level": "national",
      "country_or_region": "Estonia",
      "legislature": "Riigikogu",
      "external_ids": {
        "wikidata_qid": "Q217799",
        "ipu_country_code": "EE",
        "ipu_parliament_code": "EE",
        "ipu_chamber_code": "EE-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q217799",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/EE/EE-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Estonian",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://router.euddn.net/862366dd346d6b6392d5231546f3d179/smil:rk_live_2.smil/playlist.m3u8?c=8005",
      "official_url": "https://www.riigikogu.ee/live/2/en",
      "provenance_note": "Official Riigikogu live page exposes this HLS manifest through its player.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.riigikogu.ee/en/news-and-publications/multimedia/live-broadcast/",
          "method": "GET",
          "kind": "live_broadcast_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official Riigikogu live page exposes a public HLS manifest, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.riigikogu.ee/en/news-and-publications/multimedia/live-broadcast/",
          "https://www.riigikogu.ee/live/2/en"
        ],
        "recommendation": "Link out or keep as pending until terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:13Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        },
        {
          "checked_at": "2026-08-14T21:29:17Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "italy-senate",
      "name": "Italy Senate",
      "jurisdiction_level": "national",
      "country_or_region": "Italy",
      "legislature": "Senato della Repubblica",
      "external_ids": {
        "wikidata_qid": "Q633872",
        "ipu_country_code": "IT",
        "ipu_parliament_code": "IT",
        "ipu_chamber_code": "IT-UC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q633872",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/IT/IT-UC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Italian",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://senato-live.morescreens.com/SENATO_1_001/playlist.m3u8",
      "official_url": "https://webtv.senato.it/",
      "provenance_note": "Senate live HLS candidate; official source and terms need deeper review.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "italian-senate-palimpsest",
          "url": "https://webtv.senato.it/api/palimpsest",
          "method": "GET",
          "kind": "webtv_schedule_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Senate legal notice authorizes use, reproduction, copying, and distribution of textual and multimedia elements from the Senate site within the public interest in information and the indicated CC-BY-style conditions, preserving integrity and indicating the source. The Senate transmission rules also describe free informational reproduction/communication of parliamentary speeches within justified information purposes, with Senate logo visibility and no advertising or simultaneous commentary for retransmitted parliamentary signal use.",
        "evidence": [
          "https://webtv.senato.it/",
          "https://www.senato.it/guida-al-sito/avviso-legale",
          "https://www.senato.it/istituzione/disciplinare-trasmissioni-radiotelevisive",
          "https://www.senato.it/istituzione/senato-sintesi"
        ],
        "recommendation": "Native playback may remain enabled for informational, non-advertising use with clear Senate attribution, preserved logo/source context, and no distortion. Prefer official WebTV/YouTube links for events outside parliamentary proceedings or where item-specific rights are unclear."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:15Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:18Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:02Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "india-sansad-tv-1",
      "name": "India Sansad TV 1",
      "jurisdiction_level": "national",
      "country_or_region": "India",
      "legislature": "Parliament of India",
      "external_ids": {
        "wikidata_qid": "Q695252",
        "ipu_country_code": "IN",
        "ipu_parliament_code": "IN",
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q695252",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/IN/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Hindi / English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/fff8f20221d5456e8922e689d71dedc3/index.m3u8",
      "official_url": "https://sansadtv.nic.in/",
      "provenance_note": "Sansad TV HLS candidate; terms and reliability require review.",
      "technical_status": "validated",
      "stability_risk": "low",
      "availability": "always_on",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://sansadtv.nic.in/program-schedule",
          "method": "GET",
          "kind": "programme_schedule_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Sansad TV identifies itself as India's parliamentary channel, but no direct Sansad TV reuse terms were found in this pass. The Digital Sansad portal's copyright policy says portal content may not be reproduced partly or fully without permission, except source acknowledgement when referred to as part of another website.",
        "evidence": [
          "https://sansadtv.nic.in/",
          "https://sansadtv.nic.in/about-us",
          "https://sansad.in/rs/privacyPolicy"
        ],
        "recommendation": "Keep native playback under the catalogue's pending-review posture, and prefer link-out until direct Sansad TV playback or reuse terms are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:16Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:19Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:03Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "india-sansad-tv-2",
      "name": "India Sansad TV 2",
      "jurisdiction_level": "national",
      "country_or_region": "India",
      "legislature": "Parliament of India",
      "external_ids": {
        "wikidata_qid": "Q695252",
        "ipu_country_code": "IN",
        "ipu_parliament_code": "IN",
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q695252",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/IN/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Hindi / English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/e4182054dce340da9e0ff38b6b3658a4/index.m3u8",
      "official_url": "https://sansadtv.nic.in/",
      "provenance_note": "Sansad TV HLS candidate; terms and reliability require review.",
      "technical_status": "validated",
      "stability_risk": "low",
      "availability": "always_on",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://sansadtv.nic.in/program-schedule",
          "method": "GET",
          "kind": "programme_schedule_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Sansad TV identifies itself as India's parliamentary channel, but no direct Sansad TV reuse terms were found in this pass. The Digital Sansad portal's copyright policy says portal content may not be reproduced partly or fully without permission, except source acknowledgement when referred to as part of another website.",
        "evidence": [
          "https://sansadtv.nic.in/",
          "https://sansadtv.nic.in/about-us",
          "https://sansad.in/rs/privacyPolicy"
        ],
        "recommendation": "Keep native playback under the catalogue's pending-review posture, and prefer link-out until direct Sansad TV playback or reuse terms are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:17Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:19Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:04Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "thailand-parliament-tv",
      "name": "Thailand Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "Thailand",
      "legislature": "National Assembly of Thailand",
      "external_ids": {
        "wikidata_qid": "Q1368318",
        "ipu_country_code": "TH",
        "ipu_parliament_code": "TH",
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1368318",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/TH/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Thai",
      "source_type": "direct_hls",
      "source_kind": "first_party_hls",
      "playback_url": "https://tv-live.tpchannel.org/live/tv.m3u8",
      "official_url": "https://tpchannel.org/",
      "provenance_note": "Thai Parliament TV HLS candidate; terms and reliability require review.",
      "technical_status": "validated",
      "stability_risk": "low",
      "availability": "always_on",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "TPchannel is operated by the National Assembly Radio and Television Broadcasting Station and publishes live/OTT access, but no source-specific reuse or embedding terms were found in this pass.",
        "evidence": [
          "https://tpchannel.org/",
          "https://www.tpchannel.org/tv/live",
          "https://play.google.com/store/apps/details?id=org.tpchannel.tpchanneltv"
        ],
        "recommendation": "Keep native playback under the catalogue's pending-review posture, and prefer link-out until TPchannel publishes reuse terms or grants permission."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:17Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:20Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:04Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "slovakia-tv-nrsr",
      "name": "Slovakia TV NRSR",
      "jurisdiction_level": "national",
      "country_or_region": "Slovakia",
      "legislature": "National Council of the Slovak Republic",
      "external_ids": {
        "wikidata_qid": "Q1139204",
        "ipu_country_code": "SK",
        "ipu_parliament_code": "SK",
        "ipu_chamber_code": "SK-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1139204",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/SK/SK-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Slovak",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://n11.stv.livebox.sk/stv-tv/stv4.stream/playlist.m3u8",
      "official_url": "https://www.nrsr.sk/",
      "provenance_note": "Parliamentary/public-broadcaster HLS candidate; source ownership needs review.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://tv.nrsr.sk/",
          "method": "GET",
          "kind": "current_and_upcoming_broadcasts_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Parliamentary/public-broadcaster HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://www.nrsr.sk/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:20Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:23Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:07Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "mongolia-parliament-tv",
      "name": "Mongolia Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "Mongolia",
      "legislature": "State Great Khural",
      "external_ids": {
        "wikidata_qid": "Q1544714",
        "ipu_country_code": "MN",
        "ipu_parliament_code": "MN",
        "ipu_chamber_code": "MN-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1544714",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/MN/MN-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Mongolian",
      "source_type": "direct_dash",
      "source_kind": "direct_dash_research",
      "playback_url": "https://cdn4.skygo.mn/live/disk1/Parlament/DASH-FTA/Parlament.mpd",
      "official_url": "https://att.parliament.mn/live",
      "provenance_note": "SkyGo DASH distribution candidate for parliamentary television. The official Parliament live/session page is the safer user-facing route; SkyGo source ownership, terms, and app playback strategy need review.",
      "technical_status": "validated",
      "stability_risk": "high",
      "availability": "always_on",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "DASH experiment from SkyGo/GO+ streaming infrastructure without recorded reuse permission. The official Parliament site publishes a live/session page with meeting video and YouTube references, and GO+ app-store evidence describes a commercial OTT service with official rights, but no source-specific permission was found for third-party use of the DASH manifest.",
        "evidence": [
          "https://att.parliament.mn/live",
          "https://www.parliament.mn/",
          "https://play.google.com/store/apps/details?id=tv.mirada.iris.android.inspire.skygo"
        ],
        "recommendation": "Keep as research-only. Prefer the official Parliament live/session page for users. Do not enable DASH playback until source ownership, reuse permission, and Apple/web playback strategy are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:46Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "ok",
          "note": "DASH MPD detected."
        },
        {
          "checked_at": "2026-08-15T18:28:07Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "DASH MPD detected."
        },
        {
          "checked_at": "2026-08-15T18:27:21Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "DASH MPD detected."
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "quebec-canal01",
      "name": "Quebec National Assembly - Canal 01",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal01/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:22Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:25Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:09Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal02",
      "name": "Quebec National Assembly - Canal 02",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal02/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:23Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:26Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:10Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal03",
      "name": "Quebec National Assembly - Canal 03",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal03/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:24Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:26Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:11Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal04",
      "name": "Quebec National Assembly - Canal 04",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal04/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:25Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:27Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:12Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal05",
      "name": "Quebec National Assembly - Canal 05",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal05/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:26Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:28Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:14Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal06",
      "name": "Quebec National Assembly - Canal 06",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal06/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:27Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:29Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:14Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal07",
      "name": "Quebec National Assembly - Canal 07",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal07/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:28Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:30Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:15Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal08",
      "name": "Quebec National Assembly - Canal 08",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal08/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:29Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:31Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:16Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal09",
      "name": "Quebec National Assembly - Canal 09",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal09/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:30Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:32Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:17Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal10",
      "name": "Quebec National Assembly - Canal 10",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal10/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:31Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:33Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:18Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal11",
      "name": "Quebec National Assembly - Canal 11",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal11/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:32Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:34Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:19Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal12",
      "name": "Quebec National Assembly - Canal 12",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal12/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:33Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:35Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:19Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal13",
      "name": "Quebec National Assembly - Canal 13",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal13/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:34Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:36Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:20Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "quebec-canal14",
      "name": "Quebec National Assembly - Canal 14",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblée nationale du Québec",
      "external_ids": {
        "wikidata_qid": "Q1492249",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1492249",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "French",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal14/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "provenance_note": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeEnDirect",
          "method": "POST",
          "kind": "live_list_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "quebec-webdiffusion",
          "url": "https://www.assnat.qc.ca/Gabarits/RefonteVA_Accueil.aspx/ObtenirListeAVenir",
          "method": "POST",
          "kind": "upcoming_list_api",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Quebec National Assembly terms authorize free reproduction of its videos and audio where the use is reasonable, fair, non-commercial, unmodified, non-prejudicial, and credits the Assembly. Reproducing Assembly, committee, or subcommittee debates in whole or in part for dissemination does not require authorization, subject to the Assembly Act.",
        "evidence": [
          "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
          "https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html"
        ],
        "recommendation": "Native playback is permitted for this non-commercial, unmodified catalogue with the visible source credit “Assemblée nationale du Québec”. Do not use the Assembly logo or imply endorsement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:35Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:37Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:21Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "ontario-house-en",
      "name": "Ontario Legislative Assembly - House EN",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "external_ids": {
        "wikidata_qid": "Q1809086",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1809086",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/house-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "provenance_note": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "sitting_only",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Ontario says all broadcasts have real-time captioning, and its accessibility plan says streamed House, committee, and media-studio proceedings include simultaneous interpretation in English and French plus closed captioning. Standing Order evidence says sign-language interpretation may appear onscreen if approved by the House."
      },
      "epg_sources": [
        {
          "scraper": "ontario-calendar",
          "url": "https://www.ola.org/en/legislative-business/calendar",
          "method": "GET",
          "kind": "calendar_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "noncommercial_pending_review",
        "summary": "Ontario terms permit reasonable, fair, non-commercial display, reproduction, and use of excerpts from Assembly electronic channels with credit. Media guidance expects accredited media to use the Assembly broadcast feed, but full live-stream relay by an independent public app is not expressly documented as permitted.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/get-involved/watch-legislature-action",
          "https://www.ola.org/en/office-assembly/copyright-privacy",
          "https://www.ola.org/en/office-assembly/accessibility/2024-2027-plan",
          "https://www.ola.org/en/office-assembly/offices-divisions-branches/legislative-protective-service/who-we-are/media-filming-guidelines"
        ],
        "recommendation": "Keep direct playback cautious and non-commercial with Assembly credit; seek written clarification before treating full live-stream reuse as broadly permitted."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:36Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:38Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:22Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "ontario-house-en-cc",
      "name": "Ontario Legislative Assembly - House EN CC",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "external_ids": {
        "wikidata_qid": "Q1809086",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1809086",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/house-en-cc/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "provenance_note": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "sitting_only",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Ontario says all broadcasts have real-time captioning, and its accessibility plan says streamed House, committee, and media-studio proceedings include simultaneous interpretation in English and French plus closed captioning. Standing Order evidence says sign-language interpretation may appear onscreen if approved by the House."
      },
      "epg_sources": [
        {
          "scraper": "ontario-calendar",
          "url": "https://www.ola.org/en/legislative-business/calendar",
          "method": "GET",
          "kind": "calendar_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "noncommercial_pending_review",
        "summary": "Ontario terms permit reasonable, fair, non-commercial display, reproduction, and use of excerpts from Assembly electronic channels with credit. Media guidance expects accredited media to use the Assembly broadcast feed, but full live-stream relay by an independent public app is not expressly documented as permitted.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/get-involved/watch-legislature-action",
          "https://www.ola.org/en/office-assembly/copyright-privacy",
          "https://www.ola.org/en/office-assembly/accessibility/2024-2027-plan",
          "https://www.ola.org/en/office-assembly/offices-divisions-branches/legislative-protective-service/who-we-are/media-filming-guidelines"
        ],
        "recommendation": "Keep direct playback cautious and non-commercial with Assembly credit; seek written clarification before treating full live-stream reuse as broadly permitted."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:47Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "HTTP 404"
        },
        {
          "checked_at": "2026-08-15T18:28:08Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 404"
        },
        {
          "checked_at": "2026-08-15T18:27:36Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 404"
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "ontario-rm151-en",
      "name": "Ontario Legislative Assembly - Room 151",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "external_ids": {
        "wikidata_qid": "Q1809086",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1809086",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/rm151-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "provenance_note": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Ontario says all broadcasts have real-time captioning, and its accessibility plan says streamed House, committee, and media-studio proceedings include simultaneous interpretation in English and French plus closed captioning. Standing Order evidence says sign-language interpretation may appear onscreen if approved by the House."
      },
      "epg_sources": [
        {
          "scraper": "ontario-calendar",
          "url": "https://www.ola.org/en/legislative-business/calendar",
          "method": "GET",
          "kind": "calendar_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "noncommercial_pending_review",
        "summary": "Ontario terms permit reasonable, fair, non-commercial display, reproduction, and use of excerpts from Assembly electronic channels with credit. Media guidance expects accredited media to use the Assembly broadcast feed, but full live-stream relay by an independent public app is not expressly documented as permitted.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/get-involved/watch-legislature-action",
          "https://www.ola.org/en/office-assembly/copyright-privacy",
          "https://www.ola.org/en/office-assembly/accessibility/2024-2027-plan",
          "https://www.ola.org/en/office-assembly/offices-divisions-branches/legislative-protective-service/who-we-are/media-filming-guidelines"
        ],
        "recommendation": "Keep direct playback cautious and non-commercial with Assembly credit; seek written clarification before treating full live-stream reuse as broadly permitted."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:47Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "Remote end closed connection without response"
        },
        {
          "checked_at": "2026-08-15T18:27:36Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:38Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "ontario-committee-1-en",
      "name": "Ontario Legislative Assembly - Committee 1",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "external_ids": {
        "wikidata_qid": "Q1809086",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1809086",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/committee_1-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "provenance_note": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Ontario says all broadcasts have real-time captioning, and its accessibility plan says streamed House, committee, and media-studio proceedings include simultaneous interpretation in English and French plus closed captioning. Standing Order evidence says sign-language interpretation may appear onscreen if approved by the House."
      },
      "epg_sources": [
        {
          "scraper": "ontario-calendar",
          "url": "https://www.ola.org/en/legislative-business/calendar",
          "method": "GET",
          "kind": "calendar_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "noncommercial_pending_review",
        "summary": "Ontario terms permit reasonable, fair, non-commercial display, reproduction, and use of excerpts from Assembly electronic channels with credit. Media guidance expects accredited media to use the Assembly broadcast feed, but full live-stream relay by an independent public app is not expressly documented as permitted.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/get-involved/watch-legislature-action",
          "https://www.ola.org/en/office-assembly/copyright-privacy",
          "https://www.ola.org/en/office-assembly/accessibility/2024-2027-plan",
          "https://www.ola.org/en/office-assembly/offices-divisions-branches/legislative-protective-service/who-we-are/media-filming-guidelines"
        ],
        "recommendation": "Keep direct playback cautious and non-commercial with Assembly credit; seek written clarification before treating full live-stream reuse as broadly permitted."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:49Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "Remote end closed connection without response"
        },
        {
          "checked_at": "2026-08-15T18:27:37Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:38Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "ontario-committee-2-en",
      "name": "Ontario Legislative Assembly - Committee 2",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "external_ids": {
        "wikidata_qid": "Q1809086",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1809086",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/committee_2-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "provenance_note": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Ontario says all broadcasts have real-time captioning, and its accessibility plan says streamed House, committee, and media-studio proceedings include simultaneous interpretation in English and French plus closed captioning. Standing Order evidence says sign-language interpretation may appear onscreen if approved by the House."
      },
      "epg_sources": [
        {
          "scraper": "ontario-calendar",
          "url": "https://www.ola.org/en/legislative-business/calendar",
          "method": "GET",
          "kind": "calendar_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "noncommercial_pending_review",
        "summary": "Ontario terms permit reasonable, fair, non-commercial display, reproduction, and use of excerpts from Assembly electronic channels with credit. Media guidance expects accredited media to use the Assembly broadcast feed, but full live-stream relay by an independent public app is not expressly documented as permitted.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/get-involved/watch-legislature-action",
          "https://www.ola.org/en/office-assembly/copyright-privacy",
          "https://www.ola.org/en/office-assembly/accessibility/2024-2027-plan",
          "https://www.ola.org/en/office-assembly/offices-divisions-branches/legislative-protective-service/who-we-are/media-filming-guidelines"
        ],
        "recommendation": "Keep direct playback cautious and non-commercial with Assembly credit; seek written clarification before treating full live-stream reuse as broadly permitted."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:51Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "Remote end closed connection without response"
        },
        {
          "checked_at": "2026-08-15T18:27:37Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "Response did not start with #EXTM3U."
        },
        {
          "checked_at": "2026-08-14T21:29:38Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "ontario-media-en",
      "name": "Ontario Legislative Assembly - Media Studio",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "external_ids": {
        "wikidata_qid": "Q1809086",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1809086",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/media-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "provenance_note": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Ontario says all broadcasts have real-time captioning, and its accessibility plan says streamed House, committee, and media-studio proceedings include simultaneous interpretation in English and French plus closed captioning. Standing Order evidence says sign-language interpretation may appear onscreen if approved by the House."
      },
      "epg_sources": [
        {
          "scraper": "ontario-calendar",
          "url": "https://www.ola.org/en/legislative-business/calendar",
          "method": "GET",
          "kind": "calendar_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "noncommercial_pending_review",
        "summary": "Ontario terms permit reasonable, fair, non-commercial display, reproduction, and use of excerpts from Assembly electronic channels with credit. Media guidance expects accredited media to use the Assembly broadcast feed, but full live-stream relay by an independent public app is not expressly documented as permitted.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/get-involved/watch-legislature-action",
          "https://www.ola.org/en/office-assembly/copyright-privacy",
          "https://www.ola.org/en/office-assembly/accessibility/2024-2027-plan",
          "https://www.ola.org/en/office-assembly/offices-divisions-branches/legislative-protective-service/who-we-are/media-filming-guidelines"
        ],
        "recommendation": "Keep direct playback cautious and non-commercial with Assembly credit; seek written clarification before treating full live-stream reuse as broadly permitted."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:53Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "Remote end closed connection without response"
        },
        {
          "checked_at": "2026-08-15T18:27:37Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:38Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "nunavut-legislative-assembly-tv",
      "name": "Nunavut Legislative Assembly TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Nunavut",
      "legislature": "Legislative Assembly of Nunavut",
      "external_ids": {
        "wikidata_qid": "Q2867082",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q2867082",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English / Inuktitut",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "http://temp2.isilive.ca/live/nunavut/live-eng/index.m3u8",
      "official_url": "https://www.assembly.nu.ca/webcasts",
      "provenance_note": "Official-vendor iSi LIVE HLS for the Legislative Assembly of Nunavut webcast service.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.assembly.nu.ca/webcasts?page=1",
          "method": "GET",
          "kind": "webcast_archive_and_live_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "The direct iSi LIVE HLS URL returned HTTP 200 with an HLS manifest and permissive CORS on 2026-08-14. Official Assembly pages document live and archived webcasts, but explicit third-party native playback or redistribution permission has not been recorded.",
        "evidence": [
          "https://www.assembly.nu.ca/webcasts",
          "https://video.isilive.ca/nunavut/live-eng.html"
        ],
        "recommendation": "Keep native playback permission-pending and seek written clarification before treating the HLS endpoint as redistributable."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:38Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 404"
        },
        {
          "checked_at": "2026-08-14T21:29:39Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-07-29T15:29:23Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "uk-parliament-youtube",
      "name": "UK Parliament YouTube",
      "jurisdiction_level": "national",
      "country_or_region": "United Kingdom",
      "legislature": "UK Parliament",
      "external_ids": {
        "wikidata_qid": "Q11010",
        "ipu_country_code": "GB",
        "ipu_parliament_code": "GB",
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q11010",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/GB/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "English",
      "source_type": "youtube",
      "source_kind": "official_youtube_embed",
      "playback_url": null,
      "embed": {
        "provider": "youtube",
        "kind": "uploads_playlist",
        "content_id": "UUMasyWuE1P2AaEKw_FkGq9g",
        "url": "https://www.youtube-nocookie.com/embed?listType=playlist&list=UUMasyWuE1P2AaEKw_FkGq9g",
        "live_url": "https://www.youtube.com/channel/UCMasyWuE1P2AaEKw_FkGq9g/live",
        "notes": "Permanent official uploads playlist. It starts with the latest published video and may show an active broadcast when YouTube places it first; it is not a guaranteed live-only feed."
      },
      "official_url": "https://www.youtube.com/channel/UCMasyWuE1P2AaEKw_FkGq9g/live",
      "provenance_note": "Official UK Parliament YouTube uploads playlist with selected live events and recordings.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "uk-parliament",
          "url": "https://whatson-api.parliament.uk/calendar/events/list.json",
          "method": "GET",
          "kind": "whatson_calendar_events_api",
          "scraper_status": "implemented"
        },
        {
          "scraper": "youtube-live",
          "url": "https://www.youtube.com/channel/UCMasyWuE1P2AaEKw_FkGq9g/live",
          "method": "GET",
          "kind": "official_youtube_live_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "embed_only",
        "summary": "Playback uses YouTube's official privacy-enhanced playlist embed; this catalogue does not extract YouTube manifests.",
        "evidence": [
          "https://www.youtube.com/UKParliament",
          "https://support.google.com/youtube/answer/171780"
        ],
        "recommendation": "Use the official YouTube embed or channel link only. The permanent playlist is not guaranteed to select a live event."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:38Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:39Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-07-29T15:29:23Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "provider_embed"
    },
    {
      "id": "australia-parliament-youtube",
      "name": "Australia Parliament Live",
      "jurisdiction_level": "national",
      "country_or_region": "Australia",
      "legislature": "Parliament of Australia",
      "external_ids": {
        "wikidata_qid": "Q382118",
        "ipu_country_code": "AU",
        "ipu_parliament_code": "AU",
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q382118",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/AU/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "English",
      "source_type": "youtube",
      "source_kind": "official_youtube_embed",
      "playback_url": null,
      "embed": {
        "provider": "youtube",
        "kind": "uploads_playlist",
        "content_id": "UUzx6ti0rql6Q2Dc2zSAPmuA",
        "url": "https://www.youtube-nocookie.com/embed?listType=playlist&list=UUzx6ti0rql6Q2Dc2zSAPmuA",
        "live_url": "https://www.youtube.com/@AUSParliamentLive/live",
        "notes": "Permanent official uploads playlist. It starts with the latest published video and may show an active broadcast when YouTube places it first; use the live-page link to check the current or next scheduled event."
      },
      "official_url": "https://www.youtube.com/@AUSParliamentLive/live",
      "provenance_note": "Official Australian Parliament House Streaming Portal uploads playlist.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "youtube-live",
          "url": "https://www.youtube.com/@AUSParliamentLive/live",
          "method": "GET",
          "kind": "official_youtube_live_page",
          "scraper_status": "implemented"
        },
        {
          "scraper": "planned",
          "url": "https://www.aph.gov.au/News_and_Events/Watch_Parliament",
          "method": "GET",
          "kind": "broadcast_schedule_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "embed_only",
        "summary": "Playback uses YouTube's official privacy-enhanced playlist embed; this catalogue does not extract YouTube manifests.",
        "evidence": [
          "https://www.youtube.com/@AUSParliamentLive",
          "https://support.google.com/youtube/answer/171780"
        ],
        "recommendation": "Use the official YouTube embed or channel link only. Check the stable live page for the current or next scheduled event."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:38Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:39Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-07-29T15:29:23Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "provider_embed"
    },
    {
      "id": "taiwan-parliamentary-tv",
      "name": "Taiwan Parliamentary TV",
      "jurisdiction_level": "national",
      "country_or_region": "Taiwan",
      "legislature": "Legislative Yuan",
      "external_ids": {
        "wikidata_qid": "Q715869",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q715869",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Mandarin",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.parliamentarytv.org.tw/",
      "provenance_note": "Live portal with channels and meeting playlists.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [],
      "permission": {
        "status": "embed_only",
        "summary": "Current catalogue treats this as an official-page/link-out source; terms are not yet reviewed.",
        "evidence": [
          "https://www.parliamentarytv.org.tw/"
        ],
        "recommendation": "Keep link-out only pending terms review."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:39Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:39Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-07-29T15:29:24Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "germany-bundestag-1",
      "name": "Germany Bundestag 1",
      "jurisdiction_level": "national",
      "country_or_region": "Germany",
      "legislature": "Deutscher Bundestag",
      "external_ids": {
        "wikidata_qid": "Q154797",
        "ipu_country_code": "DE",
        "ipu_parliament_code": "DE",
        "ipu_chamber_code": "DE-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q154797",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/DE/DE-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "German",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://cldf-hlsgw.r53.cdn.tv1.eu/1000153copo/hk1.m3u8",
      "official_url": "https://www.bundestag.de/mediathek",
      "provenance_note": "Bundestag Parlamentsfernsehen channel 1 HLS candidate validated during democracy-tier refresh.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.bundestag.de/mediathek",
          "method": "GET",
          "kind": "mediathek_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "Bundestag terms permit archive downloads and embeds subject to conditions, and offer a live signal to third parties on request. The catalogued browser-discovered HLS endpoint is not documented as that requested live-signal route.",
        "evidence": [
          "https://www.bundestag.de/mediathek",
          "https://www.bundestag.de/resource/blob/296016/nutzungsbedingungen_de.pdf",
          "https://cldf-hlsgw.r53.cdn.tv1.eu/1000153copo/hk1.m3u8"
        ],
        "recommendation": "Use an official Bundestag embed or link out. Do not enable third-party playback of this raw HLS endpoint unless the Bundestag supplies or approves the documented live-signal route."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:40Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        },
        {
          "checked_at": "2026-08-14T21:29:40Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "costa-rica-assembly-youtube",
      "name": "Costa Rica Assembly YouTube",
      "jurisdiction_level": "national",
      "country_or_region": "Costa Rica",
      "legislature": "Asamblea Legislativa",
      "external_ids": {
        "wikidata_qid": "Q1386962",
        "ipu_country_code": "CR",
        "ipu_parliament_code": "CR",
        "ipu_chamber_code": "CR-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1386962",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/CR/CR-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "youtube",
      "source_kind": "official_youtube_embed",
      "playback_url": null,
      "embed": {
        "provider": "youtube",
        "kind": "uploads_playlist",
        "content_id": "UUWN0rIWneMdqRmZ4yHs5GuA",
        "url": "https://www.youtube-nocookie.com/embed?listType=playlist&list=UUWN0rIWneMdqRmZ4yHs5GuA",
        "live_url": "https://www.youtube.com/@AsambleaCRC/live",
        "notes": "Permanent official uploads playlist. It starts with the latest published video and may show an active broadcast when YouTube places it first; use the live-page link to check the current or next scheduled event."
      },
      "official_url": "https://www.youtube.com/@AsambleaCRC/live",
      "provenance_note": "Official Asamblea Legislativa uploads playlist with live and recorded proceedings.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "youtube-live",
          "url": "https://www.youtube.com/@AsambleaCRC/live",
          "method": "GET",
          "kind": "official_youtube_live_page",
          "scraper_status": "implemented"
        },
        {
          "scraper": "planned",
          "url": "https://www.asamblea.go.cr/p/SitePages/Transmisi%C3%B3n%20en%20vivo.aspx",
          "method": "GET",
          "kind": "live_transmission_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "embed_only",
        "summary": "Playback uses YouTube's official privacy-enhanced playlist embed; this catalogue does not extract YouTube manifests.",
        "evidence": [
          "https://www.youtube.com/@AsambleaCRC",
          "https://support.google.com/youtube/answer/171780"
        ],
        "recommendation": "Use the official YouTube embed or channel link only. Check the stable live page for the current or next scheduled event."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:41Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:42Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-07-29T15:29:25Z",
          "report_path": "reports/health/2026-07-29-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "provider_embed"
    },
    {
      "id": "el-salvador-legislative-assembly",
      "name": "El Salvador Legislative Assembly",
      "jurisdiction_level": "national",
      "country_or_region": "El Salvador",
      "legislature": "Asamblea Legislativa de El Salvador",
      "external_ids": {
        "wikidata_qid": "Q1812873",
        "ipu_country_code": "SV",
        "ipu_parliament_code": "SV",
        "ipu_chamber_code": "SV-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1812873",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/SV/SV-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "first_party_hls",
      "playback_url": "https://streaming.asamblea.gob.sv/hls/plenariahd.m3u8",
      "official_url": "https://www.asamblea.gob.sv/",
      "provenance_note": "Official Asamblea Legislativa domain hosts this plenary HLS manifest.",
      "technical_status": "needs_review",
      "stability_risk": "high",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.asamblea.gob.sv/",
          "method": "GET",
          "kind": "official_site_schedule_target",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "The HLS manifest is hosted on the official Asamblea Legislativa domain, but standard TLS verification failed in the 2026-08-14 Python healthcheck; no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.asamblea.gob.sv/",
          "https://streaming.asamblea.gob.sv/hls/plenariahd.m3u8"
        ],
        "recommendation": "Link out or keep as pending until TLS behavior and terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:55Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1010)>"
        },
        {
          "checked_at": "2026-08-15T18:28:08Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "error",
          "note": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1010)>"
        },
        {
          "checked_at": "2026-08-15T18:27:42Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "error",
          "note": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1010)>"
        }
      ],
      "playback_policy": "research_only"
    },
    {
      "id": "european-parliament-multimedia-centre",
      "name": "European Parliament Multimedia Centre",
      "jurisdiction_level": "supranational",
      "country_or_region": "European Union",
      "legislature": "European Parliament",
      "external_ids": {
        "wikidata_qid": "Q8889",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q8889",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Multilingual",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://multimedia.europarl.europa.eu/en/webstreaming",
      "provenance_note": "Official European Parliament Multimedia Centre webstreaming page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "europarl-webstreaming",
          "url": "https://multimedia.europarl.europa.eu/en/webstreaming",
          "method": "GET",
          "kind": "webstreaming_schedule_page",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "European Parliament pages describe live streaming, embed support, downloads, and reuse of Multimedia Centre material free of charge with acknowledgement of the European Union / EP source. No stable raw HLS URL was validated in the August 2026 passes.",
        "evidence": [
          "https://www.europarl.europa.eu/website/multimedia-centre/en/webstreaming.html",
          "https://www.europarl.europa.eu/news/en/media-services/multimedia-centre",
          "https://multimedia.europarl.europa.eu/en/webstreaming"
        ],
        "recommendation": "Use official links/embeds and preserve required EU/EP attribution; do not treat dynamic player manifests as stable channels until documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:43Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:43Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "council-of-eu-live",
      "name": "Council of the European Union Live",
      "jurisdiction_level": "supranational",
      "country_or_region": "European Union",
      "legislature": "Council of the European Union",
      "external_ids": {
        "wikidata_qid": "Q8896",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q8896",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Multilingual",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://video.consilium.europa.eu/home/en",
      "provenance_note": "Official Council live page for public Council sessions and related events.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://video.consilium.europa.eu/home/en",
          "method": "GET",
          "kind": "council_live_schedule_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Council copyright rules authorize reproduction of Council website content, including editorial broadcasts and webcasts, when the source is acknowledged, the original meaning is not distorted, changes are indicated, and third-party or specially restricted material is separately cleared.",
        "evidence": [
          "https://video.consilium.europa.eu/home/en",
          "https://www.consilium.europa.eu/en/about-site/copyright/"
        ],
        "recommendation": "Use official Council links or embeds with European Union/Council attribution. Do not extract unsupported direct streams, distort context, or reuse third-party/specially restricted material without permission."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:43Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:43Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "eu-audiovisual-ebs",
      "name": "EU Audiovisual Service / EBS",
      "jurisdiction_level": "supranational",
      "country_or_region": "European Union",
      "legislature": "European Union institutions",
      "external_ids": {
        "wikidata_qid": "Q458",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q458",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Multilingual",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://audiovisual.ec.europa.eu/en",
      "provenance_note": "Official European Union Audiovisual Service / Europe by Satellite page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "ebs-grid",
          "url": "https://audiovisual.ec.europa.eu/en/ebs/grid",
          "method": "GET",
          "kind": "ebs_schedule_grid",
          "scraper_status": "implemented"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The EU Audiovisual Service/EBS FAQ says audiovisual material is offered free of charge for EU-related information and educational purposes, with item-specific copyright conditions and restrictions for some media.",
        "evidence": [
          "https://audiovisual.ec.europa.eu/en",
          "https://audiovisual.ec.europa.eu/en/ebs/grid",
          "https://audiovisual.ec.europa.eu/en/faq"
        ],
        "recommendation": "Use official AV Portal pages, schedules, downloads, or supported embeds for EU-related information/educational purposes, and check item-specific conditions before reuse. Do not treat EBS as a parliament-only channel or extract unsupported live manifests."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:44Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:44Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "un-web-tv",
      "name": "United Nations Web TV",
      "jurisdiction_level": "supranational",
      "country_or_region": "United Nations",
      "legislature": "United Nations bodies",
      "external_ids": {
        "wikidata_qid": "Q1065",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1065",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Multilingual",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://webtv.un.org/en/schedule",
      "provenance_note": "Official United Nations Web TV live schedule page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://webtv.un.org/en/schedule",
          "method": "GET",
          "kind": "live_schedule_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "UN Web TV copyright guidance says UN video/audio footage is not public domain and use requires UN authorization plus a licence agreement; UN website terms otherwise allow only personal, non-commercial copying without resale, redistribution, or derivative compilation, subject to specific restrictions.",
        "evidence": [
          "https://webtv.un.org/en/schedule",
          "https://webtv.un.org/en/copyright_use",
          "https://www.un.org/en/about-us/terms-of-use"
        ],
        "recommendation": "Link to official UN Web TV event pages or use documented event embed links where supplied by UN Web TV. Do not relay, download, redistribute, or treat UN video/audio footage as reusable without UN authorization."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:45Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:44Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "council-of-europe-pace-live",
      "name": "Council of Europe / PACE Live",
      "jurisdiction_level": "supranational",
      "country_or_region": "Council of Europe",
      "legislature": "Parliamentary Assembly of the Council of Europe",
      "external_ids": {
        "wikidata_qid": "Q939743",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q939743",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Multilingual",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.coe.int/en/web/portal/live",
      "provenance_note": "Official Council of Europe live webcast page carrying PACE and other Council of Europe sessions/events.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.coe.int/en/web/portal/live",
          "method": "GET",
          "kind": "live_webcast_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Council of Europe website permissions authorize some non-commercial website-material reproduction for private, informational, or educational use with source attribution, but audiovisual-material rights questions are directed to the Council of Europe audiovisual contacts. The audiovisual services page says PACE sessions are live-streamed and video files can be downloaded on request, so native playback or reuse still needs source-specific permission.",
        "evidence": [
          "https://www.coe.int/en/web/portal/live",
          "https://www.coe.int/en/web/portal/audiovisual-services1",
          "https://www.coe.int/en/web/portal/copyright-licensing-permissions",
          "https://pace.coe.int/en/sessions/livestream"
        ],
        "recommendation": "Keep as official link-out/watchlist pending audiovisual-specific permission or a documented embed route. Do not infer live-video reuse rights from general website text permissions."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-17T10:32:57Z",
          "report_path": "reports/health/2026-08-17-review-followup-static.json",
          "method": "review_followup",
          "status": "error",
          "note": "HTTP 403"
        },
        {
          "checked_at": "2026-08-15T18:28:09Z",
          "report_path": "reports/health/2026-08-15-review-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 403"
        },
        {
          "checked_at": "2026-08-15T18:27:45Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 403"
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "scottish-parliament-tv",
      "name": "Scottish Parliament TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Scotland",
      "legislature": "Scottish Parliament",
      "external_ids": {
        "wikidata_qid": "Q206171",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q206171",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English / Gaelic",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.scottishparliament.tv/",
      "provenance_note": "Official Scottish Parliament TV page with live and archived chamber and committee coverage, including accessible variants where scheduled.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "source_dependent",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Scottish Parliament TV documents caption controls on current meeting pages, live captions for Meeting of the Parliament accessible videos, on-demand captions for newer business video, and BSL-labelled accessible variants for selected proceedings. Audio-description coverage is not confirmed."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.scottishparliament.tv/",
          "method": "GET",
          "kind": "parliament_tv_schedule_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://www.parliament.scot/chamber-and-committees/whats-on-and-watch-live/whats-on/",
          "method": "GET",
          "kind": "parliamentary_business_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The Scottish Parliament Copyright Licence permits broad reuse with attribution, no implied endorsement, and restrictions on party-political and advertising uses. Separate Parliament TV clip guidance requires fair and accurate reporting and limits editing. The official site requires links to open in their normal form rather than within third-party frames.",
        "evidence": [
          "https://www.scottishparliament.tv/",
          "https://www.parliament.scot/about/copyright",
          "https://www.parliament.scot/about/how-parliament-works/policies/social-media-use-of-parliament-tv-clips",
          "https://www.parliament.scot/chamber-and-committees/whats-on-and-watch-live/whats-on/"
        ],
        "recommendation": "Link to Scottish Parliament TV and preserve attribution. Do not frame the official site or treat dynamic player manifests as a licensed direct stream."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "senedd-tv",
      "name": "Senedd TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Wales",
      "legislature": "Senedd Cymru / Welsh Parliament",
      "external_ids": {
        "wikidata_qid": "Q493517",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q493517",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Welsh / English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.senedd.tv/",
      "provenance_note": "Official Senedd TV page with live and archived public Plenary and committee proceedings.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Official Record evidence says BSL interpretation is provided for First Minister's Questions and for selected Plenary or committee proceedings when requested or content-dependent. Caption and audio-description coverage remains unconfirmed."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.senedd.tv/",
          "method": "GET",
          "kind": "senedd_tv_schedule_page",
          "scraper_status": "planned"
        },
        {
          "scraper": "planned",
          "url": "https://senedd.wales/calendar",
          "method": "GET",
          "kind": "parliamentary_meetings_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Senedd Commission copyright material may be reproduced with source and copyright acknowledgement, subject to accuracy, non-misleading use, and restrictions on commercial promotion and other prohibited contexts. Senedd TV clips may be shared or embedded under those terms, but Senedd web pages may not be framed by another site.",
        "evidence": [
          "https://www.senedd.tv/",
          "https://senedd.wales/commission/access-to-information/copyright/",
          "https://senedd.wales/media/images-and-video/",
          "https://senedd.wales/calendar"
        ],
        "recommendation": "Link to the official live page. Use only Senedd-provided clip sharing or embedding routes under the published terms; do not frame the official site or extract dynamic manifests."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "northern-ireland-assembly-tv",
      "name": "Northern Ireland Assembly TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Northern Ireland",
      "legislature": "Northern Ireland Assembly",
      "external_ids": {
        "wikidata_qid": "Q285714",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q285714",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English / Irish",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://niassembly.tv/",
      "provenance_note": "Official Northern Ireland Assembly TV page with scheduled Assembly and committee streams, archives, and language/accessibility variants.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "source_dependent",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Assembly evidence says YouTube streams and recordings offer auto-generated subtitles while niassembly.tv live subtitles are not yet available; BSL and ISL interpretation is provided for selected proceedings including Sign Language Bill coverage and some Question Time sessions. Audio-description coverage remains unconfirmed."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://niassembly.tv/calendar/",
          "method": "GET",
          "kind": "assembly_tv_live_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "Northern Ireland Assembly copyright guidance states that live and archive broadcasts of Assembly and committee proceedings may not be directly linked to, reproduced, copied, or downloaded without formal agreement. Its site also places specific restrictions on reuse of recorded interpretation.",
        "evidence": [
          "https://niassembly.tv/",
          "https://niassembly.tv/calendar/",
          "https://www.niassembly.gov.uk/about-the-assembly/corporate-information/copyright-guidelines/"
        ],
        "recommendation": "Link only to the Assembly TV home or calendar page. Do not embed, relay, directly link to a broadcast, or extract a player manifest without formal agreement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "osce-live",
      "name": "OSCE Live",
      "jurisdiction_level": "supranational",
      "country_or_region": "OSCE",
      "legislature": "Organization for Security and Co-operation in Europe",
      "external_ids": {
        "wikidata_qid": "Q81299",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q81299",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Multilingual",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.osce.org/live",
      "provenance_note": "Official OSCE live page for streamed events.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.osce.org/live",
          "method": "GET",
          "kind": "live_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "OSCE copyright policy says written OSCE content may be used freely only for personal or educational purposes with notice and credit; for other purposes, content may not be reproduced, copied, distributed, transmitted, broadcast, sold, licensed, or otherwise exploited without prior written permission. Linking is also described as subject to OSCE consent.",
        "evidence": [
          "https://www.osce.org/live",
          "https://www.osce.org/about/terms-of-use",
          "https://comms.osce.org/resources/copyright-information"
        ],
        "recommendation": "Keep OSCE as an official link-out/watchlist entry. Do not embed, relay, or reuse OSCE live video without written permission."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-15T18:27:45Z",
          "report_path": "reports/health/2026-08-15-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        },
        {
          "checked_at": "2026-08-14T21:29:44Z",
          "report_path": "reports/health/2026-08-14-catalogue-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "british-columbia-legislature-webcasts",
      "name": "British Columbia Legislature Webcasts",
      "jurisdiction_level": "subnational",
      "country_or_region": "British Columbia",
      "legislature": "Legislative Assembly of British Columbia",
      "external_ids": {
        "wikidata_qid": "Q1323479",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1323479",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.leg.bc.ca/index.php/parliamentary-business/broadcasts-and-webcasts",
      "provenance_note": "Official Legislative Assembly of British Columbia live and archived webcast page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "The Assembly documents AI-generated closed captions for televised and streamed proceedings and an ASL-focused webcast for Routine Business during sitting days. Audio-description coverage is not confirmed."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.leg.bc.ca/index.php/parliamentary-business/parliamentary-calendar",
          "method": "GET",
          "kind": "parliamentary_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The Speaker grants permission to replay webcast video of Legislature proceedings for schools and purposes such as private study, research, criticism, review, or newspaper summary. Broadcasters may use excerpts for fair and accurate news or public-affairs reports. Material may not be distorted or used for party-political advertising, election campaigns, or other partisan activity; other commercial use or rebroadcast requires express written approval.",
        "evidence": [
          "https://www.leg.bc.ca/index.php/parliamentary-business/broadcasts-and-webcasts",
          "https://www.leg.bc.ca/parliamentary-business/broadcasts-and-webcasts/guidelines-for-use-of-hansard-video"
        ],
        "recommendation": "Link to the official webcast page and preserve Assembly/Hansard attribution. Reuse only under the Speaker guidelines; avoid distortion, partisan use, commercial use, or rebroadcast without express approval."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "alberta-assembly-online",
      "name": "Alberta Assembly Online",
      "jurisdiction_level": "subnational",
      "country_or_region": "Alberta",
      "legislature": "Legislative Assembly of Alberta",
      "external_ids": {
        "wikidata_qid": "Q1812866",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1812866",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.assembly.ab.ca/assembly-business/watch-the-assembly",
      "provenance_note": "Official Legislative Assembly of Alberta live and archived proceedings page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The Assembly states that closed captioning is available on all Assembly and committee broadcasts and video streams."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.assembly.ab.ca/assembly-business/watch-the-assembly",
          "method": "GET",
          "kind": "watch_page_and_session_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Alberta permits personal and public non-commercial use of recorded excerpts if they are unaltered except for length, are not used in undignified, party-political, election, or advertising contexts, and preserve the distinction from official Hansard.",
        "evidence": [
          "https://www.assembly.ab.ca/terms-of-use-for-audio-and-video-recordings"
        ],
        "recommendation": "Link to Assembly Online. Reuse recordings only for non-commercial purposes under the published conditions."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "saskatchewan-legislative-proceedings",
      "name": "Saskatchewan Legislative Proceedings",
      "jurisdiction_level": "subnational",
      "country_or_region": "Saskatchewan",
      "legislature": "Legislative Assembly of Saskatchewan",
      "external_ids": {
        "wikidata_qid": "Q1537375",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1537375",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.legassembly.sk.ca/legislative-business/watch-legislative-proceedings/",
      "provenance_note": "Official Legislative Assembly of Saskatchewan live and archived proceedings page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The official proceedings page documents closed captions for live and archived video."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.legassembly.sk.ca/parliamentary-calendar",
          "method": "GET",
          "kind": "parliamentary_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "The official page documents live and archived Assembly proceedings, captioning, mobile playback, television availability, and television guidelines in the Assembly rules, but this pass did not locate terms expressly authorizing third-party playback, rebroadcast, or redistribution.",
        "evidence": [
          "https://www.legassembly.sk.ca/legislative-business/watch-legislative-proceedings/",
          "https://www.legassembly.sk.ca/about/rules/"
        ],
        "recommendation": "Link to the official proceedings page while third-party playback or redistribution permission remains undocumented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "manitoba-house-broadcasts",
      "name": "Manitoba House Broadcasts",
      "jurisdiction_level": "subnational",
      "country_or_region": "Manitoba",
      "legislature": "Legislative Assembly of Manitoba",
      "external_ids": {
        "wikidata_qid": "Q1517320",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1517320",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English / French",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.gov.mb.ca/legislature/business/house_broadcasts.html",
      "provenance_note": "Official Legislative Assembly of Manitoba House broadcast page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.gov.mb.ca/legislature/business/calendar.html",
          "method": "GET",
          "kind": "sessional_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The Legislative Assembly of Manitoba website copyright statement supports dissemination of website information and permits downloading, reproduction, display, or distribution of website material for non-commercial use only, with source acknowledgement, no alteration except for length, no undignified association, no implied Assembly endorsement, and no extension of parliamentary privilege to reproductions.",
        "evidence": [
          "https://www.gov.mb.ca/legislature/business/house_broadcasts.html",
          "https://www.gov.mb.ca/legislature/copyright.html"
        ],
        "recommendation": "Keep as official link-out and reuse only under the Assembly website copyright conditions: non-commercial use, Assembly source acknowledgement, no alteration except length, no undignified association, no implied endorsement, and no claim of parliamentary privilege for reproductions."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "prince-edward-island-assembly-live",
      "name": "Prince Edward Island Assembly Live",
      "jurisdiction_level": "subnational",
      "country_or_region": "Prince Edward Island",
      "legislature": "Legislative Assembly of Prince Edward Island",
      "external_ids": {
        "wikidata_qid": "Q825815",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q825815",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.assembly.pe.ca/watch-live",
      "provenance_note": "Official Legislative Assembly of Prince Edward Island live debates and committee page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.assembly.pe.ca/calendar",
          "method": "GET",
          "kind": "parliamentary_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The webcast page permits reproduction or rebroadcast only when the result is accurate, factual, complete, and does not editorialize, dramatize, or misrepresent the Assembly record. General copyright terms may add restrictions for commercial use.",
        "evidence": [
          "https://www.assembly.pe.ca/watch-live",
          "https://www.assembly.pe.ca/copyright"
        ],
        "recommendation": "Link to the official live page and follow the Assembly's accuracy, completeness, attribution, and non-commercial conditions for any reuse."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "northwest-territories-watch-session",
      "name": "Northwest Territories Watch Session",
      "jurisdiction_level": "subnational",
      "country_or_region": "Northwest Territories",
      "legislature": "Legislative Assembly of the Northwest Territories",
      "external_ids": {
        "wikidata_qid": "Q2867078",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q2867078",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Multiple official languages",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.ntlegislativeassembly.ca/legislative-business/watch-session",
      "provenance_note": "Official Northwest Territories Assembly live session and committee page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "Separate official-language YouTube routes are listed, subject to interpreter availability; caption and sign-language support remains unverified."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.ntlegislativeassembly.ca/committees",
          "method": "GET",
          "kind": "assembly_and_committee_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "The Assembly publishes House and committee proceedings in multiple official languages. Generic Government of the Northwest Territories terms allow non-commercial reproduction or redistribution with acknowledgement, but this review did not locate an Assembly-specific video reuse statement or explicit third-party playback terms.",
        "evidence": [
          "https://www.ntlegislativeassembly.ca/legislative-business/watch-session",
          "https://www.justice.gov.nt.ca/en/terms-of-use/page/2/"
        ],
        "recommendation": "Link to the official multilingual session page pending a source-specific rights statement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "newfoundland-labrador-house-webcast",
      "name": "Newfoundland and Labrador House Webcast",
      "jurisdiction_level": "subnational",
      "country_or_region": "Newfoundland and Labrador",
      "legislature": "Newfoundland and Labrador House of Assembly",
      "external_ids": {
        "wikidata_qid": "Q258843",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q258843",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.assembly.nl.ca/HouseBusiness/Webcast/",
      "provenance_note": "Official Newfoundland and Labrador House of Assembly webcast page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The official live page provides instructions for accessing closed captions."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.assembly.nl.ca/HouseBusiness/ParliamentaryCalendar.aspx",
          "method": "GET",
          "kind": "parliamentary_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Assembly terms permit attributed excerpts, citations, and rebroadcast for education, private study, research, criticism, review, and journalistic fair comment. Commercial use requires approval; political advertising, alteration beyond length, and undignified association are prohibited.",
        "evidence": [
          "https://www.assembly.nl.ca/CopyrightPrivacyStatement.aspx"
        ],
        "recommendation": "Link to the official webcast and follow the published attribution, purpose, editing, and non-commercial conditions for any reuse."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:05Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "new-south-wales-parliament-webcasts",
      "name": "New South Wales Parliament Webcasts",
      "jurisdiction_level": "subnational",
      "country_or_region": "New South Wales",
      "legislature": "Parliament of New South Wales",
      "external_ids": {
        "wikidata_qid": "Q3365521",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q3365521",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.parliament.nsw.gov.au/webcasts",
      "provenance_note": "Official Parliament of New South Wales chamber and committee webcast hub.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The webcast hub documents English live captions for chamber and committee proceedings."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.parliament.nsw.gov.au/parliamentary-business/sitting-day-calendar",
          "method": "GET",
          "kind": "webcast_and_daily_program_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "NSW Parliament permits fair and accurate reporting of broadcast excerpts but prohibits use for political advertising, election campaigns, satire or ridicule, and commercial sponsorship or advertising.",
        "evidence": [
          "https://www.parliament.nsw.gov.au/copyright",
          "https://www.parliament.nsw.gov.au/webcasts/lc-webcast"
        ],
        "recommendation": "Link to the official webcast hub and follow the Parliament's fair-reporting and prohibited-use conditions."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:06Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "victoria-parliament-watch",
      "name": "Victoria Parliament Watch",
      "jurisdiction_level": "subnational",
      "country_or_region": "Victoria",
      "legislature": "Parliament of Victoria",
      "external_ids": {
        "wikidata_qid": "Q1848835",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q1848835",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.parliament.vic.gov.au/watch/",
      "provenance_note": "Official Parliament of Victoria live and archived proceedings page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The Parliament documents live captions for both chambers."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.parliament.vic.gov.au/sittingcalendar",
          "method": "GET",
          "kind": "sitting_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Victorian parliamentary rules authorize fair, accurate, balanced broadcast use and prohibit satire, ridicule, commercial sponsorship or advertising, misleading context, and impermissible manipulation.",
        "evidence": [
          "https://www.parliament.vic.gov.au/watch/",
          "https://www.parliament.vic.gov.au/49c19e/contentassets/e8f90d0357454466a6cb966defccdca7/legislative-council-broadcasting-terms-and-conditions-29-april-2024-dated.pdf"
        ],
        "recommendation": "Link to the official watch page and follow the chamber-specific fair-reporting, context, editing, and non-commercial conditions."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:06Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "queensland-parliament-live",
      "name": "Queensland Parliament Live",
      "jurisdiction_level": "subnational",
      "country_or_region": "Queensland",
      "legislature": "Parliament of Queensland",
      "external_ids": {
        "wikidata_qid": "Q3365548",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q3365548",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.parliament.qld.gov.au/Work-of-the-Assembly/Live-and-Archived-Broadcasts/live",
      "provenance_note": "Official Queensland Parliament live chamber and committee broadcast page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The official live broadcast page documents closed captions."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.parliament.qld.gov.au/Work-of-the-Assembly/Sitting-Dates/Dates",
          "method": "GET",
          "kind": "sitting_dates",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Queensland authorizes further publication only as fair, accurate, balanced coverage and prohibits political advertising, election use, satire, ridicule, and commercial sponsorship or advertising.",
        "evidence": [
          "https://www.parliament.qld.gov.au/Work-of-the-Assembly/Live-and-Archived-Broadcasts/live"
        ],
        "recommendation": "Link to the official live page and follow the Parliament's fair-reporting, balance, context, and prohibited-use conditions."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:06Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 403"
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "western-australia-parliament-live",
      "name": "Western Australia Parliament Live",
      "jurisdiction_level": "subnational",
      "country_or_region": "Western Australia",
      "legislature": "Parliament of Western Australia",
      "external_ids": {
        "wikidata_qid": "Q3365500",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q3365500",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "English",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.parliament.wa.gov.au/watch/live/chamber/lh",
      "provenance_note": "Official Parliament of Western Australia Legislative Assembly live broadcast page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "en"
        ],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": "The official player provides closed-caption controls; captions are not the official record."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.parliament.wa.gov.au/parliament/sitting-dates",
          "method": "GET",
          "kind": "sitting_calendar",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "The page sets fair-reporting conditions for rebroadcasts but also expressly states that reproduction or distribution is prohibited. The explicit prohibition controls this catalogue's playback posture.",
        "evidence": [
          "https://www.parliament.wa.gov.au/watch/live/chamber/lh"
        ],
        "recommendation": "Link to the official live page only; do not relay, reproduce, or distribute the broadcast."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:06Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 403"
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "north-rhine-westphalia-landtag-live",
      "name": "North Rhine-Westphalia Landtag Live",
      "jurisdiction_level": "subnational",
      "country_or_region": "North Rhine-Westphalia",
      "legislature": "Landtag of North Rhine-Westphalia",
      "external_ids": {
        "wikidata_qid": "Q571436",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q571436",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "German",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.landtag.nrw.de/home/mediathek/aktuelle-und-kunftige-live-ubert.html",
      "provenance_note": "Official Landtag Nordrhein-Westfalen scheduled livestream page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "de"
        ],
        "sign_language": "available",
        "audio_description": "unknown",
        "notes": "Plenary listings provide an accessible stream with German Sign Language and subtitles."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.landtag.nrw.de/home/mediathek/aktuelle-und-kunftige-live-ubert.html",
          "method": "GET",
          "kind": "scheduled_livestreams",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "Landtag NRW terms state that video and audio sequences may not be used, including excerpts and still frames, without prior written permission; permitted use must credit the Landtag and avoid misleading alteration.",
        "evidence": [
          "https://www.landtag.nrw.de/home/mediathek/anmeldung-zum-livestream.html?id=1116333"
        ],
        "recommendation": "Link to the official livestream schedule only unless written permission is obtained."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:06Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "baden-wurttemberg-landtag-live",
      "name": "Baden-Wurttemberg Landtag Live",
      "jurisdiction_level": "subnational",
      "country_or_region": "Baden-Wurttemberg",
      "legislature": "Landtag of Baden-Württemberg",
      "external_ids": {
        "wikidata_qid": "Q455697",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q455697",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "German",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.landtag-bw.de/de/mediathek/landtag-live",
      "provenance_note": "Official Landtag of Baden-Württemberg four-channel live page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "de"
        ],
        "sign_language": "available",
        "audio_description": "unknown",
        "notes": "The accessible player combines original video, German Sign Language, and subtitles."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.landtag-bw.de/de/mediathek/landtag-live",
          "method": "GET",
          "kind": "livestream_and_sitting_schedule",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The Landtag permits downloaded recordings for political reporting and private or civic-education non-commercial use with source credit, limited editing, no misleading context, and no commercial advertising use.",
        "evidence": [
          "https://www.landtag-bw.de/de/mediathek/nutzungsbedingungen-fuer-die-mediathek"
        ],
        "recommendation": "Link to the official live page. Apply the published non-commercial, attribution, editing, and context conditions to downloaded recordings."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:06Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "error",
          "note": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1010)>"
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "bavaria-landtag-plenum-online",
      "name": "Bavaria Landtag Plenum Online",
      "jurisdiction_level": "subnational",
      "country_or_region": "Bavaria",
      "legislature": "Landtag of Bavaria",
      "external_ids": {
        "wikidata_qid": "Q641439",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q641439",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "German",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.bayern.landtag.de/aktuelles/plenum-online/",
      "provenance_note": "Official Bayerischer Landtag Plenum Online live and archive page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.bayern.landtag.de/aktuelles/sitzungen/",
          "method": "GET",
          "kind": "parliamentary_meetings",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "Bavarian Landtag livestream/archive guidance states that its video files are copyrighted and reproduction or use of the files, or parts of them, in other electronic or printed publications and publication online is permitted only with prior approval.",
        "evidence": [
          "https://www.bayern.landtag.de/aktuelles/plenum-online/",
          "https://www.bayern.landtag.de/aktuelles/sitzungen/livestreams/"
        ],
        "recommendation": "Link to the official Plenum Online/livestream pages only. Do not embed, republish, or relay Landtag video without prior approval."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:06Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "catalonia-canal-parlament",
      "name": "Catalonia Canal Parlament",
      "jurisdiction_level": "subnational",
      "country_or_region": "Catalonia",
      "legislature": "Parliament of Catalonia",
      "external_ids": {
        "wikidata_qid": "Q135630",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q135630",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Catalan / Spanish",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.parlament.cat/ext/f?p=700:1::::::",
      "provenance_note": "Official Parliament of Catalonia Canal Parlament live and on-demand service.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.parlament.cat/web/index.html",
          "method": "GET",
          "kind": "parliamentary_agenda",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "The Parliament describes Canal Parlament as its institutional signal for citizens and media. Its rules permit lawful reuse of parliamentary information when meaning is preserved and the source and update date are cited.",
        "evidence": [
          "https://www.parlament.cat/web/index.html",
          "https://www.parlament.cat/document/cataleg/165484.pdf"
        ],
        "recommendation": "Link to Canal Parlament and preserve source attribution, context, and the unaltered meaning of reused material."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:07Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "valencia-canal-corts",
      "name": "Valencia Canal Corts",
      "jurisdiction_level": "subnational",
      "country_or_region": "Valencia",
      "legislature": "Corts Valencianes",
      "external_ids": {
        "wikidata_qid": "Q2734573",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q2734573",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Valencian / Spanish",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://mediateca.cortsvalencianes.es/live",
      "provenance_note": "Official Corts Valencianes Canal Corts live and audiovisual archive service.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.cortsvalencianes.es/es/actividad/actualidad/agenda",
          "method": "GET",
          "kind": "parliamentary_agenda",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Corts Valencianes legal notice authorizes reproduction of text and multimedia elements belonging to Les Corts only for non-commercial purposes, provided integrity is preserved and the source is mentioned, subject to different conditions attached to specific data.",
        "evidence": [
          "https://mediateca.cortsvalencianes.es/live",
          "https://www.cortsvalencianes.es/es/aviso-legal"
        ],
        "recommendation": "Link to Canal Corts and allow only non-commercial, attributed, unmodified reuse where no item-specific restriction applies. Do not bypass technical protections or imply broader live-stream redistribution rights."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:07Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "andalusia-parliament-tv-live",
      "name": "Andalusia Parliament TV Live",
      "jurisdiction_level": "subnational",
      "country_or_region": "Andalusia",
      "legislature": "Parliament of Andalusia",
      "external_ids": {
        "wikidata_qid": "Q2743388",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q2743388",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Spanish",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://www.parlamentodeandalucia.es/webdinamica/portal-web-parlamento/actividadparlamentaria/parlamentoabierto/sesionesendirecto/programacion.do",
      "provenance_note": "Official Parliament of Andalusia live TV programming page.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.parlamentodeandalucia.es/webdinamica/portal-web-parlamento/actividadparlamentaria/agendasemanal.do",
          "method": "GET",
          "kind": "weekly_parliamentary_agenda",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "no_third_party_reuse",
        "summary": "Parliament of Andalusia web-use rules state that portal materials are protected by intellectual-property law; access does not grant a licence for reproduction or distribution, which is prohibited without prior express consent. The rules also require prior conformity for links to portal content and express authorization for use of information on other Internet sites.",
        "evidence": [
          "https://www.parlamentodeandalucia.es/webdinamica/portal-web-parlamento/actividadparlamentaria/parlamentoabierto/sesionesendirecto/programacion.do",
          "https://www.parlamentodeandalucia.es/normas-de-uso"
        ],
        "recommendation": "Link to the official live-programming page only. Do not embed, relay, reproduce, distribute, or reuse the stream without prior express consent from the Parliament."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:08Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "Official page/link reachable."
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "navarre-parliament-live",
      "name": "Navarre Parliament Live",
      "jurisdiction_level": "subnational",
      "country_or_region": "Navarre",
      "legislature": "Parliament of Navarre",
      "external_ids": {
        "wikidata_qid": "Q2742602",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q2742602",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Spanish / Basque",
      "source_type": "official_page",
      "source_kind": "official_page",
      "playback_url": null,
      "official_url": "https://parlamentodenavarra.es/es/pruebalive1.htm",
      "provenance_note": "Official Parliament of Navarre live and video-library service.",
      "technical_status": "link_only",
      "stability_risk": "unknown",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://parlamentodenavarra.es/es",
          "method": "GET",
          "kind": "parliamentary_calendar_and_live_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official documents describe a complete institutional signal supplied to media and the public for live streaming and on-demand consultation. Navarre parliamentary transparency rules support reuse of transparency-portal information with source/date and no distortion, but this review did not locate video-specific third-party playback or redistribution terms for the live service.",
        "evidence": [
          "https://parlamentodenavarra.es/sites/default/files/contenido-estatico-archivos/Anexo%20III%20soporte%20web.pdf",
          "https://parlamentodenavarra.es/es/pruebalive1.htm",
          "https://www.lexnavarra.navarra.es/detalle.asp?r=54698"
        ],
        "recommendation": "Link to the official live service pending a source-specific reuse statement."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:08Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "error",
          "note": "HTTP 403"
        }
      ],
      "playback_policy": "link_out"
    },
    {
      "id": "jalisco-canal-parlamento",
      "name": "Jalisco Canal Parlamento",
      "jurisdiction_level": "subnational",
      "country_or_region": "Jalisco",
      "legislature": "Congress of Jalisco",
      "external_ids": {
        "wikidata_qid": "Q5160874",
        "ipu_country_code": null,
        "ipu_parliament_code": null,
        "ipu_chamber_code": null
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q5160874",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature named by this catalogue entry; used for identity and discovery only."
        }
      ],
      "language": "Spanish",
      "source_type": "direct_hls",
      "source_kind": "official_vendor_hls",
      "playback_url": "https://60417ddeaf0d9.streamlock.net/srtc/smil:srtc.smil/playlist.m3u8",
      "official_url": "https://www.congresojal.gob.mx/trabajo/transmisiones_en_vivo",
      "provenance_note": "Official Congress of Jalisco live-transmissions page embeds the vendor player serving this HLS endpoint.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "unknown",
        "caption_languages": [],
        "sign_language": "unknown",
        "audio_description": "unknown",
        "notes": null
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.congresojal.gob.mx/agenda-parlamentaria/mes",
          "method": "GET",
          "kind": "parliamentary_agenda",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "The official Congress live page embeds the vendor player associated with the validated Canal Parlamento HLS. No explicit third-party playback or redistribution terms were located.",
        "evidence": [
          "https://www.congresojal.gob.mx/trabajo/transmisiones_en_vivo"
        ],
        "recommendation": "Allow client-side playback under the catalogue's opt-out policy with visible Congress attribution; remove or link out if the source requests it."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:08Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "warning",
          "note": "HLS master detected, but sample variant check failed."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "netherlands-tweede-kamer-aletta-jacobszaal",
      "name": "Netherlands Tweede Kamer Aletta Jacobszaal",
      "jurisdiction_level": "national",
      "country_or_region": "Netherlands",
      "legislature": "Tweede Kamer",
      "external_ids": {
        "wikidata_qid": "Q233262",
        "ipu_country_code": "NL",
        "ipu_parliament_code": "NL",
        "ipu_chamber_code": "NL-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q233262",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/NL/NL-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Dutch",
      "source_type": "direct_hls",
      "source_kind": "first_party_hls",
      "playback_url": "https://livestreaming.b67buv2.tweedekamer.nl/live/alettajacobszaal/index.m3u8?hd=1&keyframes=1&subtitles=live",
      "official_url": "https://www.tweedekamer.nl/vergaderingen/livedebat/aletta-jacobszaal",
      "provenance_note": "Official Tweede Kamer Aletta Jacobszaal live room stream.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "nl"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Tweede Kamer documents automatic live captions for all debates and manual live captions for Question Time and selected debates; Dutch Sign Language interpretation is available for Question Time through a separate linked stream, so sign-language coverage is source-dependent for committee-room feeds. Audio-description coverage is not confirmed."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.tweedekamer.nl/debat_en_vergadering/livedebatten",
          "method": "GET",
          "kind": "live_debates_and_agenda_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official-looking public HLS source, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.tweedekamer.nl/vergaderingen/livedebat/aletta-jacobszaal",
          "https://www.tweedekamer.nl/contact-en-bezoek/persinformatie/audiovisuele-vergaderbeelden-afnemen"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:08Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    },
    {
      "id": "netherlands-tweede-kamer-actualiteitenkanaal",
      "name": "Netherlands Tweede Kamer Actualiteitenkanaal",
      "jurisdiction_level": "national",
      "country_or_region": "Netherlands",
      "legislature": "Tweede Kamer",
      "external_ids": {
        "wikidata_qid": "Q233262",
        "ipu_country_code": "NL",
        "ipu_parliament_code": "NL",
        "ipu_chamber_code": "NL-LC01"
      },
      "identity_sources": [
        {
          "source": "wikidata",
          "url": "https://www.wikidata.org/wiki/Q233262",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the legislature or institution named by this catalogue entry; used for identity and discovery only."
        },
        {
          "source": "ipu_parline",
          "url": "https://data.ipu.org/parliament/NL/NL-LC01/",
          "checked_on": "2026-08-16",
          "confidence": "high",
          "notes": "Matched to the IPU Parline parliament or chamber identifier; used for institutional identity only."
        }
      ],
      "language": "Dutch",
      "source_type": "direct_hls",
      "source_kind": "first_party_hls",
      "playback_url": "https://livestreaming.b67buv2.tweedekamer.nl/live/evenementenkanaal/index.m3u8?hd=1&keyframes=1&subtitles=live",
      "official_url": "https://www.tweedekamer.nl/vergaderingen/livedebat/actualiteitenkanaal",
      "provenance_note": "Official Tweede Kamer Actualiteitenkanaal for occasional public broadcasts.",
      "technical_status": "validated",
      "stability_risk": "medium",
      "availability": "event_based",
      "accessibility": {
        "captions": "available",
        "caption_languages": [
          "nl"
        ],
        "sign_language": "source_dependent",
        "audio_description": "unknown",
        "notes": "Tweede Kamer documents automatic live captions for all debates and manual live captions for Question Time and selected debates; Dutch Sign Language interpretation is available for Question Time through a separate linked stream, so sign-language coverage is source-dependent for occasional-channel feeds. Audio-description coverage is not confirmed."
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://www.tweedekamer.nl/debat_en_vergadering/livedebatten",
          "method": "GET",
          "kind": "live_debates_and_agenda_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official-looking public HLS source, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.tweedekamer.nl/vergaderingen/livedebat/actualiteitenkanaal",
          "https://www.tweedekamer.nl/contact-en-bezoek/persinformatie/audiovisuele-vergaderbeelden-afnemen"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      },
      "validation_history": [
        {
          "checked_at": "2026-08-19T17:47:08Z",
          "report_path": "reports/health/2026-08-19-validation-gap-health.json",
          "method": "static_http",
          "status": "ok",
          "note": "HLS manifest detected."
        }
      ],
      "playback_policy": "native_playback"
    }
  ]
};
window.PARLIAMENT_STREAMS_FALLBACKS = {
  "schema_version": 1,
  "generated_on": "2026-08-19",
  "description": "Official event, player, broadcaster, and provider surfaces that can support catalogue link-out or embed fallbacks without claiming a stable direct parliamentary channel stream.",
  "fallbacks": [
    {
      "id": "canada-house-of-commons-parlvu-events",
      "related_channel_ids": [
        "canada-house-of-commons-parlvu"
      ],
      "label": "Canada House of Commons ParlVU events",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "House of Commons of Canada",
      "fallback_type": "official_event_platform",
      "official_url": "https://parlvu.parl.gc.ca/Harmony/en",
      "integration_mode": "planned_event_resolver",
      "playback_claim": "event_specific_research",
      "schedule_role": "schedule_source",
      "stability_risk": "high",
      "rights_status": "no_third_party_reuse",
      "evidence_urls": [
        "https://parlvu.parl.gc.ca/Harmony/en",
        "https://www.ourcommons.ca/en/important-notices"
      ],
      "notes": "Use the public Harmony landing-page scraper for upcoming metadata and link users to official event pages. Do not claim a stable channel feed or reuse event media without separate permission."
    },
    {
      "id": "canada-senate-senvu-events",
      "related_channel_ids": [
        "canada-senate-senvu"
      ],
      "label": "Canada Senate SenVu events",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "Senate of Canada",
      "fallback_type": "official_event_platform",
      "official_url": "https://senparlvu.parl.gc.ca/Harmony/",
      "integration_mode": "planned_event_resolver",
      "playback_claim": "event_specific_research",
      "schedule_role": "schedule_source",
      "stability_risk": "high",
      "rights_status": "no_third_party_reuse",
      "evidence_urls": [
        "https://senparlvu.parl.gc.ca/Harmony/",
        "https://sencanada.ca/en/important-notices/"
      ],
      "notes": "Use the public Harmony landing-page scraper for upcoming metadata and link users to official event pages. Do not claim a stable Senate channel feed or reuse event media without separate permission."
    },
    {
      "id": "canada-house-of-commons-parlvu-recordings",
      "related_channel_ids": [
        "canada-house-of-commons-parlvu"
      ],
      "label": "Canada House of Commons ParlVU recordings",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "House of Commons of Canada",
      "fallback_type": "official_archive",
      "official_url": "https://parlvu.parl.gc.ca/Harmony/en/View/EventListView/",
      "integration_mode": "link_out",
      "playback_claim": "event_specific_research",
      "schedule_role": "none",
      "stability_risk": "medium",
      "rights_status": "no_third_party_reuse",
      "evidence_urls": [
        "https://parlvu.parl.gc.ca/Harmony/en/View/EventListView/",
        "https://www.ourcommons.ca/en/important-notices"
      ],
      "notes": "Official Harmony recordings view for House and committee proceedings. Treat as archive link-out until archive event identifiers and reuse terms are documented well enough for metadata integration."
    },
    {
      "id": "canada-senate-senvu-recordings",
      "related_channel_ids": [
        "canada-senate-senvu"
      ],
      "label": "Canada Senate SenVu recordings",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "Senate of Canada",
      "fallback_type": "official_archive",
      "official_url": "https://senparlvu.parl.gc.ca/Harmony/en/View/EventListView/",
      "integration_mode": "link_out",
      "playback_claim": "event_specific_research",
      "schedule_role": "none",
      "stability_risk": "medium",
      "rights_status": "no_third_party_reuse",
      "evidence_urls": [
        "https://senparlvu.parl.gc.ca/Harmony/en/View/EventListView/",
        "https://sencanada.ca/en/intellectual-property/#permission"
      ],
      "notes": "Official Harmony recordings view for Senate proceedings and committee meetings. Treat as archive link-out until archive event identifiers and reuse terms are documented well enough for metadata integration."
    },
    {
      "id": "uk-parliament-youtube-live",
      "related_channel_ids": [
        "uk-parliament-youtube"
      ],
      "label": "UK Parliament YouTube live page",
      "jurisdiction_level": "national",
      "country_or_region": "United Kingdom",
      "legislature": "UK Parliament",
      "fallback_type": "official_youtube_live",
      "official_url": "https://www.youtube.com/channel/UCMasyWuE1P2AaEKw_FkGq9g/live",
      "integration_mode": "provider_embed",
      "playback_claim": "provider_managed_embed",
      "schedule_role": "now_next_possible",
      "stability_risk": "medium",
      "rights_status": "embed_only",
      "evidence_urls": [
        "https://www.youtube.com/channel/UCMasyWuE1P2AaEKw_FkGq9g/live",
        "https://whatson.parliament.uk/"
      ],
      "notes": "The catalogue can embed official YouTube surfaces through the provider, but the live page is not a one-to-one replacement for Parliamentlive.tv chambers and should remain a fallback."
    },
    {
      "id": "uk-parliamentlive-official-player",
      "related_channel_ids": [
        "uk-parliament-youtube"
      ],
      "label": "UK Parliamentlive.tv official player",
      "jurisdiction_level": "national",
      "country_or_region": "United Kingdom",
      "legislature": "UK Parliament",
      "fallback_type": "official_live_page",
      "official_url": "https://www.parliamentlive.tv/",
      "integration_mode": "link_out",
      "playback_claim": "unsupported_native_playback",
      "schedule_role": "now_next_possible",
      "stability_risk": "high",
      "rights_status": "no_third_party_reuse",
      "evidence_urls": [
        "https://www.parliamentlive.tv/",
        "https://whatson.parliament.uk/"
      ],
      "notes": "Keep as an official link-out fallback unless supported native playback or documented embedding terms are found. The separate What's on API is the better schedule source."
    },
    {
      "id": "australia-parliament-youtube-live",
      "related_channel_ids": [
        "australia-parliament-youtube"
      ],
      "label": "Australia Parliament YouTube live page",
      "jurisdiction_level": "national",
      "country_or_region": "Australia",
      "legislature": "Parliament of Australia",
      "fallback_type": "official_youtube_live",
      "official_url": "https://www.youtube.com/@AUSParliamentLive/live",
      "integration_mode": "provider_embed",
      "playback_claim": "provider_managed_embed",
      "schedule_role": "now_next_possible",
      "stability_risk": "medium",
      "rights_status": "embed_only",
      "evidence_urls": [
        "https://www.youtube.com/@AUSParliamentLive/live",
        "https://www.aph.gov.au/News_and_Events/Watch_Parliament"
      ],
      "notes": "The catalogue can embed official YouTube surfaces through the provider. The live-page resolver may improve current-event selection when YouTube exposes explicit watch metadata, but it does not extract or relay manifests."
    },
    {
      "id": "costa-rica-assembly-youtube-live",
      "related_channel_ids": [
        "costa-rica-assembly-youtube"
      ],
      "label": "Costa Rica Assembly YouTube live page",
      "jurisdiction_level": "national",
      "country_or_region": "Costa Rica",
      "legislature": "Asamblea Legislativa",
      "fallback_type": "official_youtube_live",
      "official_url": "https://www.youtube.com/@AsambleaCRC/live",
      "integration_mode": "provider_embed",
      "playback_claim": "provider_managed_embed",
      "schedule_role": "now_next_possible",
      "stability_risk": "medium",
      "rights_status": "embed_only",
      "evidence_urls": [
        "https://www.youtube.com/@AsambleaCRC/live",
        "https://www.asamblea.go.cr/p/SitePages/Transmisi%C3%B3n%20en%20vivo.aspx"
      ],
      "notes": "The catalogue can embed official YouTube surfaces through the provider. The live-page resolver may improve current-event selection when YouTube exposes explicit watch metadata, but it does not extract or relay manifests."
    },
    {
      "id": "us-cspan-congress",
      "related_channel_ids": [],
      "label": "C-SPAN Congress coverage",
      "jurisdiction_level": "national",
      "country_or_region": "United States",
      "legislature": "United States Congress",
      "fallback_type": "official_broadcaster",
      "official_url": "https://www.c-span.org/congress/",
      "integration_mode": "link_out",
      "playback_claim": "no_direct_stream_claim",
      "schedule_role": "now_next_possible",
      "stability_risk": "medium",
      "rights_status": "no_third_party_reuse",
      "evidence_urls": [
        "https://www.c-span.org/congress/",
        "https://www.c-span.org/about/copyrightsAndLicensing/"
      ],
      "notes": "Useful as a public official-broadcaster fallback and schedule/discovery surface, but not a direct open stream candidate without explicit reuse permission."
    },
    {
      "id": "us-house-live",
      "related_channel_ids": [],
      "label": "U.S. HouseLive official events",
      "jurisdiction_level": "national",
      "country_or_region": "United States",
      "legislature": "U.S. House of Representatives",
      "fallback_type": "official_event_platform",
      "official_url": "https://live.house.gov/",
      "integration_mode": "link_out",
      "playback_claim": "event_specific_research",
      "schedule_role": "now_next_possible",
      "stability_risk": "high",
      "rights_status": "personal_use_pending_review",
      "evidence_urls": [
        "https://live.house.gov/"
      ],
      "notes": "Treat event pages as research and link-out fallbacks until stable event identifiers, schedule semantics, and reuse terms are documented."
    }
  ]
};
