import { Weather as WeatherInterface, WeatherData } from "./lib/services/shared-interfaces";

export class Weather implements WeatherInterface {
    GetForcast(_longitiude: number, _latitude: number): WeatherData {
        // Return structured weather data
        return {
            probabilityOfRain: 25,
            humidity: 60,
            temp: 21,
        };
    }
}