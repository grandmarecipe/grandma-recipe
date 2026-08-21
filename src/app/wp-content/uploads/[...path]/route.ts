import { NextRequest, NextResponse } from "next/server";
import https from "node:https";

export const runtime = "nodejs";

const OLD_HOST_IP = process.env.WP_MEDIA_IP || "72.60.93.62";

/**
 * Temporary fallback while media is copied into public/:
 * serve /wp-content/uploads/* from the old Hostinger host.
 * Files present in public/wp-content/uploads/ are served first by Next.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const objectPath = path.map((segment) => encodeURIComponent(segment)).join("/");

  try {
    const upstreamResponse = await fetchFromOldHost(objectPath);
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
