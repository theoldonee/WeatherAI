import { Weather } from "./weather";
import { Ai } from "./ai";

import {
    EntryResponse,
    AiResponse,
    Controller as ControllerInterface,
    Ai as AiInterface,
    Weather as WeatherInterface,
    WeatherData,
} from "@/lib/services/shared-interfaces";


class Controller implements ControllerInterface{
    private ai : AiInterface = new Ai();
    private weather : WeatherInterface = new Weather();

    GetResponse(location : {longitiude: number, latitude: number}) : EntryResponse{

        // validate if data already exist
        const weatherData : WeatherData =  this.weather.GetForcast(location.longitiude, location.latitude);

        const aiResponse: AiResponse =  this.ai.GetSummery(weatherData);

        const result : EntryResponse =  {
            ...location,
            ...weatherData,
            ...aiResponse
        };

        return result;
    }

    CheckDb(location : {longitiude: number, latitude: number}){
        // check 
        const date = Date.now();

        
        
    }
}

export { Controller };