import type { DiningRequest } from "../../../dinematch.application/recommendations/contracts";
import type {
  RecommendationGateway,
  RemoteRecommendationResponse,
} from "../../../dinematch.application/recommendations/ports/RecommendationGateway";

/**
 * Future outbound adapter for the FastAPI/LangGraph service. It fulfills an
 * application port without exposing transport concerns to the UI or core.
 */
export class FastApiRecommendationClient implements RecommendationGateway {
  async requestRecommendations(
    _request: DiningRequest,
  ): Promise<RemoteRecommendationResponse> {
    throw new Error("The recommendation API is not connected yet.");
  }
}
