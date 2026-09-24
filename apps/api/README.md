# DineMatch API

FastAPI and LangGraph service for DineMatch. The first endpoint runs the same
five-stage recommendation flow as the frontend using a temporary in-memory
restaurant catalog. When the browser supplies coordinates, the retrieval stage
uses a cached, low-volume OpenStreetMap Overpass lookup; it falls back to local
fixtures if that public service is unavailable.

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

## Location-aware results without paid APIs

Click **Use my location** in the browser before searching. The browser sends its
coordinates to FastAPI, which requests nearby `amenity=restaurant` OpenStreetMap
records, estimates walking time from geographic distance, and ranks the closest
matches. A five-minute in-memory cache keeps the low-volume public lookup polite.

Set `DINEMATCH_OSM_USER_AGENT` in a local `.env` file to a contactable identifier
before sharing the app. OpenStreetMap data requires attribution, which the web UI
displays. The public endpoint is appropriate only for occasional personal use;
ratings, price levels, and dietary metadata may be unavailable.
