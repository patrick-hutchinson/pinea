import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**/orders-paid': ['./src/app/scripts/send-codes/gift-mail.html', './src/app/scripts/send-codes/gift-mail.en.html'],
    '/api/newsletter/membership-discount': ['./src/app/scripts/send-codes/mail.html', './src/app/scripts/send-codes/mail.en.html', './src/app/scripts/send-codes/membership-start-dates.csv'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
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
