import { ChevronDown, MapPinned, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import type { Restaurant } from "../../../../dinematch.application/recommendations/contracts";

interface RestaurantCardProps {
  restaurant: Restaurant;
  position: number;
}

export function RestaurantCard({ restaurant, position }: RestaurantCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const detailsId = `${restaurant.id}-details`;

  return (
    <article className={`restaurant-card ${position === 1 ? "restaurant-card--featured" : ""}`}>
      <div className="restaurant-card__topline">
        <span className="restaurant-card__position">0{position}</span>
        <span className="match-score">{restaurant.matchScore}% match</span>
      </div>
      <div className="restaurant-card__title-row">
        <div>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.cuisine} · {restaurant.price}</p>
        </div>
        <span className="rating" aria-label={`${restaurant.rating} out of 5 rating`}>
          <Star aria-hidden="true" fill="currentColor" size={15} strokeWidth={2} />
          {restaurant.rating.toFixed(1)}
        </span>
      </div>
      <ul className="restaurant-card__facts" aria-label={`${restaurant.name} details`}>
        <li>{restaurant.walkTime}</li>
        <li>{restaurant.dietaryFit}</li>
      </ul>
      <div className="verified-note">
        <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.3} />
        <span>Fit validation modeled in this prototype</span>
      </div>
      <p className="restaurant-card__rationale">{restaurant.rationale}</p>

      <div className="restaurant-card__actions">
        <button
          aria-controls={detailsId}
          aria-expanded={showDetails}
          className="text-button"
          onClick={() => setShowDetails((isVisible) => !isVisible)}
          type="button"
        >
          {showDetails ? "Hide trade-off" : "See trade-off"}
          <ChevronDown aria-hidden="true" className={showDetails ? "icon-rotated" : ""} size={16} />
        </button>
        <button
          aria-describedby={`${restaurant.id}-map-note`}
          className="map-link map-link--disabled"
          disabled
          type="button"
        >
          <MapPinned aria-hidden="true" size={16} strokeWidth={2} />
          Maps soon
        </button>
        <span className="sr-only" id={`${restaurant.id}-map-note`}>
          Live maps will be available once restaurant data is connected.
        </span>
      </div>

      {showDetails && (
        <p className="tradeoff" id={detailsId}>
          <strong>Trade-off:</strong> {restaurant.tradeoff}
        </p>
      )}
    </article>
  );
}
