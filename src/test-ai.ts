import { generateWeatherSummary } from "./ai";
import "dotenv/config";

async function runTest() {
  const mockWeatherData = {
    temp: 24,
    humidity: 60,
    probabilityOfRain: 15,
    latitude: 37.7749,
    longitude: -122.4194
  };

  console.log("Testing generateWeatherSummary with mock data:", mockWeatherData);
  console.log("GROQ_API_KEY is currently set to:", process.env.GROQ_API_KEY ? "Defined" : "Undefined");
  
  const startTime = Date.now();
  const result = await generateWeatherSummary(mockWeatherData);
  const duration = Date.now() - startTime;
  
  console.log(`\nResult received in ${duration}ms:`);
  console.log(JSON.stringify(result, null, 2));
}

runTest().catch((err) => {
  console.error("Test execution failed:", err);
});
