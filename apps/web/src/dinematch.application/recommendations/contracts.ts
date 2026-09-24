import type {
  DiningRequest,
  PreferenceChip,
  PreferenceKey,
  Restaurant,
  WorkflowStep,
} from "../../dinematch.core/recommendations/models";
import type { SearchLocation } from "../../dinematch.core/location/models";

export type {
  DiningRequest,
  PreferenceChip,
  PreferenceKey,
  Restaurant,
  WorkflowStep,
};
export type { SearchLocation };

export interface RecommendationService {
  interpretPreferences(prompt: string, defaults: PreferenceChip[]): PreferenceChip[];
  preview(request: DiningRequest): Restaurant[];
  recommend(request: DiningRequest): Promise<Restaurant[]>;
}
