import { getShopifyProducts } from "@/lib/shopify";

import ShopPage from "./ShopPage";

export const revalidate = 60;

export default async function Page() {
  let products = [];
  let error = null;

  try {
    products = await getShopifyProducts(12);
  } catch (err) {
    console.error("Failed to load Shopify products:", err);
    error = err instanceof Error ? err.message : "Unable to load products.";
  }

  return <ShopPage products={products} error={error} />;
}
