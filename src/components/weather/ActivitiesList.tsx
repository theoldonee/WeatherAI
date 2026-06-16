"use client";

import { motion } from "framer-motion";
import { PersonStandingIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { WeatherApiResponse } from "./types";

interface ActivitiesListProps {
  activities: WeatherApiResponse["suitableActivities"];
}

/**
 * ActivitiesList — Feature 5: Suitable Activities List
 *
 * Renders the suitableActivities array from POST /api/weather.
 *
 * The route handler (src/app/api/weather/route.ts) returns this field
 * as string[] — the raw array from generateWeatherSummary() — NOT the
 * comma-joined string produced by Controller.GetResponse() which is
 * not wired to any route.
 *
 * Each activity renders as a styled pill tag with a staggered
 * Framer Motion entrance animation.
 */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function ActivitiesList({ activities }: ActivitiesListProps) {
  if (!activities || activities.length === 0) return null;

  return (
    <Card id="activities-panel">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PersonStandingIcon className="size-4 text-muted-foreground" />
          <CardTitle>Suitable Activities</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <motion.ul
          className="flex flex-wrap gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          role="list"
          aria-label="Suitable activities for current weather"
        >
          {activities.map((activity, index) => (
            <motion.li
              key={`activity-${index}`}
              variants={itemVariants}
              className="inline-flex items-center rounded-none border border-border bg-secondary px-3 py-1.5 text-[0.65rem] font-semibold tracking-widest uppercase text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground cursor-default select-none"
              role="listitem"
            >
              {activity}
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
}
