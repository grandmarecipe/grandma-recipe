export type GenerateCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snacks"
  | "dessert";

export type GenerateMode = "keyword" | "keyword_recipe" | "paste";

export interface GenerateArticleInput {
  mode: GenerateMode;
  primaryKeyword: string;
  /** Optional override — if omitted, AI detects from keyword/recipe */
  category?: GenerateCategory;
  /** Optional notes / extra context */
  notes?: string;
  /**
   * For keyword_recipe mode — paste a messy recipe blob
   * (title + ingredients, instructions optional). AI cleans and fills gaps.
   */
  recipePaste?: string;
  /** @deprecated Prefer recipePaste — kept for older clients */
  ingredientsText?: string;
  /** @deprecated Prefer recipePaste */
  instructionsText?: string;
  /** For paste mode — full ChatGPT draft */
  pastedDraft?: string;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  category: GenerateCategory;
  contentHtml: string;
  ingredients: string[];
  instructions: string[];
  seoTitle: string;
  seoDescription: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  calories?: string;
  cuisine?: string;
  course?: string;
  focusKeyword: string;
}
