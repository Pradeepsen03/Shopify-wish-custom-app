import prisma from "../db.server";

export async function getAccessToken(data) {
    try {
        const getToken = await prisma.session.findMany({
            where: {
                shop: data.shopUrl,
            },
        });

     console.log("my token",getToken)

        return getToken; 
    } catch (error) {
        console.error("Error Not Getting Access Token:", error); 
    }
}
