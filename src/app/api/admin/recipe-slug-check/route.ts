import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { getRecipeBySlug } from "@/lib/content";
import { slugifyTitle } from "@/lib/article-generate-prompts";

export const runtime = "nodejs";

/** Check if a keyword/slug already exists as a CMS article or file recipe. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const input = request.nextUrl.searchParams.get("q")?.trim();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!input || input.length < 2) {
    return NextResponse.json({ exists: false });
  }

  const convex = getConvexClient();
  const admin = await convex.query(api.adminAuth.me, { token });
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cms = await convex.query(api.articles.findExistingForGenerate, {
    token,
    input,
  });
  if (cms) {
    return NextResponse.json({
      exists: true,
      source: "cms",
      matchType: cms.matchType,
      slug: cms.slug,
      title: cms.title,
      status: cms.status,
      cmsId: cms._id,
    });
  }

  const slug = slugifyTitle(input);
  const fileRecipe = slug ? getRecipeBySlug(slug) : null;
  if (fileRecipe) {
    return NextResponse.json({
      exists: true,
      source: "file",
      matchType: "slug",
      slug: fileRecipe.slug,
      title: fileRecipe.title,
    });
  }

  return NextResponse.json({ exists: false });
}
