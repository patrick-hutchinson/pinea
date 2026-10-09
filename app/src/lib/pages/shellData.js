import { getImprint, getMenuData, getSearchableData, getSiteData } from "@/lib/fetch";
import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";
import { isAuthEnabled, isShopEnabled } from "@/lib/runtimeFlags";
import { getSearchableShopifyProducts } from "@/lib/shopify";

const getSearchableProducts = async () => {
  if (!isShopEnabled) return [];

  try {
    return await getSearchableShopifyProducts(100);
  } catch (error) {
    console.warn("[search] Could not load Shopify products for search.", error);
    return [];
  }
};

export const getPagesShellData = async (context = {}) => {
  const [site, menu, imprint, searchableData, searchableProducts] = await Promise.all([
    getSiteData(),
    getMenuData(),
    getImprint(),
    getSearchableData(),
    getSearchableProducts(),
  ]);

  const token = context.req?.cookies?.[SESSION_COOKIE_NAME];
  const session = isAuthEnabled ? decodeSessionToken(token) : null;

  return {
    site,
    menu,
    imprint,
    searchableData: [...(Array.isArray(searchableData) ? searchableData : []), ...searchableProducts],
    authEnabled: isAuthEnabled,
    shopEnabled: isShopEnabled,
    manageAccountUrl: process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "",
    manageSubscriptionUrl: process.env.SHOPIFY_SUBSCRIPTION_MANAGEMENT_URL || "",
    isAuthenticated: Boolean(session?.email),
  };
};

export const withPagesShellProps = (getPageProps) => async (context) => {
  const [shell, result] = await Promise.all([
    getPagesShellData(context),
    getPageProps ? getPageProps(context) : Promise.resolve({ props: {} }),
  ]);

  if (result?.redirect || result?.notFound) return result;

  return {
    ...result,
    props: {
      ...(result?.props || {}),
      __shell: shell,
    },
  };
};
