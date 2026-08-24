import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import {
  buildArticleBodyPrompt,
  buildRecipeDataPrompt,
  slugifyTitle,
} from "@/lib/article-generate-prompts";
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

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
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
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
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

    if (!CATEGORIES.has(body.category)) {
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

    const input: GenerateArticleInput = {
      mode: body.mode,
      primaryKeyword: body.primaryKeyword?.trim() || "",
      category: body.category as GenerateCategory,
      notes: body.notes,
      ingredientsText: body.ingredientsText,
      instructionsText: body.instructionsText,
      pastedDraft: body.pastedDraft,
    };

    const recipeData = await openaiJson<{
      focusKeyword?: string;
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
    const ingredients = asStringArray(recipeData.ingredients);
    const instructions = asStringArray(recipeData.instructions);

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
          category: input.category,
          excerpt,
          ingredients,
          instructions,
          prepTime: cleanOptional(recipeData.prepTime),
          cookTime: cleanOptional(recipeData.cookTime),
          totalTime: cleanOptional(recipeData.totalTime),
          servings: cleanOptional(recipeData.servings),
        }),
      },
    ]);

    const contentHtml = cleanOptional(articleBody.contentHtml);
    if (!contentHtml) {
      return NextResponse.json(
        { error: "Generation did not produce article HTML. Try again." },
        { status: 502 },
      );
    }

    const result: GeneratedArticle = {
      title,
      slug: slugifyTitle(title),
      excerpt,
      category: input.category,
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
      calories: cleanOptional(recipeData.calories),
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
