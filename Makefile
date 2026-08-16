.PHONY: verify test coverage json-check catalogue-validate candidates-validate site-data site-data-check compile format format-check lint type-check accessibility-check healthcheck site

UV ?= uv
UV_RUN ?= $(UV) run --locked --extra dev
UV_CACHE_DIR ?= $(CURDIR)/.uv-cache
PYTHONPYCACHEPREFIX ?= $(CURDIR)/.pycache
PYTHON_SOURCES := parliament_streams tests tools

verify: json-check catalogue-validate candidates-validate site-data-check format-check lint type-check compile coverage accessibility-check

json-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m json.tool data/channels.json >/dev/null

catalogue-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams validate

candidates-validate:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) parliament-streams candidates-validate candidates

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

site:
	python3 -m http.server 8000
