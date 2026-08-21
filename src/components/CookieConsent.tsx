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

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustomise, setShowCustomise] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    setVisible(!getStoredConsent());
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
      className="site-cookie-consent fixed inset-0 z-[100] flex items-end justify-center bg-black/20 p-4 sm:items-center"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl leading-none text-muted transition hover:text-foreground"
          aria-label="Close cookie banner"
        >
          ×
        </button>

        <h2
          id="cookie-consent-title"
          className="pr-8 font-serif text-2xl text-foreground"
        >
          We value your privacy
        </h2>

        <p
          id="cookie-consent-description"
          className="mt-3 text-sm leading-relaxed text-muted"
        >
          We use cookies to enhance your browsing experience, serve personalised
          ads or content, and analyse our traffic. By clicking &quot;Accept
          All&quot;, you consent to our use of cookies. Read our{" "}
          <Link href="/privacy-policy/" className="text-accent underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/gdpr-ccpa-privacy-policy-for-grandma-recipe/"
            className="text-accent underline"
          >
            GDPR &amp; CCPA policy
          </Link>
          .
        </p>

        {showCustomise ? (
          <div className="mt-5 space-y-4 rounded-xl border border-border bg-background p-4">
            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Necessary
                </span>
                <span className="block text-xs text-muted">
                  Required for the site to work.
                </span>
              </span>
              <span className="text-xs font-semibold text-muted">Always on</span>
            </label>

            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Analytics
                </span>
                <span className="block text-xs text-muted">
                  Helps us understand how visitors use the site.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--gold)]"
              />
            </label>

            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Advertising
                </span>
                <span className="block text-xs text-muted">
                  Used to show relevant ads, including AdSense.
                </span>
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

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setShowCustomise((value) => !value)}
            className="flex-1 rounded-full border border-[#d4a574] px-4 py-2.5 text-sm font-semibold text-[#b8860b] transition hover:bg-[#faf4eb]"
          >
            Customise
          </button>
          <button
            type="button"
            onClick={handleRejectAll}
            className="flex-1 rounded-full border border-[#d4a574] px-4 py-2.5 text-sm font-semibold text-[#b8860b] transition hover:bg-[#faf4eb]"
          >
            Reject All
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 rounded-full bg-[#d4a574] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c49563]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
