import type { DiningRequest, Restaurant } from "../contracts";

export interface RemoteRecommendationResponse {
  restaurants: Restaurant[];
  generatedAt: string;
}

/**
 * Boundary for the future FastAPI/LangGraph recommendation endpoint.
 * The local prototype instead composes a synchronous catalog and ranking rule.
 */
export interface RecommendationGateway {
  requestRecommendations(
    request: DiningRequest,
  ): Promise<RemoteRecommendationResponse>;
}
