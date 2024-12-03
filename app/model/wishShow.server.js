import prisma from "../db.server";

export async function WishShow(data) {
    try {
        const wishShow = await prisma.wishlist.findMany({
            where: {
                cusId: data.cus_id,
            },
        });


        const serializedWishlist = wishShow.map(item => {
            return {
                ...item,
                productId: item.productId.toString(), 
            };
        });

        return serializedWishlist; 
    } catch (error) {
        console.error("Error showing wishlist data:", error); 
    }
}
