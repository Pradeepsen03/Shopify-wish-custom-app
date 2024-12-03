// app/routes/api/index.js
import { json } from "@remix-run/node";

export const loader = async () => {
  return json({
    message: "Welcome to the API!",
    availableRoutes: [
      { path: "/api/save-wishlist", method: "POST", description: "Save a wishlist" },
      { path: "/api/get-wishlist", method: "GET", description: "Get products" },
    ],
  });
};
