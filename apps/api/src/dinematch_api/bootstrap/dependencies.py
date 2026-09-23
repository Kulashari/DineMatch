from functools import lru_cache

from dinematch_api.application.recommendations.service import RecommendationService
from dinematch_api.graphs.recommendation_graph import build_recommendation_graph
from dinematch_api.infrastructure.recommendations.mock_catalog import MockRestaurantCatalog


@lru_cache
def get_recommendation_service() -> RecommendationService:
    """The API composition root for recommendation dependencies."""
    return RecommendationService(graph=build_recommendation_graph(MockRestaurantCatalog()))
