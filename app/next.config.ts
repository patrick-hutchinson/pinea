import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io", "image.mux.com"],
  },
  async redirects() {
    return [
      {
        source: "/periodical",
        destination: "/print-periodical",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
