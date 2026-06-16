"use client";

import { motion } from "framer-motion";
import {
  ThermometerIcon,
  DropletIcon,
  CloudRainIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
} from "@/components/ui/progress";
import type { WeatherApiResponse } from "./types";

interface MetricCardsProps {
  data: WeatherApiResponse;
}

/**
 * MetricCards — Feature 3: Metric Display Cards
 *
 * Renders three animated cards for the three weather metrics
 * returned by POST /api/weather:
 *   - temp          → displayed as °C, progress out of 50°C max
 *   - humidity      → displayed as %, progress 0–100
 *   - probabilityOfRain → displayed as %, progress 0–100
 *
 * Each card uses a Framer Motion entrance animation and the
 * Progress component from @/components/ui/progress (Base UI).
 */

interface Metric {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  max: number;
  icon: React.ReactNode;
  colorClass: string;
  description: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export function MetricCards({ data }: MetricCardsProps) {
  const metrics: Metric[] = [
    {
      id: "metric-temperature",
      label: "Temperature",
      value: Math.max(0, Math.min(data.temp, 50)),
      displayValue: `${data.temp}°C`,
      max: 50,
      icon: <ThermometerIcon className="size-4 text-muted-foreground" />,
      colorClass: "bg-amber-500",
      description:
        data.temp >= 30
          ? "Very warm"
          : data.temp >= 20
          ? "Pleasant"
          : data.temp >= 10
          ? "Cool"
          : "Cold",
    },
    {
      id: "metric-humidity",
      label: "Humidity",
      value: data.humidity,
      displayValue: `${data.humidity}%`,
      max: 100,
      icon: <DropletIcon className="size-4 text-muted-foreground" />,
      colorClass: "bg-blue-500",
      description:
        data.humidity >= 80
          ? "Very humid"
          : data.humidity >= 60
          ? "Humid"
          : data.humidity >= 40
          ? "Comfortable"
          : "Dry",
    },
    {
      id: "metric-rain",
      label: "Rain Probability",
      value: data.probabilityOfRain,
      displayValue: `${data.probabilityOfRain}%`,
      max: 100,
      icon: <CloudRainIcon className="size-4 text-muted-foreground" />,
      colorClass: "bg-sky-500",
      description:
        data.probabilityOfRain >= 70
          ? "Very likely"
          : data.probabilityOfRain >= 40
          ? "Possible"
          : "Unlikely",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.id}
          id={metric.id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card size="sm" className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs">{metric.label}</CardTitle>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="font-heading text-3xl font-semibold tracking-tight text-foreground leading-none">
                {metric.displayValue}
              </p>
              <Progress
                value={(metric.value / metric.max) * 100}
                aria-label={`${metric.label}: ${metric.displayValue}`}
              >
                <ProgressLabel className="sr-only">
                  {metric.label}
                </ProgressLabel>
                <span className="ml-auto text-[0.65rem] text-muted-foreground">
                  {metric.description}
                </span>
              </Progress>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
