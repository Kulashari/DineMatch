from dataclasses import dataclass
from typing import Literal


LocationSource = Literal["browser", "typed"]


@dataclass(frozen=True)
class LocationCoordinates:
    latitude: float
    longitude: float
    accuracy_meters: float | None = None


@dataclass(frozen=True)
class SearchLocation:
    label: str
    source: LocationSource
    coordinates: LocationCoordinates | None = None
