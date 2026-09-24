from typing import Protocol

from dinematch_api.core.recommendations.models import RecommendationRequest, Restaurant


class RestaurantCatalog(Protocol):
    def list_candidates(self, request: RecommendationRequest) -> tuple[Restaurant, ...]:
        """Return candidates for the request from a provider, cache, or database."""
