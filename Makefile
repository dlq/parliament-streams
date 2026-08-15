.PHONY: verify test coverage json-check compile format format-check lint healthcheck site

UV ?= uv
UV_RUN ?= $(UV) run --extra dev
UV_CACHE_DIR ?= $(CURDIR)/.uv-cache
PYTHONPYCACHEPREFIX ?= $(CURDIR)/.pycache
PYTHON_SOURCES := parliament_streams tests tools

verify: json-check format-check lint compile coverage

json-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m json.tool data/channels.json >/dev/null

compile:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m compileall $(PYTHON_SOURCES)

format:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff format $(PYTHON_SOURCES)

format-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff format --check $(PYTHON_SOURCES)

lint:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff check $(PYTHON_SOURCES)

test:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m unittest discover -s tests

coverage:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) coverage run -m unittest discover -s tests
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) coverage report

healthcheck:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m parliament_streams.healthcheck

site:
	python3 -m http.server 8000
