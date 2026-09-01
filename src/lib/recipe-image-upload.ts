import type { ImagePromptSection } from "./image-prompt-types";

export type RecipeImageSection = ImagePromptSection;

/** Max pixel width when uploading — keeps files small for in-article lazy-loaded images. */
export const RECIPE_IMAGE_MAX_WIDTH: Record<RecipeImageSection, number> = {
  feature: 1200,
  ingredients: 400,
  how_to_make: 400,
  how_to_serve: 400,
};

export const RECIPE_IMAGE_WEBP_QUALITY: Record<RecipeImageSection, number> = {
  feature: 80,
  ingredients: 78,
  how_to_make: 78,
  how_to_serve: 78,
};

export type RecipeImageMetadata = {
  alt: string;
  title: string;
  caption: string;
  description: string;
};

export function slugifyImageFilename(text: string): string {
  return text
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-")
    .slice(0, 80);
}

/** R2/WebP filename derived from the generated metadata title. */
export function buildRecipeImageBasename(input: {
  metadata: RecipeImageMetadata;
  focusKeyword: string;
  slug: string;
}): string {
  const fromTitle = slugifyImageFilename(input.metadata.title);
  if (fromTitle) return fromTitle;

  return (
    slugifyImageFilename(input.focusKeyword) ||
    slugifyImageFilename(input.slug) ||
    "Recipe-Image"
  );
}

export function buildRecipeImageR2Key(basename: string, date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const safe = basename.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `wp-content/uploads/${year}/${month}/${safe}.webp`;
}

export function r2KeyToPublicPath(key: string): string {
  return `/${key.replace(/^\/+/, "")}`;
}

/** Readable recipe/dish name from slug or focus keyword. */
export function humanizeRecipeName(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";

  return trimmed
    .replace(/['']/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Subject name embedded in the image and stored on R2 (uses generated metadata title). */
export function buildRecipeImageSubjectName(input: {
  section: RecipeImageSection;
  metadata: RecipeImageMetadata;
  focusKeyword: string;
  slug: string;
}): string {
  const title = input.metadata.title.trim();
  if (title) return title;

  const recipeName =
    humanizeRecipeName(input.focusKeyword) ||
    humanizeRecipeName(input.slug);

  switch (input.section) {
    case "feature":
      return recipeName || "Recipe";
    case "ingredients":
      return recipeName ? `Ingredients for ${recipeName}` : "Ingredients";
    case "how_to_make":
      return recipeName ? `${recipeName} Preparation` : "Recipe preparation";
    case "how_to_serve":
      return recipeName ? `How to Serve ${recipeName}` : "Serving suggestion";
  }
}

export type RecipeImageProcessingPlan = {
  originalFilename: string;
  originalType: string;
  originalSizeBytes: number;
  outputFilename: string;
  outputPublicPath: string;
  outputFormat: "webp";
  outputMaxWidth: number;
  subjectName: string;
  exifRemoved: string[];
  exifAdded: Array<{ label: string; value: string }>;
  r2Metadata: Array<{ label: string; value: string }>;
  warnings: string[];
};

/** Preview of filename, EXIF, and R2 changes before upload. */
export function buildRecipeImageProcessingPlan(input: {
  section: RecipeImageSection;
  metadata: RecipeImageMetadata;
  focusKeyword: string;
  slug: string;
  file: { name: string; type: string; size: number };
  date?: Date;
}): RecipeImageProcessingPlan {
  const basename = buildRecipeImageBasename({
    metadata: input.metadata,
    focusKeyword: input.focusKeyword,
    slug: input.slug,
  });
  const r2Key = buildRecipeImageR2Key(basename, input.date);
  const subjectName = buildRecipeImageSubjectName({
    section: input.section,
    metadata: input.metadata,
    focusKeyword: input.focusKeyword,
    slug: input.slug,
  });
  const comment =
    input.metadata.caption.trim() || input.metadata.description.trim();

  const warnings: string[] = [];
  if (!input.metadata.title.trim()) {
    warnings.push("No metadata title — filename will fall back to focus keyword or slug.");
  }
  if (!input.metadata.alt.trim()) {
    warnings.push("Alt text is empty — add it in the prompts above for accessibility.");
  }

  return {
    originalFilename: input.file.name,
    originalType: input.file.type || "unknown",
    originalSizeBytes: input.file.size,
    outputFilename: `${basename}.webp`,
    outputPublicPath: r2KeyToPublicPath(r2Key),
    outputFormat: "webp",
    outputMaxWidth: RECIPE_IMAGE_MAX_WIDTH[input.section],
    subjectName,
    exifRemoved: [
      "GPS location",
      "Camera make & model",
      "Date/time taken",
      "All other original EXIF",
      "Orientation tag (image auto-rotated first)",
    ],
    exifAdded: [
      { label: "ImageDescription", value: subjectName },
      { label: "XPTitle", value: subjectName },
      ...(comment ? [{ label: "XPComment", value: comment }] : []),
    ],
    r2Metadata: [
      ...(input.metadata.alt
        ? [{ label: "alt-text", value: input.metadata.alt }]
        : []),
      ...(input.metadata.title
        ? [{ label: "title", value: input.metadata.title }]
        : []),
      ...(input.metadata.caption
        ? [{ label: "caption", value: input.metadata.caption }]
        : []),
      ...(input.metadata.description
        ? [{ label: "description", value: input.metadata.description }]
        : []),
      ...(input.focusKeyword
        ? [{ label: "focus-keyword", value: input.focusKeyword }]
        : []),
      { label: "section", value: input.section },
      { label: "subject-name", value: subjectName },
    ],
    warnings,
  };
}
