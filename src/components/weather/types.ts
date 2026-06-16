/**
 * Frontend TypeScript types for the WeatherAI dashboard.
 *
 * These interfaces reflect the actual POST /api/weather contract
 * defined in src/app/api/weather/route.ts — NOT the Controller
 * or EntryResponse interfaces (which are unused by the active route).
 */

/**
 * Form state: all fields are strings because HTML inputs are strings.
 * Converted to numbers before the API call.
 */
export interface WeatherFormState {
  latitude: string;
  longitude: string;
  temp: string;
  humidity: string;
  probabilityOfRain: string;
}

/**
 * The exact body sent to POST /api/weather.
 * All fields must be numbers as validated by the route handler.
 */
export interface WeatherApiRequest {
  latitude: number;
  longitude: number;
  temp: number;
  humidity: number;
  probabilityOfRain: number;
}

/**
 * The exact 200 OK response from POST /api/weather.
 * suitableActivities is string[] — the route handler returns the
 * raw array from generateWeatherSummary(), not the comma-joined string
 * produced by Controller.GetResponse().
 */
export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  temp: number;
  humidity: number;
  probabilityOfRain: number;
  summary: string;
  recommendation: string;
  suitableActivities: string[];
}

/**
 * Shape of error responses (400 / 500) from the route handler.
 */
export interface WeatherApiError {
  error: string;
}

/** Union for the async state machine inside WeatherDashboard */
export type FetchState = "idle" | "loading" | "success" | "error";
