import { stripHtml } from "./html";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RecipeSnapshotMeta {
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  extraTime?: string;
  servings?: string;
  calories?: string;
  cuisine?: string;
  category?: string;
  dietary?: string;
  course?: string;
}

export function parseDurationToIso(value: string): string | undefined {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (/^pt[\dhms]+$/i.test(normalized)) {
    return normalized.toUpperCase();
  }

  let hours = 0;
  let minutes = 0;
  const hourMatch = normalized.match(/(\d+)\s*(?:hours?|hrs?|hr|h)\b/);
  const minuteMatch = normalized.match(/(\d+)\s*(?:minutes?|mins?|min|m)\b/);

  if (hourMatch) hours = Number.parseInt(hourMatch[1], 10);
  if (minuteMatch) minutes = Number.parseInt(minuteMatch[1], 10);

  if (!hourMatch && !minuteMatch) {
    const numeric = normalized.match(/^(\d+)$/);
    if (numeric) minutes = Number.parseInt(numeric[1], 10);
  }

  if (hours === 0 && minutes === 0) return undefined;

  let iso = "PT";
  if (hours > 0) iso += `${hours}H`;
  if (minutes > 0) iso += `${minutes}M`;
  return iso;
}

export function formatRecipeDuration(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized) return undefined;

  const lower = normalized.toLowerCase();
  if (/^0+\s*(minutes?|mins?|hours?|hrs?)?$/i.test(lower)) return undefined;

  let hours = Number.parseInt(
    lower.match(/(\d+)\s*(?:hours?|hrs?|hr|h)\b/)?.[1] ?? "0",
    10,
  );
  let minutes = 0;
  const minuteMatch = lower.match(/(\d+)\s*(?:minutes?|mins?|min|m)\b/);
  if (minuteMatch) {
    minutes = Number.parseInt(minuteMatch[1], 10);
  } else if (/^\d+$/.test(lower)) {
    minutes = Number.parseInt(lower, 10);
  }

  if (!hours && !minutes) return normalized;

  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  const parts: string[] = [];
  if (hours) parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
  if (minutes) parts.push(`${minutes} mins`);
  return parts.join(" ");
}

export function extractSnapshotMeta(html: string): RecipeSnapshotMeta {
  const meta: Record<string, string> = {};
  const snapshotMatch =
    html.match(
      /id=["']recipe-snapshot["'][\s\S]*?<table[\s\S]*?<\/table>/i,
    ) ||
    html.match(
      /Recipe Snapshot<\/(?:strong|b|h2)>[\s\S]*?<table[\s\S]*?<\/table>/i,
    );

  if (snapshotMatch) {
    const rowRegex =
      /<tr>\s*<t[dh][^>]*>\s*([^<]+?)\s*<\/t[dh]>\s*<t[dh][^>]*>\s*([^<]+?)\s*<\/t[dh]>\s*<\/tr>/gi;
    let match: RegExpExecArray | null;
    while ((match = rowRegex.exec(snapshotMatch[0])) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key && value && key.toLowerCase() !== "feature") {
        meta[key] = value;
      }
    }
  }

  const wprmTime = (kind: string) => {
    const match = html.match(
      new RegExp(
        `wprm-recipe-${kind}_time[\\s\\S]*?<span class="wprm-recipe-details[^"]*"[^>]*>(\\d+)<`,
        "i",
      ),
    );
    return match ? `${match[1]} mins` : undefined;
  };

  const wprmText = (className: string) => {
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
  };

  const servingsMatch = html.match(/data-servings="([^"]+)"/i);
  const servingsFromClass = html.match(
    /wprm-recipe-servings wprm-recipe-details[^"]*"[^>]*>([^<]+)</i,
  );
  const servings =
    meta.Serves || servingsMatch?.[1] || servingsFromClass?.[1]?.trim();

  return {
    prepTime: meta["Prep Time"] || wprmTime("prep"),
    cookTime: meta["Cook Time"] || wprmTime("cook"),
    totalTime: meta["Total Time"] || wprmTime("total"),
    extraTime: meta["Extra Time"] || meta.Cooling || meta.cooling,
    servings: servings ? `${servings}`.replace(/\s*servings?$/i, "") : undefined,
    calories: meta.Calories || wprmText("wprm-recipe-calories"),
    cuisine: meta.Cuisine || wprmText("wprm-recipe-cuisine"),
    category: meta.Category,
    dietary: meta.Dietary,
    course: meta.Course || wprmText("wprm-recipe-course"),
  };
}

export function extractFaqsFromHtml(html: string): FaqItem[] {
  const faqs: FaqItem[] = [];
  const qaRegex =
    /<h3[^>]*class="rank-math-question[^"]*"[^>]*>([\s\S]*?)<\/h3>\s*<div[^>]*class="rank-math-answer[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

  let match: RegExpExecArray | null;
  while ((match = qaRegex.exec(html)) !== null) {
    const question = stripHtml(match[1]).replace(/^\d+\.\s*/, "").trim();
    const answer = stripHtml(match[2]).trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

export function cleanSchema<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanSchema(item))
      .filter((item) => item !== undefined && item !== null) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, item]) => [key, cleanSchema(item)])
        .filter(
          ([, item]) =>
            item !== undefined &&
            item !== null &&
            !(Array.isArray(item) && item.length === 0),
        ),
    ) as T;
  }

  return value;
}
