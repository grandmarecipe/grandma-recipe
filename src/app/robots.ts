import type { MetadataRoute } from "next";
import { SITE } from "@/lib/types";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/search/", "/print/", "/admin/", "/*?s="],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
