import { useEffect, useRef, useState } from "react";
import type {
  DiningRequest,
  RecommendationService,
  Restaurant,
} from "../../../dinematch.application/recommendations/contracts";
import { recommendationWorkflowSteps } from "../../../dinematch.application/recommendations/workflow";

const SEARCH_STEP_DELAY = 360;

export function useRecommendationPreview(
  recommendationService: RecommendationService,
  initialRequest: DiningRequest,
) {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasNoMatches, setHasNoMatches] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<Restaurant[]>(() =>
    recommendationService.preview(initialRequest),
  );
  const timersRef = useRef<number[]>([]);
  const searchIdRef = useRef(0);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  async function findMatches(request: DiningRequest) {
    const searchId = searchIdRef.current + 1;
    searchIdRef.current = searchId;
    clearTimers();
    setIsSearching(true);
    setHasSearched(false);
    setHasNoMatches(false);
    setSearchError(null);
    setActiveStepIndex(0);

    recommendationWorkflowSteps.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setActiveStepIndex(index);
      }, index * SEARCH_STEP_DELAY);

      timersRef.current.push(timer);
    });

    try {
      const rankedResults = await recommendationService.recommend(request);

      if (searchId !== searchIdRef.current) {
        return;
      }

      setResults(rankedResults);
      setHasNoMatches(rankedResults.length === 0);
      setHasSearched(true);
    } catch (error) {
      if (searchId !== searchIdRef.current) {
        return;
      }

      setSearchError(
        error instanceof Error ? error.message : "Unable to create a DineMatch shortlist.",
      );
    } finally {
      if (searchId === searchIdRef.current) {
        clearTimers();
        setActiveStepIndex(null);
        setIsSearching(false);
      }
    }
  }

  const status = isSearching
    ? `${recommendationWorkflowSteps[activeStepIndex ?? 0].label}: ${recommendationWorkflowSteps[activeStepIndex ?? 0].description}`
    : searchError
      ? searchError
      : hasSearched
      ? hasNoMatches
        ? "No restaurants meet every active hard constraint."
        : "Your live DineMatch shortlist is ready."
      : "Ready to turn your preferences into a shortlist.";

  return {
    hasSearched,
    hasNoMatches,
    isSearching,
    results,
    searchError,
    status,
    findMatches,
  };
}
