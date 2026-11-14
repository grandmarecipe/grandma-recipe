/**
 * Schedule Thanksgiving cluster on DEV with staggered publish times,
 * build Pinterest packs, then push scheduled drafts to PROD.
 *
 * Order: 6 recipes → 4 guides → 1 pillar
 * Gaps: varied ~1.5–2.5 hours
 *
 * Usage:
 *   npx tsx scripts/schedule-thanksgiving-cluster.ts
 *   SKIP_PINS=1 npx tsx scripts/schedule-thanksgiving-cluster.ts
 *   SKIP_PROD=1 npx tsx scripts/schedule-thanksgiving-cluster.ts
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

const ROOT = process.cwd();
const ASSETS =
  "/Users/talhaoui/.cursor/projects/Users-talhaoui-Desktop-cursor-projects-grandma-recipe/assets";
const DEFAULT_PROD_URL = "https://valuable-parrot-157.convex.cloud";

type Kind = "recipe" | "guide" | "pillar";

const QUEUE: Array<{
  slug: string;
  kind: Kind;
  board: string;
  boardId: string;
  pinTitle: string;
  pinDescription: string;
  pinAlt: string;
  assetCandidates: string[];
}> = [
  {
    slug: "green-bean-casserole",
    kind: "recipe",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Homestyle Green Bean Casserole for Thanksgiving",
    pinDescription: `Creamy green bean casserole with a crispy onion topping for the holiday table.

This pin covers:
- Fresh green beans in a creamy mushroom sauce
- Golden crispy fried onion topping
- Make-ahead tips for Thanksgiving day

Get the full recipe on Grandma Recipe.`,
    pinAlt:
      "Homestyle green bean casserole with creamy sauce and crispy fried onions",
    assetCandidates: [
      "green-bean-casserole-feature.jpg",
      "green-bean-casserole-feature.png",
      "green-bean-casserole-how-to-serve.jpg",
    ],
  },
  {
    slug: "sweet-potato-casserole",
    kind: "recipe",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Classic Sweet Potato Casserole with Pecan Streusel",
    pinDescription: `Sweet potato casserole with a buttery pecan streusel topping for Thanksgiving.

This pin covers:
- Creamy mashed sweet potatoes
- Cinnamon brown sugar flavor
- Crunchy pecan streusel finish

Get the full recipe on Grandma Recipe.`,
    pinAlt:
      "Classic sweet potato casserole topped with golden pecan streusel",
    assetCandidates: [
      "sweet-potato-casserole-feature.jpg",
      "sweet-potato-casserole-feature.png",
      "sweet-potato-casserole-how-to-serve.jpg",
    ],
  },
  {
    slug: "classic-stuffing",
    kind: "recipe",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Classic Bread Stuffing Recipe for Thanksgiving",
    pinDescription: `Classic bread stuffing with onion, celery, and herbs for the holiday sideboard.

This pin covers:
- Day-old bread cubes
- Butter, sage, and thyme
- Oven-baked until golden on top

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Classic bread stuffing with herbs in a ceramic baking dish",
    assetCandidates: [
      "classic-stuffing-feature.jpg",
      "classic-stuffing-feature.png",
      "classic-stuffing-how-to-serve.jpg",
    ],
  },
  {
    slug: "cranberry-sauce",
    kind: "recipe",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Homemade Cranberry Sauce for Thanksgiving",
    pinDescription: `Homemade cranberry sauce simmered with orange and cinnamon until glossy.

This pin covers:
- Fresh cranberries
- Orange zest and juice
- Make-ahead holiday condiment

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Homemade cranberry sauce with orange zest in a small bowl",
    assetCandidates: [
      "cranberry-sauce-feature.jpg",
      "cranberry-sauce-feature.png",
      "cranberry-sauce-how-to-serve.jpg",
    ],
  },
  {
    slug: "turkey-gravy",
    kind: "recipe",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Silky Homemade Turkey Gravy, No Wine",
    pinDescription: `Silky turkey gravy from drippings or broth for mashed potatoes and turkey.

This pin covers:
- Pan drippings or turkey broth
- Smooth flour-butter roux
- No wine, just classic gravy

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Silky homemade turkey gravy in a ceramic gravy boat",
    assetCandidates: [
      "turkey-gravy-feature.jpg",
      "turkey-gravy-feature.png",
      "turkey-gravy-how-to-serve.jpg",
    ],
  },
  {
    slug: "roast-turkey",
    kind: "recipe",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "How to Cook a Turkey for Thanksgiving",
    pinDescription: `Clear roast turkey guide with seasoning, timing, resting, and carving tips.

This pin covers:
- Herb butter under the skin
- Oven timing by bird size
- Resting for juicy slices

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Golden roasted whole turkey on a holiday serving platter",
    assetCandidates: [
      "roast-turkey-feature.jpg",
      "roast-turkey-feature.png",
      "roast-turkey-how-to-serve.jpg",
    ],
  },
  {
    slug: "thanksgiving-side-dishes",
    kind: "guide",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Thanksgiving Side Dishes Guide",
    pinDescription: `Easy Thanksgiving side dishes for potatoes, stuffing, beans, and gravy.

This pin covers:
- Mashed potatoes and casseroles
- Stuffing and green beans
- Gravy and cranberry sauce

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Thanksgiving side dishes with mashed potatoes, stuffing, and gravy",
    assetCandidates: [
      "thanksgiving-side-dishes-feature.jpg",
      "thanksgiving-side-dishes-feature.png",
    ],
  },
  {
    slug: "thanksgiving-desserts",
    kind: "guide",
    board: "Grandma dessert recipe",
    boardId: "1137229412095780952",
    pinTitle: "Thanksgiving Desserts Guide",
    pinDescription: `Thanksgiving desserts centered on pumpkin pie, rolls, breads, and easy cakes.

This pin covers:
- Classic pumpkin pie
- Pumpkin roll and poke cake
- Bread and muffins for leftovers

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Thanksgiving desserts with pumpkin pie and fall bakes",
    assetCandidates: [
      "thanksgiving-desserts-feature.jpg",
      "thanksgiving-desserts-feature.png",
    ],
  },
  {
    slug: "thanksgiving-appetizers",
    kind: "guide",
    board: "Grandma snack recipe",
    boardId: "1137229412095892593",
    pinTitle: "Thanksgiving Appetizers Guide",
    pinDescription: `Light Thanksgiving appetizers with dips, cheese balls, and non-alcoholic drinks.

This pin covers:
- Cheese balls and veggie dips
- Fresh starters for guests
- Cider and cranberry drinks

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Thanksgiving appetizer tray with dips and festive drinks",
    assetCandidates: [
      "thanksgiving-appetizers-feature.jpg",
      "thanksgiving-appetizers-feature.png",
    ],
  },
  {
    slug: "thanksgiving-dinner-ideas",
    kind: "guide",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Thanksgiving Dinner Ideas and Menus",
    pinDescription: `Thanksgiving dinner ideas for a classic table, dinner for two, and vegetarian plates.

This pin covers:
- Classic turkey menu
- Smaller dinner for two
- Vegetarian holiday plate

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Thanksgiving dinner table with turkey, sides, and pie",
    assetCandidates: [
      "thanksgiving-dinner-ideas-feature.jpg",
      "thanksgiving-dinner-ideas-feature.png",
    ],
  },
  {
    slug: "thanksgiving-recipes",
    kind: "pillar",
    board: "Grandma dinner recipe",
    boardId: "1137229412095780951",
    pinTitle: "Easy Thanksgiving Recipes Hub",
    pinDescription: `Easy Thanksgiving recipes for turkey, sides, desserts, and appetizers in one guide.

This pin covers:
- Turkey mains and gravy
- Classic holiday sides
- Pumpkin desserts and starters

Get the full recipe on Grandma Recipe.`,
    pinAlt: "Easy Thanksgiving recipes spread with turkey, sides, and pie",
    assetCandidates: [
      "thanksgiving-recipes-feature.jpg",
      "thanksgiving-recipes-feature.png",
    ],
  },
];

/** Minutes between consecutive publishes (varied around ~2 hours). */
const GAPS_MINUTES = [105, 135, 90, 150, 120, 145, 95, 130, 110, 125];

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function buildSchedule(startIso: string): Array<{ slug: string; at: string }> {
  let cursor = new Date(startIso).getTime();
  return QUEUE.map((item, index) => {
    if (index > 0) cursor += GAPS_MINUTES[index - 1]! * 60_000;
    return { slug: item.slug, at: new Date(cursor).toISOString() };
  });
}

