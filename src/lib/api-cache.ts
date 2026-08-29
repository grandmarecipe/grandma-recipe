/** CDN/browser cache for read-only UGC API responses (shared data). */
export const UGC_API_CACHE_CONTROL =
  "public, s-maxage=3600, stale-while-revalidate=86400";

export function jsonCached(data: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", UGC_API_CACHE_CONTROL);
  headers.set("Vary", "Cookie");
  return Response.json(data, { ...init, headers });
}
