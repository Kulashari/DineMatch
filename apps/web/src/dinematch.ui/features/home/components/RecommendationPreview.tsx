import { BadgeCheck, RefreshCw } from "lucide-react";
import { RestaurantCard } from "./RestaurantCard";
import type { Restaurant } from "../../../../dinematch.application/recommendations/contracts";

interface RecommendationPreviewProps {
  hasSearched: boolean;
  isSearching: boolean;
  restaurants: Restaurant[];
}

export function RecommendationPreview({
  hasSearched,
  isSearching,
  restaurants,
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
          {hasSearched ? "Updated local preview" : "Local preview"}
        </span>
      </div>
      <p className="recommendation-preview__intro">
        {isSearching
          ? "DineMatch is processing the same five steps the production recommendation graph will use."
          : "Representative local fixtures show how DineMatch makes trade-offs visible before you decide where to go."}
      </p>
      {isSearching && (
        <div className="preview-progress" role="status">
          <RefreshCw aria-hidden="true" className="spinner" size={16} strokeWidth={2.2} />
          Updating the shortlist…
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
          <h3>No local sample match yet.</h3>
          <p>
            Nothing in this prototype catalog satisfies every active hard constraint.
            DineMatch keeps those requirements intact instead of silently relaxing them.
          </p>
        </div>
      )}
      <p className="sample-disclaimer">
        This prototype re-ranks local sample fixtures from your input and can capture
        your device location. Live restaurant, map, and evidence validation data will
        be connected through the FastAPI service.
      </p>
    </section>
  );
}
