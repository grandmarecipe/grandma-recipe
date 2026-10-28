#!/usr/bin/env node
/**
 * Auto-pin released articles that have a pack and are not yet in .posted.json.
 *
 * New publishes (not in backlog): pin when article is released.
 * Catch-up backlog: pin when scheduleDate <= today, limited to backlog.pinsPerDay
 * unless --all-due is set.
 *
 *   npm run pinterest:auto -- --dry-run
 *   npm run pinterest:auto -- --catch-up
 *   npm run pinterest:auto -- --catch-up --only-today
 *   npm run pinterest:auto -- --refresh
 */

import { relative, resolve, dirname, basename } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import {
  loadEnvLocal,
  parseArgs,
  parseUploadTxt,
  listUploadFiles,
  loadArticlePublishDays,
  articleSlugFromLink,
  publishedAtDay,
  releaseDateToday,
  loadPostedLog,
  savePostedLog,
  getAccessToken,
  ROOT,
} from "./lib.mjs";
import { createPinFromResolved } from "./create-pin.mjs";

loadEnvLocal();
const args = parseArgs();
const dryRun = Boolean(args["dry-run"]);
const onlyToday = Boolean(args["only-today"]);
const catchUp = Boolean(args["catch-up"]);
const allDue = Boolean(args["all-due"]);
const asOfDay = args.day || releaseDateToday();
const preferUrl = Boolean(args["use-url"]);

if (args.refresh) {
  await getAccessToken({ refresh: true });
  console.log("Refreshed Pinterest access token");
}

const backlogPath = resolve(ROOT, "pinterest-pins/backlog.json");
const backlog = existsSync(backlogPath)
  ? JSON.parse(readFileSync(backlogPath, "utf8"))
  : { pinsPerDay: 2, items: [] };
const backlogBySlug = new Map(
  (backlog.items || []).map((item) => [item.slug, item]),
);
const pinsPerDay = Number(backlog.pinsPerDay || 2);

const articles = loadArticlePublishDays();
const posted = loadPostedLog();
const postedLinks = new Set(
  (posted.pins || []).map((p) => String(p.link || "").replace(/\/$/, "")),
);

function normalizeLink(link) {
  return String(link || "")
    .trim()
    .replace(/\/$/, "");
}

function resolveFromUploadFile(uploadPath) {
  const packDir = dirname(uploadPath);
  const fields = parseUploadTxt(readFileSync(uploadPath, "utf8"));
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.grandmarecipe.com";
  const imageName = fields["IMAGE FILE"];
  const localImage = imageName ? resolve(packDir, imageName) : null;
  const imageUrl = fields.IMAGE_URL || null;
  const folder = basename(packDir);
  const publicUrl =
    imageUrl ||
    (imageName ? `${site}/pinterest-pins/${folder}/${imageName}` : null);

  return {
    uploadPath,
    boardName: fields.BOARD,
    boardId: fields.BOARD_ID || process.env.PINTEREST_DEFAULT_BOARD_ID,
    title: fields.TITLE,
    description: fields.DESCRIPTION,
    link: fields["DESTINATION LINK"],
    altText: fields["ALT TEXT"],
    imageUrl: publicUrl,
    localImage: localImage && existsSync(localImage) ? localImage : null,
    packDir,
  };
}

const uploads = listUploadFiles();
const fresh = [];
const scheduled = [];

for (const uploadPath of uploads) {
  const resolved = resolveFromUploadFile(uploadPath);
  const link = normalizeLink(resolved.link);
  const slug = articleSlugFromLink(link);
  const publishedAt = slug ? articles.get(slug) : null;
  const rel = relative(ROOT, uploadPath);
  const backlogItem = slug ? backlogBySlug.get(slug) : null;

  if (!link || !slug) {
    console.log(`skip\t${rel}\t(no article destination link)`);
    continue;
  }
  if (!publishedAt) {
    console.log(`skip\t${rel}\t(no recipe slug ${slug} in content/recipes)`);
    continue;
  }
  const day = publishedAtDay(publishedAt);
  if (day > asOfDay) {
    console.log(`skip\t${rel}\t(not released yet; publishes ${day})`);
    continue;
  }
  if (postedLinks.has(link)) {
    console.log(`skip\t${rel}\t(already posted)`);
    continue;
  }
  if (!resolved.boardId) {
    console.log(`skip\t${rel}\t(missing BOARD_ID)`);
    continue;
  }
  if (!resolved.localImage && !resolved.imageUrl) {
    console.log(`skip\t${rel}\t(missing image)`);
    continue;
  }

  if (backlogItem) {
    if (catchUp === false && onlyToday === false && !args.day) {
      // On plain publish pushes, ignore catch-up backlog (daily job handles it)
      console.log(`skip\t${rel}\t(catch-up backlog; waits for schedule ${backlogItem.scheduleDate})`);
      continue;
    }
    if (backlogItem.scheduleDate > asOfDay) {
      console.log(`skip\t${rel}\t(scheduled ${backlogItem.scheduleDate})`);
      continue;
    }
    if (onlyToday && backlogItem.scheduleDate !== asOfDay) {
      console.log(`skip\t${rel}\t(only-today; schedule ${backlogItem.scheduleDate})`);
      continue;
    }
    scheduled.push({
      resolved,
      slug,
      day,
      rel,
      link,
      scheduleDate: backlogItem.scheduleDate,
    });
    continue;
  }

  // Fresh (non-backlog) packs: pin when article is live
  if (catchUp) {
    console.log(`skip\t${rel}\t(not in catch-up backlog)`);
    continue;
  }
  if (onlyToday && day !== asOfDay) {
    console.log(`skip\t${rel}\t(only-today; article day ${day})`);
    continue;
  }
  fresh.push({ resolved, slug, day, rel, link });
}

scheduled.sort((a, b) => a.scheduleDate.localeCompare(b.scheduleDate));
// Catch-up runs post 1 pin at a time so two hourly crons can space the daily pair.
const perRun = args["per-run"] ? Number(args["per-run"]) : catchUp ? 1 : pinsPerDay;
const dueScheduled =
  catchUp && !allDue && !onlyToday
    ? scheduled.slice(0, perRun)
    : catchUp && onlyToday
      ? scheduled.filter((s) => s.scheduleDate === asOfDay).slice(0, perRun)
      : scheduled;

const candidates = [...fresh, ...dueScheduled];

if (!candidates.length) {
  console.log(`No new pins to create for ${asOfDay}.`);
  process.exit(0);
}

console.log(`Creating ${candidates.length} pin(s) for ${asOfDay}`);

let failures = 0;
for (const item of candidates) {
  try {
    const result = await createPinFromResolved(item.resolved, {
      dryRun,
      preferUrl,
    });
    if (dryRun) {
      console.log(`dry-run\t${item.rel}\t${item.link}`);
      continue;
    }
    console.log(`ok\t${item.rel}\t${result.url}`);
    posted.pins = posted.pins || [];
    posted.pins.push({
      link: item.link,
      slug: item.slug,
      publishedAtDay: item.day,
      scheduleDate: item.scheduleDate || null,
      pinId: result.id,
      pinUrl: result.url,
      uploadFile: item.rel,
      postedAt: new Date().toISOString(),
    });
    postedLinks.add(item.link);
    savePostedLog(posted);
  } catch (err) {
    failures += 1;
    console.error(`fail\t${item.rel}\t${err.message || err}`);
  }
}

if (failures) process.exit(1);
