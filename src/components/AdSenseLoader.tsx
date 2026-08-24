"use client";

import { useEffect } from "react";
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
 * Loads AdSense on every visit (needed for Auto Ads + AdSense pageviews),
 * but after first paint / idle so it stays off the LCP critical path.
 * Personalization is controlled by Consent Mode (AdSenseConsent), not by
 * withholding the script.
 */
export function AdSenseLoader() {
  useEffect(() => {
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
  }, []);

  return null;
}
