/**
 * Import filesystem recipes into Convex CMS using primary keywords +
 * publish status from the grandma sheet tab (content/sheet-primary-keywords.csv).
 *
 * Usage:
 *   CMS_IMPORT_SECRET='…' npx tsx scripts/import-file-recipes-to-cms.ts
 *   npx tsx scripts/import-file-recipes-to-cms.ts --limit=10
 *   npx tsx scripts/import-file-recipes-to-cms.ts --sheet-only
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { CategorySlug } from "../src/lib/types";

const ROOT = process.cwd();
const RECIPES_DIR = path.join(ROOT, "content", "recipes");
const SHEET_CSV = path.join(ROOT, "content", "sheet-primary-keywords.csv");
const CATEGORY_SLUGS = new Set([
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "dessert",
]);

type FileRecipe = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categories?: string[];
  contentHtml: string;
  ingredients: string[];
  instructions: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  calories?: string;
  cuisine?: string;
  course?: string;
  publishedAt?: string;
  modifiedAt?: string;
};

type SheetRow = {
  slug: string;
  keyword: string;
  status: "draft" | "published";
  url: string;
  seo_title: string;
  category: string;
};

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function loadSheetRows(): Map<string, SheetRow> {
  if (!fs.existsSync(SHEET_CSV)) {
    throw new Error(
      `Missing ${SHEET_CSV}. Re-export the grandma sheet Keyword/POST URL/STATUT columns.`,
    );
  }
  const rows = parseCsv(fs.readFileSync(SHEET_CSV, "utf8"));
  const header = rows[0]?.map((h) => h.trim().toLowerCase()) ?? [];
  const idx = (name: string) => header.indexOf(name);
  const iSlug = idx("slug");
  const iKw = idx("keyword");
  const iStatus = idx("status");
  const iUrl = idx("url");
  const iSeo = idx("seo_title");
  const iCat = idx("category");
  const map = new Map<string, SheetRow>();
  for (const cols of rows.slice(1)) {
    const slug = (cols[iSlug] || "").trim();
    if (!slug) continue;
    const rawStatus = (cols[iStatus] || "").trim().toLowerCase();
    map.set(slug, {
      slug,
      keyword: (cols[iKw] || "").trim(),
      status: rawStatus === "draft" ? "draft" : "published",
      url: (cols[iUrl] || "").trim(),
      seo_title: (cols[iSeo] || "").trim(),
      category: (cols[iCat] || "").trim(),
    });
  }
  return map;
}

function asCategory(value: string): CategorySlug {
  const normalized = value.trim().toLowerCase();
  if (CATEGORY_SLUGS.has(normalized)) return normalized as CategorySlug;
  return "dinner";
}

function parseArgs() {
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
  return {
    limit: Number.isFinite(limit) && (limit as number) > 0 ? limit : undefined,
    sheetOnly: process.argv.includes("--sheet-only"),
  };
}

async function main() {
  loadEnvLocal();
  const { limit, sheetOnly } = parseArgs();
  const sheet = loadSheetRows();
  console.log(`Loaded ${sheet.size} sheet rows from ${path.basename(SHEET_CSV)}`);

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL (check .env.local).");
  }

  const client = new ConvexHttpClient(convexUrl);
  const importSecret = process.env.CMS_IMPORT_SECRET?.trim();

  let token: string | undefined = process.env.ADMIN_TOKEN?.trim();
  if (!importSecret && !token) {
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error(
        "Set CMS_IMPORT_SECRET, or ADMIN_TOKEN, or ADMIN_EMAIL + ADMIN_PASSWORD.",
      );
    }
    const session = await client.mutation(api.adminAuth.login, {
      email,
      password,
    });
    token = session.token;
    console.log(`Signed in as ${email}`);
  }

  const files = fs
    .readdirSync(RECIPES_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort();

  let selected = sheetOnly
    ? files.filter((name) => sheet.has(name.replace(/\.json$/, "")))
    : files;

  // Prefer sheet order for published + keyword coverage
  if (sheetOnly) {
    selected = [...sheet.keys()]
      .map((slug) => `${slug}.json`)
      .filter((name) => fs.existsSync(path.join(RECIPES_DIR, name)));
  }

  if (limit) selected = selected.slice(0, limit);
  console.log(`Importing ${selected.length} recipes…`);

  let inserted = 0;
  let keyword = 0;
  let status = 0;
  let skipped = 0;
  let failed = 0;
  let missingSheet = 0;

  for (let i = 0; i < selected.length; i += 1) {
    const file = selected[i];
    const filePath = path.join(RECIPES_DIR, file);
    try {
      const recipe = JSON.parse(
        fs.readFileSync(filePath, "utf8"),
      ) as FileRecipe;
      const sheetRow = sheet.get(recipe.slug);
      if (!sheetRow?.keyword) missingSheet += 1;

      const focusKeyword =
        sheetRow?.keyword || recipe.slug.replace(/-/g, " ").trim();
      const publishStatus = sheetRow?.status ?? "published";
      const categories = (recipe.categories?.length
        ? recipe.categories
        : [sheetRow?.category || recipe.category]
      ).map(asCategory);

      const result = await client.mutation(api.articles.upsertPublishedImport, {
        token,
        secret: importSecret,
        article: {
          slug: recipe.slug,
          title: recipe.title,
          excerpt: recipe.excerpt || "",
          category: asCategory(sheetRow?.category || recipe.category),
          categories,
          contentHtml: recipe.contentHtml || "",
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          featuredImage: recipe.featuredImage,
          featuredImageAlt: recipe.featuredImageAlt,
          seoTitle: sheetRow?.seo_title || recipe.seoTitle,
          seoDescription: recipe.seoDescription,
          focusKeyword,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          totalTime: recipe.totalTime,
          servings: recipe.servings,
          calories: recipe.calories,
          cuisine: recipe.cuisine,
          course: recipe.course,
          publishedAt: recipe.publishedAt,
          modifiedAt: recipe.modifiedAt,
          status: publishStatus,
        },
      });

      if (result.action === "insert") inserted += 1;
      else if (result.action === "keyword") keyword += 1;
      else if (result.action === "status") status += 1;
      else skipped += 1;

      if ((i + 1) % 25 === 0 || i + 1 === selected.length) {
        console.log(
          `… ${i + 1}/${selected.length} (insert ${inserted}, keyword ${keyword}, status ${status}, skip ${skipped}, fail ${failed})`,
        );
      }
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`FAIL ${file}: ${message}`);
    }
  }

  console.log(
    `\nDone. inserted=${inserted} keywordFilled=${keyword} statusUpdated=${status} skipped=${skipped} failed=${failed} noSheetKeyword=${missingSheet}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
