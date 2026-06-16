"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { LocationForm } from "./LocationForm";
import { MetricCards } from "./MetricCards";
import { AiSummaryPanel } from "./AiSummaryPanel";
import { ActivitiesList } from "./ActivitiesList";
import { ResultSkeleton } from "./ResultSkeleton";
import type {
  WeatherFormState,
  WeatherApiRequest,
  WeatherApiResponse,
  FetchState,
} from "./types";

/**
 * WeatherDashboard — Main Orchestration Component
 *
 * This is the top-level 'use client' component. It owns all state:
 *   - formData:   the five input fields (strings)
 *   - fetchState: idle | loading | success | error
 *   - result:     the WeatherApiResponse or null
 *
 * API Integration: POST /api/weather
 *   - Endpoint defined in src/app/api/weather/route.ts
 *   - Request body: { latitude, longitude, temp, humidity, probabilityOfRain }
 *     all must be numbers (validated by the route handler)
 *   - Success (200): returns summary, recommendation, suitableActivities (string[])
 *   - Error (400): missing/invalid fields
 *   - Error (500): internal server error
 *
 * Backend notes documented in implementation_plan.md:
 *   - Weather module is a stub → user must supply all 5 fields manually
 *   - Controller/DB cache not wired → every request hits Groq (~1–3s)
 *   - suitableActivities is string[] (not comma-joined string from Controller)
 */

const INITIAL_FORM: WeatherFormState = {
  latitude: "",
  longitude: "",
  temp: "",
  humidity: "",
  probabilityOfRain: "",
};

/** Parse and validate a numeric field from the form. Returns null if invalid. */
function parseNumber(value: string, label: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    toast.error(`${label} is required.`);
    return null;
  }
  const n = Number(trimmed);
  if (isNaN(n)) {
    toast.error(`${label} must be a valid number.`);
    return null;
  }
  return n;
}

/** Validate that percentage fields are within [0, 100]. */
function validatePercent(value: number, label: string): boolean {
  if (value < 0 || value > 100) {
    toast.error(`${label} must be between 0 and 100.`);
    return false;
  }
  return true;
}

export function WeatherDashboard() {
  const [formData, setFormData] = useState<WeatherFormState>(INITIAL_FORM);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [result, setResult] = useState<WeatherApiResponse | null>(null);

  const handleChange = useCallback(
    (field: keyof WeatherFormState, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    // ── 1. Parse and validate all five fields ──────────────────────────────
    const latitude = parseNumber(formData.latitude, "Latitude");
    if (latitude === null) return;

    const longitude = parseNumber(formData.longitude, "Longitude");
    if (longitude === null) return;

    const temp = parseNumber(formData.temp, "Temperature");
    if (temp === null) return;

    const humidity = parseNumber(formData.humidity, "Humidity");
    if (humidity === null) return;
    if (!validatePercent(humidity, "Humidity")) return;

    const probabilityOfRain = parseNumber(
      formData.probabilityOfRain,
      "Rain probability"
    );
    if (probabilityOfRain === null) return;
    if (!validatePercent(probabilityOfRain, "Rain probability")) return;

    const requestBody: WeatherApiRequest = {
      latitude,
      longitude,
      temp,
      humidity,
      probabilityOfRain,
    };

    // ── 2. Call POST /api/weather ──────────────────────────────────────────
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
        // Route returns { error: string } on 400/500
        const message =
          data?.error ?? "Something went wrong. Please try again.";
        toast.error(message);
        setFetchState("error");
        return;
      }

      // ── 3. Success ──────────────────────────────────────────────────────
      setResult(data as WeatherApiResponse);
      setFetchState("success");
      toast.success("AI forecast generated successfully.");
    } catch (err) {
      // Network errors (no response at all)
      console.error("WeatherDashboard fetch error:", err);
      toast.error("Network error. Check your connection and try again.");
      setFetchState("error");
    }
  }, [formData]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 flex flex-col gap-10">
      {/* ── Page heading ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Weather Forecast
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
          Enter your location coordinates and current weather metrics to receive
          an AI-generated summary, recommendation, and activity suggestions
          powered by LLaMA 3.1.
        </p>
      </div>

      {/* ── Main layout: form left | results right ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Input panel */}
        <aside
          className="lg:sticky lg:top-24 rounded-none border border-border bg-card p-8 shadow-sm"
          aria-label="Weather input form"
        >
          <LocationForm
            formData={formData}
            isLoading={fetchState === "loading"}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </aside>

        {/* Results panel */}
        <section aria-label="Forecast results" aria-live="polite">
          {fetchState === "idle" && (
            <div
              id="idle-placeholder"
              className="flex flex-col items-center justify-center h-64 rounded-none border border-dashed border-border text-center px-8 gap-3"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Awaiting Input
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Fill in the form and click <strong>Get AI Forecast</strong> to
                see results.
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
                Check the toast notification for details, then correct your
                inputs and try again.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
