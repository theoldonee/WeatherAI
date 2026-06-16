"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, CloudSunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * AppHeader — Feature 1: App Shell & Header
 *
 * Displays the WeatherAI brand, a short tagline, and a dark/light
 * mode toggle powered by next-themes (already installed).
 * No backend connection — purely presentational.
 */
export function AppHeader() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch by only rendering the toggle client-side
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center rounded-none bg-primary p-2">
            <CloudSunIcon className="size-5 text-primary-foreground" />
          </span>
          <div>
            <p className="font-heading text-base font-semibold tracking-wider uppercase text-foreground leading-none">
              WeatherAI
            </p>
            <p className="text-[0.65rem] tracking-widest uppercase text-muted-foreground leading-none mt-0.5">
              AI-Powered Forecast
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            id="theme-toggle"
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
