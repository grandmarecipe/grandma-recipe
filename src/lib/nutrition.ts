import type { RecipeNutritionRow } from "./wprm";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseNutritionRows(value: unknown): RecipeNutritionRow[] {
  if (!Array.isArray(value)) return [];

  const rows: RecipeNutritionRow[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const nutrient =
      typeof record.nutrient === "string" ? record.nutrient.trim() : "";
    const amount =
      typeof record.amount === "string" ? record.amount.trim() : "";
    if (nutrient && amount) {
      rows.push({ nutrient, amount });
    }
  }
  return rows;
}

export function parseNutritionTableHtml(tableHtml: string): RecipeNutritionRow[] {
  const rows: RecipeNutritionRow[] = [];
  const rowRegex =
    /<tr>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>\s*<\/tr>/gi;
  let match: RegExpExecArray | null;

  while ((match = rowRegex.exec(tableHtml)) !== null) {
    const nutrient = stripInlineHtml(match[1]);
    const amount = stripInlineHtml(match[2]);
    if (
      nutrient &&
      amount &&
      !/^nutrient$/i.test(nutrient) &&
      !/^amount/i.test(nutrient)
    ) {
      rows.push({ nutrient, amount });
    }
  }

  return rows;
}

function stripInlineHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Hidden CMS block — parsed for the recipe card Notes table, stripped from story HTML. */
export function buildRecipeNutritionBlock(rows: RecipeNutritionRow[]): string {
  if (rows.length === 0) return "";

  const body = rows
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.nutrient)}</td><td>${escapeHtml(row.amount)}</td></tr>`,
    )
    .join("");

  return `<div id="recipe-nutrition" class="recipe-nutrition"><table><thead><tr><th>Nutrient</th><th>Amount per Serving</th></tr></thead><tbody>${body}</tbody></table></div>`;
}

export function prependNutritionBlock(
  contentHtml: string,
  rows: RecipeNutritionRow[],
): string {
  if (rows.length === 0 || /id=["']recipe-nutrition["']/i.test(contentHtml)) {
    return contentHtml;
  }
  return `${buildRecipeNutritionBlock(rows)}\n${contentHtml}`;
}

export function caloriesFromNutrition(rows: RecipeNutritionRow[]): string | undefined {
  const calories = rows.find((row) => /^calories$/i.test(row.nutrient.trim()));
  return calories?.amount;
}

export function nutritionFallbackFromCalories(
  calories?: string,
): RecipeNutritionRow[] {
  if (!calories?.trim()) return [];
  const amount = calories.trim().replace(/\s*calories?$/i, "");
  if (!amount) return [];
  return [{ nutrient: "Calories", amount }];
}
