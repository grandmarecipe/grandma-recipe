import type { NextConfig } from "next";

/**
 * Brand assets moved to /brand/. Recipe media stays at /wp-content/uploads/
 * (same indexed paths). Only these old brand URLs need 301s.
 */
const brandRedirects = [
  {
    source:
      "/wp-content/uploads/2025/06/Logo-of-GrandmaRecipe.com-%E2%80%93-Warm-and-Welcoming-Recipe-Blog-150x150.webp",
    destination: "/brand/logo.webp",
  },
  {
    source:
      "/wp-content/uploads/2025/10/Warm-portrait-of-a-smiling-grandmother-in-a-cozy-kitchen.webp",
    destination: "/brand/grandma-millie.webp",
  },
  {
    source:
      "/wp-content/uploads/2025/10/Warm-portrait-of-a-smiling-grandmother-in-a-cozy-kitchen-233x300.webp",
    destination: "/brand/grandma-millie-233x300.webp",
  },
  {
    source:
      "/wp-content/uploads/2025/06/elegant-background-with-white-marble-texture.webp",
    destination: "/brand/marble.webp",
  },
  {
    source:
      "/wp-content/uploads/2025/06/Reflection-Cooking-Joy-www.garndmarecipe.com_.jpg",
    destination: "/brand/contact-hero.jpg",
  },
  {
    source: "/wp-content/uploads/2024/06/breakfast-category.jpg",
    destination: "/brand/category-breakfast.webp",
  },
  {
    source: "/wp-content/uploads/2024/06/lunch-category.jpg",
    destination: "/brand/category-lunch.webp",
  },
  {
    source: "/wp-content/uploads/2024/06/dinner-category.jpg",
    destination: "/brand/category-dinner.webp",
  },
  {
    source: "/wp-content/uploads/2024/06/snacks-category.jpg",
    destination: "/brand/category-snacks.webp",
  },
  {
    source: "/wp-content/uploads/2024/06/dessert-category.jpg",
    destination: "/brand/category-dessert.webp",
  },
].map((item) => ({
  ...item,
  permanent: true,
}));

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return brandRedirects;
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
