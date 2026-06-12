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

export interface Ai{
    GetSummery: (weatherData:WeatherData) => AiResponse,
}

export interface Weather{
    GetForcast: (longitiude: Number, latitude: Number) => WeatherData,
}

export interface Controller{
    GetResponse: (location : {longitiude: Number, latitude: Number}) => EntryRespone,
}