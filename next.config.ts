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

/**
 * CSP allows Next.js, Consent Mode, AdSense, and Convex — without opening
 * the door to arbitrary third-party scripts. `unsafe-inline` / `unsafe-eval`
 * are required for Next + AdSense; tightening further needs nonces.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
  // Next.js + Consent Mode inline + AdSense
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://pagead2.googlesyndication.com",
    "https://www.googletagservices.com",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://partner.googleadservices.com",
    "https://adservice.google.com",
    "https://tpc.googlesyndication.com",
    "https://*.adtrafficquality.google",
  ].join(" "),
  [
    "script-src-elem",
    "'self'",
    "'unsafe-inline'",
    "https://pagead2.googlesyndication.com",
    "https://www.googletagservices.com",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://partner.googleadservices.com",
    "https://adservice.google.com",
    "https://tpc.googlesyndication.com",
    "https://*.adtrafficquality.google",
  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src",
    "'self'",
    "https://*.convex.cloud",
    "wss://*.convex.cloud",
    "https://*.convex.site",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com",
    "https://*.google.com",
    "https://*.googleapis.com",
    "https://*.doubleclick.net",
    "https://*.adtrafficquality.google",
    "https://googleads.g.doubleclick.net",
    "https://fundingchoicesmessages.google.com",
  ].join(" "),
  [
    "frame-src",
    "'self'",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
    "https://www.google.com",
    "https://pagead2.googlesyndication.com",
    "https://*.adtrafficquality.google",
    "https://fundingchoicesmessages.google.com",
  ].join(" "),
  "worker-src 'self' blob:",
  "media-src 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return brandRedirects;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
