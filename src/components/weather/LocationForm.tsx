"use client";

import { useRef } from "react";
import {
  MapPinIcon,
  ThermometerIcon,
  DropletIcon,
  CloudRainIcon,
  LocateIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { WeatherFormState } from "./types";

interface LocationFormProps {
  formData: WeatherFormState;
  isLoading: boolean;
  onChange: (field: keyof WeatherFormState, value: string) => void;
  onSubmit: () => void;
}

/**
 * LocationForm — Feature 2: Location & Weather Input Form
 *
 * Collects the five fields required by POST /api/weather:
 *   latitude, longitude, temp, humidity, probabilityOfRain
 *
 * Also provides a "Use My Location" button that calls
 * navigator.geolocation to auto-fill lat/lng. The user must still
 * supply weather metrics manually because Weather.GetForcast() is
 * a stub on the backend (returns hardcoded values, not a real API).
 *
 * All values are strings in state (HTML input default). The parent
 * WeatherDashboard converts them to numbers and validates before
 * calling the API.
 */
export function LocationForm({
  formData,
  isLoading,
  onChange,
  onSubmit,
}: LocationFormProps) {
  const latRef = useRef<HTMLInputElement>(null);

  function handleGeolocate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange("latitude", pos.coords.latitude.toFixed(4));
        onChange("longitude", pos.coords.longitude.toFixed(4));
      },
      () => {
        // Geolocation denied or unavailable — silently ignore;
        // the toast for this is handled in the dashboard.
      }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onSubmit();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Section: Coordinates ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            <MapPinIcon className="size-3.5" />
            Location Coordinates
          </p>
          <Button
            id="geolocate-btn"
            variant="ghost"
            size="xs"
            type="button"
            onClick={handleGeolocate}
            disabled={isLoading}
          >
            <LocateIcon className="size-3" />
            Use My Location
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="latitude-input"
              className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground"
            >
              Latitude
            </label>
            <Input
              id="latitude-input"
              ref={latRef}
              type="number"
              placeholder="-20.2"
              step="any"
              value={formData.latitude}
              onChange={(e) => onChange("latitude", e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Latitude"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="longitude-input"
              className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground"
            >
              Longitude
            </label>
            <Input
              id="longitude-input"
              type="number"
              placeholder="57.5"
              step="any"
              value={formData.longitude}
              onChange={(e) => onChange("longitude", e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Longitude"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Section: Weather Metrics ── */}
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
          <ThermometerIcon className="size-3.5" />
          Weather Metrics
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="temp-input"
              className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground"
            >
              Temp (°C)
            </label>
            <Input
              id="temp-input"
              type="number"
              placeholder="28"
              step="0.1"
              value={formData.temp}
              onChange={(e) => onChange("temp", e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Temperature in Celsius"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="humidity-input"
              className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground"
            >
              Humidity (%)
            </label>
            <Input
              id="humidity-input"
              type="number"
              placeholder="40"
              min="0"
              max="100"
              value={formData.humidity}
              onChange={(e) => onChange("humidity", e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Humidity percentage"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="rain-input"
              className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground"
            >
              Rain (%)
            </label>
            <Input
              id="rain-input"
              type="number"
              placeholder="5"
              min="0"
              max="100"
              value={formData.probabilityOfRain}
              onChange={(e) => onChange("probabilityOfRain", e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Probability of rain percentage"
            />
          </div>
        </div>

        {/* Metric icons legend */}
        <div className="grid grid-cols-3 gap-4 mt-1">
          <span className="flex items-center gap-1 text-[0.6rem] text-muted-foreground/60">
            <ThermometerIcon className="size-3" /> Temperature
          </span>
          <span className="flex items-center gap-1 text-[0.6rem] text-muted-foreground/60">
            <DropletIcon className="size-3" /> Humidity
          </span>
          <span className="flex items-center gap-1 text-[0.6rem] text-muted-foreground/60">
            <CloudRainIcon className="size-3" /> Rain chance
          </span>
        </div>
      </div>

      {/* ── Submit ── */}
      <Button
        id="get-forecast-btn"
        onClick={onSubmit}
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        <SparklesIcon className="size-4" />
        {isLoading ? "Generating AI Forecast…" : "Get AI Forecast"}
      </Button>
    </div>
  );
}
