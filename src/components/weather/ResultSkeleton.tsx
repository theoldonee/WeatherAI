import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ResultSkeleton — Feature 6: Loading State
 *
 * Shown during the POST /api/weather call (1–3 seconds per WEATHER_AI.md).
 * Mirrors the exact layout of MetricCards + AiSummaryPanel + ActivitiesList
 * so there is no layout shift when the real data arrives.
 *
 * This is a server component (no "use client" needed — no interactivity).
 */
export function ResultSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading forecast results">
      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Card key={i} size="sm">
            <CardHeader>
              <Skeleton className="h-3 w-24 rounded-none" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Skeleton className="h-8 w-16 rounded-none" />
              <Skeleton className="h-0.5 w-full rounded-none" />
              <Skeleton className="h-3 w-20 rounded-none" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI summary skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-3 w-40 rounded-none" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-3 w-full rounded-none" />
          <Skeleton className="h-3 w-5/6 rounded-none" />
          <Skeleton className="h-3 w-4/6 rounded-none" />

          <div className="h-px bg-border" />

          <div className="flex gap-3 pl-4 border-l-2 border-muted">
            <Skeleton className="h-4 w-4 shrink-0 rounded-none" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-3 w-32 rounded-none" />
              <Skeleton className="h-3 w-full rounded-none" />
              <Skeleton className="h-3 w-3/4 rounded-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-3 w-36 rounded-none" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[80, 96, 72, 112, 88].map((w, i) => (
              <Skeleton
                key={i}
                className="h-7 rounded-none"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
