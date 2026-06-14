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