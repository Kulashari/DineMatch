import { ArrowRight, LocateFixed, Sparkles } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "../../../components/Button";

interface HeroSearchProps {
  isLocating: boolean;
  isSearching: boolean;
  location: string;
  locationError: string | null;
  locationNotice?: string;
  prompt: string;
  status: string;
  onLocationChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onUseCurrentLocation: () => void;
}

export function HeroSearch({
  isLocating,
  isSearching,
  location,
  locationError,
  locationNotice,
  prompt,
  status,
  onLocationChange,
  onPromptChange,
  onSubmit,
  onUseCurrentLocation,
}: HeroSearchProps) {
  const [errors, setErrors] = useState<{ location?: string; prompt?: string }>({});
  const locationDescribedBy = [
    errors.location ? "starting-point-error" : undefined,
    locationError ? "location-access-error" : undefined,
    locationNotice ? "location-status" : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: { location?: string; prompt?: string } = {};

    if (!prompt.trim()) {
      nextErrors.prompt = "Describe the meal you want before finding matches.";
    }

    if (!location.trim()) {
      nextErrors.location = "Add a neighbourhood or address so distance can be considered.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit();
  }

  function handlePromptChange(value: string) {
    if (errors.prompt) {
      setErrors((currentErrors) => ({ ...currentErrors, prompt: undefined }));
    }

    onPromptChange(value);
  }

  function handleLocationChange(value: string) {
    if (errors.location) {
      setErrors((currentErrors) => ({ ...currentErrors, location: undefined }));
    }

    onLocationChange(value);
  }

  return (
    <section className="hero-copy" aria-labelledby="hero-heading">
      <div className="eyebrow">
        <Sparkles aria-hidden="true" size={15} strokeWidth={2.5} />
        <span>Restaurant recommendations, explained</span>
      </div>
      <h1 id="hero-heading">Find the right table, not another endless list.</h1>
      <p className="hero-copy__description">
        Tell DineMatch the kind of meal you want. It balances your details,
        preserves hard constraints, and shows why every recommendation fits.
      </p>

      <form className="search-form" noValidate onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="meal-request">What are you in the mood for?</label>
          <textarea
            aria-describedby={errors.prompt ? "meal-request-error" : undefined}
            aria-invalid={Boolean(errors.prompt)}
            id="meal-request"
            name="meal-request"
            onChange={(event) => handlePromptChange(event.target.value)}
            placeholder="e.g., A quiet vegetarian dinner close to home"
            required
            rows={3}
            value={prompt}
          />
          {errors.prompt && (
            <p className="field-error" id="meal-request-error" role="alert">
              {errors.prompt}
            </p>
          )}
        </div>
        <div className="search-form__bottom-row">
          <div className="field-group field-group--location">
            <label htmlFor="starting-point">Starting point</label>
            <div className="input-with-icon">
              <LocateFixed aria-hidden="true" size={18} strokeWidth={2} />
              <input
                aria-describedby={locationDescribedBy}
                aria-invalid={Boolean(errors.location || locationError)}
                id="starting-point"
                name="starting-point"
                onChange={(event) => handleLocationChange(event.target.value)}
                placeholder="Neighbourhood or address"
                required
                type="text"
                value={location}
              />
            </div>
            <div className="location-field__actions">
              <Button
                className="location-action"
                disabled={isLocating || isSearching}
                onClick={onUseCurrentLocation}
                type="button"
                variant="secondary"
              >
                <LocateFixed aria-hidden="true" size={16} strokeWidth={2.2} />
                <span>{isLocating ? "Finding location" : "Use my location"}</span>
              </Button>
              {locationNotice && (
                <p aria-live="polite" className="location-note" id="location-status">
                  {locationNotice}
                </p>
              )}
            </div>
            {errors.location && (
              <p className="field-error" id="starting-point-error" role="alert">
                {errors.location}
              </p>
            )}
            {locationError && (
              <p className="field-error" id="location-access-error" role="alert">
                {locationError}
              </p>
            )}
          </div>
          <Button className="search-form__submit" disabled={isSearching} type="submit">
            <span>{isSearching ? "Finding matches" : "Find my match"}</span>
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
          </Button>
        </div>
        <p aria-atomic="true" aria-live="polite" className="search-status" role="status">
          <span className={isSearching ? "status-dot status-dot--active" : "status-dot"} aria-hidden="true" />
          {status}
        </p>
      </form>
    </section>
  );
}
