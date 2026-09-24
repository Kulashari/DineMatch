from dataclasses import dataclass
from typing import Literal

from dinematch_api.core.location.models import SearchLocation


PreferenceKey = Literal["cuisine", "budget", "distance", "rating", "dietary", "vibe"]


@dataclass(frozen=True)
class Constraint:
    key: PreferenceKey
    label: str
    value: str


@dataclass(frozen=True)
class Restaurant:
    id: str
    name: str
    cuisine: str
    price: str
    rating: float | None
    walk_minutes: int
    dietary_fit: str
    match_score: int
    address: str
    rationale: str
    tradeoff: str
    search_terms: tuple[str, ...]


@dataclass(frozen=True)
class RecommendationRequest:
    prompt: str
    location: SearchLocation
    constraints: tuple[Constraint, ...]


@dataclass(frozen=True)
class RecommendationResult:
    restaurants: tuple[Restaurant, ...]
    workflow: tuple[str, ...]
