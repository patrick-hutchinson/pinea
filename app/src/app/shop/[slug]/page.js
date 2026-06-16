import { notFound, redirect } from "next/navigation";

import { getEditions, getPeriodicals } from "@/lib/fetch";
import { getShopifyProducts } from "@/lib/shopify";
import { isShopEnabled } from "@/lib/runtimeFlags";
import { normalizeShopSlug, toShopProductPath } from "@/lib/shopifySlug";
import { convertToPlainText } from "@/helpers/convertToPlainText";

import ProductPage from "./ProductPage";

export const revalidate = 60;

const normalizeMatchValue = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

const getLocalizedValues = (value) => {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    const translationValues = value
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item?.value === "string") return item.value;
        return "";
      })
      .filter(Boolean);

    return translationValues.length > 0 ? translationValues : [convertToPlainText(value)].filter(Boolean);
  }

  return [];
};

const getIssueNumber = (value = "") => {
  const match = String(value || "").match(/(\d{1,3})(?!.*\d)/);
  return match ? String(Number(match[1])).padStart(3, "0") : "";
};

const isPeriodicalProduct = (product) => {
  if (product?.category === "periodical") return true;

  return getProductMatchValues(product).some((value) => {
    const normalizedValue = normalizeMatchValue(value);
    return normalizedValue.includes("pinea") && (normalizedValue.includes("periodical") || Boolean(getIssueNumber(value)));
  });
};

const isEditionProduct = (product) => {
  if (product?.category === "edition") return true;

  return getProductMatchValues(product).some((value) => normalizeMatchValue(value).includes("edition"));
};

const getProductMatchValues = (product) => {
  const titleValues = [
    product?.title,
    product?.handle,
    ...(Array.isArray(product?.titleTranslations) ? product.titleTranslations.map((item) => item?.value) : []),
  ];

  return titleValues.filter(Boolean);
};

const getSanityProductMatchValues = (sanityProduct) => {
  const firstInfo = Array.isArray(sanityProduct?.info) ? sanityProduct.info[0] : null;

  return [
    sanityProduct?.title,
    sanityProduct?.isbn,
    ...getLocalizedValues(sanityProduct?.selector),
    ...getLocalizedValues(firstInfo?.title),
  ].filter(Boolean);
};

const findMatchingSanityProduct = (product, sanityProducts) => {
  if (!Array.isArray(sanityProducts)) return null;

  const productValues = getProductMatchValues(product);
  const normalizedProductValues = new Set(productValues.map(normalizeMatchValue).filter(Boolean));

  const exactMatch = sanityProducts.find((sanityProduct) =>
    getSanityProductMatchValues(sanityProduct).some((value) => normalizedProductValues.has(normalizeMatchValue(value))),
  );

  if (exactMatch) return exactMatch;

  const productIssueNumbers = new Set(productValues.map(getIssueNumber).filter(Boolean));
  if (productIssueNumbers.size === 0) return null;

  return (
    sanityProducts.find((sanityProduct) =>
      getSanityProductMatchValues(sanityProduct).some((value) => productIssueNumbers.has(getIssueNumber(value))),
    ) || null
  );
};

export default async function Page({ params }) {
  if (!isShopEnabled) {
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
  const periodicals = isPeriodicalProduct(product) ? await getPeriodicals() : [];
  const editions = isEditionProduct(product) ? await getEditions() : [];
  const matchedPeriodical = isPeriodicalProduct(product) ? findMatchingSanityProduct(product, periodicals) : null;
  const matchedEdition = isEditionProduct(product) ? findMatchingSanityProduct(product, editions) : null;

  return <ProductPage product={product} relatedProducts={relatedProducts} periodical={matchedPeriodical} edition={matchedEdition} />;
}
