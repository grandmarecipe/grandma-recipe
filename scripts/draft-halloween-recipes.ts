/**
 * Draft 6 high-volume Halloween/fall recipes on DEV (no images yet, prompts included).
 *
 * Usage: npx tsx scripts/draft-halloween-recipes.ts
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import {
  buildArticleBodyPrompt,
  buildRecipeDataPrompt,
  slugifyTitle,
  stripEmDashes,
} from "../src/lib/article-generate-prompts";
import type { GenerateArticleInput } from "../src/lib/article-generate-types";
import {
  buildRecipeEquipmentBlock,
  parseEquipmentItems,
  prependRecipeMetaBlocks,
} from "../src/lib/equipment";
import { stripLeadingIntroParagraph } from "../src/lib/html";
import { buildImagePromptForSection } from "../src/lib/image-prompt-prompts";
import type {
  FeatureImagePromptResult,
  ImagePromptBundle,
  SectionImagePromptResult,
} from "../src/lib/image-prompt-types";
import {
  buildRecipeNutritionBlock,
  caloriesFromNutrition,
  parseNutritionRows,
} from "../src/lib/nutrition";

const ROOT = process.cwd();

/** Picked for Halloween hub: high volume + not already on site + no pork/alcohol. */
const RECIPES: Array<{
  primaryKeyword: string;
  category: "breakfast" | "lunch" | "dinner" | "snacks" | "dessert";
  volumeNote: string;
  notes: string;
}> = [
  {
    primaryKeyword: "pumpkin pie recipe",
    category: "dessert",
    volumeNote: "~165k (Semrush competitor)",
    notes:
      "Classic homemade pumpkin pie for Halloween and fall. Use canned pumpkin puree, evaporated milk, eggs, sugar, pumpkin pie spice. No alcohol.",
  },
  {
    primaryKeyword: "pumpkin bread",
    category: "dessert",
    volumeNote: "~228k fall searches / strong recipe intent",
    notes:
      "Moist quick pumpkin bread loaf with warm spices. Optional chocolate chips or walnuts. No alcohol, no pork.",
  },
  {
    primaryKeyword: "pumpkin muffins",
    category: "breakfast",
    volumeNote: "~103k fall searches",
    notes:
      "Soft bakery-style pumpkin muffins with cinnamon sugar or streusel optional. Family breakfast treat for Halloween week.",
  },
  {
    primaryKeyword: "pumpkin roll",
    category: "dessert",
    volumeNote: "~93k fall searches",
    notes:
      "Pumpkin cake roll with cream cheese filling, dusted with powdered sugar. Clear rolling tips so home bakers succeed.",
  },
  {
    primaryKeyword: "caramel popcorn",
    category: "snacks",
    volumeNote: "~18k (Semrush competitor)",
    notes:
      "Homemade caramel popcorn for Halloween parties and movie night. Stovetop caramel, no alcohol (no bourbon/rum).",
  },
  {
    primaryKeyword: "pumpkin soup",
    category: "dinner",
    volumeNote: "~18k (Semrush competitor)",
    notes:
      "Creamy homemade pumpkin soup with garlic, onion, broth, cream or coconut milk. Cozy Halloween dinner. No alcohol, no pork/bacon.",
  },
];

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

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

