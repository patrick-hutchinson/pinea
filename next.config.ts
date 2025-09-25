import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io", "image.mux.com"],
  },
};

export default nextConfig;
