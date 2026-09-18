/**
 * Hero image preload URL — use the source path directly.
 * Do NOT route through `/_next/image` (burns Vercel Image Optimization
 * Transformations on the Hobby free tier).
 */
export const HERO_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 640px, 560px";

export function getHeroImagePreloadHref(src: string): string {
  return src;
}
