import { PrismaClient, Prisma } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const weatherData = [
  {
    created_at: new Date(),
    probability_of_rain: 20,
    humidity: 80,
    temp_c: 20,
    longitude: 10,
    latitude: 15,
    summary: "Cloudy and humid.",
    recommendation: "Take an umbrella just in case.",
    suitable_activities: "Indoor games, Reading",
  },
];

export async function main() {
  for (const u of weatherData) {
    await prisma.weather.create({ data: u });
  }
}

main();