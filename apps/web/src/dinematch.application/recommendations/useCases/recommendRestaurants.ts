import { rankRestaurants } from "../../../dinematch.core/recommendations/rankRestaurants";
import type { RecommendationService } from "../contracts";
import type { PreferenceInterpreter } from "../ports/PreferenceInterpreter";
import type { RestaurantCatalog } from "../ports/RestaurantCatalog";

interface RecommendationDependencies {
  preferenceInterpreter: PreferenceInterpreter;
  restaurantCatalog: RestaurantCatalog;
}

export function createRecommendationService({
  preferenceInterpreter,
  restaurantCatalog,
}: RecommendationDependencies): RecommendationService {
  return {
    interpretPreferences(prompt, defaults) {
      return preferenceInterpreter.interpret(prompt, defaults);
    },
    recommend(request) {
      return rankRestaurants(request, restaurantCatalog.listCandidates());
    },
  };
}
