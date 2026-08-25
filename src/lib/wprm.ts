import { stripHtml } from "./html";
import {
  nutritionFallbackFromCalories,
  parseNutritionTableHtml,
} from "./nutrition";
import { parseEquipmentListHtml } from "./equipment";

export interface RecipeEquipmentItem {
  name: string;
  notes?: string;
}

export interface RecipeNutritionRow {
  nutrient: string;
  amount: string;
}

export interface RecipeNotes {
  nutrition: RecipeNutritionRow[];
  html?: string;
  text?: string;
}

function decodeHtml(text: string): string {
  return text
    .replace(/&#32;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractEquipmentFromHtml(html: string): RecipeEquipmentItem[] {
  const cmsMatch = html.match(
    /<div[^>]*id=["']recipe-equipment["'][^>]*>([\s\S]*?)<\/div>/i,
  );
  if (cmsMatch) {
    const cmsItems = parseEquipmentListHtml(cmsMatch[1]);
    if (cmsItems.length > 0) return cmsItems;
  }

  const items: RecipeEquipmentItem[] = [];
  const itemRegex =
    /<li class="[^"]*wprm-recipe-equipment-item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[1];
    const notesMatch = block.match(
      /<span class="[^"]*wprm-recipe-equipment-notes[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
    );
    const notes = notesMatch ? decodeHtml(stripHtml(notesMatch[1])) : undefined;
    const withoutNotes = block.replace(
      /<span class="[^"]*wprm-recipe-equipment-notes[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
      "",
    );
    const name = decodeHtml(stripHtml(withoutNotes));
    if (name) items.push({ name, notes: notes || undefined });
  }

  return items;
}

export function extractNotesFromHtml(
  html: string,
  options?: { calories?: string },
): RecipeNotes | null {
  const cmsMatch = html.match(
    /<div[^>]*id=["']recipe-nutrition["'][^>]*>([\s\S]*?)<\/div>/i,
  );
  if (cmsMatch) {
    const nutrition = parseNutritionTableHtml(cmsMatch[1]);
    if (nutrition.length > 0) {
      return { nutrition };
    }
  }

  const notesMatch = html.match(
    /<div class="[^"]*wprm-recipe-notes\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  );
  if (!notesMatch) {
    const fallback = nutritionFallbackFromCalories(options?.calories);
    return fallback.length > 0 ? { nutrition: fallback } : null;
  }

  const body = notesMatch[1].trim();
  if (!body) {
    const fallback = nutritionFallbackFromCalories(options?.calories);
    return fallback.length > 0 ? { nutrition: fallback } : null;
  }

  const nutrition = parseNutritionTableHtml(body);
  if (nutrition.length > 0) {
    return { nutrition };
  }

  const text = decodeHtml(stripHtml(body));
  if (text) {
    return {
      nutrition: [],
      html: body,
      text,
    };
  }

  const fallback = nutritionFallbackFromCalories(options?.calories);
  return fallback.length > 0 ? { nutrition: fallback } : null;
}
