from dinematch_api.core.location.models import LocationCoordinates
from dinematch_api.infrastructure.recommendations.openstreetmap_catalog import _to_restaurant


def test_openstreetmap_restaurant_uses_browser_coordinates_for_distance() -> None:
    restaurant = _to_restaurant(
        {
            "type": "node",
            "id": 123,
            "lat": 43.646,
            "lon": -79.401,
            "tags": {
                "amenity": "restaurant",
                "name": "Nearby Kitchen",
                "cuisine": "italian;pizza",
                "diet:vegetarian": "yes",
                "addr:housenumber": "10",
                "addr:street": "King St W",
                "addr:city": "Toronto",
            },
        },
        LocationCoordinates(latitude=43.645, longitude=-79.400),
    )

    assert restaurant is not None
    assert restaurant.id == "osm-node-123"
    assert restaurant.cuisine == "Italian"
    assert restaurant.walk_minutes > 0
    assert restaurant.rating is None
    assert restaurant.dietary_fit == "Vegetarian-friendly"
    assert restaurant.address == "10 King St W, Toronto"
