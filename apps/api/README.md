# DineMatch API

FastAPI and LangGraph service for DineMatch. The first endpoint runs the same
five-stage recommendation flow as the frontend using a temporary in-memory
restaurant catalog.

## Run locally

In PowerShell:

```bash
cd apps/api
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
.\.venv\Scripts\fastapi.exe dev src\dinematch_api\main.py
```

Using the virtual environment's executables directly avoids PowerShell PATH and
activation-policy issues. If you prefer activating the environment, run
`.\.venv\Scripts\Activate.ps1` before `fastapi dev src\dinematch_api\main.py`.

The API will be available at `http://127.0.0.1:8000`, with interactive docs at
`http://127.0.0.1:8000/docs`.

## Endpoints

- `GET /health` — service health check
- `POST /v1/recommendations` — accepts the frontend's prompt, constraints, and
  typed or browser-derived location; returns a ranked shortlist and workflow
  stages.

The mock catalog is intentionally isolated in `infrastructure/`. Replace it with
Google Places/Routes and PostgreSQL adapters without changing the API route or
core ranking rules.
