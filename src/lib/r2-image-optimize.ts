import sharp from "sharp";
import { mimeFromKey } from "@/lib/r2";
import { RECIPE_IMAGE_MAX_WIDTH } from "@/lib/recipe-image-upload";

const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

function inferMaxWidthFromKey(key: string): number {
  const base = key.split("/").pop()?.toLowerCase() ?? "";
  if (
    /ingredient|step-by-step|how-to-serve|how-to-make|preparation|serving/i.test(
      base,
    )
  ) {
    return RECIPE_IMAGE_MAX_WIDTH.ingredients;
  }
  return RECIPE_IMAGE_MAX_WIDTH.feature;
}

/** Downscale oversized recipe media; keeps the same file extension on R2. */
export async function resizeStoredImageIfNeeded(
  key: string,
  input: Buffer,
): Promise<{ buffer: Buffer; contentType: string; changed: boolean }> {
  const ext = key.slice(key.lastIndexOf(".")).toLowerCase();
  const contentType = mimeFromKey(key) || "application/octet-stream";

  if (!IMAGE_EXT.has(ext)) {
    return { buffer: input, contentType, changed: false };
  }

  const meta = await sharp(input).metadata();
  const maxWidth = inferMaxWidthFromKey(key);
  if (!meta.width || meta.width <= maxWidth) {
    return { buffer: input, contentType, changed: false };
  }

  let pipeline = sharp(input)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true });

  if (ext === ".webp") {
    return {
      buffer: await pipeline.webp({ quality: 80, effort: 4 }).toBuffer(),
      contentType: "image/webp",
      changed: true,
    };
  }
  if (ext === ".png") {
    return {
      buffer: await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer(),
      contentType: "image/png",
      changed: true,
    };
  }
  if (ext === ".avif") {
    return {
      buffer: await pipeline.avif({ quality: 70 }).toBuffer(),
      contentType: "image/avif",
      changed: true,
    };
  }

  return {
    buffer: await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
    contentType: "image/jpeg",
    changed: true,
  };
}
