export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

export type LocationSource = "browser" | "typed";

/** A user-selected starting point that can be sent to a restaurant provider. */
export interface SearchLocation {
  label: string;
  source: LocationSource;
  coordinates?: LocationCoordinates;
}
