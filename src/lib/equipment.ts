import type { RecipeEquipmentItem } from "./wprm";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseEquipmentItems(value: unknown): RecipeEquipmentItem[] {
  if (!Array.isArray(value)) return [];

  const items: RecipeEquipmentItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    if (!name) continue;
    const notes =
      typeof record.notes === "string" ? record.notes.trim() : undefined;
    items.push({ name, notes: notes || undefined });
  }
  return items;
}

export function parseEquipmentListHtml(listHtml: string): RecipeEquipmentItem[] {
  const items: RecipeEquipmentItem[] = [];
  const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(listHtml)) !== null) {
    const block = match[1];
    const notesMatch = block.match(
      /<span[^>]*class="[^"]*recipe-equipment-notes[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
    );
    const notes = notesMatch
      ? stripInlineHtml(notesMatch[1])
      : undefined;
    const nameMatch = block.match(
      /<span[^>]*class="[^"]*recipe-equipment-name[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
    );
    const name = nameMatch
      ? stripInlineHtml(nameMatch[1])
      : stripInlineHtml(
          block.replace(
            /<span[^>]*class="[^"]*recipe-equipment-notes[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
            "",
          ),
        );
    if (name) items.push({ name, notes: notes || undefined });
  }

  return items;
}

function stripInlineHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Hidden CMS block — parsed for recipe card Equipment, stripped from story HTML. */
export function buildRecipeEquipmentBlock(
  items: RecipeEquipmentItem[],
): string {
  if (items.length === 0) return "";

  const list = items
    .map((item) => {
      const notes = item.notes
        ? `<span class="recipe-equipment-notes">${escapeHtml(item.notes)}</span>`
        : "";
      return `<li class="recipe-equipment-item"><span class="recipe-equipment-name">${escapeHtml(item.name)}</span>${notes}</li>`;
    })
    .join("");

  return `<div id="recipe-equipment" class="recipe-equipment"><ul>${list}</ul></div>`;
}

export function prependEquipmentBlock(
  contentHtml: string,
  items: RecipeEquipmentItem[],
): string {
  if (items.length === 0 || /id=["']recipe-equipment["']/i.test(contentHtml)) {
    return contentHtml;
  }
  return `${buildRecipeEquipmentBlock(items)}\n${contentHtml}`;
}

export function prependRecipeMetaBlocks(
  contentHtml: string,
  blocks: string[],
): string {
  const toPrepend = blocks.filter(Boolean).join("\n");
  if (!toPrepend) return contentHtml;
  return `${toPrepend}\n${contentHtml}`;
}
