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
 * Keeps Google Consent Mode in sync with the cookie banner so AdSense
 * Auto Ads respect advertising preference.
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
