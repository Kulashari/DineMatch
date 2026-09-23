from typing import Protocol

from dinematch_api.core.recommendations.models import Restaurant


class RestaurantCatalog(Protocol):
    def list_candidates(self) -> tuple[Restaurant, ...]:
        """Return candidates from a provider, cache, or database."""
