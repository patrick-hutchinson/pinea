import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io", "image.mux.com"],
  },
  i18n: {
    locales: ["en", "de"], // all languages you support
    defaultLocale: "en", // fallback language
  },
};

export default nextConfig;
