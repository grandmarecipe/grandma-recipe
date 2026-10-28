#!/usr/bin/env node
/**
 * Create a public pin.
 *
 * From a pack folder:
 *   npm run pinterest:pin -- --pack=pinterest-pins/potency-vs-efficacy
 *
 * From a specific UPLOAD file (multi-pin folders):
 *   npm run pinterest:pin -- --upload-file=pinterest-pins/bac-water-diluents/UPLOAD-benzyl-alcohol.txt
 *
 * Pack needs UPLOAD*.txt + jpg/png. Local files upload via image_base64.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, basename, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import {
  loadEnvLocal,
  parseArgs,
  pinterestFetch,
  parseUploadTxt,
  contentTypeFor,
  ROOT,
} from "./lib.mjs";

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
const args = isCli ? (loadEnvLocal(), parseArgs()) : parseArgs(process.argv.slice(2));

function resolveUpload(uploadRelOrAbs) {
  const uploadPath = resolve(ROOT, uploadRelOrAbs);
  if (!existsSync(uploadPath)) {
    throw new Error(`Missing upload file: ${uploadPath}`);
  }
  const packDir = dirname(uploadPath);
  const fields = parseUploadTxt(readFileSync(uploadPath, "utf8"));
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.grandmarecipe.com";

  const imageName = fields["IMAGE FILE"];
  const localImage = imageName ? resolve(packDir, imageName) : null;
  const imageUrl = fields.IMAGE_URL || args["image-url"] || null;

  if (!imageUrl && (!localImage || !existsSync(localImage))) {
    throw new Error("UPLOAD needs IMAGE FILE (local jpg/png) or IMAGE_URL");
  }

  const folder = basename(packDir);
  const publicUrl =
    imageUrl ||
    (imageName ? `${site}/pinterest-pins/${folder}/${imageName}` : null);

  return {
    uploadPath,
    boardName: fields.BOARD,
    boardId:
      fields.BOARD_ID ||
      args["board-id"] ||
      process.env.PINTEREST_DEFAULT_BOARD_ID,
    title: fields.TITLE,
    description: fields.DESCRIPTION,
    link: fields["DESTINATION LINK"],
    altText: fields["ALT TEXT"],
    imageUrl: publicUrl,
    localImage: localImage && existsSync(localImage) ? localImage : null,
    packDir,
  };
}

function resolvePack(packRel) {
  return resolveUpload(resolve(ROOT, packRel, "UPLOAD.txt"));
}

function normalizeDescription(description) {
  let text = String(description || "");
  const cta = "Get the full recipe on Grandma Recipe.";
  text = text.replace(
    /Read the full (?:article|explainer|recipe)(?::)?\s*\n(?:https?:\/\/[^\s\n]+\s*\n?)+/gi,
    `${cta}\n`,
  );
  text = text.replace(
    /(?:Read the full (?:article|explainer)|Get the full recipe)(?::)?\s*\n+/gi,
    `${cta}\n`,
  );
  if (
    /Get the full recipe on Grandma Recipe\./i.test(text) === false &&
    /Read the full (?:article|explainer|recipe)/i.test(text) === false
  ) {
    text = `${text.trim()}\n\n${cta}`;
  }
  return text.trim();
}

export async function createPinFromResolved(resolved, { dryRun = false, preferUrl = false } = {}) {
  const {
    boardId,
    boardName,
    title,
    link,
    imageUrl,
    localImage,
    altText,
  } = resolved;
  const description = normalizeDescription(resolved.description);

  if (!boardId) {
    const err = new Error(
      `Missing board id${boardName ? ` (board name: ${boardName})` : ""}`,
    );
    throw err;
  }
  if (!title || !link || (!imageUrl && !localImage)) {
    throw new Error("Need title, link, and a local image or image-url");
  }

  let mediaSource;
  if (!preferUrl && localImage) {
    mediaSource = {
      source_type: "image_base64",
      content_type: contentTypeFor(localImage),
      data: readFileSync(localImage).toString("base64"),
      is_standard: true,
    };
  } else {
    mediaSource = {
      source_type: "image_url",
      url: String(imageUrl),
    };
  }

  const payload = {
    boardId,
    title,
    link,
    imageUrl,
    localImage,
    mediaSourceType: mediaSource.source_type,
    altText,
    description,
  };

  if (dryRun) return { dryRun: true, ...payload };

  const body = {
    board_id: String(boardId),
    title: String(title).slice(0, 100),
    description: String(description || "").slice(0, 800),
    link: String(link),
    alt_text: String(altText || title).slice(0, 500),
    media_source: mediaSource,
  };

  const created = await pinterestFetch("/pins", { method: "POST", body });
  return {
    id: created.id,
    url: `https://www.pinterest.com/pin/${created.id}/`,
    link: created.link || link,
    title,
  };
}

if (isCli) {
  const uploadRel = args["upload-file"];
  const packRel = args.pack;
  const resolved = uploadRel
    ? resolveUpload(uploadRel)
    : packRel
      ? resolvePack(packRel)
      : null;

  if (
    !resolved &&
    !(args.title && args.link && (args["image-url"] || args["image-file"]))
  ) {
    console.error(
      "Need --pack=... or --upload-file=... (or title/link/image flags).",
    );
    process.exit(1);
  }

  const manual = resolved || {
    boardId: args["board-id"] || process.env.PINTEREST_DEFAULT_BOARD_ID,
    title: args.title,
    description: args.description || "",
    link: args.link,
    imageUrl: args["image-url"],
    localImage: args["image-file"] ? resolve(ROOT, args["image-file"]) : null,
    altText: args["alt-text"] || args.title,
  };

  try {
    const result = await createPinFromResolved(manual, {
      dryRun: Boolean(args["dry-run"]),
      preferUrl: Boolean(args["image-url"] || args["use-url"]),
    });
    if (result.dryRun) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("Pin created");
      console.log(`id:\t${result.id}`);
      console.log(`url:\t${result.url}`);
      if (result.link) console.log(`link:\t${result.link}`);
    }
  } catch (err) {
    console.error(String(err.message || err));
    process.exit(1);
  }
}
