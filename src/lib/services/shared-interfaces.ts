export interface WeatherData{
    probabilityOfRain : number,
    humidity : number,
    temp : number,
}

export interface EntryResponse{
    longitiude : number,
    latitude : number,
    probabilityOfRain : number,
    humidity : number,
    temp : number,
    summary : string,
    recommendation : string,
    suitableActivities: string,
}

export interface AiResponse{
    summary : string,
    recommendation : string,
    suitableActivities: string,
}

export interface Ai{
    GetSummery: (weatherData:WeatherData) => AiResponse,
}

export interface Weather{
    GetForcast: (longitiude: number, latitude: number) => WeatherData,
}

export interface Controller{
    GetResponse: (location : {longitiude: number, latitude: number}) => EntryResponse,
}