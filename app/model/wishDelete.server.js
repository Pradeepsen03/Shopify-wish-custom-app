import prisma from "../db.server";

export async function wishDelete(data) {
    try {
        const wish = await prisma.wishlist.delete({
            where: {
                productId:data.productId,
                cusId: data.cusId,
              },
        });
        console.log("Wishlist entry deleted:", wish);
        return wish;
    } catch (error) {
        console.error("Error deleting wishlist entry:", error);
        throw error; 
    }
}
