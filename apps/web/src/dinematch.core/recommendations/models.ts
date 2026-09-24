export type PreferenceKey =
  | "cuisine"
  | "budget"
  | "distance"
  | "rating"
  | "dietary"
  | "vibe";

export interface PreferenceChip {
  key: PreferenceKey;
  label: string;
  value: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  price: string;
  rating: number | null;
  walkTime: string;
  dietaryFit: string;
  matchScore: number;
  address: string;
  mapQuery: string;
  searchTerms: string[];
  rationale: string;
  tradeoff: string;
}

export interface WorkflowStep {
  label: string;
  description: string;
}

export interface DiningRequest {
  prompt: string;
  location: SearchLocation;
  constraints: PreferenceChip[];
}
import type { SearchLocation } from "../location/models";
