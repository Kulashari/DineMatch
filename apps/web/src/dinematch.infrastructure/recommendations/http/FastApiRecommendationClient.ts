import type {
  DiningRequest,
  Restaurant,
} from "../../../dinematch.application/recommendations/contracts";
import type {
  RecommendationGateway,
  RemoteRecommendationResponse,
} from "../../../dinematch.application/recommendations/ports/RecommendationGateway";

interface ApiRestaurant {
  id: string;
  name: string;
  cuisine: string;
  price: string;
  rating: number | null;
  walk_minutes: number;
  dietary_fit: string;
  match_score: number;
  address: string;
  rationale: string;
  tradeoff: string;
}

interface ApiRecommendationResponse {
  restaurants: ApiRestaurant[];
  workflow: string[];
  generated_at: string;
}

/** HTTP adapter for the FastAPI/LangGraph recommendation endpoint. */
export class FastApiRecommendationClient implements RecommendationGateway {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async requestRecommendations(
    request: DiningRequest,
  ): Promise<RemoteRecommendationResponse> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}/v1/recommendations`, {
        body: JSON.stringify({
          prompt: request.prompt,
          location: {
            label: request.location.label,
            source: request.location.source,
            coordinates: request.location.coordinates
              ? {
                  latitude: request.location.coordinates.latitude,
                  longitude: request.location.coordinates.longitude,
                  accuracy_meters: request.location.coordinates.accuracyMeters,
                }
              : undefined,
          },
          constraints: request.constraints,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    } catch {
      throw new Error(
        "DineMatch API is unavailable. Start the FastAPI server and try again.",
      );
    }

    if (!response.ok) {
      throw new Error(
        `DineMatch API could not create a shortlist (HTTP ${response.status}).`,
      );
    }

    const payload = (await response.json()) as ApiRecommendationResponse;

    return {
      generatedAt: payload.generated_at,
      restaurants: payload.restaurants.map(toRestaurant),
    };
  }
}

function toRestaurant(restaurant: ApiRestaurant): Restaurant {
  return {
    id: restaurant.id,
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    price: restaurant.price,
    rating: restaurant.rating,
    walkTime: `${restaurant.walk_minutes} min walk`,
    dietaryFit: restaurant.dietary_fit,
    matchScore: restaurant.match_score,
    address: restaurant.address,
    mapQuery: `${restaurant.name}, ${restaurant.address}`,
    searchTerms: [restaurant.name, restaurant.cuisine, restaurant.address].map((term) =>
      term.toLowerCase(),
    ),
    rationale: restaurant.rationale,
    tradeoff: restaurant.tradeoff,
  };
}
