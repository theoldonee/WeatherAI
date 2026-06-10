export interface WeatherData{
    probabilityOfRain : Number,
    humidity : Number,
    temp : Number,
}

export interface EntryRespone{
    longitiude : Number,
    latitude : Number,
    probabilityOfRain : Number,
    humidity : Number,
    temp : Number,
    summary : string,
    recommendation : string,
    suitableActivities: string,
}

export interface AiResponse{
    summary : string,
    recommendation : string,
    suitableActivities: string,
}