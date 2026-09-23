import type { Restaurant } from "../contracts";

export interface RestaurantCatalog {
  listCandidates(): readonly Restaurant[];
}
