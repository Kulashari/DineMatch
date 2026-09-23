from datetime import UTC, datetime
from typing import Literal

from pydantic import BaseModel, Field

from dinematch_api.core.location.models import LocationCoordinates, SearchLocation
from dinematch_api.core.recommendations.models import (
    Constraint,
    RecommendationRequest,
    RecommendationResult,
    Restaurant,
)


class LocationCoordinatesBody(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    accuracy_meters: float | None = Field(default=None, ge=0)

    def to_domain(self) -> LocationCoordinates:
        return LocationCoordinates(
            latitude=self.latitude,
            longitude=self.longitude,
            accuracy_meters=self.accuracy_meters,
        )


class SearchLocationBody(BaseModel):
    label: str = Field(min_length=1, max_length=200)
    source: Literal["browser", "typed"]
    coordinates: LocationCoordinatesBody | None = None

    def to_domain(self) -> SearchLocation:
        return SearchLocation(
            label=self.label,
            source=self.source,
            coordinates=self.coordinates.to_domain() if self.coordinates else None,
        )


class ConstraintBody(BaseModel):
    key: Literal["cuisine", "budget", "distance", "rating", "dietary", "vibe"]
    label: str = Field(min_length=1, max_length=80)
    value: str = Field(min_length=1, max_length=120)

    def to_domain(self) -> Constraint:
        return Constraint(key=self.key, label=self.label, value=self.value)


class RecommendationRequestBody(BaseModel):
    prompt: str = Field(min_length=1, max_length=2_000)
    location: SearchLocationBody
    constraints: list[ConstraintBody] = Field(default_factory=list, max_length=6)

    def to_domain(self) -> RecommendationRequest:
        return RecommendationRequest(
            prompt=self.prompt,
            location=self.location.to_domain(),
            constraints=tuple(constraint.to_domain() for constraint in self.constraints),
        )


class RestaurantBody(BaseModel):
    id: str
    name: str
    cuisine: str
    price: str
    rating: float
    walk_minutes: int
    dietary_fit: str
    match_score: int
    address: str
    rationale: str
    tradeoff: str

    @classmethod
    def from_domain(cls, restaurant: Restaurant) -> "RestaurantBody":
        return cls(
            id=restaurant.id,
            name=restaurant.name,
            cuisine=restaurant.cuisine,
            price=restaurant.price,
            rating=restaurant.rating,
            walk_minutes=restaurant.walk_minutes,
            dietary_fit=restaurant.dietary_fit,
            match_score=restaurant.match_score,
            address=restaurant.address,
            rationale=restaurant.rationale,
            tradeoff=restaurant.tradeoff,
        )


class RecommendationResponseBody(BaseModel):
    restaurants: list[RestaurantBody]
    workflow: list[str]
    generated_at: datetime

    @classmethod
    def from_domain(cls, result: RecommendationResult) -> "RecommendationResponseBody":
        return cls(
            restaurants=[RestaurantBody.from_domain(restaurant) for restaurant in result.restaurants],
            workflow=list(result.workflow),
            generated_at=datetime.now(UTC),
        )
