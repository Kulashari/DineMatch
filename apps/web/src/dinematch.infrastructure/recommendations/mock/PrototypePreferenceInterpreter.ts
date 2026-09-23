import type { PreferenceChip } from "../../../dinematch.application/recommendations/contracts";
import type { PreferenceInterpreter } from "../../../dinematch.application/recommendations/ports/PreferenceInterpreter";

const cuisineKeywords = [
  "italian",
  "thai",
  "japanese",
  "korean",
  "mexican",
  "indian",
  "mediterranean",
] as const;

/**
 * A deliberately small, deterministic interpreter for the local prototype.
 * It implements the same port that a Bedrock/LangGraph interpreter will use.
 */
export class PrototypePreferenceInterpreter implements PreferenceInterpreter {
  interpret(prompt: string, defaults: PreferenceChip[]): PreferenceChip[] {
    const normalizedPrompt = prompt.toLowerCase();
    const promptCuisine = cuisineKeywords.find((cuisine) => normalizedPrompt.includes(cuisine));
    const budgetMatch = normalizedPrompt.match(
      /\b(?:under|below|less than|up to|max(?:imum)? of)\s*\$?\s*(\d+)/i,
    );
    const distanceMatch = normalizedPrompt.match(
      /\b(?:within|under|less than)\s*(\d+)\s*(?:min|mins|minutes)/i,
    );
    const ratingMatch =
      normalizedPrompt.match(/\b(?:rated?|rating)\s*(?:at\s+least\s*)?(\d(?:\.\d)?)\s*\+?/i) ??
      normalizedPrompt.match(/\b(\d(?:\.\d)?)\s*\+?\s*(?:stars?|rating)\b/i);

    return defaults.map((preference) => {
      if (preference.key === "cuisine" && promptCuisine) {
        return { ...preference, value: promptCuisine[0].toUpperCase() + promptCuisine.slice(1) };
      }

      if (preference.key === "budget" && budgetMatch) {
        return { ...preference, value: `Under $${budgetMatch[1]}` };
      }

      if (preference.key === "distance" && distanceMatch) {
        return { ...preference, value: `${distanceMatch[1]} min walk` };
      }

      if (preference.key === "rating" && ratingMatch) {
        return { ...preference, value: `${ratingMatch[1]}+` };
      }

      if (preference.key === "dietary" && normalizedPrompt.includes("vegan")) {
        return { ...preference, value: "Vegan-friendly" };
      }

      if (preference.key === "dietary" && normalizedPrompt.includes("vegetarian")) {
        return { ...preference, value: "Vegetarian-friendly" };
      }

      if (preference.key === "vibe" && normalizedPrompt.includes("quiet")) {
        return { ...preference, value: "Quiet" };
      }

      return preference;
    });
  }
}
