import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.grandmarecipe.com",
      },
      {
        protocol: "https",
        hostname: "grandmarecipe.com",
      },
    ],
  },
};

export default nextConfig;
