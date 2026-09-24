"""Low-volume OpenStreetMap restaurant retrieval for browser-derived coordinates."""

from __future__ import annotations

from dataclasses import dataclass
from json import loads
from math import asin, ceil, cos, radians, sin, sqrt
from threading import Lock
from time import monotonic
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from dinematch_api.application.recommendations.ports import RestaurantCatalog
from dinematch_api.core.location.models import LocationCoordinates
from dinematch_api.core.recommendations.models import RecommendationRequest, Restaurant

_EARTH_RADIUS_KM = 6_371.0088
_SEARCH_RADIUS_METERS = 2_500
_CACHE_TTL_SECONDS = 300


@dataclass(frozen=True)
class _CachedCandidates:
    expires_at: float
    restaurants: tuple[Restaurant, ...]


class OpenStreetMapRestaurantCatalog:
    """Fetch nearby OSM restaurants and fall back when external data is unavailable.

    The public Overpass service is deliberately used only for a small side project:
    requests are cached for five minutes and only made for browser coordinates.
    """

    def __init__(
        self,
        endpoint: str,
        user_agent: str,
        fallback_catalog: RestaurantCatalog,
    ) -> None:
        self._endpoint = endpoint
        self._user_agent = user_agent
        self._fallback_catalog = fallback_catalog
        self._cache: dict[tuple[float, float], _CachedCandidates] = {}
        self._cache_lock = Lock()

    def list_candidates(self, request: RecommendationRequest) -> tuple[Restaurant, ...]:
        coordinates = request.location.coordinates
        if request.location.source != "browser" or coordinates is None:
            return self._fallback_catalog.list_candidates(request)

        cache_key = (round(coordinates.latitude, 3), round(coordinates.longitude, 3))
        cached = self._read_cache(cache_key)
        if cached is not None:
            return cached

        try:
            restaurants = self._fetch_nearby_restaurants(coordinates)
        except (HTTPError, OSError, TypeError, URLError, ValueError):
            return self._fallback_catalog.list_candidates(request)

        if not restaurants:
            return self._fallback_catalog.list_candidates(request)

        self._write_cache(cache_key, restaurants)
        return restaurants

    def _read_cache(self, cache_key: tuple[float, float]) -> tuple[Restaurant, ...] | None:
        with self._cache_lock:
            cached = self._cache.get(cache_key)
            if cached is None or cached.expires_at <= monotonic():
                self._cache.pop(cache_key, None)
                return None
            return cached.restaurants

    def _write_cache(self, cache_key: tuple[float, float], restaurants: tuple[Restaurant, ...]) -> None:
        with self._cache_lock:
            self._cache[cache_key] = _CachedCandidates(
                expires_at=monotonic() + _CACHE_TTL_SECONDS,
                restaurants=restaurants,
            )

    def _fetch_nearby_restaurants(
        self, coordinates: LocationCoordinates
    ) -> tuple[Restaurant, ...]:
        query = _build_nearby_restaurant_query(coordinates)
        request = Request(
            self._endpoint,
            data=urlencode({"data": query}).encode(),
            headers={
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": self._user_agent,
            },
            method="POST",
        )
        with urlopen(request, timeout=8) as response:
            payload = loads(response.read().decode("utf-8"))

        elements = payload.get("elements", [])
        if not isinstance(elements, list):
            raise TypeError("Unexpected OpenStreetMap response.")

        restaurants = [
            restaurant
            for element in elements
            if (restaurant := _to_restaurant(element, coordinates)) is not None
        ]
        return tuple(restaurants)


def _build_nearby_restaurant_query(coordinates: LocationCoordinates) -> str:
    return f"""[out:json][timeout:8];
nwr[\"amenity\"=\"restaurant\"](around:{_SEARCH_RADIUS_METERS},{coordinates.latitude:.6f},{coordinates.longitude:.6f});
out center 35;"""


def _to_restaurant(element: Any, origin: LocationCoordinates) -> Restaurant | None:
    if not isinstance(element, dict):
        return None
    tags = element.get("tags")
    if not isinstance(tags, dict) or not isinstance(tags.get("name"), str):
        return None

    latitude, longitude = _element_coordinates(element)
    if latitude is None or longitude is None:
        return None

    distance_km = _haversine_distance_km(origin.latitude, origin.longitude, latitude, longitude)
    walk_minutes = max(1, ceil((distance_km * 1.2 / 4.8) * 60))
    cuisine = _display_cuisine(tags.get("cuisine"))
    vegetarian = tags.get("diet:vegetarian") in {"yes", "only"}
    dietary_fit = "Vegetarian-friendly" if vegetarian else "Dietary details unavailable"
    address = _display_address(tags)
    name = tags["name"].strip()
    element_id = f"osm-{element.get('type', 'place')}-{element.get('id', name.lower().replace(' ', '-'))}"

    return Restaurant(
        id=element_id,
        name=name,
        cuisine=cuisine,
        price="Price unavailable",
        rating=None,
        walk_minutes=walk_minutes,
        dietary_fit=dietary_fit,
        match_score=72,
        address=address,
        rationale=(
            f"Approximately {walk_minutes} minutes on foot from your current location "
            "using OpenStreetMap coordinates."
        ),
        tradeoff="OpenStreetMap does not reliably include ratings, prices, or full dietary details.",
        search_terms=(name.lower(), cuisine.lower(), *[str(value).lower() for value in tags.values()]),
    )


def _element_coordinates(element: dict[str, Any]) -> tuple[float | None, float | None]:
    latitude = element.get("lat")
    longitude = element.get("lon")
    center = element.get("center")
    if isinstance(center, dict):
        latitude = center.get("lat", latitude)
        longitude = center.get("lon", longitude)
    if not isinstance(latitude, (int, float)) or not isinstance(longitude, (int, float)):
        return None, None
    return float(latitude), float(longitude)


def _display_cuisine(value: object) -> str:
    if not isinstance(value, str) or not value.strip():
        return "Restaurant"
    return value.split(";")[0].replace("_", " ").title()


def _display_address(tags: dict[str, Any]) -> str:
    street = tags.get("addr:street")
    house_number = tags.get("addr:housenumber")
    city = tags.get("addr:city")
    street_address = " ".join(
        str(value).strip() for value in (house_number, street) if isinstance(value, str)
    )
    return ", ".join(value for value in (street_address, city) if value) or "Address unavailable"


def _haversine_distance_km(
    first_latitude: float,
    first_longitude: float,
    second_latitude: float,
    second_longitude: float,
) -> float:
    latitude_delta = radians(second_latitude - first_latitude)
    longitude_delta = radians(second_longitude - first_longitude)
    a = (
        sin(latitude_delta / 2) ** 2
        + cos(radians(first_latitude))
        * cos(radians(second_latitude))
        * sin(longitude_delta / 2) ** 2
    )
    return _EARTH_RADIUS_KM * 2 * asin(sqrt(a))
