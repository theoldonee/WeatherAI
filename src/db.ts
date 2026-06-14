import prisma from "./lib/prisma";

export const CheckForData = async (date: Date, longitiude: number, latitude: number) => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const forcast = await prisma.weather.findMany({
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
    return forcast;
}

// add