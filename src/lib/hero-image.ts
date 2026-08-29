import { getImageProps } from "next/image";

/** Matches RecipeHero `sizes` — caps mobile LCP fetch around 640w. */
export const HERO_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 640px, 560px";

const HERO_QUALITY = 75;

/**
 * Optimized URL for `<link rel="preload">` / react-dom preload.
 * Must match the hero ContentImage props (sizes, quality, optimize).
 */
export function getHeroImagePreloadHref(src: string): string {
  const { props } = getImageProps({
    src,
    alt: "",
    width: 1200,
    height: 900,
    sizes: HERO_IMAGE_SIZES,
    quality: HERO_QUALITY,
    priority: true,
  });
  return props.src;
}
