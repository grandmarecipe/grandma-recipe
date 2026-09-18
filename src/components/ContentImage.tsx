import Image, { type ImageProps } from "next/image";

type ContentImageProps = ImageProps & {
  /**
   * @deprecated Ignored — Vercel Image Optimization is off site-wide
   * (`images.unoptimized` in next.config) to stay under Hobby free limits.
   */
  optimize?: boolean;
};

/**
 * Recipe media under /wp-content/ is served from R2 (via the same-origin
 * route) or Hostinger fallback. Always unoptimized so we never bill
 * Vercel Image Optimization Transformations.
 */
export function ContentImage({
  src,
  unoptimized,
  optimize: _optimize,
  ...props
}: ContentImageProps) {
  return <Image {...props} src={src} unoptimized={unoptimized ?? true} />;
}
