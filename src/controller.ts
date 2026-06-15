import { Weather } from "./weather";
import { Ai } from "./ai";
import  * as db  from "./db";

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

    GetResponse(location : {longitiude: number, latitude: number}) : Promise<EntryResponse>{

        let weatherData : WeatherData;
        let aiResponse: AiResponse ;

        // validate if data already exist
        const result = this.CheckDb(location).then(searchResult =>{

            if(searchResult){
                weatherData = {
                    probabilityOfRain: Number(searchResult.probability_of_rain),
                    temp: Number(searchResult.temp_c),
                    humidity: Number(searchResult.humidity),

                };

                aiResponse = {
                    summary: searchResult.summary,
                    suitableActivities: searchResult.suitable_activities,
                    recommendation: searchResult.recommendation
                }
            }
            else{
                weatherData =  this.weather.GetForcast(location.longitiude, location.latitude);
                aiResponse =  this.ai.GetSummery(weatherData);

                db.addData(location, weatherData, aiResponse);
            }

            return {
                ...location,
                ...weatherData,
                ...aiResponse
            }

        });

        return result;
    }

    async CheckDb(location : {longitiude: number, latitude: number}){
        // check 

        const recentData = await db.CheckForData(location.longitiude, location.latitude);
        
        return recentData;
    }
}

export { Controller };