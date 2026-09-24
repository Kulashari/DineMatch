import { BadgeCheck, RefreshCw } from "lucide-react";
import { RestaurantCard } from "./RestaurantCard";
import type { Restaurant } from "../../../../dinematch.application/recommendations/contracts";

interface RecommendationPreviewProps {
  hasSearched: boolean;
  isSearching: boolean;
  restaurants: Restaurant[];
  searchError: string | null;
}

export function RecommendationPreview({
  hasSearched,
  isSearching,
  restaurants,
  searchError,
}: RecommendationPreviewProps) {
  return (
    <section className="recommendation-preview" aria-labelledby="shortlist-heading">
      <div className="recommendation-preview__header">
        <div>
          <p className="section-kicker">Your dinner shortlist</p>
          <h2 id="shortlist-heading">A reasoned match, not a guess.</h2>
        </div>
        <span className="preview-badge">
          <BadgeCheck aria-hidden="true" size={16} strokeWidth={2.3} />
          {hasSearched ? "Live API result" : "Sample preview"}
        </span>
      </div>
      <p className="recommendation-preview__intro">
        {isSearching
          ? "DineMatch is running its five-stage LangGraph recommendation workflow."
          : hasSearched
            ? "These recommendations came from the live FastAPI service."
            : "Sample fixtures show how DineMatch makes trade-offs visible before you decide where to go."}
      </p>
      {isSearching && (
        <div className="preview-progress" role="status">
          <RefreshCw aria-hidden="true" className="spinner" size={16} strokeWidth={2.2} />
          Updating the shortlist…
        </div>
      )}
      {searchError && (
        <div className="api-error" role="alert">
          <strong>Couldn’t update the shortlist.</strong> {searchError}
        </div>
      )}
      {restaurants.length > 0 ? (
        <div className="restaurant-list">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              position={index + 1}
              restaurant={restaurant}
            />
          ))}
        </div>
      ) : (
        <div className="empty-shortlist" role="status">
          <h3>No match yet.</h3>
          <p>
            Nothing in the current restaurant catalog satisfies every active hard constraint.
            DineMatch keeps those requirements intact instead of silently relaxing them.
          </p>
        </div>
      )}
      <p className="sample-disclaimer">
        Sample cards appear before your first search. New shortlists are requested from
        the FastAPI service, which runs the LangGraph workflow with its current catalog.
        Nearby searches use <a href="https://www.openstreetmap.org/copyright" rel="noreferrer" target="_blank">© OpenStreetMap contributors</a>.
      </p>
    </section>
  );
}
