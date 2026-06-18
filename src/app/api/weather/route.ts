import { NextRequest, NextResponse } from "next/server";
import { Controller } from "@/controller";

const controller = new Controller();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude } = body;

    // Validate: UI only sends lat/lng — Controller handles everything else
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        {
          error:
            "Missing or invalid fields. Required: latitude and longitude (both numbers).",
        },
        { status: 400 }
      );
    }

    // Controller handles: DB cache check → Weather fetch → AI generation → DB save
    const result = await controller.GetResponse({
      longitiude: longitude, // preserve backend typo from shared-interfaces
      latitude,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
