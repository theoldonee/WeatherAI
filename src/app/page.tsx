import { AppHeader } from "@/components/weather/AppHeader";
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

/**
 * Home — The WeatherAI dashboard page.
 *
 * This is a Server Component. All interactivity is delegated to the
 * 'use client' WeatherDashboard and AppHeader components.
 *
 * Layout:
 *   - AppHeader (sticky, themed)
 *   - Main content area with bg-grid-pattern
 *     - WeatherDashboard (two-column: form | results)
 *   - Footer
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-background bg-grid-pattern">
      <AppHeader />

      <main className="flex-1 flex flex-col">
        <WeatherDashboard />
      </main>

      <footer className="border-t border-border py-6 px-6">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground">
            WeatherAI
          </p>
          <p className="text-[0.65rem] text-muted-foreground">
            Powered by Groq · LLaMA 3.1 8B Instant · Next.js 16
          </p>
        </div>
      </footer>
    </div>
  );
}