async function openaiJson<T>(messages: ChatMessage[]): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${response.status}: ${detail.slice(0, 400)}`);
  }
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");
  return JSON.parse(content) as T;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n|•|;/)
      .map((item) => item.replace(/^[-*\d.)\s]+/, "").trim())
      .filter(Boolean);
  }
  return [];
}

function cleanOptional(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = stripEmDashes(value).trim();
  return trimmed ? trimmed : undefined;
}

function cleanStringList(value: unknown): string[] {
  return asStringArray(value).map((item) => stripEmDashes(item));
}

function clean(value: unknown): string {
  return typeof value === "string" ? stripEmDashes(value).trim() : "";
}

async function generateImagePrompts(input: {
  focusKeyword: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  excerpt: string;
}): Promise<ImagePromptBundle> {
  const recipeDetails = `${input.title}. ${input.excerpt}`;
  const ingredientsContent = input.ingredients.join("\n");
  const howToMakeContent = input.instructions.join("\n");
  const howToServeContent = `Serve ${input.title} for a cozy Halloween or fall family table.`;

  const bundle: ImagePromptBundle = { focusKeyword: input.focusKeyword };

  const featureRaw = await openaiJson<FeatureImagePromptResult>([
    {
      role: "system",
      content:
        "You write image-generation prompts and SEO-friendly image metadata for a family-friendly recipe blog. Always return valid JSON only. Never mention pork, bacon, wine, or alcohol.",
    },
    {
      role: "user",
      content: buildImagePromptForSection("feature", {
        focusKeyword: input.focusKeyword,
        recipeDetails,
        ingredientsContent,
        howToMakeContent,
        howToServeContent,
      }),
    },
  ]);
  bundle.feature = {
    prompt: clean(featureRaw.prompt),
    alt_text_1: clean(featureRaw.alt_text_1),
    title_1: clean(featureRaw.title_1),
    caption_1: clean(featureRaw.caption_1),
    description_1: clean(featureRaw.description_1),
    alt_text_2: clean(featureRaw.alt_text_2),
    title_2: clean(featureRaw.title_2),
    caption_2: clean(featureRaw.caption_2),
    description_2: clean(featureRaw.description_2),
  };

  for (const section of ["ingredients", "how_to_make", "how_to_serve"] as const) {
    const raw = await openaiJson<SectionImagePromptResult>([
      {
        role: "system",
        content:
          "You write image-generation prompts and SEO-friendly image metadata for a family-friendly recipe blog. Always return valid JSON only. Never mention pork, bacon, wine, or alcohol.",
      },
      {
        role: "user",
        content: buildImagePromptForSection(section, {
          focusKeyword: input.focusKeyword,
          recipeDetails,
          ingredientsContent,
          howToMakeContent,
          howToServeContent,
          feature: bundle.feature,
          ingredients: bundle.ingredients,
          how_to_make: bundle.how_to_make,
        }),
      },
    ]);
    bundle[section] = {
      prompt: clean(raw.prompt),
      alt_text: clean(raw.alt_text),
      title: clean(raw.title),
      caption: clean(raw.caption),
      description: clean(raw.description),
    };
  }

  if (
    !bundle.feature?.prompt ||
    !bundle.ingredients?.prompt ||
    !bundle.how_to_make?.prompt ||
    !bundle.how_to_serve?.prompt
  ) {
    throw new Error(`Incomplete image prompts for ${input.focusKeyword}`);
  }

  return bundle;
}

async function generateOne(spec: (typeof RECIPES)[number]) {
  const input: GenerateArticleInput = {
    mode: "keyword",
    primaryKeyword: spec.primaryKeyword,
    category: spec.category,
    notes: spec.notes,
  };

  const recipeData = await openaiJson<{
    focusKeyword?: string;
    category?: string;
    title?: string;
    excerpt?: string;
    ingredients?: unknown;
    instructions?: unknown;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    servings?: string;
    calories?: string;
    cuisine?: string;
    course?: string;
    nutrition?: unknown;
    equipment?: unknown;
  }>([
    {
      role: "system",
      content:
        "You are a recipe CMS assistant for Grandma Recipe. Always return valid JSON only. Never use pork, bacon, wine, or alcohol.",
    },
    { role: "user", content: buildRecipeDataPrompt(input) },
  ]);

  const focusKeyword =
    cleanOptional(recipeData.focusKeyword) || spec.primaryKeyword;
  const title =
    cleanOptional(recipeData.title) ||
    focusKeyword.replace(/\b\w/g, (c) => c.toUpperCase());
  const ingredients = cleanStringList(recipeData.ingredients);
  const instructions = cleanStringList(recipeData.instructions);
  if (!ingredients.length || !instructions.length) {
    throw new Error(`Missing ingredients/instructions for ${spec.primaryKeyword}`);
  }

  const excerpt =
    cleanOptional(recipeData.excerpt) ||
    `A cozy homemade ${focusKeyword} recipe from Grandma's kitchen.`;

  const articleBody = await openaiJson<{
    seoTitle?: string;
    seoDescription?: string;
    contentHtml?: string;
  }>([
    {
      role: "system",
      content:
        "You are a recipe blog writer for Grandma Recipe. Always return valid JSON only. contentHtml must be HTML, not markdown. Never use pork, bacon, wine, or alcohol. Never use em dashes.",
    },
    {
      role: "user",
      content: buildArticleBodyPrompt({
        focusKeyword,
        title,
        category: spec.category,
        excerpt,
        ingredients,
        instructions,
        prepTime: cleanOptional(recipeData.prepTime),
        cookTime: cleanOptional(recipeData.cookTime),
        totalTime: cleanOptional(recipeData.totalTime),
        servings: cleanOptional(recipeData.servings),
        cuisine: cleanOptional(recipeData.cuisine),
        course: cleanOptional(recipeData.course),
      }),
    },
  ]);

  const contentHtmlRaw = cleanOptional(articleBody.contentHtml);
  if (!contentHtmlRaw) {
    throw new Error(`No HTML for ${spec.primaryKeyword}`);
  }

  const nutrition = parseNutritionRows(recipeData.nutrition);
  const equipment = parseEquipmentItems(recipeData.equipment);
  const contentHtml = stripEmDashes(
    prependRecipeMetaBlocks(stripLeadingIntroParagraph(contentHtmlRaw), [
      buildRecipeNutritionBlock(nutrition),
      buildRecipeEquipmentBlock(equipment),
    ]),
  );
  const calories =
    cleanOptional(recipeData.calories) || caloriesFromNutrition(nutrition);

  console.log(`  prompts… (${focusKeyword})`);
  const imagePrompts = await generateImagePrompts({
    focusKeyword,
    title,
    ingredients,
    instructions,
    excerpt,
  });

  return {
    slug: slugifyTitle(focusKeyword),
    title,
    excerpt,
    category: spec.category,
    categories: [spec.category],
    contentHtml,
    ingredients,
    instructions,
    seoTitle: cleanOptional(articleBody.seoTitle) || title.slice(0, 60),
    seoDescription:
      cleanOptional(articleBody.seoDescription) || excerpt.slice(0, 160),
    focusKeyword,
    prepTime: cleanOptional(recipeData.prepTime),
    cookTime: cleanOptional(recipeData.cookTime),
    totalTime: cleanOptional(recipeData.totalTime),
    servings: cleanOptional(recipeData.servings),
    calories,
    cuisine: cleanOptional(recipeData.cuisine) || "American",
    course: cleanOptional(recipeData.course),
    imagePrompts,
    volumeNote: spec.volumeNote,
  };
}

