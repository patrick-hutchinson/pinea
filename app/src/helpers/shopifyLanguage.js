export const getShopifyLanguage = (language) =>
  typeof language === "string" && language.toLowerCase() === "en" ? "EN" : "DE";

export const getLocalizedCartUrl = (cartId, language, checkout = false) => {
  const params = new URLSearchParams({cartId, language: getShopifyLanguage(language)});
  if (checkout) params.set("checkout", "1");
  return `/api/shopify/cart?${params}`;
};