async function makePinImage(slug: string, candidates: string[]) {
  const srcName = candidates.find((name) =>
    fs.existsSync(path.join(ASSETS, name)),
  );
  if (!srcName) {
    throw new Error(
      `No pin source image for ${slug}. Tried: ${candidates.join(", ")}`,
    );
  }
  const src = path.join(ASSETS, srcName);
  const pinName = `${slug}-pin.jpg`;
  const packDir = path.join(ROOT, "pinterest-pins", slug);
  const publicDir = path.join(ROOT, "public", "pinterest-pins", slug);
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  const outPack = path.join(packDir, pinName);
  const outPublic = path.join(publicDir, pinName);

  // Tall 9:16 crop from feature (cover fit into 1080x1920).
  await sharp(src)
    .rotate()
    .resize(1080, 1920, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88 })
    .toFile(outPack);
  fs.copyFileSync(outPack, outPublic);
  return pinName;
}

function writeUploadTxt(
  slug: string,
  pinFile: string,
  meta: (typeof QUEUE)[number],
) {
  const body = `BOARD
${meta.board}

BOARD_ID
${meta.boardId}

IMAGE FILE
${pinFile}

TITLE
${meta.pinTitle}

DESCRIPTION
${meta.pinDescription}

DESTINATION LINK
https://www.grandmarecipe.com/${slug}/

ALT TEXT
${meta.pinAlt}
`;
  const packPath = path.join(ROOT, "pinterest-pins", slug, "UPLOAD.txt");
  const publicPath = path.join(
    ROOT,
    "public",
    "pinterest-pins",
    slug,
    "UPLOAD.txt",
  );
  fs.writeFileSync(packPath, body);
  fs.writeFileSync(publicPath, body);
}

