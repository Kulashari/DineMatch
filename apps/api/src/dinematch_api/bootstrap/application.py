from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dinematch_api.api.routes import health_router, recommendations_router
from dinematch_api.core.configuration import Settings


def create_app() -> FastAPI:
    settings = Settings.from_environment()
    app = FastAPI(
        title="DineMatch API",
        version="0.1.0",
        description="Constraint-aware restaurant recommendations powered by LangGraph.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.allowed_origins),
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )
    app.include_router(health_router)
    app.include_router(recommendations_router)
    return app
