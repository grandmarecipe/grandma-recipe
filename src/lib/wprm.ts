import { stripHtml } from "./html";

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

export function extractNotesFromHtml(html: string): RecipeNotes | null {
  const notesMatch = html.match(
    /<div class="[^"]*wprm-recipe-notes\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  );
  if (!notesMatch) return null;

  const body = notesMatch[1].trim();
  if (!body) return null;

  const nutrition: RecipeNutritionRow[] = [];
  const rowRegex =
    /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  let row: RegExpExecArray | null;
  while ((row = rowRegex.exec(body)) !== null) {
    const nutrient = decodeHtml(stripHtml(row[1]));
    const amount = decodeHtml(stripHtml(row[2]));
    if (
      nutrient &&
      amount &&
      !/^nutrient$/i.test(nutrient) &&
      !/^amount/i.test(nutrient)
    ) {
      nutrition.push({ nutrient, amount });
    }
  }

  if (nutrition.length > 0) {
    return { nutrition };
  }

  const text = decodeHtml(stripHtml(body));
  if (!text) return null;

  return {
    nutrition: [],
    html: body,
    text,
  };
}
