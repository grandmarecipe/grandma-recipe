"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAdminAuth } from "./AdminProviders";
import { buildArticleImagePromptInput } from "@/lib/image-prompt-article";
import type {
  FeatureImagePromptResult,
  ImageAssetRecord,
  ImageAssetsBundle,
  ImagePromptBundle,
  ImagePromptSection,
  SectionImagePromptResult,
} from "@/lib/image-prompt-types";
import { SectionImageUploadBox } from "./SectionImageUploadBox";

type TabId = ImagePromptSection;

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "feature", label: "Feature image" },
  { id: "ingredients", label: "Ingredients" },
  { id: "how_to_make", label: "How to make" },
  { id: "how_to_serve", label: "How to serve" },
];

export type ArticleImagePromptSource = {
  title: string;
  excerpt: string;
  focusKeyword: string;
  ingredientsText: string;
  instructionsText: string;
  contentHtml: string;
};

type FeatureMeta = {
  alt: string;
  title: string;
  caption: string;
  description: string;
};

type FeatureFieldKey = "alt" | "title" | "caption" | "description";
type FeatureOptionChoice = 1 | 2;

export function ArticleImagePromptsPanel({
  articleId,
  slug,
  article,
  savedPrompts,
  savedAssets,
  onApplyFeature,
  onInsertImage,
  onSaved,
}: {
  articleId?: Id<"articles">;
  slug: string;
  article: ArticleImagePromptSource;
  savedPrompts?: ImagePromptBundle | null;
  savedAssets?: ImageAssetsBundle | null;
  onApplyFeature?: (meta: FeatureMeta) => void;
  onInsertImage?: (
    section: ImagePromptSection,
    asset: ImageAssetRecord,
  ) => void | Promise<void>;
  onSaved?: () => void;
}) {
  const { token } = useAdminAuth();
  const saveImagePrompts = useMutation(api.articles.saveImagePrompts);
  const derived = buildArticleImagePromptInput(article);
  const [activeTab, setActiveTab] = useState<TabId>("feature");
  const [bundle, setBundle] = useState<ImagePromptBundle | null>(
    savedPrompts ?? null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (savedPrompts) {
      setBundle(savedPrompts);
    }
  }, [savedPrompts]);

  async function generate(
    section: ImagePromptSection | "all",
    previousBundle: ImagePromptBundle | null = bundle,
  ) {
    if (!token) return;
    if (!derived.focusKeyword) {
      setError("Add a title or primary keyword first.");
      return;
    }

    setBusy(true);
    setError(null);
    setStatus(
      section === "all"
        ? "Generating all image prompts from this article…"
        : `Generating ${TABS.find((tab) => tab.id === section)?.label.toLowerCase()} prompt…`,
    );

    try {
      const response = await fetch("/api/admin/generate-image-prompts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          section,
          focusKeyword: derived.focusKeyword,
          recipeDetails: derived.recipeDetails,
          ingredientsContent: derived.ingredientsContent,
          howToMakeContent: derived.howToMakeContent,
          howToServeContent: derived.howToServeContent,
          previousBundle:
            section === "all" ? undefined : previousBundle ?? undefined,
        }),
      });

      const payload = (await response.json()) as {
        bundle?: ImagePromptBundle;
        error?: string;
      };

      if (!response.ok || !payload.bundle) {
        throw new Error(payload.error || "Generation failed.");
      }

      const mergedBundle: ImagePromptBundle = {
        focusKeyword: payload.bundle.focusKeyword,
        feature: payload.bundle.feature ?? previousBundle?.feature,
        ingredients: payload.bundle.ingredients ?? previousBundle?.ingredients,
        how_to_make: payload.bundle.how_to_make ?? previousBundle?.how_to_make,
        how_to_serve: payload.bundle.how_to_serve ?? previousBundle?.how_to_serve,
      };

      setBundle(mergedBundle);
      if (section !== "all") {
        setActiveTab(section);
      }

      if (articleId && token) {
        await saveImagePrompts({
          token,
          id: articleId,
          imagePrompts: mergedBundle,
        });
        onSaved?.();
        setStatus("Generated and saved to this article.");
      } else {
        setStatus("Generated. Save the article first to persist prompts.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }

  const activeResult =
    activeTab === "feature" ? bundle?.feature : bundle?.[activeTab];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#8b1a1a]">Image prompts</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#6b5b4f]">
          Prompts are built from this article&apos;s keyword, excerpt, ingredients,
          instructions, and &quot;how to serve&quot; section in the body.
        </p>
      </div>

      {savedPrompts ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Saved prompts loaded for this article. Generate again to replace a section.
        </p>
      ) : null}

      <section className="rounded-2xl border border-[#e5d8c8] bg-[#fffdf9] p-4 text-sm">
        <h3 className="font-semibold text-[#8b1a1a]">Source for this article</h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <SourceItem label="Focus keyword" value={derived.focusKeyword} />
          <SourceItem
            label="Recipe details"
            value={derived.recipeDetails || "—"}
          />
          <SourceItem
            label="Ingredients"
            value={derived.ingredientsContent || "—"}
          />
          <SourceItem
            label="How to make"
            value={derived.howToMakeContent || "—"}
          />
          <SourceItem
            label="How to serve"
            value={derived.howToServeContent || "—"}
            className="sm:col-span-2"
          />
        </dl>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void generate("all", null)}
          className="rounded-full bg-[#5a822b] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Generating…" : "Generate all prompts"}
        </button>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            disabled={busy}
            onClick={() => void generate(tab.id, bundle)}
            className="rounded-full border border-[#d4a574] px-4 py-2 text-sm font-semibold text-[#b8860b] disabled:opacity-60"
          >
            {tab.label} only
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="rounded-lg border border-[#e5d8c8] bg-white px-4 py-3 text-sm text-[#6b5b4f]">
          {status}
        </p>
      ) : null}

      {bundle ? (
        <section className="space-y-4 rounded-2xl border border-[#e5d8c8] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif text-xl text-[#8b1a1a]">Results</h3>
            <CopyButton label="Copy all JSON" text={JSON.stringify(bundle, null, 2)} />
          </div>

          <div className="flex flex-wrap gap-2 border-b border-[#e5d8c8] pb-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  activeTab === tab.id
                    ? "bg-[#8b1a1a] text-white"
                    : "bg-[#f7f1e8] text-[#6b5b4f]"
                }`}
              >
                {tab.label}
                {bundle[tab.id] ? " ✓" : ""}
              </button>
            ))}
          </div>

          {activeResult ? (
            activeTab === "feature" ? (
              <FeatureResultView
                result={activeResult as FeatureImagePromptResult}
                onApplyFeature={onApplyFeature}
                section="feature"
                slug={slug}
                focusKeyword={derived.focusKeyword}
                articleId={articleId}
                savedAsset={savedAssets?.feature}
                onInsert={
                  onInsertImage
                    ? (asset) => onInsertImage("feature", asset)
                    : undefined
                }
              />
            ) : (
              <SectionResultView
                result={activeResult as SectionImagePromptResult}
                section={activeTab}
                slug={slug}
                focusKeyword={derived.focusKeyword}
                articleId={articleId}
                savedAsset={savedAssets?.[activeTab]}
                onInsert={
                  onInsertImage
                    ? (asset) => onInsertImage(activeTab, asset)
                    : undefined
                }
              />
            )
          ) : (
            <p className="text-sm text-[#6b5b4f]">
              No result for this section yet.
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}

function SourceItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#6b5b4f]">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-[#2c241b]">{value}</dd>
    </div>
  );
}

function FeatureResultView({
  result,
  onApplyFeature,
  section,
  slug,
  focusKeyword,
  articleId,
  savedAsset,
  onInsert,
}: {
  result: FeatureImagePromptResult;
  onApplyFeature?: (meta: FeatureMeta) => void;
  section: "feature";
  slug: string;
  focusKeyword: string;
  articleId?: Id<"articles">;
  savedAsset?: ImageAssetRecord | null;
  onInsert?: (asset: ImageAssetRecord) => void | Promise<void>;
}) {
  const [choices, setChoices] = useState<
    Record<FeatureFieldKey, FeatureOptionChoice>
  >({
    alt: 1,
    title: 1,
    caption: 1,
    description: 1,
  });

  function pick(field: FeatureFieldKey, option: FeatureOptionChoice) {
    setChoices((current) => ({ ...current, [field]: option }));
  }

  function valueFor(field: FeatureFieldKey, option: FeatureOptionChoice) {
    if (option === 1) {
      return {
        alt: result.alt_text_1,
        title: result.title_1,
        caption: result.caption_1,
        description: result.description_1,
      }[field];
    }
    return {
      alt: result.alt_text_2,
      title: result.title_2,
      caption: result.caption_2,
      description: result.description_2,
    }[field];
  }

  function applySelected() {
    if (!onApplyFeature) return;
    onApplyFeature({
      alt: valueFor("alt", choices.alt),
      title: valueFor("title", choices.title),
      caption: valueFor("caption", choices.caption),
      description: valueFor("description", choices.description),
    });
  }

  const pickerFields: Array<{ key: FeatureFieldKey; label: string }> = [
    { key: "alt", label: "Alt text" },
    { key: "title", label: "Title" },
    { key: "caption", label: "Caption" },
    { key: "description", label: "Description" },
  ];

  return (
    <div className="space-y-4">
      <FieldBlock label="Image prompt" value={result.prompt} mono />
      <div className="grid gap-4 lg:grid-cols-2">
        <FeatureMetadataColumn
          title="Option 1"
          option={1}
          fields={pickerFields}
          valueFor={valueFor}
          choices={choices}
          onPick={pick}
          selectable={Boolean(onApplyFeature)}
        />
        <FeatureMetadataColumn
          title="Option 2"
          option={2}
          fields={pickerFields}
          valueFor={valueFor}
          choices={choices}
          onPick={pick}
          selectable={Boolean(onApplyFeature)}
        />
      </div>
      <CopyButton label="Copy feature JSON" text={JSON.stringify(result, null, 2)} />

      {onApplyFeature ? (
        <button
          type="button"
          onClick={applySelected}
          className="rounded-full bg-[#8b1a1a] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Apply selected to featured image
        </button>
      ) : null}

      <SectionImageUploadBox
        section={section}
        slug={slug}
        focusKeyword={focusKeyword}
        articleId={articleId}
        metadata={{
          alt: valueFor("alt", choices.alt),
          title: valueFor("title", choices.title),
          caption: valueFor("caption", choices.caption),
          description: valueFor("description", choices.description),
        }}
        savedAsset={savedAsset}
        onInsert={onInsert}
      />
    </div>
  );
}

function SectionResultView({
  result,
  section,
  slug,
  focusKeyword,
  articleId,
  savedAsset,
  onInsert,
}: {
  result: SectionImagePromptResult;
  section: Exclude<ImagePromptSection, "feature">;
  slug: string;
  focusKeyword: string;
  articleId?: Id<"articles">;
  savedAsset?: ImageAssetRecord | null;
  onInsert?: (asset: ImageAssetRecord) => void | Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <FieldBlock label="Image prompt" value={result.prompt} mono />
      <MetadataGroup
        title="Metadata"
        fields={[
          ["Alt text", result.alt_text],
          ["Title", result.title],
          ["Caption", result.caption],
          ["Description", result.description],
        ]}
      />
      <CopyButton label="Copy section JSON" text={JSON.stringify(result, null, 2)} />

      <SectionImageUploadBox
        section={section}
        slug={slug}
        focusKeyword={focusKeyword}
        articleId={articleId}
        metadata={{
          alt: result.alt_text,
          title: result.title,
          caption: result.caption,
          description: result.description,
        }}
        savedAsset={savedAsset}
        onInsert={onInsert}
      />
    </div>
  );
}

function FeatureMetadataColumn({
  title,
  option,
  fields,
  valueFor,
  choices,
  onPick,
  selectable,
}: {
  title: string;
  option: FeatureOptionChoice;
  fields: Array<{ key: FeatureFieldKey; label: string }>;
  valueFor: (field: FeatureFieldKey, option: FeatureOptionChoice) => string;
  choices: Record<FeatureFieldKey, FeatureOptionChoice>;
  onPick: (field: FeatureFieldKey, option: FeatureOptionChoice) => void;
  selectable: boolean;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-[#e5d8c8] bg-[#fffdf9] p-4">
      <h4 className="font-semibold text-[#8b1a1a]">{title}</h4>
      {fields.map(({ key, label }) => (
        <FieldBlock
          key={key}
          label={label}
          value={valueFor(key, option)}
          radioName={selectable ? `feature-${key}` : undefined}
          selected={choices[key] === option}
          onSelect={selectable ? () => onPick(key, option) : undefined}
        />
      ))}
    </div>
  );
}

function MetadataGroup({
  title,
  fields,
}: {
  title: string;
  fields: Array<[string, string]>;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-[#e5d8c8] bg-[#fffdf9] p-4">
      <h4 className="font-semibold text-[#8b1a1a]">{title}</h4>
      {fields.map(([label, value]) => (
        <FieldBlock key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function FieldBlock({
  label,
  value,
  mono = false,
  radioName,
  selected = false,
  onSelect,
}: {
  label: string;
  value: string;
  mono?: boolean;
  radioName?: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        {radioName && onSelect ? (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={radioName}
              checked={selected}
              onChange={onSelect}
              className="shrink-0"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#6b5b4f]">
              {label}
            </span>
          </label>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wide text-[#6b5b4f]">
            {label}
          </span>
        )}
        <CopyButton label="Copy" text={value} small />
      </div>
      <p
        className={`rounded-lg border border-[#e5d8c8] bg-[#fffdf9] px-3 py-2 text-sm text-[#2c241b] ${
          mono ? "whitespace-pre-wrap font-mono" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function CopyButton({
  label,
  text,
  small = false,
}: {
  label: string;
  text: string;
  small?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={`rounded-full border border-[#d4a574] font-semibold text-[#b8860b] ${
        small ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
