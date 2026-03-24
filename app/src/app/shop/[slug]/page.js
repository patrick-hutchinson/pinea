import { notFound } from "next/navigation";

import { getShopifyProducts } from "@/lib/shopify";
import { getSiteData } from "@/lib/fetch";

import ProductPage from "./ProductPage";

export const revalidate = 60;

export default async function Page({ params }) {
  const { slug } = await params;
  const products = await getShopifyProducts(100);
  const product = products.find((item) => item?.handle === slug);

  const site = await getSiteData();

  if (!product) {
    notFound();
  }

  return <ProductPage product={product} site={site} />;
}
