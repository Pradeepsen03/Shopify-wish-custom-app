import { json } from "@remix-run/node";
import { WishCreate } from "../model/wishCreate.server";
 


export const action = async ({ request }) => {
  const body = await request.json();
  const { shop, productId ,cusId} = body;

  if (!shop && !productId && !cusId) {
    return json({ error: "Shop, Product ID and Customer  are required." }, { status: 400 });
  }

  
 const data={shop, productId ,cusId}
 await WishCreate(data)

  return json({ message: "Product added to wishlist successfully." });
};
