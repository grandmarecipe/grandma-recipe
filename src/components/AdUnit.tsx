"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_READY_EVENT } from "@/components/AdSenseLoader";
import { ADSENSE_CLIENT, type AdSenseSlotId } from "@/lib/adsense";
import {
  COOKIE_CONSENT_EVENT,
  hasConsentFor,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

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

function pushAd() {
  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch {
    // Ad blocker or script race — ignore.
  }
}

/**
 * Manual AdSense unit. Script is loaded by AdSenseLoader after consent.
 * Hidden until advertising cookies are accepted so LCP stays clean.
 */
export function AdUnit({
  slot,
  format = "auto",
  layout,
  className = "",
}: AdUnitProps) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function sync(preferences?: CookieConsentPreferences | null) {
      setAllowed(
        preferences ? preferences.advertising : hasConsentFor("advertising"),
      );
    }

    sync(null);

    function onConsent(event: Event) {
      sync((event as CustomEvent<CookieConsentPreferences>).detail);
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    if (!allowed) return;

    function tryPush() {
      if (document.getElementById("adsense-script")) {
        pushAd();
      }
    }

    tryPush();
    window.addEventListener(ADSENSE_READY_EVENT, tryPush);
    return () => window.removeEventListener(ADSENSE_READY_EVENT, tryPush);
  }, [allowed, pathname, slot]);

  if (!allowed) return null;

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
