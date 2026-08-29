import sharp from "sharp";
import { sanitizeR2MetadataValue } from "@/lib/r2";
import type { RecipeImageSection } from "./recipe-image-upload";
import {
  RECIPE_IMAGE_MAX_WIDTH,
  RECIPE_IMAGE_WEBP_QUALITY,
} from "./recipe-image-upload";

export type ProcessedRecipeImage = {
  buffer: Buffer;
  width: number;
  height: number;
};

/** Strip EXIF, resize for web, and encode WebP tuned for LCP / in-article use. */
export async function convertRecipeImageToWebp(
  inputBuffer: Buffer,
  subjectName: string,
  section: RecipeImageSection,
  extra?: { caption?: string; description?: string },
): Promise<ProcessedRecipeImage> {
  const exif: Record<string, string> = {
    ImageDescription: sanitizeR2MetadataValue(subjectName, 512),
    XPTitle: sanitizeR2MetadataValue(subjectName, 512),
  };

  const comment = extra?.caption?.trim() || extra?.description?.trim();
  if (comment) {
    exif.XPComment = sanitizeR2MetadataValue(comment, 512);
  }

  const maxWidth = RECIPE_IMAGE_MAX_WIDTH[section];
  const quality = RECIPE_IMAGE_WEBP_QUALITY[section];

  let pipeline = sharp(inputBuffer).rotate();
  const meta = await pipeline.metadata();

  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const { data, info } = await pipeline
    .withExif({ IFD0: exif })
    .webp({ quality, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    width: info.width,
    height: info.height,
  };
}
