import { getImprint, getMenuData, getSearchableData, getSiteData } from "@/lib/fetch";
import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";
import { isAuthEnabled, isShopEnabled } from "@/lib/runtimeFlags";

export const getPagesShellData = async (context = {}) => {
  const [site, menu, imprint, searchableData] = await Promise.all([
    getSiteData(),
    getMenuData(),
    getImprint(),
    getSearchableData(),
  ]);

  const token = context.req?.cookies?.[SESSION_COOKIE_NAME];
  const session = isAuthEnabled ? decodeSessionToken(token) : null;

  return {
    site,
    menu,
    imprint,
    searchableData,
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
