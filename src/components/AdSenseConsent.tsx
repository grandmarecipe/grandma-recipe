"use client";

import { useEffect } from "react";
import {
  COOKIE_CONSENT_EVENT,
  getStoredConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // Google expects the Arguments object, not a rest-params array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
}

function applyGoogleConsent(preferences: CookieConsentPreferences | null) {
  ensureGtag();
  const advertising = preferences?.advertising ?? false;
  const analytics = preferences?.analytics ?? false;

  window.gtag("consent", "update", {
    ad_storage: advertising ? "granted" : "denied",
    ad_user_data: advertising ? "granted" : "denied",
    ad_personalization: advertising ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
  });
}

/**
 * Google Consent Mode v2 — what Google asks for (EEA/UK and similar).
 * Cookie banner Accept → grant ad_storage / personalization.
 * Reject or no choice → denied (non-personalized / restricted ads).
 * This is the correct Google flow; hiding the AdSense script is not.
 */
export function AdSenseConsent() {
  useEffect(() => {
    applyGoogleConsent(getStoredConsent());

    function onConsent(event: Event) {
      applyGoogleConsent(
        (event as CustomEvent<CookieConsentPreferences>).detail,
      );
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  return null;
}
