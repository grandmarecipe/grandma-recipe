import Image, { type ImageProps } from "next/image";

type ContentImageProps = ImageProps & {
  /** Run through `/_next/image` (e.g. recipe hero LCP). */
  optimize?: boolean;
};

/**
 * Recipe media under /wp-content/ is served from public/ locally, then R2,
 * then the Hostinger fallback route. Skip the optimizer by default so
 * missing local files still load through that same-origin path.
 */
export function ContentImage({
  src,
  unoptimized,
  optimize = false,
  ...props
}: ContentImageProps) {
  const isWpUpload =
    typeof src === "string" && src.startsWith("/wp-content/uploads/");

  return (
    <Image
      {...props}
      src={src}
      unoptimized={unoptimized ?? (isWpUpload && !optimize)}
    />
  );
}
