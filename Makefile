.PHONY: verify research-secrets-check test test-python test-js test-browser coverage json-check catalogue-validate fallbacks-validate candidates-validate discovery-targets-validate us-candidates-validate discovery-decisions-validate institution-inventory-validate inventory-review-validate discovery-plan-validate service-baseline-check inventory-review validation-history validation-history-check catalogue-site-data catalogue-site-data-check site-data site-data-check institution-site-data institution-site-data-check compile format format-check lint type-check accessibility-check healthcheck links-audit epg-audit playback-policy-audit schedules site

UV ?= uv
UV_RUN ?= $(UV) run --locked --extra dev
UV_CACHE_DIR ?= $(CURDIR)/.uv-cache
PYTHONPYCACHEPREFIX ?= $(CURDIR)/.pycache
PYTHON_SOURCES := parliament_streams tests tools

verify: research-secrets-check json-check catalogue-validate fallbacks-validate candidates-validate discovery-targets-validate us-candidates-validate discovery-decisions-validate institution-inventory-validate inventory-review-validate discovery-plan-validate service-baseline-check validation-history-check institution-site-data-check data-products-check format-check lint type-check compile coverage test-js accessibility-check

.PHONY: data-products-check
data-products-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_data_products.py

research-secrets-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/sanitize_research_evidence.py --check-tracked

json-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m json.tool data/channels.json >/dev/null
	@if [ -f data/schedules.json ]; then \
		UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m json.tool data/schedules.json >/dev/null; \
	else \
		echo "Skipping generated data/schedules.json (not present in this checkout)"; \
	fi
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m json.tool data/supranational.json >/dev/null

catalogue-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams validate

fallbacks-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams fallbacks-validate

candidates-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams candidates-validate candidates

discovery-targets-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_discovery_targets.py data/discovery/tier1.json data/discovery/tier2.json

us-candidates-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_us_candidates.py

discovery-decisions-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_discovery_decisions.py
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_discovery_decisions.py data/discovery/reviewed-page-leads.json

institution-inventory-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/validate_institution_inventory.py

inventory-review-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/check_legislature_inventory.py --validate-inputs

discovery-plan-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/build_discovery_targets.py --validate-only

service-baseline-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m tools.build_institution_service_baseline --check

inventory-review:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/check_legislature_inventory.py --output-dir reports/automated/legislature-inventory --baseline reports/automated/legislature-inventory/snapshot.json --timeout 15 --workers 6 --budget-seconds 2400

validation-history:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams validation-history-refresh

validation-history-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams validation-history-refresh --check

# Compatibility aliases: the catalogue is already the canonical JSON product.
catalogue-site-data: catalogue-validate

catalogue-site-data-check: catalogue-validate

site-data: institution-site-data

site-data-check: institution-site-data-check

institution-site-data:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/build_institution_site_data.py

institution-site-data-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python tools/build_institution_site_data.py --check

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

accessibility-check: test-browser

test: test-python test-js test-browser

test-python:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m unittest discover -s tests

test-js:
	npm run test:unit

test-browser:
	npm run test:browser

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
