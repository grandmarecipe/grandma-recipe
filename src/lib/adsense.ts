export const ADSENSE_CLIENT = "ca-pub-2579283603529303";

/** Publisher ID without the ca- prefix (ads.txt / meta tag). */
export const ADSENSE_PUB = "pub-2579283603529303";

/**
 * Existing WordPress AdSense units (HTML only — not AMP).
 * @see https://support.google.com/adsense/answer/9274634
 */
export const ADSENSE_SLOTS = {
  displaySidebar: "8451968801",
  multiplexBottom: "9223064143",
  inArticle01: "9315946376",
  inArticle02: "2387575948",
} as const;

export type AdSenseSlotId = (typeof ADSENSE_SLOTS)[keyof typeof ADSENSE_SLOTS];
