import fs from "node:fs";
import path from "node:path";
import { extractRecipeFieldsFromHtml } from "../src/lib/recipe-card-meta";
import type { Recipe } from "../src/lib/types";

const FIELD_KEYS = [
  "prepTime",
  "cookTime",
  "totalTime",
  "servings",
  "course",
  "cuisine",
  "calories",
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];

async function main() {
  const recipesDir = path.join(process.cwd(), "content", "recipes");
  const files = fs
    .readdirSync(recipesDir)
    .filter((file) => file.endsWith(".json"));

  let updated = 0;
  let unchanged = 0;
  const coverage: Record<FieldKey, number> = {
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    servings: 0,
    course: 0,
    cuisine: 0,
    calories: 0,
  };
  let missingAll = 0;

  for (const file of files) {
    const filePath = path.join(recipesDir, file);
    const recipe = JSON.parse(fs.readFileSync(filePath, "utf8")) as Recipe;
    const extracted = extractRecipeFieldsFromHtml(recipe.contentHtml || "");

    let changed = false;
    for (const key of FIELD_KEYS) {
      const next = extracted[key];
      if (!next) continue;
      if (recipe[key] !== next) {
        recipe[key] = next;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, `${JSON.stringify(recipe, null, 2)}\n`);
      updated += 1;
    } else {
      unchanged += 1;
    }

    let any = false;
    for (const key of FIELD_KEYS) {
      if (recipe[key]) {
        coverage[key] += 1;
        any = true;
      }
    }
    if (!any) missingAll += 1;
  }

  console.log(`Backfilled recipe meta in ${updated} files (${unchanged} unchanged).`);
  console.log("Coverage after backfill:");
  for (const key of FIELD_KEYS) {
    console.log(`  ${key}: ${coverage[key]}/${files.length}`);
  }
  console.log(`  no timing/meta fields: ${missingAll}/${files.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
