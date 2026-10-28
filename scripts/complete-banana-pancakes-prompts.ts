/**
 * One-off: generate image prompts for homemade banana pancakes (dev draft).
 * Usage: npx tsx scripts/complete-banana-pancakes-prompts.ts
 */
import fs from "fs";
import path from "path";
import { buildImagePromptForSection } from "../src/lib/image-prompt-prompts";
import type {
  FeatureImagePromptResult,
  SectionImagePromptResult,
} from "../src/lib/image-prompt-types";

const ROOT = process.cwd();

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

async function openaiJson<T>(userPrompt: string): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const model = process.env.OPENAI_MODEL || "gpt-4.1";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write image-generation prompts and SEO-friendly image metadata for a family-friendly recipe blog. Always return valid JSON only.",
        },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const payload = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");
  return JSON.parse(content) as T;
}

async function main() {
  loadEnvLocal();
  const articlePath = path.join(ROOT, ".tmp", "banana-article.json");
  if (!fs.existsSync(articlePath)) {
    throw new Error(`Missing ${articlePath} — export article first.`);
  }
  const article = JSON.parse(fs.readFileSync(articlePath, "utf8")) as {
    excerpt: string;
    ingredients: string[];
    instructions: string[];
  };

  const focusKeyword = "homemade banana pancakes";
  const recipeDetails = [
    article.excerpt,
    article.ingredients.join(", "),
    article.instructions.slice(0, 4).join(" "),
  ].join("\n");
  const ingredientsContent = article.ingredients.join("\n");
  const howToMakeContent = article.instructions.join("\n");
  const howToServeContent =
    "Serve warm with maple syrup, butter, sliced bananas, berries, yogurt, cinnamon.";

  console.log("Generating feature prompt…");
  const feature = await openaiJson<FeatureImagePromptResult>(
    buildImagePromptForSection("feature", { focusKeyword, recipeDetails }),
  );

  console.log("Generating ingredients prompt…");
  const ingredients = await openaiJson<SectionImagePromptResult>(
    buildImagePromptForSection("ingredients", {
      focusKeyword,
      ingredientsContent,
      feature,
    }),
  );

  console.log("Generating how_to_make prompt…");
  const how_to_make = await openaiJson<SectionImagePromptResult>(
    buildImagePromptForSection("how_to_make", {
      focusKeyword,
      howToMakeContent,
      feature,
      ingredients,
    }),
  );

  console.log("Generating how_to_serve prompt…");
  const how_to_serve = await openaiJson<SectionImagePromptResult>(
    buildImagePromptForSection("how_to_serve", {
      focusKeyword,
      howToServeContent,
      feature,
      ingredients,
      how_to_make,
    }),
  );

  const bundle = { feature, ingredients, how_to_make, how_to_serve };
  const out = path.join(ROOT, ".tmp", "banana-image-prompts.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(bundle, null, 2));
  console.log("Wrote", out);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
