/**
 * Serve recipe media from the R2 public host so browsers never hit the
 * Vercel `/wp-content/uploads` function (Fluid Active CPU).
 *
 * Stored paths stay site-relative (`/wp-content/uploads/...`).
 * Rewrite only when rendering public pages / schema.
 */

const UPLOADS_PREFIX = "/wp-content/uploads/";

export function getR2PublicBaseUrl(): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  return base || null;
}

function isUploadsPath(pathOrUrl: string): boolean {
  if (pathOrUrl.includes(UPLOADS_PREFIX)) return true;
  return pathOrUrl.startsWith("wp-content/uploads/");
}

/** Site-relative or absolute uploads URL → R2 public URL when configured. */
export function toMediaUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;

  const base = getR2PublicBaseUrl();
  if (!base) return pathOrUrl;

  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      const url = new URL(pathOrUrl);
      if (!url.pathname.includes(UPLOADS_PREFIX)) return pathOrUrl;
      if (url.origin === base) return pathOrUrl;
      return `${base}${url.pathname}${url.search}`;
    } catch {
      return pathOrUrl;
    }
  }

  if (!isUploadsPath(pathOrUrl)) return pathOrUrl;

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

/** Rewrite img/src and a/href uploads paths inside HTML to the R2 host. */
export function rewriteMediaUrlsInHtml(html: string): string {
  const base = getR2PublicBaseUrl();
  if (!base || !html) return html;

  return html.replace(
    /\b(src|href)=(["'])([^"']*\/wp-content\/uploads\/[^"']+)\2/gi,
    (_match, attr: string, quote: string, value: string) => {
      const next = toMediaUrl(value) ?? value;
      return `${attr}=${quote}${next}${quote}`;
    },
  );
}

export function withPublicMediaUrls<
  T extends { featuredImage?: string; contentHtml?: string },
>(item: T): T {
  const featuredImage = toMediaUrl(item.featuredImage) ?? item.featuredImage;
  const contentHtml = item.contentHtml
    ? rewriteMediaUrlsInHtml(item.contentHtml)
    : item.contentHtml;
  if (featuredImage === item.featuredImage && contentHtml === item.contentHtml) {
    return item;
  }
  return { ...item, featuredImage, contentHtml };
}
