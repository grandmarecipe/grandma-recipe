"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getGtmId } from "@/lib/gtm";

/** Push virtual page views on client-side navigations (Next.js App Router). */
export function GtmPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!getGtmId() || !pathname) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    } as Record<string, unknown>);
  }, [pathname, searchParams]);

  return null;
}
