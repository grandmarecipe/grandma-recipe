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
  category: GenerateCategory;
  /** Optional notes / extra context */
  notes?: string;
  /** For keyword_recipe mode */
  ingredientsText?: string;
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
