from dinematch_api.core.recommendations.models import RecommendationRequest, Restaurant


class MockRestaurantCatalog:
    """Temporary data adapter until Google Places and PostgreSQL are connected."""

    def list_candidates(self, _request: RecommendationRequest) -> tuple[Restaurant, ...]:
        return (
            Restaurant(
                id="luna-trattoria",
                name="Luna Trattoria",
                cuisine="Italian",
                price="$$",
                rating=4.6,
                walk_minutes=11,
                dietary_fit="Vegetarian options",
                match_score=92,
                address="12 Portland St, Toronto",
                rationale="Relaxed dining, vegetarian pasta, and a short King West walk.",
                tradeoff="Reservations fill quickly after 7 PM.",
                search_terms=("quiet", "date", "vegetarian", "pasta", "king west", "spadina"),
            ),
            Restaurant(
                id="campo-social",
                name="Campo Social",
                cuisine="Modern Italian",
                price="$$",
                rating=4.5,
                walk_minutes=8,
                dietary_fit="Vegetarian-friendly",
                match_score=88,
                address="461 King St W, Toronto",
                rationale="Close to the starting point with a flexible seasonal menu.",
                tradeoff="The menu is less traditional than a classic Italian restaurant.",
                search_terms=("quiet", "vegetarian", "seasonal", "date", "king west", "spadina"),
            ),
            Restaurant(
                id="siam-garden",
                name="Siam Garden",
                cuisine="Thai",
                price="$$",
                rating=4.6,
                walk_minutes=10,
                dietary_fit="Vegetarian-friendly",
                match_score=89,
                address="410 Adelaide St W, Toronto",
                rationale="A balanced Thai menu with clear vegetarian choices.",
                tradeoff="Better suited to a relaxed dinner than a quick meal.",
                search_terms=("thai", "vegetarian", "spicy", "quiet", "date", "king west"),
            ),
        )
