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
 * Renders the suitableActivities from POST /api/weather.
 * The Controller joins activities into a single comma-separated string
 * (e.g., "Hiking, Cycling, Running"). This component splits it back
 * into an array for rendering.
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
  if (!activities) return null;

  // Split comma-separated string into an array and clean up whitespace
  const activityArray = activities
    .split(",")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);

  if (activityArray.length === 0) return null;

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
          {activityArray.map((activity, index) => (
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
