.PHONY: verify test coverage json-check catalogue-validate fallbacks-validate candidates-validate discovery-targets-validate discovery-decisions-validate validation-history validation-history-check site-data site-data-check compile format format-check lint type-check accessibility-check healthcheck links-audit epg-audit playback-policy-audit schedules site

UV ?= uv
UV_RUN ?= $(UV) run --locked --extra dev
UV_CACHE_DIR ?= $(CURDIR)/.uv-cache
PYTHONPYCACHEPREFIX ?= $(CURDIR)/.pycache
PYTHON_SOURCES := parliament_streams tests tools

verify: json-check catalogue-validate fallbacks-validate candidates-validate discovery-targets-validate discovery-decisions-validate validation-history-check site-data-check format-check lint type-check compile coverage accessibility-check

json-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m json.tool data/channels.json >/dev/null

catalogue-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams validate

fallbacks-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams fallbacks-validate

candidates-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams candidates-validate candidates

discovery-targets-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_discovery_targets.py data/discovery/tier1.json data/discovery/tier2.json

discovery-decisions-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_discovery_decisions.py

validation-history:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams validation-history-refresh

validation-history-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams validation-history-refresh --check

site-data:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/build_site_data.py

site-data-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/build_site_data.py --check

compile:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m compileall $(PYTHON_SOURCES)

format:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff format $(PYTHON_SOURCES)

format-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff format --check $(PYTHON_SOURCES)

lint:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff check $(PYTHON_SOURCES)

type-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) mypy parliament_streams tools

accessibility-check:
	npm run check:site

test:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m unittest discover -s tests

coverage:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) coverage run -m unittest discover -s tests
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) coverage report

healthcheck:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m parliament_streams.healthcheck

links-audit:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) parliament-streams links-audit

epg-audit:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) parliament-streams epg-audit

playback-policy-audit:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) parliament-streams playback-policy-audit

schedules:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) parliament-streams schedules-collect

site:
	python3 -m http.server 8000
