import sharp from "sharp";
import { sanitizeR2MetadataValue } from "@/lib/r2";
import type { RecipeImageSection } from "./recipe-image-upload";
import {
  RECIPE_IMAGE_ASPECT,
  RECIPE_IMAGE_MAX_WIDTH,
  RECIPE_IMAGE_WEBP_QUALITY,
} from "./recipe-image-upload";

export type ProcessedRecipeImage = {
  buffer: Buffer;
  width: number;
  height: number;
};

/** Strip EXIF, crop to section aspect, resize for web, encode WebP. */
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
  const aspect = RECIPE_IMAGE_ASPECT[section];
  const targetHeight = Math.round((maxWidth * aspect.h) / aspect.w);

  const { data, info } = await sharp(inputBuffer)
    .rotate()
    .resize({
      width: maxWidth,
      height: targetHeight,
      fit: "cover",
      position: "centre",
      withoutEnlargement: false,
    })
    .withExif({ IFD0: exif })
    .webp({ quality, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    width: info.width,
    height: info.height,
  };
}
