"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT, type AdSenseSlotId } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type AdFormat = "auto" | "fluid" | "autorelaxed";

interface AdUnitProps {
  slot: AdSenseSlotId;
  format?: AdFormat;
  /** Required for In-article units from AdSense. */
  layout?: "in-article";
  className?: string;
}

/**
 * Manual AdSense ad unit (official pattern):
 * 1. Load adsbygoogle.js once in the root layout
 * 2. Place an <ins class="adsbygoogle"> where the ad should appear
 * 3. Call adsbygoogle.push({}) after the element is in the DOM
 *
 * @see https://support.google.com/adsense/answer/9274634
 * @see https://support.google.com/adsense/answer/3221666
 */
export function AdUnit({
  slot,
  format = "auto",
  layout,
  className = "",
}: AdUnitProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or script race — ignore.
    }
  }, [pathname, slot]);

  return (
    <div
      className={`ad-unit no-print ${className}`.trim()}
      data-ad-slot={slot}
      aria-hidden="true"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: layout === "in-article" ? "center" : undefined,
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(format === "auto"
          ? { "data-full-width-responsive": "true" }
          : {})}
      />
    </div>
  );
}
