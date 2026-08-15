window.PARLIAMENT_STREAMS_CATALOGUE = {
  "schema_version": 2,
  "generated_from": "curated research and live endpoint validation",
  "generated_on": "2026-08-15",
  "description": "Public parliamentary stream and source catalogue maintained through research notes, official pages, and live endpoint validation.",
  "channels": [
    {
      "id": "cpac-ca",
      "name": "CPAC Canada",
      "jurisdiction_level": "national",
      "country_or_region": "Canada",
      "legislature": "Parliament of Canada",
      "language": "English / French",
      "source_type": "direct_hls",
      "playback_url": "https://cpac-ca-live.cdn.vustreams.com/groupa/live/f9809cea-1e07-47cd-a94d-2ddd3e1351db/live.isml/.m3u8",
      "official_url": "https://www.cpac.ca/en/",
      "attribution_text": "Official CPAC stream endpoint discovered from CPAC metadata.",
      "technical_status": "validated",
      "availability": "always_on",
      "program": {
        "current_event_title": "Live public affairs feed",
        "current_event_time": "Schedule integration pending",
        "next_event_title": "Daily schedule metadata",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "new-zealand-parliament",
      "name": "New Zealand Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "New Zealand",
      "legislature": "New Zealand Parliament",
      "language": "English",
      "source_type": "direct_hls",
      "playback_url": "https://ptvlive.kordia.net.nz/out/v1/daf20b9a9ec5449dadd734e50ce52b74/index.m3u8",
      "official_url": "https://www.parliament.nz/en/watch-parliament/",
      "attribution_text": "New Zealand Parliament TV. Attribute the source and link to the official Parliament TV terms.",
      "technical_status": "validated",
      "availability": "sitting_only",
      "program": {
        "current_event_title": "Parliament TV",
        "current_event_time": "Live during House sittings",
        "next_event_title": "Sitting calendar integration",
        "next_event_time": "Planned",
        "confidence": "high"
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
      }
    },
    {
      "id": "norway-stortinget",
      "name": "Norway Stortinget",
      "jurisdiction_level": "national",
      "country_or_region": "Norway",
      "legislature": "Stortinget",
      "language": "Norwegian",
      "source_type": "direct_hls",
      "playback_url": "https://httpcache1.dna.contentdelivery.net/90415-cachemn1/stortinget_n/stortingssalen_web/playlist_dvr_timeshift-0-43200.m3u8",
      "official_url": "https://www.stortinget.no/nett-tv",
      "attribution_text": "Official Stortinget Nett-TV page exposed this HLS manifest during browser validation.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Stortinget chamber stream",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "status": "personal_use_pending_review",
        "summary": "Stortinget documents a formal retransmission arrangement for Nett-TV that supplies a dedicated publication point and requires an agreement, attribution, non-commercial use, and reporting. That does not authorize use of the catalogued browser-discovered HLS manifest.",
        "evidence": [
          "https://www.stortinget.no/nett-tv",
          "https://httpcache1.dna.contentdelivery.net/90415-cachemn1/stortinget_n/stortingssalen_web/playlist_dvr_timeshift-0-43200.m3u8"
        ],
        "recommendation": "Link to Stortinget Nett-TV. Request Stortinget's dedicated publishing point and retransmission agreement before enabling third-party playback."
      }
    },
    {
      "id": "brazil-tv-camara",
      "name": "Brazil TV Camara",
      "jurisdiction_level": "national",
      "country_or_region": "Brazil",
      "legislature": "Camara dos Deputados",
      "language": "Portuguese",
      "source_type": "direct_hls",
      "playback_url": "https://stream3.camara.gov.br/tv1/manifest.m3u8",
      "official_url": "https://www.camara.leg.br/tv/",
      "attribution_text": "Official TV Camara stream; source attribution and watermark integrity matter.",
      "technical_status": "validated",
      "availability": "always_on",
      "program": {
        "current_event_title": "TV Camara live",
        "current_event_time": "Official live channel",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "high"
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
        "status": "personal_use_pending_review",
        "summary": "Camara portal terms allow reproduction of public portal information with source and author credit, but the terms do not clearly authorize third-party native playback of the catalogued TV Camara HLS endpoint. The same terms direct portal video use to YouTube terms where applicable.",
        "evidence": [
          "https://www.camara.leg.br/tv/",
          "https://www2.camara.leg.br/termo-de-uso-e-politica-de-privacidade"
        ],
        "recommendation": "Link to the official TV Camara page until TV Camara confirms that third-party native playback of this HLS endpoint is permitted."
      }
    },
    {
      "id": "ireland-oireachtas-tv",
      "name": "Ireland Oireachtas TV",
      "jurisdiction_level": "national",
      "country_or_region": "Ireland",
      "legislature": "Houses of the Oireachtas",
      "language": "English / Irish",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://www.oireachtas.ie/en/oireachtas-tv/",
      "attribution_text": "Official Oireachtas TV page with live channel, Dail, Seanad, and committee-room embed codes.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Oireachtas TV live and chamber/committee streams",
        "current_event_time": "Live around scheduled proceedings",
        "next_event_title": "Official TV guide and committee schedule",
        "next_event_time": "Research target",
        "confidence": "high"
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
      }
    },
    {
      "id": "denmark-folketinget",
      "name": "Denmark Folketinget",
      "jurisdiction_level": "national",
      "country_or_region": "Denmark",
      "legislature": "Folketinget",
      "language": "Danish",
      "source_type": "direct_hls",
      "playback_url": "https://cdnapi.kaltura.com/p/2158211/sp/327418300/playManifest/entryId/1_24gfa7qq/protocol/https/format/applehttp/a.m3u8",
      "official_url": "https://www.ft.dk/",
      "attribution_text": "Folketinget. Link to the Folketinget sharing and rights terms; do not use the Folketinget logo.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Folketinget live stream",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "explicit_reuse_with_conditions",
        "summary": "Folketinget grants a global, royalty-free, non-exclusive right to reproduce, disseminate, publicly show, and transmit its TV productions in all media and formats, including webcasts. Conditions include correct attribution, no modification except technically necessary changes, no endorsement, no use of parliamentary logos, and no access restrictions inconsistent with the source terms.",
        "evidence": [
          "https://www.ft.dk/da/aktuelt/tv-fra-folketinget/deling-og-rettigheder"
        ],
        "recommendation": "Native playback is permitted where the source is attributed and the public is linked to the Folketinget sharing and rights terms. Preserve the unmodified feed, do not use the logo, and do not imply endorsement."
      }
    },
    {
      "id": "netherlands-tweede-kamer",
      "name": "Netherlands Tweede Kamer",
      "jurisdiction_level": "national",
      "country_or_region": "Netherlands",
      "legislature": "Tweede Kamer",
      "language": "Dutch",
      "source_type": "direct_hls",
      "playback_url": "https://livestreaming.b67buv2.tweedekamer.nl/live/plenairezaal/index.m3u8?hd=1&keyframes=1&subtitles=live",
      "official_url": "https://www.tweedekamer.nl/debat_en_vergadering/livedebat",
      "attribution_text": "Official Tweede Kamer live room stream.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Plenary hall live stream",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official-looking public HLS source, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.tweedekamer.nl/debat_en_vergadering/livedebat"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "spain-canal-parlamento",
      "name": "Spain Canal Parlamento",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2037973/canalparlamento/master.m3u8",
      "official_url": "https://www.congreso.es/",
      "attribution_text": "Official Congreso/Canal Parlamento HLS candidate.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Canal Parlamento",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://www.congreso.es/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "spain-congreso-directo-1",
      "name": "Spain Congreso en Directo 1",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038274/canal1/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "attribution_text": "Official Congreso en Directo signal 1; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "Congreso en Directo signal 1",
        "current_event_time": "Active around scheduled plenary, committee, or institutional proceedings",
        "next_event_title": "Official weekly programming integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "spain-congreso-directo-2",
      "name": "Spain Congreso en Directo 2",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038275/canal2/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "attribution_text": "Official Congreso en Directo signal 2; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "Congreso en Directo signal 2",
        "current_event_time": "Active around scheduled plenary, committee, or institutional proceedings",
        "next_event_title": "Official weekly programming integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "spain-congreso-directo-3",
      "name": "Spain Congreso en Directo 3",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038276/canal3/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "attribution_text": "Official Congreso en Directo signal 3; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "Congreso en Directo signal 3",
        "current_event_time": "Active around scheduled plenary, committee, or institutional proceedings",
        "next_event_title": "Official weekly programming integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "spain-congreso-directo-4",
      "name": "Spain Congreso en Directo 4",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038277/canal4/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "attribution_text": "Official Congreso en Directo signal 4; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "Congreso en Directo signal 4",
        "current_event_time": "Active around scheduled plenary, committee, or institutional proceedings",
        "next_event_title": "Official weekly programming integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "spain-congreso-directo-5",
      "name": "Spain Congreso en Directo 5",
      "jurisdiction_level": "national",
      "country_or_region": "Spain",
      "legislature": "Congreso de los Diputados",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://congresodirecto.akamaized.net/hls/live/2038278/canal5/master.m3u8",
      "official_url": "https://www.congreso.es/es/web/guest/congreso-en-directo",
      "attribution_text": "Official Congreso en Directo signal 5; master HLS reached on 2026-07-29; sample variant check needs review.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "Congreso en Directo signal 5",
        "current_event_time": "Active around scheduled plenary, committee, or institutional proceedings",
        "next_event_title": "Official weekly programming integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "france-national-assembly",
      "name": "France National Assembly",
      "jurisdiction_level": "national",
      "country_or_region": "France",
      "legislature": "Assemblee nationale",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://assemblee-nationale.akamaized.net/live/live36/stream36.m3u8",
      "official_url": "https://videos.assemblee-nationale.fr/direct.php",
      "attribution_text": "Official National Assembly HLS candidate; July 2026 health check reached the URL but received a malformed/minimal manifest.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "National Assembly live stream",
        "current_event_time": "Active around public sittings and meetings",
        "next_event_title": "Official video portal schedule integration",
        "next_event_time": "Planned",
        "confidence": "low"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official video portal candidate without recorded reuse permission.",
        "evidence": [
          "https://videos.assemblee-nationale.fr/direct.php"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "chile-camara-tv",
      "name": "Chile Camara TV",
      "jurisdiction_level": "national",
      "country_or_region": "Chile",
      "legislature": "Camara de Diputadas y Diputados",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://tls-cl.cdnz.cl/streamdiptudadosa/live/playlist.m3u8",
      "official_url": "https://www.camara.cl/prensa/television.aspx",
      "attribution_text": "Official Camara television page exposed this HLS manifest during browser validation.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Camara TV live stream",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "israel-knesset-channel",
      "name": "Israel Knesset Channel",
      "jurisdiction_level": "national",
      "country_or_region": "Israel",
      "legislature": "Knesset",
      "language": "Hebrew",
      "source_type": "direct_hls",
      "playback_url": "https://kneset.gostreaming.tv/p2-kneset/_definst_/myStream/playlist.m3u8",
      "official_url": "https://www.knesset.tv/live/",
      "attribution_text": "Official Knesset Channel live page exposed this HLS manifest during browser validation.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Knesset Channel live stream",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "summary": "The official Knesset Channel live page exposed a public HLS manifest, but no sufficient documentary reuse evidence has been recorded.",
        "evidence": [
          "https://www.knesset.tv/live/",
          "https://kneset.gostreaming.tv/p2-kneset/_definst_/myStream/playlist.m3u8"
        ],
        "recommendation": "Link out or keep as pending until terms or permission are documented."
      }
    },
    {
      "id": "portugal-artv",
      "name": "Portugal ARTV Canal Parlamento",
      "jurisdiction_level": "national",
      "country_or_region": "Portugal",
      "legislature": "Assembleia da Republica",
      "language": "Portuguese",
      "source_type": "direct_hls",
      "playback_url": "https://playout172.livextend.cloud/liveiframe/_definst_/liveartvabr/playlist.m3u8",
      "official_url": "https://www.parlamento.pt/",
      "attribution_text": "Canal Parlamento HLS candidate; pair with official agenda metadata.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "ARTV Canal Parlamento",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official agenda integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://www.parlamento.pt/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "greece-hellenic-parliament-tv",
      "name": "Greece Hellenic Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "Greece",
      "legislature": "Hellenic Parliament",
      "language": "Greek",
      "source_type": "direct_hls",
      "playback_url": "https://ert-ucdn.broadpeak-aas.com/bpk-tv/VOULITV/default/index.m3u8",
      "official_url": "https://www.hellenicparliament.gr/",
      "attribution_text": "Hellenic Parliament TV HLS candidate distributed through public broadcaster infrastructure.",
      "technical_status": "validated",
      "availability": "always_on",
      "program": {
        "current_event_title": "Hellenic Parliament TV",
        "current_event_time": "Official parliamentary TV feed",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Public-broadcaster/official parliamentary TV HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://www.hellenicparliament.gr/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "luxembourg-chamber-tv",
      "name": "Luxembourg Chamber TV",
      "jurisdiction_level": "national",
      "country_or_region": "Luxembourg",
      "legislature": "Chambre des Deputes",
      "language": "French / Luxembourgish",
      "source_type": "direct_hls",
      "playback_url": "https://media02.webtvlive.eu/chd-edge/smil:chamber_tv_hd.smil/playlist.m3u8",
      "official_url": "https://www.chd.lu/",
      "attribution_text": "Chamber TV HLS candidate from official player infrastructure.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "Chamber TV",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official player HLS candidate without recorded reuse permission. The endpoint was not reachable from the 2026-08-14 validation environment.",
        "evidence": [
          "https://www.chd.lu/"
        ],
        "recommendation": "Link-out or pending until current availability and terms or permission are documented."
      }
    },
    {
      "id": "estonia-riigikogu-live-1",
      "name": "Estonia Riigikogu Live 1",
      "jurisdiction_level": "national",
      "country_or_region": "Estonia",
      "legislature": "Riigikogu",
      "language": "Estonian",
      "source_type": "direct_hls",
      "playback_url": "https://router.euddn.net/862366dd346d6b6392d5231546f3d179/smil:rk_live_1.smil/playlist.m3u8?c=8005",
      "official_url": "https://www.riigikogu.ee/live/1/en",
      "attribution_text": "Official Riigikogu live page exposes this HLS manifest through its player.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Riigikogu live stream 1",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "estonia-riigikogu-live-2",
      "name": "Estonia Riigikogu Live 2",
      "jurisdiction_level": "national",
      "country_or_region": "Estonia",
      "legislature": "Riigikogu",
      "language": "Estonian",
      "source_type": "direct_hls",
      "playback_url": "https://router.euddn.net/862366dd346d6b6392d5231546f3d179/smil:rk_live_2.smil/playlist.m3u8?c=8005",
      "official_url": "https://www.riigikogu.ee/live/2/en",
      "attribution_text": "Official Riigikogu live page exposes this HLS manifest through its player.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Riigikogu live stream 2",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "italy-senate",
      "name": "Italy Senate",
      "jurisdiction_level": "national",
      "country_or_region": "Italy",
      "legislature": "Senato della Repubblica",
      "language": "Italian",
      "source_type": "direct_hls",
      "playback_url": "https://senato-live.morescreens.com/SENATO_1_001/playlist.m3u8",
      "official_url": "https://webtv.senato.it/",
      "attribution_text": "Senate live HLS candidate; official source and terms need deeper review.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Senate live stream",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://webtv.senato.it/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "india-sansad-tv-1",
      "name": "India Sansad TV 1",
      "jurisdiction_level": "national",
      "country_or_region": "India",
      "legislature": "Parliament of India",
      "language": "Hindi / English",
      "source_type": "direct_hls",
      "playback_url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/fff8f20221d5456e8922e689d71dedc3/index.m3u8",
      "official_url": "https://sansadtv.nic.in/",
      "attribution_text": "Sansad TV HLS candidate; terms and reliability require review.",
      "technical_status": "validated",
      "availability": "always_on",
      "program": {
        "current_event_title": "Sansad TV feed 1",
        "current_event_time": "Official parliamentary television feed",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official-looking HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://sansadtv.nic.in/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "india-sansad-tv-2",
      "name": "India Sansad TV 2",
      "jurisdiction_level": "national",
      "country_or_region": "India",
      "legislature": "Parliament of India",
      "language": "Hindi / English",
      "source_type": "direct_hls",
      "playback_url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/e4182054dce340da9e0ff38b6b3658a4/index.m3u8",
      "official_url": "https://sansadtv.nic.in/",
      "attribution_text": "Sansad TV HLS candidate; terms and reliability require review.",
      "technical_status": "validated",
      "availability": "always_on",
      "program": {
        "current_event_title": "Sansad TV feed 2",
        "current_event_time": "Official parliamentary television feed",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official-looking HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://sansadtv.nic.in/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "thailand-parliament-tv",
      "name": "Thailand Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "Thailand",
      "legislature": "National Assembly of Thailand",
      "language": "Thai",
      "source_type": "direct_hls",
      "playback_url": "https://tv-live.tpchannel.org/live/tv.m3u8",
      "official_url": "https://tpchannel.org/",
      "attribution_text": "Thai Parliament TV HLS candidate; terms and reliability require review.",
      "technical_status": "validated",
      "availability": "always_on",
      "program": {
        "current_event_title": "Thai Parliament TV",
        "current_event_time": "Official parliamentary television feed",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official-looking HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://tpchannel.org/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "slovakia-tv-nrsr",
      "name": "Slovakia TV NRSR",
      "jurisdiction_level": "national",
      "country_or_region": "Slovakia",
      "legislature": "National Council of the Slovak Republic",
      "language": "Slovak",
      "source_type": "direct_hls",
      "playback_url": "https://n11.stv.livebox.sk/stv-tv/stv4.stream/playlist.m3u8",
      "official_url": "https://www.nrsr.sk/",
      "attribution_text": "Parliamentary/public-broadcaster HLS candidate; source ownership needs review.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "TV NRSR",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "low"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Parliamentary/public-broadcaster HLS candidate without recorded reuse permission.",
        "evidence": [
          "https://www.nrsr.sk/"
        ],
        "recommendation": "Link-out or pending until terms or permission are documented."
      }
    },
    {
      "id": "mongolia-parliament-tv",
      "name": "Mongolia Parliament TV",
      "jurisdiction_level": "national",
      "country_or_region": "Mongolia",
      "legislature": "State Great Khural",
      "language": "Mongolian",
      "source_type": "direct_dash",
      "playback_url": "https://cdn4.skygo.mn/live/disk1/Parlament/DASH-FTA/Parlament.mpd",
      "official_url": "https://www.parliament.mn/",
      "attribution_text": "SkyGo DASH distribution candidate for parliamentary television; ownership and terms need review.",
      "technical_status": "needs_review",
      "availability": "always_on",
      "program": {
        "current_event_title": "Parliament TV DASH stream",
        "current_event_time": "macOS playback experiment",
        "next_event_title": "Official source review",
        "next_event_time": "Planned",
        "confidence": "low"
      },
      "epg_sources": [],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "DASH experiment from public streaming infrastructure without recorded reuse permission.",
        "evidence": [
          "https://www.parliament.mn/"
        ],
        "recommendation": "Keep as research-only until source ownership and rights are clear."
      }
    },
    {
      "id": "quebec-canal01",
      "name": "Quebec National Assembly - Canal 01",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal01/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal02",
      "name": "Quebec National Assembly - Canal 02",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal02/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal03",
      "name": "Quebec National Assembly - Canal 03",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal03/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal04",
      "name": "Quebec National Assembly - Canal 04",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal04/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal05",
      "name": "Quebec National Assembly - Canal 05",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal05/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Recently active Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "quebec-canal06",
      "name": "Quebec National Assembly - Canal 06",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal06/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Recently active Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "quebec-canal07",
      "name": "Quebec National Assembly - Canal 07",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal07/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal08",
      "name": "Quebec National Assembly - Canal 08",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal08/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal09",
      "name": "Quebec National Assembly - Canal 09",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal09/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal10",
      "name": "Quebec National Assembly - Canal 10",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal10/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal11",
      "name": "Quebec National Assembly - Canal 11",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal11/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal12",
      "name": "Quebec National Assembly - Canal 12",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal12/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal13",
      "name": "Quebec National Assembly - Canal 13",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal13/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "low"
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
      }
    },
    {
      "id": "quebec-canal14",
      "name": "Quebec National Assembly - Canal 14",
      "jurisdiction_level": "subnational",
      "country_or_region": "Quebec",
      "legislature": "Assemblee nationale du Quebec",
      "language": "French",
      "source_type": "direct_hls",
      "playback_url": "https://cdn3.wowza.com/5/SVEySlNEQ0FOWXlS/diffusion/canal14/playlist.m3u8",
      "official_url": "https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html",
      "attribution_text": "Assemblée nationale du Québec. Official-vendor HLS from the Assembly live-list flow.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Recently active Assembly webcast channel",
        "current_event_time": "Active when proceedings are scheduled",
        "next_event_title": "Live-list API metadata",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "ontario-house-en",
      "name": "Ontario Legislative Assembly - House EN",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "language": "English",
      "source_type": "direct_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/house-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "attribution_text": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "availability": "sitting_only",
      "program": {
        "current_event_title": "House proceedings",
        "current_event_time": "Live during sittings or scheduled events",
        "next_event_title": "OLA calendar integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "summary": "Ontario terms permit reasonable, fair, non-commercial display/reproduction/use of excerpts with Assembly credit, but full live-stream relay is less clearly covered.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/office-assembly/copyright-privacy"
        ],
        "recommendation": "Use cautiously and seek written clarification for full live stream reuse."
      }
    },
    {
      "id": "ontario-house-en-cc",
      "name": "Ontario Legislative Assembly - House EN CC",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "language": "English",
      "source_type": "direct_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/house-en-cc/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "attribution_text": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "needs_review",
      "availability": "sitting_only",
      "program": {
        "current_event_title": "House proceedings with captions",
        "current_event_time": "Live during sittings or scheduled events",
        "next_event_title": "OLA calendar integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "summary": "The previous direct HLS endpoint returned HTTP 404 during 2026-08-14 validation; official source and current captioned playback route need review.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/office-assembly/copyright-privacy"
        ],
        "recommendation": "Keep as pending/review until a current source-supported captioned House stream is documented."
      }
    },
    {
      "id": "ontario-rm151-en",
      "name": "Ontario Legislative Assembly - Room 151",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "language": "English",
      "source_type": "direct_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/rm151-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "attribution_text": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Room 151 proceedings",
        "current_event_time": "Live during sittings or scheduled events",
        "next_event_title": "OLA calendar integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "summary": "Ontario terms permit reasonable, fair, non-commercial display/reproduction/use of excerpts with Assembly credit, but full live-stream relay is less clearly covered.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/office-assembly/copyright-privacy"
        ],
        "recommendation": "Use cautiously and seek written clarification for full live stream reuse."
      }
    },
    {
      "id": "ontario-committee-1-en",
      "name": "Ontario Legislative Assembly - Committee 1",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "language": "English",
      "source_type": "direct_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/committee_1-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "attribution_text": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Committee room 1",
        "current_event_time": "Live during sittings or scheduled events",
        "next_event_title": "OLA calendar integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "summary": "Ontario terms permit reasonable, fair, non-commercial display/reproduction/use of excerpts with Assembly credit, but full live-stream relay is less clearly covered.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/office-assembly/copyright-privacy"
        ],
        "recommendation": "Use cautiously and seek written clarification for full live stream reuse."
      }
    },
    {
      "id": "ontario-committee-2-en",
      "name": "Ontario Legislative Assembly - Committee 2",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "language": "English",
      "source_type": "direct_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/committee_2-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "attribution_text": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Committee room 2",
        "current_event_time": "Live during sittings or scheduled events",
        "next_event_title": "OLA calendar integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "summary": "Ontario terms permit reasonable, fair, non-commercial display/reproduction/use of excerpts with Assembly credit, but full live-stream relay is less clearly covered.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/office-assembly/copyright-privacy"
        ],
        "recommendation": "Use cautiously and seek written clarification for full live stream reuse."
      }
    },
    {
      "id": "ontario-media-en",
      "name": "Ontario Legislative Assembly - Media Studio",
      "jurisdiction_level": "subnational",
      "country_or_region": "Ontario",
      "legislature": "Legislative Assembly of Ontario",
      "language": "English",
      "source_type": "direct_hls",
      "playback_url": "https://origin-http-delivery.isilive.ca/live/_definst_/ontla/media-en/playlist.m3u8",
      "official_url": "https://www.ola.org/en/legislative-business/video",
      "attribution_text": "Official-vendor HLS for the Legislative Assembly video service.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Media studio feed",
        "current_event_time": "Live during sittings or scheduled events",
        "next_event_title": "OLA calendar integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "summary": "Ontario terms permit reasonable, fair, non-commercial display/reproduction/use of excerpts with Assembly credit, but full live-stream relay is less clearly covered.",
        "evidence": [
          "https://www.ola.org/en/legislative-business/video",
          "https://www.ola.org/en/office-assembly/copyright-privacy"
        ],
        "recommendation": "Use cautiously and seek written clarification for full live stream reuse."
      }
    },
    {
      "id": "nunavut-legislative-assembly-tv",
      "name": "Nunavut Legislative Assembly TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Nunavut",
      "legislature": "Legislative Assembly of Nunavut",
      "language": "English / Inuktitut",
      "source_type": "direct_hls",
      "playback_url": "http://temp2.isilive.ca/live/nunavut/live-eng/index.m3u8",
      "official_url": "https://www.assembly.nu.ca/webcasts",
      "attribution_text": "Official-vendor iSi LIVE HLS for the Legislative Assembly of Nunavut webcast service.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Nunavut Legislative Assembly webcast",
        "current_event_time": "Live during sittings",
        "next_event_title": "Official webcast archive and sitting calendar",
        "next_event_time": "Research target",
        "confidence": "medium"
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
      }
    },
    {
      "id": "uk-parliament-youtube",
      "name": "UK Parliament YouTube",
      "jurisdiction_level": "national",
      "country_or_region": "United Kingdom",
      "legislature": "UK Parliament",
      "language": "English",
      "source_type": "youtube",
      "playback_url": null,
      "official_url": "https://www.youtube.com/UKParliament",
      "attribution_text": "Selected live events and clips.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Channel page",
        "current_event_time": "Open for selected live streams",
        "next_event_title": "Schedule metadata",
        "next_event_time": "Planned",
        "confidence": "high"
      },
      "epg_sources": [],
      "permission": {
        "status": "embed_only",
        "summary": "Official YouTube channel is link-out only; this catalogue does not extract YouTube manifests.",
        "evidence": [
          "https://www.youtube.com/UKParliament"
        ],
        "recommendation": "Use official YouTube links or compliant embeds only."
      }
    },
    {
      "id": "australia-parliament-youtube",
      "name": "Australia Parliament Live",
      "jurisdiction_level": "national",
      "country_or_region": "Australia",
      "legislature": "Parliament of Australia",
      "language": "English",
      "source_type": "youtube",
      "playback_url": null,
      "official_url": "https://www.youtube.com/@AUSParliamentLive",
      "attribution_text": "Live events hosted outside the native player.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Channel page",
        "current_event_time": "Open for active streams",
        "next_event_title": "Schedule metadata",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "embed_only",
        "summary": "Official YouTube channel is link-out only; this catalogue does not extract YouTube manifests.",
        "evidence": [
          "https://www.youtube.com/@AUSParliamentLive"
        ],
        "recommendation": "Use official YouTube links or compliant embeds only."
      }
    },
    {
      "id": "taiwan-parliamentary-tv",
      "name": "Taiwan Parliamentary TV",
      "jurisdiction_level": "national",
      "country_or_region": "Taiwan",
      "legislature": "Legislative Yuan",
      "language": "Mandarin",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://www.parliamentarytv.org.tw/",
      "attribution_text": "Live portal with channels and meeting playlists.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Live portal",
        "current_event_time": "Open for active streams",
        "next_event_title": "Schedule metadata",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "embed_only",
        "summary": "Current catalogue treats this as an official-page/link-out source; terms are not yet reviewed.",
        "evidence": [
          "https://www.parliamentarytv.org.tw/"
        ],
        "recommendation": "Keep link-out only pending terms review."
      }
    },
    {
      "id": "germany-bundestag-1",
      "name": "Germany Bundestag 1",
      "jurisdiction_level": "national",
      "country_or_region": "Germany",
      "legislature": "Deutscher Bundestag",
      "language": "German",
      "source_type": "direct_hls",
      "playback_url": "https://cldf-hlsgw.r53.cdn.tv1.eu/1000153copo/hk1.m3u8",
      "official_url": "https://www.bundestag.de/mediathek",
      "attribution_text": "Bundestag Parlamentsfernsehen channel 1 HLS candidate validated during democracy-tier refresh.",
      "technical_status": "validated",
      "availability": "event_based",
      "program": {
        "current_event_title": "Bundestag Parlamentsfernsehen 1",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
        "status": "personal_use_pending_review",
        "summary": "Bundestag terms permit archive downloads and embeds subject to conditions, and offer a live signal to third parties on request. The catalogued browser-discovered HLS endpoint is not documented as that requested live-signal route.",
        "evidence": [
          "https://www.bundestag.de/mediathek",
          "https://cldf-hlsgw.r53.cdn.tv1.eu/1000153copo/hk1.m3u8"
        ],
        "recommendation": "Use an official Bundestag embed or link out. Request the documented live signal before enabling this raw HLS endpoint."
      }
    },
    {
      "id": "costa-rica-assembly-youtube",
      "name": "Costa Rica Assembly YouTube",
      "jurisdiction_level": "national",
      "country_or_region": "Costa Rica",
      "legislature": "Asamblea Legislativa",
      "language": "Spanish",
      "source_type": "youtube",
      "playback_url": null,
      "official_url": "https://www.youtube.com/@AsambleaCRC",
      "attribution_text": "Live and recorded Assembly proceedings.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Channel page",
        "current_event_time": "Open for active streams",
        "next_event_title": "Schedule metadata",
        "next_event_time": "Planned",
        "confidence": "medium"
      },
      "epg_sources": [],
      "permission": {
        "status": "embed_only",
        "summary": "Official YouTube channel is link-out only; this catalogue does not extract YouTube manifests.",
        "evidence": [
          "https://www.youtube.com/@AsambleaCRC"
        ],
        "recommendation": "Use official YouTube links or compliant embeds only."
      }
    },
    {
      "id": "el-salvador-legislative-assembly",
      "name": "El Salvador Legislative Assembly",
      "jurisdiction_level": "national",
      "country_or_region": "El Salvador",
      "legislature": "Asamblea Legislativa de El Salvador",
      "language": "Spanish",
      "source_type": "direct_hls",
      "playback_url": "https://streaming.asamblea.gob.sv/hls/plenariahd.m3u8",
      "official_url": "https://www.asamblea.gob.sv/",
      "attribution_text": "Official Asamblea Legislativa domain hosts this plenary HLS manifest.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "Legislative Assembly plenary stream",
        "current_event_time": "Active around scheduled proceedings",
        "next_event_title": "Official schedule integration",
        "next_event_time": "Planned",
        "confidence": "medium"
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
      }
    },
    {
      "id": "european-parliament-multimedia-centre",
      "name": "European Parliament Multimedia Centre",
      "jurisdiction_level": "supranational",
      "country_or_region": "European Union",
      "legislature": "European Parliament",
      "language": "Multilingual",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://multimedia.europarl.europa.eu/en/webstreaming",
      "attribution_text": "Official European Parliament Multimedia Centre webstreaming page.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "European Parliament plenary, committee, and institutional webstreams",
        "current_event_time": "Live around scheduled proceedings and events",
        "next_event_title": "Multimedia Centre schedule and event metadata",
        "next_event_time": "Research target",
        "confidence": "high"
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://multimedia.europarl.europa.eu/en/webstreaming",
          "method": "GET",
          "kind": "webstreaming_schedule_page",
          "scraper_status": "planned"
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
      }
    },
    {
      "id": "council-of-eu-live",
      "name": "Council of the European Union Live",
      "jurisdiction_level": "supranational",
      "country_or_region": "European Union",
      "legislature": "Council of the European Union",
      "language": "Multilingual",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://video.consilium.europa.eu/home/en",
      "attribution_text": "Official Council live page for public Council sessions and related events.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Council public sessions and events",
        "current_event_time": "Live around scheduled public sessions",
        "next_event_title": "Council live schedule and archive",
        "next_event_time": "Research target",
        "confidence": "high"
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
        "status": "personal_use_pending_review",
        "summary": "Council pages document live and recorded public sessions in all EU languages, but this project has not recorded sufficient native stream reuse permission.",
        "evidence": [
          "https://video.consilium.europa.eu/home/en",
          "https://www.consilium.europa.eu/en/press/",
          "https://www.consilium.europa.eu/en/general-secretariat/corporate-policies/transparency/"
        ],
        "recommendation": "Use official link-out pending terms review and avoid extracting dynamic player manifests."
      }
    },
    {
      "id": "eu-audiovisual-ebs",
      "name": "EU Audiovisual Service / EBS",
      "jurisdiction_level": "supranational",
      "country_or_region": "European Union",
      "legislature": "European Union institutions",
      "language": "Multilingual",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://audiovisual.ec.europa.eu/en",
      "attribution_text": "Official European Union Audiovisual Service / Europe by Satellite page.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "EU institutional live and audiovisual coverage",
        "current_event_time": "Live around scheduled EU events",
        "next_event_title": "EBS schedule and audiovisual metadata",
        "next_event_time": "Research target",
        "confidence": "medium"
      },
      "epg_sources": [
        {
          "scraper": "planned",
          "url": "https://audiovisual.ec.europa.eu/en",
          "method": "GET",
          "kind": "audiovisual_service_live_page",
          "scraper_status": "planned"
        }
      ],
      "permission": {
        "status": "personal_use_pending_review",
        "summary": "Official EU Audiovisual Service page is reachable and publishes EBS live/schedule surfaces, but this project has not recorded sufficient native stream reuse permission.",
        "evidence": [
          "https://audiovisual.ec.europa.eu/en",
          "https://www.europarl.europa.eu/website/multimedia-centre/en/europe-by-satellite.html"
        ],
        "recommendation": "Use official link-out pending terms review; keep distinct from parliamentary chamber streams."
      }
    },
    {
      "id": "un-web-tv",
      "name": "United Nations Web TV",
      "jurisdiction_level": "supranational",
      "country_or_region": "United Nations",
      "legislature": "United Nations bodies",
      "language": "Multilingual",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://webtv.un.org/en/schedule",
      "attribution_text": "Official United Nations Web TV live schedule page.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "UN meetings, events, and briefings",
        "current_event_time": "Live around scheduled UN coverage",
        "next_event_title": "UN Web TV live schedule",
        "next_event_time": "Research target",
        "confidence": "high"
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
        "status": "personal_use_pending_review",
        "summary": "UN Web TV provides official live and on-demand multilingual coverage and event links/embed codes, but this project has not recorded sufficient native stream reuse permission.",
        "evidence": [
          "https://webtv.un.org/en/schedule",
          "https://media.un.org/en",
          "https://www.un.org/en/node/205121"
        ],
        "recommendation": "Use official schedule/event links or documented embeds; do not extract dynamic manifests without permission."
      }
    },
    {
      "id": "council-of-europe-pace-live",
      "name": "Council of Europe / PACE Live",
      "jurisdiction_level": "supranational",
      "country_or_region": "Council of Europe",
      "legislature": "Parliamentary Assembly of the Council of Europe",
      "language": "Multilingual",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://www.coe.int/en/web/portal/live",
      "attribution_text": "Official Council of Europe live webcast page carrying PACE and other Council of Europe sessions/events.",
      "technical_status": "needs_review",
      "availability": "event_based",
      "program": {
        "current_event_title": "PACE and Council of Europe live sessions/events",
        "current_event_time": "Live around scheduled sessions",
        "next_event_title": "PACE live and multimedia resources",
        "next_event_time": "Research target",
        "confidence": "low"
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
        "summary": "Council of Europe audiovisual pages state PACE sessions and other major events are live-streamed, but Council of Europe/PACE pages returned 403 from parts of the 2026-08-14 validation environment and native stream reuse permission is not documented.",
        "evidence": [
          "https://www.coe.int/en/web/portal/live",
          "https://www.coe.int/en/web/portal/audiovisual-services1",
          "https://pace.coe.int/en/sessions/livestream"
        ],
        "recommendation": "Keep as watchlist/link-out pending source-specific terms and current page access review."
      }
    },
    {
      "id": "scottish-parliament-tv",
      "name": "Scottish Parliament TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Scotland",
      "legislature": "Scottish Parliament",
      "language": "English / Gaelic",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://www.scottishparliament.tv/",
      "attribution_text": "Official Scottish Parliament TV page with live and archived chamber and committee coverage, including accessible variants where scheduled.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Scottish Parliament chamber and committee coverage",
        "current_event_time": "Live around scheduled parliamentary business",
        "next_event_title": "What's On parliamentary schedule",
        "next_event_time": "See the official schedule",
        "confidence": "high"
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
      }
    },
    {
      "id": "senedd-tv",
      "name": "Senedd TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Wales",
      "legislature": "Senedd Cymru / Welsh Parliament",
      "language": "Welsh / English",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://www.senedd.tv/",
      "attribution_text": "Official Senedd TV page with live and archived public Plenary and committee proceedings.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Senedd Plenary and committee coverage",
        "current_event_time": "Live around scheduled public meetings",
        "next_event_title": "Senedd TV and parliamentary meeting schedules",
        "next_event_time": "See the official schedules",
        "confidence": "high"
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
      }
    },
    {
      "id": "northern-ireland-assembly-tv",
      "name": "Northern Ireland Assembly TV",
      "jurisdiction_level": "subnational",
      "country_or_region": "Northern Ireland",
      "legislature": "Northern Ireland Assembly",
      "language": "English / Irish",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://niassembly.tv/",
      "attribution_text": "Official Northern Ireland Assembly TV page with scheduled Assembly and committee streams, archives, and language/accessibility variants.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "Northern Ireland Assembly and committee coverage",
        "current_event_time": "Live around scheduled Assembly business",
        "next_event_title": "Assembly TV live schedule",
        "next_event_time": "See the official calendar",
        "confidence": "high"
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
      }
    },
    {
      "id": "osce-live",
      "name": "OSCE Live",
      "jurisdiction_level": "supranational",
      "country_or_region": "OSCE",
      "legislature": "Organization for Security and Co-operation in Europe",
      "language": "Multilingual",
      "source_type": "official_page",
      "playback_url": null,
      "official_url": "https://www.osce.org/live",
      "attribution_text": "Official OSCE live page for streamed events.",
      "technical_status": "link_only",
      "availability": "event_based",
      "program": {
        "current_event_title": "OSCE live events",
        "current_event_time": "Live around scheduled events",
        "next_event_title": "OSCE live schedule/event pages",
        "next_event_time": "Research target",
        "confidence": "medium"
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
        "status": "personal_use_pending_review",
        "summary": "Official OSCE live page is reachable, but this project has not recorded sufficient stream reuse permission or a stable parliamentary-specific direct stream.",
        "evidence": [
          "https://www.osce.org/live",
          "https://www.oscepa.org/en/"
        ],
        "recommendation": "Use official link-out pending terms review; keep OSCE PA-specific coverage as a research target."
      }
    }
  ]
};
