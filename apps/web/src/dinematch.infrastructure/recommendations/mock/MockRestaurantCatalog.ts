import type { RestaurantCatalog } from "../../../dinematch.application/recommendations/ports/RestaurantCatalog";
import { getLocalRestaurantFixtures } from "./restaurantFixtures";

export class MockRestaurantCatalog implements RestaurantCatalog {
  listCandidates() {
    return getLocalRestaurantFixtures();
  }
}
