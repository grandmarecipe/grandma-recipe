import { NextRequest, NextResponse } from "next/server";
import https from "node:https";
import {
  getR2ObjectBuffer,
  isR2Configured,
  mimeFromKey,
  uploadsPathToR2Key,
} from "@/lib/r2";

export const runtime = "nodejs";

const OLD_HOST_IP = process.env.WP_MEDIA_IP || "72.60.93.62";

/**
 * Serve /wp-content/uploads/* with same public URLs for SEO.
 * Order: R2 → legacy Hostinger fallback.
 *
 * Do NOT run sharp/resize here — every image hit was burning Vercel
 * Fluid Active CPU. Resize offline via `npm run resize:r2` instead.
 *
 * Optional: set R2_PUBLIC_BASE_URL (e.g. https://media.grandmarecipe.com)
 * to 308-redirect and skip the Vercel function entirely (saves Origin Transfer + CPU).
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const objectPath = path.join("/");
  const r2Key = uploadsPathToR2Key(objectPath);

  const publicBase = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (publicBase) {
    return NextResponse.redirect(`${publicBase}/${r2Key}`, 308);
  }

  if (isR2Configured()) {
    try {
      const object = await getR2ObjectBuffer(r2Key);
      if (object) {
        const headers = new Headers();
        headers.set(
          "content-type",
          object.contentType || mimeFromKey(r2Key) || "application/octet-stream",
        );
        headers.set("cache-control", "public, max-age=31536000, immutable");
        return new NextResponse(new Uint8Array(object.body), {
          status: 200,
          headers,
        });
      }
    } catch {
      // fall through to Hostinger
    }
  }

  try {
    const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
    const upstreamResponse = await fetchFromOldHost(encodedPath);
    if (upstreamResponse.status >= 400 || !upstreamResponse.body) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();
    const contentType = upstreamResponse.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new NextResponse(upstreamResponse.body, {
      status: 200,
      headers,
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

function fetchFromOldHost(objectPath: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        protocol: "https:",
        hostname: OLD_HOST_IP,
        servername: "www.grandmarecipe.com",
        path: `/wp-content/uploads/${objectPath}`,
        method: "GET",
        headers: {
          Host: "www.grandmarecipe.com",
          "User-Agent": "GrandmaRecipeMediaProxy/1.0",
        },
        rejectUnauthorized: false,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          const body = Buffer.concat(chunks);
          const headers = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (typeof value === "string") headers.set(key, value);
            else if (Array.isArray(value)) headers.set(key, value.join(","));
          }
          resolve(
            new Response(body, {
              status: res.statusCode || 502,
              headers,
            }),
          );
        });
      },
    );
    req.on("error", reject);
    req.end();
  });
}
