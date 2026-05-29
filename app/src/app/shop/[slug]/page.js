import { notFound, redirect } from "next/navigation";

import { getShopifyProducts } from "@/lib/shopify";
import { normalizeShopSlug, toShopProductPath } from "@/lib/shopifySlug";

import ProductPage from "./ProductPage";

export const revalidate = 60;
const shopEnabled = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";

export default async function Page({ params }) {
  if (!shopEnabled) {
    redirect("/");
  }

  const { slug } = await params;
  const rawSlug = String(slug || "");
  const normalizedSlug = normalizeShopSlug(rawSlug);
  const products = await getShopifyProducts(100);

  const product =
    products.find((item) => item?.handle === rawSlug) ||
    products.find((item) => item?.handle === normalizedSlug) ||
    products.find((item) => normalizeShopSlug(item?.handle) === normalizedSlug);

  if (!product) {
    notFound();
  }

  const canonicalSlug = normalizeShopSlug(product.handle);
  if (rawSlug !== canonicalSlug) {
    redirect(toShopProductPath(product.handle));
  }

  const relatedProducts = products
    .filter((item) => item?.category && item.category === product.category)
    .map((item) => ({
      title: item.title,
      titleTranslations: item.titleTranslations,
      href: toShopProductPath(item.handle),
    }));

  return <ProductPage product={product} relatedProducts={relatedProducts} />;
}
