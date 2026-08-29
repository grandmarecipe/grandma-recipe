import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { convertRecipeImageToWebp } from "@/lib/recipe-image-process";
import {
  buildRecipeImageBasename,
  buildRecipeImageR2Key,
  buildRecipeImageSubjectName,
  r2KeyToPublicPath,
  type RecipeImageMetadata,
  type RecipeImageSection,
} from "@/lib/recipe-image-upload";
import { isR2Configured, putR2Object, r2ObjectExists } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

const SECTIONS = new Set<RecipeImageSection>([
  "feature",
  "ingredients",
  "how_to_make",
  "how_to_serve",
]);

function cleanMeta(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeMetadata(value: string, max = 256): string {
  return value.slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: "R2 is not configured. Add R2_* env vars." },
        { status: 503 },
      );
    }

    const form = await request.formData();
    const token = cleanMeta(form.get("token"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const convex = getConvexClient();
    const admin = await convex.query(api.adminAuth.me, { token });
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const section = cleanMeta(form.get("section")) as RecipeImageSection;
    if (!SECTIONS.has(section)) {
      return NextResponse.json({ error: "Invalid image section." }, { status: 400 });
    }

    const slug = cleanMeta(form.get("slug"));
    const focusKeyword = cleanMeta(form.get("focusKeyword"));
    if (!slug && !focusKeyword) {
      return NextResponse.json(
        { error: "Article slug or focus keyword is required." },
        { status: 400 },
      );
    }

    const metadata: RecipeImageMetadata = {
      alt: cleanMeta(form.get("alt")),
      title: cleanMeta(form.get("title")),
      caption: cleanMeta(form.get("caption")),
      description: cleanMeta(form.get("description")),
    };

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const subjectName = buildRecipeImageSubjectName({
      section,
      metadata,
      focusKeyword,
      slug,
    });
    const processed = await convertRecipeImageToWebp(
      inputBuffer,
      subjectName,
      section,
      {
        caption: metadata.caption,
        description: metadata.description,
      },
    );

    const basename = buildRecipeImageBasename({
      metadata,
      focusKeyword,
      slug,
    });
    let r2Key = buildRecipeImageR2Key(basename);
    if (await r2ObjectExists(r2Key)) {
      const suffix = Date.now().toString().slice(-6);
      r2Key = buildRecipeImageR2Key(`${basename}-${suffix}`);
    }

    const objectMetadata: Record<string, string> = {};
    if (metadata.alt) objectMetadata["alt-text"] = sanitizeMetadata(metadata.alt);
    if (metadata.title) objectMetadata.title = sanitizeMetadata(metadata.title);
    if (metadata.caption) objectMetadata.caption = sanitizeMetadata(metadata.caption);
    if (metadata.description) {
      objectMetadata.description = sanitizeMetadata(metadata.description);
    }
    if (focusKeyword) objectMetadata["focus-keyword"] = sanitizeMetadata(focusKeyword);
    objectMetadata.section = section;
    objectMetadata["subject-name"] = sanitizeMetadata(subjectName);

    await putR2Object(r2Key, processed.buffer, "image/webp", objectMetadata);

    const publicPath = r2KeyToPublicPath(r2Key);
    const uploadedAt = new Date().toISOString();

    const articleIdRaw = cleanMeta(form.get("articleId"));
    if (articleIdRaw) {
      await convex.mutation(api.articles.saveImageAsset, {
        token,
        id: articleIdRaw as Id<"articles">,
        section,
        asset: {
          publicPath,
          r2Key,
          alt: metadata.alt,
          title: metadata.title,
          caption: metadata.caption,
          description: metadata.description,
          uploadedAt,
          width: processed.width,
          height: processed.height,
        },
      });
    }

    return NextResponse.json({
      publicPath,
      r2Key,
      filename: `${basename}.webp`,
      width: processed.width,
      height: processed.height,
      uploadedAt,
      metadata,
    });
  } catch (error) {
    const raw =
      error instanceof Error ? error.message : "Recipe image upload failed.";
    const message = raw.includes("signature we calculated")
      ? "R2 upload failed (metadata or credentials). Try again — special characters in text are now stripped automatically."
      : raw;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
