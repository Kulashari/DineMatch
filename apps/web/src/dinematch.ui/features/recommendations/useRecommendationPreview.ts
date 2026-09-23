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
  const [results, setResults] = useState<Restaurant[]>(() =>
    recommendationService.recommend(initialRequest),
  );
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function findMatches(request: DiningRequest) {
    clearTimers();
    setIsSearching(true);
    setHasSearched(false);
    setHasNoMatches(false);
    setActiveStepIndex(0);

    recommendationWorkflowSteps.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setActiveStepIndex(index);
      }, index * SEARCH_STEP_DELAY);

      timersRef.current.push(timer);
    });

    const completeTimer = window.setTimeout(() => {
      const rankedResults = recommendationService.recommend(request);

      setResults(rankedResults);
      setHasNoMatches(rankedResults.length === 0);
      setActiveStepIndex(null);
      setHasSearched(true);
      setIsSearching(false);
    }, recommendationWorkflowSteps.length * SEARCH_STEP_DELAY);

    timersRef.current.push(completeTimer);
  }

  const status = isSearching
    ? `${recommendationWorkflowSteps[activeStepIndex ?? 0].label}: ${recommendationWorkflowSteps[activeStepIndex ?? 0].description}`
    : hasSearched
      ? hasNoMatches
        ? "No local sample fixtures meet every active hard constraint."
        : "Your local sample shortlist was updated from the current request."
      : "Ready to turn your preferences into a shortlist.";

  return {
    hasSearched,
    hasNoMatches,
    isSearching,
    results,
    status,
    findMatches,
  };
}
