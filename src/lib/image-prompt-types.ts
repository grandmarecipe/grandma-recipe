export type ImagePromptSection =
  | "feature"
  | "ingredients"
  | "how_to_make"
  | "how_to_serve";

export type FeatureImagePromptResult = {
  prompt: string;
  alt_text_1: string;
  title_1: string;
  caption_1: string;
  description_1: string;
  alt_text_2: string;
  title_2: string;
  caption_2: string;
  description_2: string;
};

export type SectionImagePromptResult = {
  prompt: string;
  alt_text: string;
  title: string;
  caption: string;
  description: string;
};

export type ImageAssetRecord = {
  publicPath: string;
  r2Key: string;
  alt: string;
  title: string;
  caption: string;
  description: string;
  uploadedAt: string;
  width?: number;
  height?: number;
};

export type ImageAssetsBundle = {
  feature?: ImageAssetRecord;
  ingredients?: ImageAssetRecord;
  how_to_make?: ImageAssetRecord;
  how_to_serve?: ImageAssetRecord;
};

export type ImagePromptBundle = {
  focusKeyword: string;
  feature?: FeatureImagePromptResult;
  ingredients?: SectionImagePromptResult;
  how_to_make?: SectionImagePromptResult;
  how_to_serve?: SectionImagePromptResult;
};

export type GenerateImagePromptsInput = {
  focusKeyword: string;
  recipeDetails?: string;
  ingredientsContent?: string;
  howToMakeContent?: string;
  howToServeContent?: string;
  section?: ImagePromptSection | "all";
};
