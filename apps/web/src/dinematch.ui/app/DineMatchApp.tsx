import { useMemo, useState } from "react";
import type {
  DiningRequest,
  PreferenceKey,
  RecommendationService,
} from "../../dinematch.application/recommendations/contracts";
import type { CurrentLocationProvider } from "../../dinematch.application/location/ports/CurrentLocationProvider";
import type { SearchLocation } from "../../dinematch.application/location/contracts";
import type { ThemePreferenceStore } from "../../dinematch.application/theme/ThemePreferenceStore";
import { BrandMark } from "../components/BrandMark";
import { ThemeToggle } from "../components/ThemeToggle";
import { HeroSearch } from "../features/home/components/HeroSearch";
import { PreferenceChips } from "../features/home/components/PreferenceChips";
import { RecommendationPreview } from "../features/home/components/RecommendationPreview";
import { defaultLocation, defaultPrompt, preferenceOptions } from "../features/home/homeDefaults";
import { useCurrentLocation } from "../features/location/useCurrentLocation";
import { useRecommendationPreview } from "../features/recommendations/useRecommendationPreview";
import { useTheme } from "../features/theme/useTheme";

interface DineMatchAppProps {
  currentLocationProvider: CurrentLocationProvider;
  recommendationService: RecommendationService;
  themePreferenceStore: ThemePreferenceStore;
}

export function DineMatchApp({
  currentLocationProvider,
  recommendationService,
  themePreferenceStore,
}: DineMatchAppProps) {
  const { theme, toggleTheme } = useTheme(themePreferenceStore);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [location, setLocation] = useState<SearchLocation>({
    label: defaultLocation,
    source: "typed",
  });
  const {
    clearLocationError,
    isLocating,
    locationError,
    requestCurrentLocation,
  } = useCurrentLocation(currentLocationProvider);
  const [selectedKeys, setSelectedKeys] = useState(
    () => new Set(preferenceOptions.map((preference) => preference.key)),
  );
  const initialRequest = useMemo<DiningRequest>(
    () => ({
      prompt: defaultPrompt,
      location: { label: defaultLocation, source: "typed" },
      constraints: recommendationService.interpretPreferences(defaultPrompt, preferenceOptions),
    }),
    [recommendationService],
  );
  const {
    hasSearched,
    isSearching,
    results,
    status,
    findMatches,
  } = useRecommendationPreview(recommendationService, initialRequest);

  const interpretedPreferences = useMemo(
    () => recommendationService.interpretPreferences(prompt, preferenceOptions),
    [prompt, recommendationService],
  );
  const selectedPreferences = useMemo(
    () => interpretedPreferences.filter((preference) => selectedKeys.has(preference.key)),
    [interpretedPreferences, selectedKeys],
  );

  function togglePreference(key: PreferenceKey) {
    setSelectedKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);

      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }

      return nextKeys;
    });
  }

  function handleFindMatches() {
    findMatches({
      prompt,
      location,
      constraints: selectedPreferences,
    });
  }

  function handleLocationChange(label: string) {
    clearLocationError();
    setLocation({ label, source: "typed" });
  }

  async function handleUseCurrentLocation() {
    const coordinates = await requestCurrentLocation();

    if (!coordinates) {
      return;
    }

    setLocation({
      label: "Current location",
      source: "browser",
      coordinates,
    });
  }

  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="page-container site-header__inner">
          <BrandMark />
          <ThemeToggle onToggle={toggleTheme} theme={theme} />
        </div>
      </header>

      <main id="main-content">
        <section className="hero-section">
          <div className="page-container hero-layout">
            <div className="hero-layout__search">
              <HeroSearch
                isSearching={isSearching}
                isLocating={isLocating}
                location={location.label}
                locationError={locationError}
                locationNotice={
                  location.source === "browser"
                    ? "Using your device location for distance and walking-time matching."
                    : undefined
                }
                onLocationChange={handleLocationChange}
                onPromptChange={setPrompt}
                onSubmit={handleFindMatches}
                onUseCurrentLocation={handleUseCurrentLocation}
                prompt={prompt}
                status={status}
              />
              <PreferenceChips
                onToggle={togglePreference}
                options={interpretedPreferences}
                selectedKeys={selectedKeys}
              />
              <p className="constraint-promise">
                <strong>{selectedPreferences.length} preference signals selected.</strong>
                Hard constraints stay hard - DineMatch will ask before relaxing one.
              </p>
            </div>
            <div className="hero-layout__results">
              <RecommendationPreview
                hasSearched={hasSearched}
                isSearching={isSearching}
                restaurants={results}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
