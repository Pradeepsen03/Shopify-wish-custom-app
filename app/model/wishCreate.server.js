import prisma from "../db.server";

export async function WishCreate(data) {
    try {
        const wish = await prisma.wishlist.create({
            data: {
                cusId: data.cusId,       
                productId: data.productId, 
            },
        });
        console.log("Wishlist entry created:", wish);
        return wish;
    } catch (error) {
        console.error("Error creating wishlist entry:", error);
        throw error; 
    }
}
