from functools import lru_cache

from dinematch_api.application.recommendations.service import RecommendationService
from dinematch_api.core.configuration import Settings
from dinematch_api.graphs.recommendation_graph import build_recommendation_graph
from dinematch_api.infrastructure.recommendations.mock_catalog import MockRestaurantCatalog
from dinematch_api.infrastructure.recommendations.openstreetmap_catalog import (
    OpenStreetMapRestaurantCatalog,
)


@lru_cache
def get_recommendation_service() -> RecommendationService:
    """The API composition root for recommendation dependencies."""
    settings = Settings.from_environment()
    fallback_catalog = MockRestaurantCatalog()
    catalog = OpenStreetMapRestaurantCatalog(
        endpoint=settings.overpass_endpoint,
        user_agent=settings.osm_user_agent,
        fallback_catalog=fallback_catalog,
    )
    return RecommendationService(graph=build_recommendation_graph(catalog))
