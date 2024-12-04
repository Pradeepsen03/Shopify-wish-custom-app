import { json } from "@remix-run/node";
import { WishCreate } from "../model/wishCreate.server";
import { getAccessToken } from "../model/getAccessToken.server";

export const action = async ({ request }) => {
  const body = await request.json();
  const { shop, productId, cusId } = body;
  const token = { shop };
  const getToken = await getAccessToken(token);

  if (!shop && !productId && !cusId) {
    return json(
      { error: "Shop, Product ID and Customer  are required." },
      { status: 400 },
    );
  }

  const data = { shop, productId, cusId };
  await WishCreate(data);

  return json(
    { message: "Product added to wishlist successfully." },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-shopify-access-token",
        "x-shopify-access-token": getToken[0].accessToken,
      },
    },
  );
};
