import prisma from "./lib/prisma";

export const CheckForData = async (longitiude: number, latitude: number) => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const result = await prisma.weather.findFirst({
        where: { 
            longitude: {
                gte : longitiude - 2,
                lte: longitiude + 2,
            },
            latitude: {
                gte: latitude - 2,
                lte: latitude + 2, 
            },
            created_at: {
                gte: thirtyMinutesAgo,
            },
        },
        orderBy: { created_at: 'desc' },
    });
    
    return result;
}

// add 
export const addData = async (
    location: {longitiude: number, latitude: number}, 
    weatherData: {probabilityOfRain : number, humidity : number, temp : number,},
    aiResponse: {summary : string, recommendation : string, suitableActivities: string,}
) => {

    const data = {
    created_at: new Date(),
    longitude: location.longitiude,
    latitude: location.latitude,
    probability_of_rain: weatherData.probabilityOfRain,
    humidity: weatherData.humidity,
    temp_c: weatherData.temp,
    summary: aiResponse.summary,
    recommendation: aiResponse.recommendation,
    suitable_activities: aiResponse.suitableActivities,

    }

    await prisma.weather.create({data});
}