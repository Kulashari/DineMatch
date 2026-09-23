import type { LocationCoordinates } from "../contracts";

export class CurrentLocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CurrentLocationError";
  }
}

export interface CurrentLocationProvider {
  getCurrentCoordinates(): Promise<LocationCoordinates>;
}
