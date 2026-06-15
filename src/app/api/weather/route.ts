import { NextRequest, NextResponse } from "next/server";
import { generateWeatherSummary } from "@/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, temp, humidity, probabilityOfRain } = body;

    // Validate required fields
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      typeof temp !== "number" ||
      typeof humidity !== "number" ||
      typeof probabilityOfRain !== "number"
    ) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid fields. Required: latitude, longitude, temp, humidity, probabilityOfRain (all numbers).",
        },
        { status: 400 }
      );
    }

    const aiResult = await generateWeatherSummary({
      temp,
      humidity,
      probabilityOfRain,
      latitude,
      longitude,
    });

    return NextResponse.json({
      latitude,
      longitude,
      temp,
      humidity,
      probabilityOfRain,
      summary: aiResult.summary,
      recommendation: aiResult.recommendation,
      suitableActivities: aiResult.suitableActivities,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
