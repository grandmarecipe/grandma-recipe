import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import {
  buildArticleBodyPrompt,
  buildRecipeDataPrompt,
  slugifyTitle,
  stripEmDashes,
} from "@/lib/article-generate-prompts";
import { getRecipeBySlug } from "@/lib/content";
import {
  buildRecipeEquipmentBlock,
  parseEquipmentItems,
  prependRecipeMetaBlocks,
} from "@/lib/equipment";
import { stripLeadingIntroParagraph } from "@/lib/html";
import {
  buildRecipeNutritionBlock,
  caloriesFromNutrition,
  parseNutritionRows,
} from "@/lib/nutrition";
import type {
  GenerateArticleInput,
  GenerateCategory,
  GeneratedArticle,
} from "@/lib/article-generate-types";

export const runtime = "nodejs";
export const maxDuration = 120;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function openaiJson<T>(messages: ChatMessage[]): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local (and Vercel env).",
    );
  }

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
    throw new Error(`OpenAI error (${response.status}): ${detail.slice(0, 400)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty response.");
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

const CATEGORIES = new Set([
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "dessert",
]);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateArticleInput & {
      token?: string;
    };

    if (!body.token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const convex = getConvexClient();
    const admin = await convex.query(api.adminAuth.me, { token: body.token });
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (body.category && !CATEGORIES.has(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (body.mode === "paste") {
      if (!body.pastedDraft?.trim()) {
        return NextResponse.json(
          { error: "Paste a draft to generate from." },
          { status: 400 },
        );
      }
    } else if (!body.primaryKeyword?.trim()) {
      return NextResponse.json(
        { error: "Primary keyword is required." },
        { status: 400 },
      );
    }

    if (body.mode !== "paste" && body.primaryKeyword?.trim()) {
      const existing = await convex.query(api.articles.findExistingForGenerate, {
        token: body.token,
        input: body.primaryKeyword,
      });
      if (existing) {
        const label =
          existing.matchType === "slug" ? "URL slug" : "Primary keyword";
        return NextResponse.json(
          {
            error: `${label} already used by “${existing.title}” (/${existing.slug}/). Open it in Admin → Articles instead of generating a duplicate.`,
            existing: {
              id: existing._id,
              slug: existing.slug,
              title: existing.title,
              status: existing.status,
              matchType: existing.matchType,
            },
          },
          { status: 409 },
        );
      }

      const fileSlug = slugifyTitle(body.primaryKeyword);
      const fileRecipe = fileSlug ? getRecipeBySlug(fileSlug) : null;
      if (fileRecipe) {
        return NextResponse.json(
          {
            error: `A live recipe already exists at /${fileRecipe.slug}/ (“${fileRecipe.title}”). Import or edit it in the CMS instead of generating a duplicate.`,
            existing: {
              slug: fileRecipe.slug,
              title: fileRecipe.title,
              source: "file",
            },
          },
          { status: 409 },
        );
      }
    }

    const input: GenerateArticleInput = {
      mode: body.mode,
      primaryKeyword: body.primaryKeyword?.trim() || "",
      category: body.category as GenerateCategory | undefined,
      notes: body.notes,
      recipePaste: body.recipePaste,
      ingredientsText: body.ingredientsText,
      instructionsText: body.instructionsText,
      pastedDraft: body.pastedDraft,
    };

    if (body.mode === "keyword_recipe") {
      const paste = (
        body.recipePaste?.trim() ||
        body.ingredientsText?.trim() ||
        body.instructionsText?.trim() ||
        ""
      );
      if (!paste) {
        return NextResponse.json(
          {
            error:
              "Paste a recipe (ingredients at minimum). Instructions can be missing — AI will write them.",
          },
          { status: 400 },
        );
      }
    }

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
          "You are a recipe CMS assistant for Grandma Recipe. Always return valid JSON only.",
      },
      { role: "user", content: buildRecipeDataPrompt(input) },
    ]);

    const focusKeyword =
      cleanOptional(recipeData.focusKeyword) ||
      input.primaryKeyword ||
      "homemade recipe";
    const title =
      cleanOptional(recipeData.title) ||
      focusKeyword.replace(/\b\w/g, (c) => c.toUpperCase());
    const ingredients = cleanStringList(recipeData.ingredients);
    const instructions = cleanStringList(recipeData.instructions);

    const detectedCategory = cleanOptional(recipeData.category)?.toLowerCase();
    const category: GenerateCategory =
      (input.category && CATEGORIES.has(input.category)
        ? input.category
        : undefined) ||
      (detectedCategory && CATEGORIES.has(detectedCategory)
        ? (detectedCategory as GenerateCategory)
        : "dinner");

    if (ingredients.length === 0 || instructions.length === 0) {
      return NextResponse.json(
        {
          error:
            "Generation did not produce ingredients and instructions. Try again.",
        },
        { status: 502 },
      );
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
          "You are a recipe blog writer for Grandma Recipe. Always return valid JSON only. contentHtml must be HTML, not markdown.",
      },
      {
        role: "user",
        content: buildArticleBodyPrompt({
          focusKeyword,
          title,
          category,
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
      return NextResponse.json(
        { error: "Generation did not produce article HTML. Try again." },
        { status: 502 },
      );
    }

    const nutrition = parseNutritionRows(recipeData.nutrition);
    const equipment = parseEquipmentItems(recipeData.equipment);
    const contentHtml = stripEmDashes(
      prependRecipeMetaBlocks(
        stripLeadingIntroParagraph(contentHtmlRaw),
        [
          buildRecipeNutritionBlock(nutrition),
          buildRecipeEquipmentBlock(equipment),
        ],
      ),
    );
    const calories =
      cleanOptional(recipeData.calories) || caloriesFromNutrition(nutrition);

    const result: GeneratedArticle = {
      title,
      slug: slugifyTitle(title),
      excerpt,
      category,
      contentHtml,
      ingredients,
      instructions,
      seoTitle:
        cleanOptional(articleBody.seoTitle) || title.slice(0, 60),
      seoDescription:
        cleanOptional(articleBody.seoDescription) || excerpt.slice(0, 160),
      prepTime: cleanOptional(recipeData.prepTime),
      cookTime: cleanOptional(recipeData.cookTime),
      totalTime: cleanOptional(recipeData.totalTime),
      servings: cleanOptional(recipeData.servings),
      calories,
      cuisine: cleanOptional(recipeData.cuisine),
      course: cleanOptional(recipeData.course),
      focusKeyword,
    };

    return NextResponse.json({ article: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
