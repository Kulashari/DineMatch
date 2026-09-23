import type { CurrentLocationProvider } from "../../dinematch.application/location/ports/CurrentLocationProvider";
import { CurrentLocationError } from "../../dinematch.application/location/ports/CurrentLocationProvider";
import type { LocationCoordinates } from "../../dinematch.application/location/contracts";

/** Browser adapter for a consent-based current-location request. */
export class BrowserCurrentLocationProvider implements CurrentLocationProvider {
  getCurrentCoordinates(): Promise<LocationCoordinates> {
    if (!navigator.geolocation) {
      return Promise.reject(
        new CurrentLocationError("This browser does not support current location."),
      );
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: position.coords.accuracy,
          });
        },
        (error) => {
          const message =
            error.code === error.PERMISSION_DENIED
              ? "Location access was denied. You can still enter a starting point."
              : error.code === error.TIMEOUT
                ? "Finding your location took too long. Please try again or enter a starting point."
                : "Your current location is unavailable. Please enter a starting point.";

          reject(new CurrentLocationError(message));
        },
        {
          enableHighAccuracy: false,
          maximumAge: 300_000,
          timeout: 10_000,
        },
      );
    });
  }
}
