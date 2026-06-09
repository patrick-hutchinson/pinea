import { redirect } from "next/navigation";

import { getShopifyProducts } from "@/lib/shopify";
import { getPeriodicalPage } from "@/lib/fetch";
import { isShopEnabled } from "@/lib/runtimeFlags";

import ShopPage from "./ShopPage";

export const revalidate = 60;

export default async function Page() {
  if (!isShopEnabled) {
    redirect("/");
  }

  let products = [];
  let error = null;
  let periodicalPage = null;

  try {
    [products, periodicalPage] = await Promise.all([getShopifyProducts(12), getPeriodicalPage()]);
  } catch (err) {
    console.error("Failed to load Shopify products:", err);
    error = err instanceof Error ? err.message : "Unable to load products.";
  }

  return <ShopPage products={products} error={error} periodicalEmailTemplate={periodicalPage?.email || null} />;
}
