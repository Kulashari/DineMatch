import { useState } from "react";
import {
  CurrentLocationError,
  type CurrentLocationProvider,
} from "../../../dinematch.application/location/ports/CurrentLocationProvider";
import type { LocationCoordinates } from "../../../dinematch.application/location/contracts";

export function useCurrentLocation(provider: CurrentLocationProvider) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  async function requestCurrentLocation(): Promise<LocationCoordinates | null> {
    setIsLocating(true);
    setLocationError(null);

    try {
      return await provider.getCurrentCoordinates();
    } catch (error) {
      setLocationError(
        error instanceof CurrentLocationError
          ? error.message
          : "Your current location is unavailable. Please enter a starting point.",
      );
      return null;
    } finally {
      setIsLocating(false);
    }
  }

  function clearLocationError() {
    setLocationError(null);
  }

  return {
    clearLocationError,
    isLocating,
    locationError,
    requestCurrentLocation,
  };
}
