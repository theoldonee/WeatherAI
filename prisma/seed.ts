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
    forcast: {
        probabilityOfRain : 20,
        humidity : 80,
        temp : 20,
    },
    longitude: 10,
    latitude: 15,

  },
  
];

export async function main() {
  for (const u of weatherData) {
    await prisma.weather.create({ data: u });
  }
}

main();