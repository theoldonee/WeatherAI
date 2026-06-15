import Groq from "groq-sdk";

export interface WeatherInput {
  temp: number;
  humidity: number;
  probabilityOfRain: number;
  latitude: number;
  longitude: number;
}

export interface AiSummaryResponse {
  summary: string;
  recommendation: string;
  suitableActivities: string[];
}

export async function generateWeatherSummary(
  data: WeatherInput
): Promise<AiSummaryResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY is not defined in process.env. Returning fallback weather summary.");
    return getFallbackSummary(data);
  }

  try {
    const groq = new Groq({ apiKey });
    const prompt = `You are a weather assistant. Given the following weather data, generate a summary, a recommendation, and a list of suitable activities.

Weather Data:
- Temperature: ${data.temp}°C
- Humidity: ${data.humidity}%
- Probability of Rain: ${data.probabilityOfRain}%
- Location: Latitude ${data.latitude}, Longitude ${data.longitude}

Respond ONLY with a JSON object. Do not include any markdown formatting or backticks.
The JSON object must have exactly these keys:
{
  "summary": "A concise summary of the weather",
  "recommendation": "A recommendation based on the weather",
  "suitableActivities": ["Activity 1", "Activity 2", ...]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Groq API");
    }

    // Clean any potential markdown wrappers if the model didn't follow the instruction perfectly
    let jsonString = content.trim();
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.slice(7);
    }
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.slice(3);
    }
    if (jsonString.endsWith("```")) {
      jsonString = jsonString.slice(0, -3);
    }
    jsonString = jsonString.trim();

    const result = JSON.parse(jsonString);

    return {
      summary: result.summary || "No summary available.",
      recommendation: result.recommendation || "No recommendation available.",
      suitableActivities: Array.isArray(result.suitableActivities)
        ? result.suitableActivities
        : ["No activities listed."],
    };
  } catch (error) {
    console.error("Failed to generate weather summary using Groq:", error);
    return getFallbackSummary(data);
  }
}

function getFallbackSummary(data: WeatherInput): AiSummaryResponse {
  let summary = `The weather is currently ${data.temp}°C with ${data.humidity}% humidity.`;
  let recommendation = "Enjoy your day!";
  let suitableActivities = ["General indoor activities"];

  if (data.probabilityOfRain > 50) {
    summary += " It is likely to rain.";
    recommendation = "Don't forget your umbrella!";
    suitableActivities = ["Reading", "Watching a movie", "Indoor games"];
  } else if (data.temp > 30) {
    summary += " It is quite hot outside.";
    recommendation = "Stay hydrated and avoid direct sunlight.";
    suitableActivities = ["Swimming", "Indoor exercise", "Staying in AC"];
  } else if (data.temp < 10) {
    summary += " It is cold outside.";
    recommendation = "Wear warm clothes.";
    suitableActivities = ["Drinking hot chocolate", "Indoor board games"];
  } else {
    summary += " The weather is pleasant.";
    recommendation = "A good day for outdoor activities.";
    suitableActivities = ["Walking in the park", "Cycling", "Sightseeing"];
  }

  return {
    summary,
    recommendation,
    suitableActivities,
  };
}

export class Ai {
  async GetSummery(weatherData: any): Promise<any> {
    return generateWeatherSummary({
      temp: weatherData.temp,
      humidity: weatherData.humidity,
      probabilityOfRain: weatherData.probabilityOfRain,
      latitude: 0,
      longitude: 0,
    });
  }
}