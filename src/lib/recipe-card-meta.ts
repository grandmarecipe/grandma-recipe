import { stripHtml } from "./html";
import type { Recipe } from "./types";
import { extractSnapshotMeta, formatRecipeDuration } from "./schema-data";

export interface RecipeCardMeta {
  prepTime?: string;
  cookTime?: string;
  extraTime?: string;
  extraTimeLabel?: string;
  totalTime?: string;
  servings?: string;
  course?: string;
  cuisine?: string;
  calories?: string;
}

/** Fields we persist on recipe JSON so schema/UI don't need HTML scraping. */
export type PersistedRecipeFields = Pick<
  Recipe,
  | "prepTime"
  | "cookTime"
  | "totalTime"
  | "servings"
  | "course"
  | "cuisine"
  | "calories"
>;

function parseExtraTime(raw?: string): { value?: string; label?: string } {
  if (!raw) return {};
  const trimmed = raw.trim();
  if (/^0\s*(minutes?|mins?)?$/i.test(trimmed)) return {};

  const note = trimmed.match(/\(([^)]+)\)/);
  return {
    value: formatRecipeDuration(trimmed),
    label: note?.[1]?.trim() || "Extra Time",
  };
}

function extractCustomWprmTimeLabel(html: string): string | undefined {
  const labels = [
    ...html.matchAll(
      /<span class="[^"]*wprm-recipe-time-label[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    ),
  ].map((match) => stripHtml(match[1]).replace(/:$/, "").trim().toLowerCase());

  return labels.find(
    (label) => !["prep time", "cook time", "total time"].includes(label),
  );
}

function extractWprmValue(
  html: string,
  className: string,
): string | undefined {
  const match = html.match(
    new RegExp(
      `<span class="[^"]*\\b${className}\\b(?![\\w-])[^"]*"[^>]*>([^<]+)</span>`,
      "i",
    ),
  );
  const value = match?.[1]?.trim();
  if (!value || /^(course|cuisine|calories|servings)\s*:?\s*$/i.test(value)) {
    return undefined;
  }
  return value;
}

function normalizeServings(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return /serving/i.test(trimmed) ? trimmed : `${trimmed} servings`;
}

/**
 * Pull timing/meta from Recipe Snapshot + WPRM markup in content HTML.
 * Used by import/backfill to persist fields onto recipe JSON.
 */
export function extractRecipeFieldsFromHtml(html: string): PersistedRecipeFields {
  const snapshot = extractSnapshotMeta(html);
  const servingsRaw =
    snapshot.servings || extractWprmValue(html, "wprm-recipe-servings");

  return {
    prepTime: formatRecipeDuration(snapshot.prepTime),
    cookTime: formatRecipeDuration(snapshot.cookTime),
    totalTime: formatRecipeDuration(snapshot.totalTime),
    servings: normalizeServings(servingsRaw),
    course:
      snapshot.course ||
      extractWprmValue(html, "wprm-recipe-course") ||
      snapshot.category,
    cuisine:
      snapshot.cuisine || extractWprmValue(html, "wprm-recipe-cuisine"),
    calories:
      snapshot.calories || extractWprmValue(html, "wprm-recipe-calories"),
  };
}

export function getRecipeCardMeta(recipe: Recipe): RecipeCardMeta {
  const snapshot = extractSnapshotMeta(recipe.contentHtml);
  const extra = parseExtraTime(snapshot.extraTime);
  const customLabel = extractCustomWprmTimeLabel(recipe.contentHtml);
  const fromHtml = extractRecipeFieldsFromHtml(recipe.contentHtml);

  return {
    prepTime: formatRecipeDuration(recipe.prepTime) || fromHtml.prepTime,
    cookTime: formatRecipeDuration(recipe.cookTime) || fromHtml.cookTime,
    totalTime: formatRecipeDuration(recipe.totalTime) || fromHtml.totalTime,
    extraTime: extra.value,
    extraTimeLabel: customLabel || extra.label,
    servings: recipe.servings || fromHtml.servings,
    course: recipe.course || fromHtml.course,
    cuisine: recipe.cuisine || fromHtml.cuisine,
    calories: recipe.calories || fromHtml.calories,
  };
}

export function getRecipeTimingRows(meta: RecipeCardMeta) {
  return [
    meta.prepTime ? { label: "Prep Time", value: meta.prepTime } : null,
    meta.cookTime ? { label: "Cook Time", value: meta.cookTime } : null,
    meta.extraTime
      ? { label: meta.extraTimeLabel || "Extra Time", value: meta.extraTime }
      : null,
    meta.totalTime ? { label: "Total Time", value: meta.totalTime } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}

export function getRecipeMetaPills(meta: RecipeCardMeta) {
  return [
    meta.servings ? { label: "Servings", value: meta.servings } : null,
    meta.course ? { label: "Course", value: meta.course } : null,
    meta.cuisine ? { label: "Cuisine", value: meta.cuisine } : null,
    meta.calories ? { label: "Calories", value: meta.calories } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}
