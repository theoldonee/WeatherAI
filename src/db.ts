import prisma from "./lib/prisma";
import { WeatherData, AiResponse } from "./lib/services/shared-interfaces";

export const CheckForData = async (longitiude: number, latitude: number) => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // Fetch all cache candidates within a ±5 degree bounding box in the last 30 minutes
    const candidates = await prisma.weather.findMany({
        where: { 
            longitude: {
                gte : longitiude - 5,
                lte: longitiude + 5,
            },
            latitude: {
                gte: latitude - 5,
                lte: latitude + 5, 
            },
            created_at: {
                gte: thirtyMinutesAgo,
            },
        },
    });

    if (candidates.length === 0) {
        return null;
    }

    // Helper to calculate Haversine distance in kilometers
    const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Find the candidate with the smallest distance to input coordinates
    let closestCandidate = candidates[0];
    let minDistance = getHaversineDistance(
        latitude,
        longitiude,
        Number(closestCandidate.latitude),
        Number(closestCandidate.longitude)
    );

    for (let i = 1; i < candidates.length; i++) {
        const distance = getHaversineDistance(
            latitude,
            longitiude,
            Number(candidates[i].latitude),
            Number(candidates[i].longitude)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestCandidate = candidates[i];
        }
    }

    // Return the closest candidate if it is within our target radius (50km)
    const MAX_RADIUS_KM = 50;
    if (minDistance <= MAX_RADIUS_KM) {
        return closestCandidate;
    }

    return null;
}

// add 
export const addData = async (
    location: {longitiude: number, latitude: number}, 
    weatherData: WeatherData,
    aiResponse: AiResponse
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