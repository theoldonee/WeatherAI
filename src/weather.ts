import { Weather as WeatherInterface, WeatherData } from "./lib/services/shared-interfaces";

export class Weather implements WeatherInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    GetForcast(_longitiude: number, _latitude: number): WeatherData {
        // Return structured weather data
        return {
            probabilityOfRain: 25,
            humidity: 60,
            temp: 21,
        };
    }
}