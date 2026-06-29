export const isVercelProduction =
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

export const isAuthEnabled = !isVercelProduction;
export const isShopEnabled = true;
export const isLocalDevelopment = !process.env.VERCEL_ENV && process.env.NODE_ENV !== "production";
