import type { PreferenceChip } from "../../../dinematch.application/recommendations/contracts";

export const defaultPrompt =
  "Vegetarian-friendly Italian dinner near King West, under $45, quiet enough for a date.";

export const defaultLocation = "King St W & Spadina Ave";

export const preferenceOptions: PreferenceChip[] = [
  { key: "cuisine", label: "Cuisine", value: "Italian" },
  { key: "budget", label: "Budget", value: "$25-$45" },
  { key: "distance", label: "Distance", value: "15 min walk" },
  { key: "rating", label: "Rating", value: "4.3+" },
  { key: "dietary", label: "Dietary", value: "Vegetarian-friendly" },
  { key: "vibe", label: "Vibe", value: "Quiet" },
];
