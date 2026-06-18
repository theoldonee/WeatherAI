/**
 * Frontend TypeScript types for the WeatherAI dashboard.
 *
 * These interfaces reflect the actual POST /api/weather contract —
 * now wired through the Controller (only lat/lng sent, full data returned).
 * Aligned with EntryResponse from src/lib/services/shared-interfaces.ts
 */

/**
 * Form/map state: only coordinates are needed.
 * The Controller fetches weather and AI data internally.
 */
export interface WeatherFormState {
  latitude: string;
  longitude: string;
}

/**
 * The exact body sent to POST /api/weather.
 * Only lat/lng — Controller handles the rest.
 */
export interface WeatherApiRequest {
  latitude: number;
  longitude: number;
}

/**
 * The exact 200 OK response from POST /api/weather (via Controller.GetResponse).
 * Matches EntryResponse from shared-interfaces.ts.
 * suitableActivities is a comma-joined string (e.g. "Hiking, Cycling, Running").
 */
export interface WeatherApiResponse {
  longitiude: number; // backend typo preserved from shared-interfaces
  longitude: number;
  latitude: number;
  probabilityOfRain: number;
  humidity: number;
  temp: number;
  summary: string;
  recommendation: string;
  suitableActivities: string; // comma-joined string, NOT array
}

/**
 * Shape of error responses (400 / 500) from the route handler.
 */
export interface WeatherApiError {
  error: string;
}

/** Union for the async state machine inside WeatherDashboard */
export type FetchState = "idle" | "loading" | "success" | "error";
