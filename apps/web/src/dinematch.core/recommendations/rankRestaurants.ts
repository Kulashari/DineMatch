import type { DiningRequest, Restaurant } from "./models";

const cuisineKeywords = [
  "italian",
  "thai",
  "japanese",
  "korean",
  "mexican",
  "indian",
  "mediterranean",
] as const;

const preferenceSignals = ["vegetarian", "vegan", "quiet", "date", "casual"] as const;

function getWalkMinutes(walkTime: string) {
  return Number.parseInt(walkTime, 10);
}

function getPriceEstimate(price: string): number | null {
  if (price.toLowerCase().includes("unavailable")) {
    return null;
  }

  return price.length * 20;
}

function includesPreference(restaurant: Restaurant, preference: string) {
  const searchableText = [restaurant.cuisine, restaurant.dietaryFit, ...restaurant.searchTerms]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(preference);
}

/**
 * Applies the prototype's deterministic hard constraints and ranking signals to
 * candidate restaurants. It deliberately receives candidates as an argument so
 * the domain rule has no knowledge of mock data, APIs, or storage.
 */
export function rankRestaurants(
  request: DiningRequest,
  candidates: readonly Restaurant[],
): Restaurant[] {
  const query = `${request.prompt} ${request.constraints.map((constraint) => constraint.value).join(" ")}`.toLowerCase();
  const selectedCuisine = request.constraints.find((constraint) => constraint.key === "cuisine")?.value.toLowerCase();
  const requestedCuisine = cuisineKeywords.find((cuisine) => query.includes(cuisine)) ?? selectedCuisine;
  const minimumRating = Number.parseFloat(
    request.constraints.find((constraint) => constraint.key === "rating")?.value ?? "0",
  );
  const maxWalkMinutes = Number.parseInt(
    request.constraints.find((constraint) => constraint.key === "distance")?.value ?? "999",
    10,
  );
  const budgetValue = request.constraints.find((constraint) => constraint.key === "budget")?.value ?? "";
  const budgetAmounts = budgetValue.match(/\d+/g)?.map(Number) ?? [];
  const budgetCap = budgetAmounts.length > 0 ? Math.max(...budgetAmounts) : Number.POSITIVE_INFINITY;
  const dietaryConstraint = request.constraints
    .find((constraint) => constraint.key === "dietary")
    ?.value.toLowerCase();
  const hasRatingConstraint = request.constraints.some((constraint) => constraint.key === "rating");
  const hasDistanceConstraint = request.constraints.some((constraint) => constraint.key === "distance");
  const locationTerms = request.location.label
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((term) => term.length >= 4 && term !== "street");

  const eligibleRestaurants = candidates.filter((restaurant) => {
    const matchesCuisine = !selectedCuisine || includesPreference(restaurant, selectedCuisine);
    const matchesRating =
      !hasRatingConstraint || restaurant.rating === null || restaurant.rating >= minimumRating;
    const matchesDistance = !hasDistanceConstraint || getWalkMinutes(restaurant.walkTime) <= maxWalkMinutes;
    const priceEstimate = getPriceEstimate(restaurant.price);
    const matchesBudget = priceEstimate === null || priceEstimate <= budgetCap;
    const matchesDietary =
      !dietaryConstraint ||
      restaurant.dietaryFit.toLowerCase().includes("unavailable") ||
      includesPreference(restaurant, dietaryConstraint.includes("vegan") ? "vegan" : "vegetarian");

    return matchesCuisine && matchesRating && matchesDistance && matchesBudget && matchesDietary;
  });

  return eligibleRestaurants
    .map((restaurant) => {
      let score = restaurant.matchScore;

      if (requestedCuisine && includesPreference(restaurant, requestedCuisine)) {
        score += 18;
      }

      preferenceSignals.forEach((signal) => {
        if (query.includes(signal)) {
          score += includesPreference(restaurant, signal) ? 5 : -8;
        }
      });

      if (
        hasRatingConstraint &&
        restaurant.rating !== null &&
        restaurant.rating >= minimumRating
      ) {
        score += 4;
      }

      if (hasDistanceConstraint && getWalkMinutes(restaurant.walkTime) <= maxWalkMinutes) {
        score += 4;
      }

      const priceEstimate = getPriceEstimate(restaurant.price);
      if (Number.isFinite(budgetCap) && priceEstimate !== null && priceEstimate <= budgetCap) {
        score += 5;
      }

      score += Math.min(
        8,
        locationTerms.filter((term) => includesPreference(restaurant, term)).length * 4,
      );

      return { ...restaurant, matchScore: Math.min(98, Math.max(55, score)) };
    })
    .sort((first, second) => second.matchScore - first.matchScore)
    .slice(0, 3);
}
