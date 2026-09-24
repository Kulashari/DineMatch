import { createRecommendationService } from "../dinematch.application/recommendations/useCases/recommendRestaurants";
import { BrowserCurrentLocationProvider } from "../dinematch.infrastructure/browser/BrowserCurrentLocationProvider";
import { LocalStorageThemePreferenceStore } from "../dinematch.infrastructure/browser/LocalStorageThemePreferenceStore";
import { FastApiRecommendationClient } from "../dinematch.infrastructure/recommendations/http/FastApiRecommendationClient";
import { MockRestaurantCatalog } from "../dinematch.infrastructure/recommendations/mock/MockRestaurantCatalog";
import { PrototypePreferenceInterpreter } from "../dinematch.infrastructure/recommendations/mock/PrototypePreferenceInterpreter";

/**
 * The only composition root. Swap the local catalog and interpreter adapters
 * here when live services become available; UI and core stay unchanged.
 */
export function createDependencies() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

  return {
    currentLocationProvider: new BrowserCurrentLocationProvider(),
    recommendationService: createRecommendationService({
      preferenceInterpreter: new PrototypePreferenceInterpreter(),
      restaurantCatalog: new MockRestaurantCatalog(),
      recommendationGateway: new FastApiRecommendationClient(apiBaseUrl),
    }),
    themePreferenceStore: new LocalStorageThemePreferenceStore(),
  };
}
