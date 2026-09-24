from dataclasses import dataclass
from os import environ, getenv
from pathlib import Path

_ENVIRONMENT_FILE = Path(__file__).resolve().parents[3] / ".env"
_ENVIRONMENT_KEYS = {
    "DINEMATCH_ALLOWED_ORIGINS",
    "DINEMATCH_OSM_USER_AGENT",
    "DINEMATCH_OVERPASS_ENDPOINT",
}


@dataclass(frozen=True)
class Settings:
    allowed_origins: tuple[str, ...]
    overpass_endpoint: str
    osm_user_agent: str

    @classmethod
    def from_environment(cls) -> "Settings":
        _load_local_environment_file()
        raw_origins = getenv(
            "DINEMATCH_ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        )
        allowed_origins = tuple(
            origin.strip() for origin in raw_origins.split(",") if origin.strip()
        )
        return cls(
            allowed_origins=allowed_origins,
            overpass_endpoint=getenv(
                "DINEMATCH_OVERPASS_ENDPOINT", "https://overpass-api.de/api/interpreter"
            ),
            osm_user_agent=getenv(
                "DINEMATCH_OSM_USER_AGENT",
                "DineMatch side project (contact: local-development)",
            ),
        )


def _load_local_environment_file() -> None:
    """Load the small local configuration file without adding a runtime package."""
    if not _ENVIRONMENT_FILE.is_file():
        return

    for line in _ENVIRONMENT_FILE.read_text(encoding="utf-8").splitlines():
        if not line or line.lstrip().startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", maxsplit=1)
        key = key.strip()
        if key in _ENVIRONMENT_KEYS and key not in environ:
            environ[key] = value.strip().strip('"').strip("'")
