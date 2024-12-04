import { json } from "@remix-run/node";
import { WishShow } from "../model/wishShow.server";
import { getAccessToken } from "../model/getAccessToken.server";

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const cus_id = url.searchParams.get("id");

    if (!shop) {
      return json({ error: "Shop parameter is required." }, { status: 400 });
    }
    if (!cus_id) {
      return json({ error: "Customer ID is required." }, { status: 400 });
    }

    const token = { shop };
    const getToken = await getAccessToken(token);

    console.log("appka Token", getToken[0].accessToken);
    const graphQLEndpoint = `https://testnewapp12.myshopify.com/admin/api/2024-01/graphql.json`;

    const data = { shop,cus_id };
    const WishShowData = await WishShow(data);

    const WishShowProduct = await Promise.all(
      WishShowData.map(async (product) => {
        const productId = product.productId;
        console.log("productId", productId);
        const query = `
              query {
                node(id: "gid://shopify/Product/${productId}") {
                   id
        ... on Product {
          title
          productType
          variants(first: 10) {
            edges {
              node {
                id
                price
              }
            }
          }
          hasOutOfStockVariants
          totalInventory
          tracksInventory
          publishedAt
          status
          tags
          media(first: 10) {
            edges {
              node {
                id
                alt
                preview {
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
            `;

        try {
          const response = await fetch(graphQLEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": getToken[0].accessToken,
            },
            body: JSON.stringify({ query }),
          });

          if (!response.ok) {
            const data = await response.json();
            console.log(data);

            console.error(`GraphQL Error: ${data}`);
            return null;
          }

          const responseBody = await response.json();

          if (responseBody.errors) {
            console.error("GraphQL data Response Errors:", responseBody.errors);
            return null;
          }
          console.log("dataQL", responseBody);
          return responseBody;
        } catch (error) {
          console.error(`Error fetching product with ID ${productId}:`, error);
          return null;
        }
      }),
    );

    console.log("comminng", WishShowProduct);

    return json(
      { data: WishShowProduct },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": shop, 
          "x-shopify-access-token":getToken[0].accessToken,
          "Access-Control-Allow-Headers": "Content-Type, x-shopify-access-token"
        },
      }
    );
    
  } catch (error) {
    console.error("Loader Error:", error);
    return json({ error: "An unexpected error occurred." }, { status: 500 });
  }
};