async function main() {
  loadEnvLocal();
  const skipPins = process.env.SKIP_PINS === "1";
  const skipProd = process.env.SKIP_PROD === "1";

  const devUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const prodUrl = process.env.PROD_CONVEX_URL?.trim() || DEFAULT_PROD_URL;
  const secret = process.env.CMS_IMPORT_SECRET?.trim();
  if (!devUrl || !secret) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL or CMS_IMPORT_SECRET");
  }
  if (devUrl === prodUrl) throw new Error("Dev URL equals prod");

  // Start ~12:00 UTC today if still in the future, else +2 hours from now.
  const now = Date.now();
  const preferredStart = Date.parse("2026-11-14T12:00:00.000Z");
  const startIso = new Date(
    preferredStart > now + 30 * 60_000 ? preferredStart : now + 2 * 60 * 60_000,
  ).toISOString();

  const schedule = buildSchedule(startIso);
  const bySlug = Object.fromEntries(schedule.map((s) => [s.slug, s.at]));

  console.log("Thanksgiving publish schedule (UTC):\n");
  for (const row of schedule) {
    const meta = QUEUE.find((q) => q.slug === row.slug)!;
    console.log(
      `  ${row.at}  [${meta.kind.padEnd(6)}]  ${row.slug}`,
    );
  }
  console.log("");

  const dev = new ConvexHttpClient(devUrl);
  const items = await dev.query(api.articles.listIdsForSync, { secret });

  for (const meta of QUEUE) {
    const at = bySlug[meta.slug]!;
    const item = items.find((row) => row.slug === meta.slug);
    if (!item) throw new Error(`Missing DEV article: ${meta.slug}`);

    const existing = await dev.query(api.articles.exportOneForSync, {
      secret,
      id: item.id as Id<"articles">,
    });
    if (!existing) throw new Error(`Could not export ${meta.slug}`);
    if (!existing.featuredImage?.trim()) {
      throw new Error(`${meta.slug} missing featured image`);
    }

    await dev.mutation(api.articles.syncArticleFull, {
      secret,
      article: {
        ...existing,
        status: "draft",
        publishedAt: at,
        modifiedAt: new Date().toISOString(),
        scheduledPublishAt: at,
      },
    });
    console.log(`Scheduled DEV ${meta.slug} → ${at}`);

    if (!skipPins) {
      const pinFile = await makePinImage(meta.slug, meta.assetCandidates);
      writeUploadTxt(meta.slug, pinFile, meta);
      console.log(`  pin pack ready (${pinFile})`);
    }
  }

  if (skipProd) {
    console.log("\nSKIP_PROD=1, not pushing to PROD.");
    return;
  }

  console.log("\nPushing scheduled drafts to PROD…");
  const prod = new ConvexHttpClient(prodUrl);
  for (const meta of QUEUE) {
    const item = items.find((row) => row.slug === meta.slug)!;
    const article = await dev.query(api.articles.exportOneForSync, {
      secret,
      id: item.id as Id<"articles">,
    });
    if (!article) throw new Error(`Re-export failed: ${meta.slug}`);

    const result = await prod.mutation(api.articles.syncArticleFull, {
      secret,
      article: {
        ...article,
        status: "draft",
        scheduledPublishAt: article.scheduledPublishAt,
      },
    });
    console.log(
      `  ${result.action} ${meta.slug} → PROD draft @ ${article.scheduledPublishAt}`,
    );
  }

  const schedulePath = path.join(ROOT, ".cursor", "thanksgiving-schedule.json");
  fs.writeFileSync(
    schedulePath,
    JSON.stringify(
      {
        startIso,
        gapsMinutes: GAPS_MINUTES,
        order: schedule,
      },
      null,
      2,
    ),
  );
  console.log(`\nWrote ${schedulePath}`);
  console.log(
    "PROD cron publishes each draft within ~10 minutes of its scheduled time.",
  );
  console.log(
    "Commit + push pin packs to main so auto-pin can run on publish day.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
