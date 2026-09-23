import { createRecommendationService } from "../dinematch.application/recommendations/useCases/recommendRestaurants";
import { BrowserCurrentLocationProvider } from "../dinematch.infrastructure/browser/BrowserCurrentLocationProvider";
import { LocalStorageThemePreferenceStore } from "../dinematch.infrastructure/browser/LocalStorageThemePreferenceStore";
import { MockRestaurantCatalog } from "../dinematch.infrastructure/recommendations/mock/MockRestaurantCatalog";
import { PrototypePreferenceInterpreter } from "../dinematch.infrastructure/recommendations/mock/PrototypePreferenceInterpreter";

/**
 * The only composition root. Swap the local catalog and interpreter adapters
 * here when live services become available; UI and core stay unchanged.
 */
export function createDependencies() {
  return {
    currentLocationProvider: new BrowserCurrentLocationProvider(),
    recommendationService: createRecommendationService({
      preferenceInterpreter: new PrototypePreferenceInterpreter(),
      restaurantCatalog: new MockRestaurantCatalog(),
    }),
    themePreferenceStore: new LocalStorageThemePreferenceStore(),
  };
}
