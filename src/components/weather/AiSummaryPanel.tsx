"use client";

import { motion } from "framer-motion";
import { BrainCircuitIcon, ShieldAlertIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { WeatherApiResponse } from "./types";

interface AiSummaryPanelProps {
  data: WeatherApiResponse;
}

/**
 * AiSummaryPanel — Feature 4: AI Summary Panel
 *
 * Displays the two AI-generated text fields from POST /api/weather:
 *   - summary        → narrative weather description from LLaMA 3.1 8B
 *   - recommendation → actionable advice / safety warning
 *
 * In fallback mode (no GROQ_API_KEY), these fields are still populated
 * by getFallbackSummary() in src/ai.ts, so this component always has
 * something to render on a 200 OK response.
 *
 * An entrance animation fades and slides the panel up.
 */
const panelVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.35, duration: 0.5, ease: "easeOut" },
  },
};

export function AiSummaryPanel({ data }: AiSummaryPanelProps) {
  return (
    <motion.div
      id="ai-summary-panel"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BrainCircuitIcon className="size-4 text-muted-foreground" />
            <CardTitle>AI Forecast Summary</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* Summary */}
          <p
            id="ai-summary-text"
            className="text-sm leading-relaxed text-foreground"
          >
            {data.summary}
          </p>

          <Separator />

          {/* Recommendation */}
          <div
            id="ai-recommendation"
            className="flex gap-3 rounded-none border-l-2 border-primary pl-4 py-1"
          >
            <ShieldAlertIcon className="size-4 text-primary mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1">
              <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground">
                AI Recommendation
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {data.recommendation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
