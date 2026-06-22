import { Weather as WeatherInterface, WeatherData } from "./lib/services/shared-interfaces";

export class Weather implements WeatherInterface {
    async GetForcast(longitiude: number, latitude: number): Promise<WeatherData> {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitiude}&current=temperature_2m,relative_humidity_2m&hourly=precipitation_probability&forecast_days=1`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Open-Meteo API responded with status ${response.status}`);
            }

            const data = await response.json();
            
            const temp = data?.current?.temperature_2m;
            const humidity = data?.current?.relative_humidity_2m;
            const probabilityOfRain = data?.hourly?.precipitation_probability?.[0] ?? 0;

            if (temp === undefined || humidity === undefined) {
                throw new Error("Missing required weather parameters in API response");
            }

            return {
                temp: Math.round(temp),
                humidity: Math.round(humidity),
                probabilityOfRain: Math.round(probabilityOfRain),
            };
        } catch (error) {
            console.error("Error fetching live weather from Open-Meteo. Falling back to default values:", error);
            return {
                temp: 21,
                humidity: 60,
                probabilityOfRain: 25,
            };
        }
    }
}