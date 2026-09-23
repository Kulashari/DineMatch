from dataclasses import replace
from math import inf
from re import findall, search

from dinematch_api.core.recommendations.models import RecommendationRequest, Restaurant


_CUISINES = ("italian", "thai", "japanese", "korean", "mexican", "indian", "mediterranean")
_PREFERENCE_SIGNALS = ("vegetarian", "vegan", "quiet", "date", "casual")


def _searchable_text(restaurant: Restaurant) -> str:
    return " ".join((restaurant.cuisine, restaurant.dietary_fit, *restaurant.search_terms)).lower()


def _matches(restaurant: Restaurant, value: str) -> bool:
    return value.lower() in _searchable_text(restaurant)


def _constraint_value(request: RecommendationRequest, key: str) -> str | None:
    return next((constraint.value for constraint in request.constraints if constraint.key == key), None)


def _price_estimate(price: str) -> int:
    return len(price) * 20


def rank_restaurants(
    request: RecommendationRequest,
    candidates: tuple[Restaurant, ...],
) -> tuple[Restaurant, ...]:
    """Apply hard constraints first, then produce a deterministic explainable order."""
    query = f"{request.prompt} {' '.join(constraint.value for constraint in request.constraints)}".lower()
    selected_cuisine = _constraint_value(request, "cuisine")
    requested_cuisine = next((cuisine for cuisine in _CUISINES if cuisine in query), selected_cuisine)
    rating_value = _constraint_value(request, "rating")
    rating_match = search(r"\d+(?:\.\d+)?", rating_value or "")
    minimum_rating = float(rating_match.group()) if rating_match else 0
    distance_value = _constraint_value(request, "distance")
    max_walk_minutes = int((distance_value or "999").split()[0])
    budget_value = _constraint_value(request, "budget") or ""
    budget_numbers = [int(number) for number in findall(r"\d+", budget_value)]
    budget_cap = max(budget_numbers, default=inf)
    dietary_value = _constraint_value(request, "dietary")
    location_terms = [
        term
        for term in request.location.label.lower().replace("&", " ").split()
        if len(term) >= 4 and term != "street"
    ]

    eligible = [
        restaurant
        for restaurant in candidates
        if (not selected_cuisine or _matches(restaurant, selected_cuisine))
        and (not rating_value or restaurant.rating >= minimum_rating)
        and (not distance_value or restaurant.walk_minutes <= max_walk_minutes)
        and _price_estimate(restaurant.price) <= budget_cap
        and (
            not dietary_value
            or _matches(restaurant, "vegan" if "vegan" in dietary_value.lower() else "vegetarian")
        )
    ]

    ranked: list[Restaurant] = []
    for restaurant in eligible:
        score = restaurant.match_score
        if requested_cuisine and _matches(restaurant, requested_cuisine):
            score += 18
        score += sum(5 if _matches(restaurant, signal) else -8 for signal in _PREFERENCE_SIGNALS if signal in query)
        score += min(8, sum(4 for term in location_terms if _matches(restaurant, term)))
        ranked.append(replace(restaurant, match_score=min(98, max(55, score))))

    return tuple(sorted(ranked, key=lambda restaurant: restaurant.match_score, reverse=True)[:3])
