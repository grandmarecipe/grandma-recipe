import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Called by Convex scheduled-publish cron after flipping drafts live.
 * Auth: x-cms-secret or Authorization Bearer = CMS_IMPORT_SECRET.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.CMS_IMPORT_SECRET?.trim();
  if (!expected) {
    return NextResponse.json(
      { error: "CMS_IMPORT_SECRET not configured" },
      { status: 500 },
    );
  }

  const headerSecret =
    request.headers.get("x-cms-secret")?.trim() ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!headerSecret || headerSecret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let slugs: string[] = [];
  try {
    const body = (await request.json()) as { slugs?: unknown };
    if (Array.isArray(body.slugs)) {
      slugs = body.slugs
        .filter((slug): slug is string => typeof slug === "string")
        .map((slug) => slug.trim())
        .filter(Boolean);
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  for (const slug of slugs) {
    revalidateTag(`cms-article-${slug}`);
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/sitemap-posts.xml");
    revalidatePath("/sitemap-categories.xml");
    revalidatePath("/sitemap/");
  }

  revalidateTag("cms-recipes-list");
  revalidatePath("/");
  for (const category of [
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
    "dessert",
  ]) {
    revalidatePath(`/category/${category}`);
    revalidatePath(`/category/${category}/`);
  }

  return NextResponse.json({ ok: true, slugs });
}
