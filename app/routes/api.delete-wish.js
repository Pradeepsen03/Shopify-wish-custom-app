import { json } from "@remix-run/node";
import { wishDelete } from "../model/wishDelete.server";
import { getAccessToken } from "../model/getAccessToken.server";

export const action = async ({ request }) => {
  const body = await request.json();
  const { shop, productId, cusId } = body;

  if (!shop && !productId && !cusId) {
    return json(
      { error: "Shop, Product ID and Customer  are required." },
      { status: 400 },
    );
  }

  const token = { shop };
  const getToken = await getAccessToken(token);

  const data = { shop, productId, cusId };
  await wishDelete(data);

  return json(
    { message: "Product deleted from wishlist successfully." },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `https://${shop}`,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-shopify-access-token",
        "x-shopify-access-token": getToken[0].accessToken,
      },
    },
  );
};
