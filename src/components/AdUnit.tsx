"use client";

import { useEffect, useRef, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  hasConsentFor,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";
import { ADSENSE_CLIENT, type AdSenseSlotId } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdFormat = "auto" | "fluid" | "autorelaxed";

interface AdUnitProps {
  slot: AdSenseSlotId;
  format?: AdFormat;
  layout?: "in-article";
  className?: string;
}

/**
 * Manual AdSense unit. Site-wide adsbygoogle.js is already loaded in layout —
 * only render the <ins> and push once per mount when ads cookies are allowed.
 */
export function AdUnit({
  slot,
  format = "auto",
  layout,
  className = "",
}: AdUnitProps) {
  const pushed = useRef(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasConsentFor("advertising"));

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<CookieConsentPreferences>).detail;
      setAllowed(Boolean(detail?.advertising));
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    if (!allowed || pushed.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // Ad blocker or script not ready yet — ignore.
    }
  }, [allowed, slot]);

  if (!allowed) return null;

  return (
    <div className={`ad-unit no-print ${className}`.trim()} data-ad-slot={slot}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: layout === "in-article" ? "center" : undefined,
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
      />
    </div>
  );
}
