import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { buildImagePromptForSection } from "@/lib/image-prompt-prompts";
import type {
  FeatureImagePromptResult,
  GenerateImagePromptsInput,
  ImagePromptBundle,
  ImagePromptSection,
  SectionImagePromptResult,
} from "@/lib/image-prompt-types";

export const runtime = "nodejs";
export const maxDuration = 120;

type ChatMessage = { role: "system" | "user"; content: string };

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

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFeature(raw: FeatureImagePromptResult): FeatureImagePromptResult {
  return {
    prompt: clean(raw.prompt),
    alt_text_1: clean(raw.alt_text_1),
    title_1: clean(raw.title_1),
    caption_1: clean(raw.caption_1),
    description_1: clean(raw.description_1),
    alt_text_2: clean(raw.alt_text_2),
    title_2: clean(raw.title_2),
    caption_2: clean(raw.caption_2),
    description_2: clean(raw.description_2),
  };
}

function normalizeSection(raw: SectionImagePromptResult): SectionImagePromptResult {
  return {
    prompt: clean(raw.prompt),
    alt_text: clean(raw.alt_text),
    title: clean(raw.title),
    caption: clean(raw.caption),
    description: clean(raw.description),
  };
}

async function generateSection(
  section: ImagePromptSection,
  input: GenerateImagePromptsInput,
  bundle: ImagePromptBundle,
): Promise<void> {
  const prompt = buildImagePromptForSection(section, {
    focusKeyword: input.focusKeyword,
    recipeDetails: input.recipeDetails,
    ingredientsContent: input.ingredientsContent,
    howToMakeContent: input.howToMakeContent,
    howToServeContent: input.howToServeContent,
    feature: bundle.feature,
    ingredients: bundle.ingredients,
    how_to_make: bundle.how_to_make,
  });

  if (section === "feature") {
    const result = normalizeFeature(
      await openaiJson<FeatureImagePromptResult>([
        {
          role: "system",
          content:
            "You write image-generation prompts and SEO-friendly image metadata for a family-friendly recipe blog. Always return valid JSON only.",
        },
        { role: "user", content: prompt },
      ]),
    );
    if (!result.prompt) {
      throw new Error("Feature image prompt generation returned an empty prompt.");
    }
    bundle.feature = result;
    return;
  }

  const result = normalizeSection(
    await openaiJson<SectionImagePromptResult>([
      {
        role: "system",
        content:
          "You write image-generation prompts and SEO-friendly image metadata for a family-friendly recipe blog. Always return valid JSON only.",
      },
      { role: "user", content: prompt },
    ]),
  );
  if (!result.prompt) {
    throw new Error(`${section} image prompt generation returned an empty prompt.`);
  }
  bundle[section] = result;
}

const SECTION_ORDER: ImagePromptSection[] = [
  "feature",
  "ingredients",
  "how_to_make",
  "how_to_serve",
];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateImagePromptsInput & {
      token?: string;
      previousBundle?: ImagePromptBundle;
    };

    if (!body.token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const convex = getConvexClient();
    const admin = await convex.query(api.adminAuth.me, { token: body.token });
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const focusKeyword = body.focusKeyword?.trim();
    if (!focusKeyword) {
      return NextResponse.json(
        { error: "Focus keyword is required." },
        { status: 400 },
      );
    }

    const input: GenerateImagePromptsInput = {
      focusKeyword,
      recipeDetails: body.recipeDetails,
      ingredientsContent: body.ingredientsContent,
      howToMakeContent: body.howToMakeContent,
      howToServeContent: body.howToServeContent,
      section: body.section || "all",
    };

    const bundle: ImagePromptBundle = {
      focusKeyword,
      feature: body.previousBundle?.feature,
      ingredients: body.previousBundle?.ingredients,
      how_to_make: body.previousBundle?.how_to_make,
      how_to_serve: body.previousBundle?.how_to_serve,
    };

    if (input.section === "all" || !input.section) {
      for (const section of SECTION_ORDER) {
        await generateSection(section, input, bundle);
      }
    } else {
      await generateSection(input.section, input, bundle);
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image prompt generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
