"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { SparklesIcon, CompassIcon } from "lucide-react";
import { MapPicker } from "./MapPicker";
import { MetricCards } from "./MetricCards";
import { AiSummaryPanel } from "./AiSummaryPanel";
import { ActivitiesList } from "./ActivitiesList";
import { ResultSkeleton } from "./ResultSkeleton";
import { Button } from "@/components/ui/button";
import type {
  WeatherApiRequest,
  WeatherApiResponse,
  FetchState,
} from "./types";
import "leaflet/dist/leaflet.css";

/**
 * WeatherDashboard — Main Orchestration Component
 *
 * This is the top-level 'use client' component. It owns all state:
 *   - coords:     { latitude, longitude } from the MapPicker
 *   - fetchState: idle | loading | success | error
 *   - result:     the WeatherApiResponse or null
 *
 * API Integration: POST /api/weather
 *   - Request body: { latitude, longitude }
 *   - Route handler calls Controller.GetResponse()
 *   - Controller handles: DB cache check → Weather stub → AI Generation → DB save
 */

export function WeatherDashboard() {
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [result, setResult] = useState<WeatherApiResponse | null>(null);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setCoords({ lat, lng });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (coords.lat === null || coords.lng === null) {
      toast.error("Please select a location on the map first.");
      return;
    }

    const requestBody: WeatherApiRequest = {
      latitude: coords.lat,
      longitude: coords.lng,
    };

    setFetchState("loading");
    setResult(null);

    try {
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error ?? "Something went wrong. Please try again.";
        toast.error(message);
        setFetchState("error");
        return;
      }

      setResult(data as WeatherApiResponse);
      setFetchState("success");
      toast.success("AI forecast generated successfully.");
    } catch (err) {
      console.error("WeatherDashboard fetch error:", err);
      toast.error("Network error. Check your connection and try again.");
      setFetchState("error");
    }
  }, [coords]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 flex flex-col gap-10">
      {/* ── Page heading ── */}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Weather Forecast
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
          Drop a pin on the map to receive an AI-generated summary,
          recommendation, and activity suggestions powered by LLaMA 3.1.
        </p>
      </div>

      {/* ── Main layout: map left | results right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Input panel (Map) */}
        <aside
          className="lg:sticky lg:top-24 flex flex-col gap-6 p-6 rounded-none border border-border bg-card shadow-sm"
          aria-label="Location selection"
        >
          <div className="flex items-center gap-2 mb-2">
            <CompassIcon className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              Select Location
            </h2>
          </div>

          <MapPicker
            latitude={coords.lat}
            longitude={coords.lng}
            onLocationSelect={handleLocationSelect}
            isLoading={fetchState === "loading"}
          />

          <Button
            id="get-forecast-btn"
            onClick={handleSubmit}
            disabled={fetchState === "loading" || coords.lat === null}
            size="lg"
            className="w-full"
          >
            <SparklesIcon className="size-4 mr-2" />
            {fetchState === "loading" ? "Generating Forecast…" : "Get AI Forecast"}
          </Button>
        </aside>

        {/* Results panel */}
        <section aria-label="Forecast results" aria-live="polite">
          {fetchState === "idle" && (
            <div
              id="idle-placeholder"
              className="flex flex-col items-center justify-center h-64 rounded-none border border-dashed border-border text-center px-8 gap-3"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Awaiting Selection
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Drop a pin on the map and click <strong>Get AI Forecast</strong>{" "}
                to see results.
              </p>
            </div>
          )}

          {fetchState === "loading" && <ResultSkeleton />}

          {fetchState === "success" && result && (
            <div className="flex flex-col gap-6">
              <MetricCards data={result} />
              <AiSummaryPanel data={result} />
              <ActivitiesList activities={result.suitableActivities} />
            </div>
          )}

          {fetchState === "error" && (
            <div
              id="error-state"
              className="flex flex-col items-center justify-center h-64 rounded-none border border-dashed border-destructive/40 bg-destructive/5 text-center px-8 gap-3"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-destructive">
                Request Failed
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Check the toast notification for details and try another location.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