async function main() {
  loadEnvLocal();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const secret = process.env.CMS_IMPORT_SECRET!;
  if (!secret) throw new Error("CMS_IMPORT_SECRET missing");

  console.log("Drafting 6 Halloween/fall recipes on DEV…\n");
  const results = [];

  for (const spec of RECIPES) {
    console.log(`→ ${spec.primaryKeyword} (${spec.volumeNote})`);
    const article = await generateOne(spec);
    const now = new Date().toISOString();
    const saved = await client.mutation(api.articles.syncArticleFull, {
      secret,
      article: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        categories: article.categories,
        contentHtml: article.contentHtml,
        ingredients: article.ingredients,
        instructions: article.instructions,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        focusKeyword: article.focusKeyword,
        prepTime: article.prepTime,
        cookTime: article.cookTime,
        totalTime: article.totalTime,
        servings: article.servings,
        calories: article.calories,
        cuisine: article.cuisine,
        course: article.course,
        status: "draft",
        publishedAt: now,
        modifiedAt: now,
        imagePrompts: article.imagePrompts,
      },
    });
    const row = {
      ...saved,
      slug: article.slug,
      title: article.title,
      focusKeyword: article.focusKeyword,
      volumeNote: article.volumeNote,
      admin: `http://localhost:3000/admin/articles/${saved.id}/`,
    };
    results.push(row);
    console.log(`  saved ${row.action} ${row.slug}\n`);
  }

  console.log(JSON.stringify({ count: results.length, results }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
