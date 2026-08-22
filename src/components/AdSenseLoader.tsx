"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  getStoredConsent,
  hasConsentFor,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";
import { ADSENSE_CLIENT } from "@/lib/adsense";

export const ADSENSE_READY_EVENT = "grandma-recipe-adsense-ready";

function injectPreconnect(href: string) {
  if (document.querySelector(`link[data-adsense-preconnect="${href}"]`)) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = href;
  link.crossOrigin = "anonymous";
  link.dataset.adsensePreconnect = href;
  document.head.appendChild(link);
}

function loadAdSenseScript() {
  if (document.getElementById("adsense-script")) {
    window.dispatchEvent(new Event(ADSENSE_READY_EVENT));
    return;
  }

  injectPreconnect("https://pagead2.googlesyndication.com");
  injectPreconnect("https://googleads.g.doubleclick.net");

  const script = document.createElement("script");
  script.id = "adsense-script";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.onload = () => {
    window.dispatchEvent(new Event(ADSENSE_READY_EVENT));
  };
  document.head.appendChild(script);
}

/**
 * Loads AdSense only after advertising consent — keeps it off the critical
 * path for First Contentful Paint / LCP on mobile.
 */
export function AdSenseLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    function syncFromConsent(preferences?: CookieConsentPreferences | null) {
      const allowed =
        preferences?.advertising ?? hasConsentFor("advertising");
      setShouldLoad(allowed);
    }

    syncFromConsent(getStoredConsent());

    function onConsent(event: Event) {
      syncFromConsent(
        (event as CustomEvent<CookieConsentPreferences>).detail,
      );
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    // Wait until the browser is idle so hero/LCP can paint first.
    let cancelled = false;
    const start = () => {
      if (!cancelled) loadAdSenseScript();
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(start, { timeout: 2500 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(start, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [shouldLoad]);

  return null;
}
