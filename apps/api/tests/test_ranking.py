from dinematch_api.core.location.models import SearchLocation
from dinematch_api.core.recommendations.models import Constraint, RecommendationRequest, Restaurant
from dinematch_api.core.recommendations.ranking import rank_restaurants


def test_unknown_openstreetmap_metadata_does_not_remove_a_nearby_match() -> None:
    request = RecommendationRequest(
        prompt="Vegetarian Italian dinner under $45",
        location=SearchLocation(label="Current location", source="browser"),
        constraints=(
            Constraint(key="cuisine", label="Cuisine", value="Italian"),
            Constraint(key="budget", label="Budget", value="$25-$45"),
            Constraint(key="rating", label="Rating", value="4.3+"),
            Constraint(key="dietary", label="Dietary", value="Vegetarian-friendly"),
            Constraint(key="distance", label="Distance", value="15 min walk"),
        ),
    )
    restaurant = Restaurant(
        id="osm-node-1",
        name="Nearby Italian",
        cuisine="Italian",
        price="Price unavailable",
        rating=None,
        walk_minutes=6,
        dietary_fit="Dietary details unavailable",
        match_score=72,
        address="Address unavailable",
        rationale="Nearby.",
        tradeoff="Details unavailable.",
        search_terms=("nearby italian",),
    )

    results = rank_restaurants(request, (restaurant,))

    assert [result.id for result in results] == [restaurant.id]
