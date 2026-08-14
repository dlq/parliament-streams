.PHONY: verify test json-check compile format lint healthcheck

UV ?= uv
UV_RUN ?= $(UV) run --extra dev
UV_CACHE_DIR ?= $(CURDIR)/.uv-cache
PYTHONPYCACHEPREFIX ?= $(CURDIR)/.pycache
PYTHON_SOURCES := parliament_streams tests tools

verify: json-check lint compile test

json-check:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) python -m json.tool data/channels.json >/dev/null

compile:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m compileall $(PYTHON_SOURCES)

format:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff format $(PYTHON_SOURCES)

lint:
	UV_CACHE_DIR=$(UV_CACHE_DIR) $(UV_RUN) ruff check $(PYTHON_SOURCES)

test:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m unittest discover -s tests

healthcheck:
	UV_CACHE_DIR=$(UV_CACHE_DIR) PYTHONPYCACHEPREFIX=$(PYTHONPYCACHEPREFIX) $(UV_RUN) python -m parliament_streams.healthcheck
