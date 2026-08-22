"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  acceptAllConsent,
  getStoredConsent,
  rejectOptionalConsent,
  saveCustomConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

/**
 * Compact bottom-sheet cookie banner. Delayed slightly so LCP can paint
 * before the overlay appears (helps mobile PageSpeed lab tests).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustomise, setShowCustomise] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    if (getStoredConsent()) return;

    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  function applyConsent(preferences: CookieConsentPreferences) {
    setVisible(false);
    setShowCustomise(false);
    setAnalytics(preferences.analytics);
    setAdvertising(preferences.advertising);
  }

  function handleAcceptAll() {
    applyConsent(acceptAllConsent());
  }

  function handleRejectAll() {
    applyConsent(rejectOptionalConsent());
  }

  function handleClose() {
    applyConsent(rejectOptionalConsent());
  }

  function handleSaveCustom() {
    applyConsent(saveCustomConsent(analytics, advertising));
  }

  if (!visible) return null;

  return (
    <div
      className="site-cookie-consent fixed inset-x-0 bottom-0 z-[100] flex justify-center p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-4 shadow-xl sm:p-5">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-xl leading-none text-muted transition hover:text-foreground"
          aria-label="Close cookie banner"
        >
          ×
        </button>

        <h2
          id="cookie-consent-title"
          className="pr-8 font-serif text-xl text-foreground sm:text-2xl"
        >
          Cookies
        </h2>

        <p
          id="cookie-consent-description"
          className="mt-2 text-sm leading-relaxed text-muted"
        >
          We use cookies for the site, optional analytics, and ads. See our{" "}
          <Link href="/privacy-policy/" className="text-accent underline">
            Privacy Policy
          </Link>
          .
        </p>

        {showCustomise ? (
          <div className="mt-4 space-y-3 rounded-xl border border-border bg-background p-3">
            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Necessary
                </span>
                <span className="block text-xs text-muted">Always on</span>
              </span>
            </label>

            <label className="flex items-start justify-between gap-4">
              <span className="block text-sm font-semibold text-foreground">
                Analytics
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--gold)]"
              />
            </label>

            <label className="flex items-start justify-between gap-4">
              <span className="block text-sm font-semibold text-foreground">
                Advertising
              </span>
              <input
                type="checkbox"
                checked={advertising}
                onChange={(event) => setAdvertising(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--gold)]"
              />
            </label>

            <button
              type="button"
              onClick={handleSaveCustom}
              className="w-full rounded-full bg-[#d4a574] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c49563]"
            >
              Save preferences
            </button>
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setShowCustomise((value) => !value)}
            className="flex-1 rounded-full border border-[#d4a574] px-3 py-2.5 text-sm font-semibold text-[#b8860b] transition hover:bg-[#faf4eb]"
          >
            Customise
          </button>
          <button
            type="button"
            onClick={handleRejectAll}
            className="flex-1 rounded-full border border-[#d4a574] px-3 py-2.5 text-sm font-semibold text-[#b8860b] transition hover:bg-[#faf4eb]"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 rounded-full bg-[#d4a574] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c49563]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
