export type ConsentCategory = "necessary" | "analytics" | "advertising";

export interface CookieConsentPreferences {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
}

const STORAGE_KEY = "grandma-recipe-cookie-consent";
export const COOKIE_CONSENT_EVENT = "grandma-recipe-cookie-consent";

export function getStoredConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentPreferences;
    if (parsed.necessary !== true) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(preferences: CookieConsentPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: preferences }),
  );
}

export function acceptAllConsent(): CookieConsentPreferences {
  const preferences: CookieConsentPreferences = {
    necessary: true,
    analytics: true,
    advertising: true,
    updatedAt: new Date().toISOString(),
  };
  saveConsent(preferences);
  return preferences;
}

export function rejectOptionalConsent(): CookieConsentPreferences {
  const preferences: CookieConsentPreferences = {
    necessary: true,
    analytics: false,
    advertising: false,
    updatedAt: new Date().toISOString(),
  };
  saveConsent(preferences);
  return preferences;
}

export function saveCustomConsent(
  analytics: boolean,
  advertising: boolean,
): CookieConsentPreferences {
  const preferences: CookieConsentPreferences = {
    necessary: true,
    analytics,
    advertising,
    updatedAt: new Date().toISOString(),
  };
  saveConsent(preferences);
  return preferences;
}

export function hasConsentFor(category: ConsentCategory): boolean {
  const consent = getStoredConsent();
  if (!consent) return false;
  if (category === "necessary") return true;
  return consent[category];
}
