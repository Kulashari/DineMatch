# DineMatch

DineMatch is a constraint-aware restaurant recommender. It turns natural-language
meal requests into an explainable shortlist while preserving hard requirements such
as dietary needs, budget, distance, and rating.

## Front-page prototype

The current implementation is a modular React + TypeScript interface that models
the resume-defined experience:

- Natural-language meal request, typed starting point, and optional browser location
- Natural-language constraint interpretation for cuisine, budget, distance, rating,
  dietary needs, and vibe
- A representative ranked shortlist with explanations and trade-offs
- A five-step LangGraph-oriented request workflow: understand, retrieve, filter,
  rank, and validate
- Persistent light/dark mode and keyboard-accessible controls

The frontend still uses typed local fixtures until it is connected to the API. The
new API runs the same workflow with an in-memory catalog until PostgreSQL and live
restaurant, geolocation, and maps adapters are added.

## Run locally

```bash
npm --prefix apps/web install
npm --prefix apps/web run dev
```

## Project structure

```text
apps/
  web/                          # Self-contained Vite/React frontend package
    package.json
    package-lock.json
    index.html
    src/
      dinematch.bootstrap/       # Entry point and dependency composition only
      dinematch.ui/              # React app, components, feature hooks, and styles
      dinematch.application/     # Use cases and ports owned by the product
      dinematch.core/            # Domain models and deterministic ranking rules
      dinematch.infrastructure/  # Mock fixtures, browser storage, and HTTP adapters
      dinematch.config/          # TypeScript, Vite, and Vite type configuration
  api/                           # FastAPI and LangGraph backend package
    src/dinematch_api/
      api/                       # HTTP routes and Pydantic schemas
      application/               # Use cases and ports
      core/                      # Domain models and ranking rules
      infrastructure/            # Provider and database adapters
      graphs/                    # LangGraph workflow definitions
```

Dependencies flow toward the center: UI calls application contracts, application
uses core rules, and infrastructure implements application ports. Only
`dinematch.bootstrap/` selects concrete adapters. This lets the current local
fixture adapter be replaced by FastAPI/LangGraph without changing UI components.

`apps/web/` is the frontend package boundary: its `package.json`, lockfile,
`index.html`, source, and future generated frontend artifacts belong together.
The repository root remains available for shared documentation, design assets, and
the future backend service.
