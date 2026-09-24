import { rankRestaurants } from "../../../dinematch.core/recommendations/rankRestaurants";
import type { RecommendationService } from "../contracts";
import type { PreferenceInterpreter } from "../ports/PreferenceInterpreter";
import type { RecommendationGateway } from "../ports/RecommendationGateway";
import type { RestaurantCatalog } from "../ports/RestaurantCatalog";

interface RecommendationDependencies {
  preferenceInterpreter: PreferenceInterpreter;
  restaurantCatalog: RestaurantCatalog;
  recommendationGateway?: RecommendationGateway;
}

export function createRecommendationService({
  preferenceInterpreter,
  restaurantCatalog,
  recommendationGateway,
}: RecommendationDependencies): RecommendationService {
  return {
    interpretPreferences(prompt, defaults) {
      return preferenceInterpreter.interpret(prompt, defaults);
    },
    preview(request) {
      return rankRestaurants(request, restaurantCatalog.listCandidates());
    },
    async recommend(request) {
      if (recommendationGateway) {
        const response = await recommendationGateway.requestRecommendations(request);
        return response.restaurants;
      }

      return rankRestaurants(request, restaurantCatalog.listCandidates());
    },
  };
}
