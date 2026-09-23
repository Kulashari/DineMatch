from dataclasses import dataclass
from os import getenv


@dataclass(frozen=True)
class Settings:
    allowed_origins: tuple[str, ...]

    @classmethod
    def from_environment(cls) -> "Settings":
        raw_origins = getenv("DINEMATCH_ALLOWED_ORIGINS", "http://localhost:5173")
        allowed_origins = tuple(
            origin.strip() for origin in raw_origins.split(",") if origin.strip()
        )
        return cls(allowed_origins=allowed_origins)
