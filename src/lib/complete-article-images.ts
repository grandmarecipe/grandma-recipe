/**
 * Upload helpers + heading polish for completing a recipe draft after
 * Cursor GenerateImage has produced local PNG assets.
 *
 * Image generation for admin "Complete article" is done by the Cursor agent
 * (GenerateImage) — not OpenAI DALL·E.
 */
import { convertRecipeImageToWebp } from "@/lib/recipe-image-process";
import { insertRecipeImageIntoArticle } from "@/lib/article-image-insert";
import {
  buildRecipeImageBasename,
  buildRecipeImageR2Key,
  buildRecipeImageSubjectName,
  r2KeyToPublicPath,
  type RecipeImageSection,
} from "@/lib/recipe-image-upload";
import { putR2Object } from "@/lib/r2";
import type {
  FeatureImagePromptResult,
  ImageAssetRecord,
  ImagePromptBundle,
  SectionImagePromptResult,
} from "@/lib/image-prompt-types";

function metaForSection(
  section: RecipeImageSection,
  prompts: ImagePromptBundle,
) {
  if (section === "feature") {
    const feature = prompts.feature as FeatureImagePromptResult;
    return {
      alt: feature.alt_text_1,
      title: feature.title_1,
      caption: feature.caption_1,
      description: feature.description_1,
    };
  }
  const row = prompts[section] as SectionImagePromptResult;
  return {
    alt: row.alt_text,
    title: row.title,
    caption: row.caption,
    description: row.description,
  };
}

export function polishArticleHeadings(
  html: string,
  focusKeyword: string,
): string {
  const pretty = focusKeyword
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
  return html
    .replace(
      /<h2[^>]*>\s*Why You'll Love This [^<]*<\/h2>/i,
      `<h2 id="why-youll-love-this">Why You'll Love This ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*Ingredients\s*<\/h2>/i,
      '<h2 id="ingredients">Ingredients</h2>',
    )
    .replace(
      /<h2[^>]*>\s*How to Make [^<]*<\/h2>/i,
      `<h2 id="how-to-make">How to Make ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*Recipe Snapshot\s*<\/h2>/i,
      '<h2 id="recipe-snapshot">Recipe Snapshot</h2>',
    )
    .replace(
      /<h2[^>]*>\s*Pro Tips for Making [^<]*<\/h2>/i,
      `<h2 id="pro-tips">Pro Tips for Making ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*How to Serve this [^<]*<\/h2>/i,
      `<h2 id="how-to-serve">How to Serve ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*Make Ahead and Storage\s*<\/h2>/i,
      '<h2 id="make-ahead-and-storage">Make Ahead and Storage</h2>',
    )
    .replace(
      /<h2[^>]*>\s*Final Thoughts\s*<\/h2>/i,
      '<h2 id="final-thoughts">Final Thoughts</h2>',
    )
    .replace(/<h2[^>]*>\s*FAQs\s*<\/h2>/i, '<h2 id="faqs">FAQs</h2>');
}

export function assertCompletePrompts(
  prompts: ImagePromptBundle | null | undefined,
) {
  if (
    !prompts?.feature ||
    !prompts.ingredients ||
    !prompts.how_to_make ||
    !prompts.how_to_serve
  ) {
    throw new Error("Generate all four image prompts first.");
  }
}

/** Upload one Cursor-generated image buffer to R2 with section metadata. */
export async function uploadSectionImageBuffer(input: {
  section: RecipeImageSection;
  prompts: ImagePromptBundle;
  focusKeyword: string;
  slug: string;
  sourceBuffer: Buffer;
}): Promise<ImageAssetRecord> {
  const { section, prompts, focusKeyword, slug, sourceBuffer } = input;
  const metadata = metaForSection(section, prompts);
  const subjectName = buildRecipeImageSubjectName({
    section,
    metadata,
    focusKeyword,
    slug,
  });
  const processed = await convertRecipeImageToWebp(
    sourceBuffer,
    subjectName,
    section,
    { caption: metadata.caption, description: metadata.description },
  );
  const basename = buildRecipeImageBasename({
    metadata,
    focusKeyword,
    slug,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": metadata.alt,
    title: metadata.title,
    caption: metadata.caption,
    description: metadata.description,
    "focus-keyword": focusKeyword,
    section,
    "subject-name": subjectName,
  });

  return {
    publicPath: r2KeyToPublicPath(r2Key),
    r2Key,
    alt: metadata.alt,
    title: metadata.title,
    caption: metadata.caption,
    description: metadata.description,
    uploadedAt: new Date().toISOString(),
    width: processed.width,
    height: processed.height,
  };
}

export function insertSectionImagesIntoHtml(input: {
  contentHtml: string;
  focusKeyword: string;
  assets: Record<
    "ingredients" | "how_to_make" | "how_to_serve",
    ImageAssetRecord
  >;
}): string {
  let contentHtml = polishArticleHeadings(input.contentHtml, input.focusKeyword);
  for (const section of ["ingredients", "how_to_make", "how_to_serve"] as const) {
    contentHtml = insertRecipeImageIntoArticle({
      contentHtml,
      section,
      src: input.assets[section].publicPath,
      alt: input.assets[section].alt,
      caption: input.assets[section].caption,
      width: input.assets[section].width,
      height: input.assets[section].height,
    });
  }
  return contentHtml;
}
