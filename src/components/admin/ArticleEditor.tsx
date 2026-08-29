"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAdminAuth } from "./AdminProviders";
import { RichTextEditor } from "./RichTextEditor";
import { ArticlePreview } from "./ArticlePreview";
import { ArticleImagePromptsPanel } from "./ArticleImagePromptsPanel";
import type { ImageAssetRecord, ImagePromptBundle, ImagePromptSection } from "@/lib/image-prompt-types";
import { insertRecipeImageIntoArticle, getRecipeSectionImageSrc } from "@/lib/article-image-insert";

const CATEGORIES = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "dessert",
] as const;

type Category = (typeof CATEGORIES)[number];

type ArticleFormState = {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  categories: Category[];
  contentHtml: string;
  ingredientsText: string;
  instructionsText: string;
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageCaption: string;
  featuredImageDescription: string;
  featuredImageStorageId?: Id<"_storage">;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  calories: string;
  cuisine: string;
  course: string;
  status: "draft" | "published";
  publishedAt: string;
};

const emptyForm = (): ArticleFormState => ({
  slug: "",
  title: "",
  excerpt: "",
  category: "dinner",
  categories: ["dinner"],
  contentHtml: "",
  ingredientsText: "",
  instructionsText: "",
  featuredImage: "",
  featuredImageAlt: "",
  featuredImageCaption: "",
  featuredImageDescription: "",
  seoTitle: "",
  seoDescription: "",
  focusKeyword: "",
  prepTime: "",
  cookTime: "",
  totalTime: "",
  servings: "",
  calories: "",
  cuisine: "",
  course: "",
  status: "draft",
  publishedAt: new Date().toISOString().slice(0, 10),
});

function linesToList(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

type Props = {
  articleId?: Id<"articles">;
};

export function ArticleEditor({ articleId }: Props) {
  const { token } = useAdminAuth();
  const router = useRouter();
  const existing = useQuery(
    api.articles.get,
    token && articleId ? { token, id: articleId } : "skip",
  );
  const createArticle = useMutation(api.articles.create);
  const updateArticle = useMutation(api.articles.update);
  const removeArticle = useMutation(api.articles.remove);
  const generateUploadUrl = useMutation(api.articles.generateUploadUrl);
  const resolveStorageUrl = useMutation(api.articles.resolveStorageUrl);

  const [form, setForm] = useState<ArticleFormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(!articleId);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<"edit" | "image-prompts">("edit");
  const [loadedArticleId, setLoadedArticleId] = useState<Id<"articles"> | null>(
    null,
  );

  useEffect(() => {
    if (!articleId) {
      setForm(emptyForm());
      setReady(true);
      setLoadedArticleId(null);
      return;
    }
    if (!existing) return;
    if (loadedArticleId === articleId) return;

    setForm({
      slug: existing.slug,
      title: existing.title,
      excerpt: existing.excerpt,
      category: existing.category,
      categories: existing.categories,
      contentHtml: existing.contentHtml,
      ingredientsText: existing.ingredients.join("\n"),
      instructionsText: existing.instructions.join("\n"),
      featuredImage: existing.featuredImage ?? "",
      featuredImageAlt: existing.featuredImageAlt ?? "",
      featuredImageCaption: existing.featuredImageCaption ?? "",
      featuredImageDescription: existing.featuredImageDescription ?? "",
      featuredImageStorageId: existing.featuredImageStorageId,
      seoTitle: existing.seoTitle ?? "",
      seoDescription: existing.seoDescription ?? "",
      focusKeyword: existing.focusKeyword ?? "",
      prepTime: existing.prepTime ?? "",
      cookTime: existing.cookTime ?? "",
      totalTime: existing.totalTime ?? "",
      servings: existing.servings ?? "",
      calories: existing.calories ?? "",
      cuisine: existing.cuisine ?? "",
      course: existing.course ?? "",
      status: existing.status,
      publishedAt: existing.publishedAt.slice(0, 10),
    });
    setReady(true);
    setLoadedArticleId(articleId);
  }, [articleId, existing, loadedArticleId]);

  if (articleId && existing === undefined) {
    return <p className="text-sm text-[#6b5b4f]">Loading article…</p>;
  }

  if (articleId && existing === null) {
    return <p className="text-sm text-red-700">Article not found.</p>;
  }

  if (!ready) {
    return <p className="text-sm text-[#6b5b4f]">Loading editor…</p>;
  }

  const current = form;

  function patch<K extends keyof ArticleFormState>(
    key: K,
    value: ArticleFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function syncSlugFromTitle() {
    if (articleId) return;
    if (current.slug.trim()) return;
    const slug = current.title
      .toLowerCase()
      .trim()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    patch("slug", slug);
  }

  async function uploadImageFile(file: File): Promise<string | null> {
    if (!token) return null;
    const uploadUrl = await generateUploadUrl({ token });
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!result.ok) throw new Error("Image upload failed.");
    const { storageId } = (await result.json()) as {
      storageId: Id<"_storage">;
    };
    const resolved = await resolveStorageUrl({ token, storageId });
    return resolved.url;
  }

  async function handleFeaturedUpload(file: File | null) {
    if (!file || !token) return;
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl({ token });
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!result.ok) throw new Error("Featured image upload failed.");
      const { storageId } = (await result.json()) as {
        storageId: Id<"_storage">;
      };
      const resolved = await resolveStorageUrl({ token, storageId });
      setForm((prev) => ({
        ...prev,
        featuredImage: resolved.url,
        featuredImageStorageId: resolved.storageId,
        featuredImageAlt:
          prev.featuredImageAlt ||
          file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  function buildSavePayload(
    state: ArticleFormState,
    status?: "draft" | "published",
  ) {
    return {
      token: token!,
      slug: state.slug,
      title: state.title,
      excerpt: state.excerpt,
      category: state.category,
      categories:
        state.categories.length > 0 ? state.categories : [state.category],
      contentHtml: state.contentHtml,
      ingredients: linesToList(state.ingredientsText),
      instructions: linesToList(state.instructionsText),
      featuredImage: state.featuredImage || undefined,
      featuredImageAlt: state.featuredImageAlt || undefined,
      featuredImageCaption: state.featuredImageCaption || undefined,
      featuredImageDescription: state.featuredImageDescription || undefined,
      featuredImageStorageId: state.featuredImageStorageId,
      seoTitle: state.seoTitle || undefined,
      seoDescription: state.seoDescription || undefined,
      focusKeyword: state.focusKeyword || undefined,
      prepTime: state.prepTime || undefined,
      cookTime: state.cookTime || undefined,
      totalTime: state.totalTime || undefined,
      servings: state.servings || undefined,
      calories: state.calories || undefined,
      cuisine: state.cuisine || undefined,
      course: state.course || undefined,
      status: status ?? state.status,
      publishedAt: state.publishedAt
        ? new Date(state.publishedAt).toISOString()
        : undefined,
    };
  }

  async function persistForm(
    state: ArticleFormState,
    status?: "draft" | "published",
  ) {
    if (!token) throw new Error("Not signed in.");
    const payload = buildSavePayload(state, status);

    if (articleId) {
      const result = await updateArticle({ id: articleId, ...payload });
      return { id: articleId, slug: result.slug, status: payload.status };
    }

    const result = await createArticle(payload);
    router.replace(`/admin/articles/${result.id}/`);
    return { id: result.id, slug: result.slug, status: payload.status };
  }

  async function save(status?: "draft" | "published") {
    if (!token) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const result = await persistForm(form, status);
      setMessage(`Saved "${result.slug}" as ${result.status}.`);
      patch("status", result.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function insertImageIntoArticle(
    section: ImagePromptSection,
    asset: ImageAssetRecord,
  ) {
    if (!token) {
      setError("Sign in to insert images.");
      return;
    }
    if (!articleId) {
      setError("Save the article first, then insert images.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const previousSrc =
        section === "feature"
          ? form.featuredImage || undefined
          : getRecipeSectionImageSrc(form.contentHtml, section);

      let nextForm: ArticleFormState;

      if (section === "feature") {
        nextForm = {
          ...form,
          featuredImage: asset.publicPath,
          featuredImageAlt: asset.alt,
          featuredImageCaption: asset.caption,
          featuredImageDescription: asset.description,
          featuredImageStorageId: undefined,
          seoTitle: asset.title || form.seoTitle,
        };
      } else {
        nextForm = {
          ...form,
          contentHtml: insertRecipeImageIntoArticle({
            contentHtml: form.contentHtml,
            section,
            src: asset.publicPath,
            alt: asset.alt,
            caption: asset.caption,
            previousSrc,
            width: asset.width,
            height: asset.height,
          }),
        };
      }

      setForm(nextForm);
      const result = await persistForm(nextForm, form.status);
      setMessage(
        section === "feature"
          ? `Featured image saved on "${result.slug}".`
          : `${section.replace(/_/g, " ")} image inserted and saved on "${result.slug}".`,
      );
      setEditorTab("edit");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Insert failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token || !articleId) return;
    if (!window.confirm("Delete this CMS article? This cannot be undone.")) {
      return;
    }
    await removeArticle({ token, id: articleId });
    router.replace("/admin/");
  }

  const seoTitleLen = (current.seoTitle || current.title).length;
  const seoDescLen = (current.seoDescription || current.excerpt).length;
  const liveUrl =
    current.status === "published" && current.slug.trim()
      ? `/${current.slug}/`
      : undefined;

  return (
    <div className="space-y-8">
      {previewOpen ? (
        <ArticlePreview
          input={current}
          liveUrl={liveUrl}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[#8b1a1a]">
            {articleId ? "Edit article" : "New article"}
          </h1>
          <p className="mt-1 text-sm text-[#6b5b4f]">
            Title, story, ingredients, images, and SEO meta — all in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-full border border-[#8b1a1a] px-4 py-2 text-sm font-semibold text-[#8b1a1a]"
          >
            Preview
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("draft")}
            className="rounded-full border border-[#d4a574] px-4 py-2 text-sm font-semibold text-[#b8860b] disabled:opacity-60"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("published")}
            className="rounded-full bg-[#5a822b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Publish
          </button>
          {articleId ? (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-[#e5d8c8] pb-3">
        <button
          type="button"
          onClick={() => setEditorTab("edit")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            editorTab === "edit"
              ? "bg-[#8b1a1a] text-white"
              : "bg-white text-[#6b5b4f] ring-1 ring-[#e5d8c8]"
          }`}
        >
          Edit article
        </button>
        <button
          type="button"
          onClick={() => setEditorTab("image-prompts")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            editorTab === "image-prompts"
              ? "bg-[#8b1a1a] text-white"
              : "bg-white text-[#6b5b4f] ring-1 ring-[#e5d8c8]"
          }`}
        >
          Image prompts
        </button>
      </div>

      {editorTab === "image-prompts" ? (
        <ArticleImagePromptsPanel
          articleId={articleId}
          slug={current.slug}
          savedPrompts={
            existing?.imagePrompts as ImagePromptBundle | undefined
          }
          savedAssets={existing?.imageAssets ?? null}
          article={{
            title: current.title,
            excerpt: current.excerpt,
            focusKeyword: current.focusKeyword,
            ingredientsText: current.ingredientsText,
            instructionsText: current.instructionsText,
            contentHtml: current.contentHtml,
          }}
          onApplyFeature={(meta) => {
            setForm((prev) => ({
              ...prev,
              featuredImageAlt: meta.alt,
              featuredImageCaption: meta.caption,
              featuredImageDescription: meta.description,
              seoTitle: meta.title || prev.seoTitle,
            }));
            setMessage(
              "Applied selected feature metadata. Switch to Edit article to review.",
            );
            setEditorTab("edit");
          }}
          onInsertImage={(section, asset) => insertImageIntoArticle(section, asset)}
        />
      ) : (
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-5">
          <Field label="Title">
            <input
              className={inputClass}
              value={current.title}
              onChange={(event) => patch("title", event.target.value)}
              onBlur={syncSlugFromTitle}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL slug">
              <input
                className={inputClass}
                value={current.slug}
                onChange={(event) => patch("slug", event.target.value)}
              />
            </Field>
            <Field label="Primary category">
              <select
                className={inputClass}
                value={current.category}
                onChange={(event) => {
                  const category = event.target.value as Category;
                  patch("category", category);
                  patch("categories", [category]);
                }}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Excerpt (short summary)">
            <textarea
              className={`${inputClass} min-h-[90px]`}
              value={current.excerpt}
              onChange={(event) => patch("excerpt", event.target.value)}
            />
          </Field>

          <Field label="Article body">
            <RichTextEditor
              value={current.contentHtml}
              onChange={(html) => patch("contentHtml", html)}
              onUploadImage={async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                return await new Promise((resolve) => {
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) {
                      resolve(null);
                      return;
                    }
                    try {
                      resolve(await uploadImageFile(file));
                    } catch (err) {
                      setError(
                        err instanceof Error ? err.message : "Upload failed.",
                      );
                      resolve(null);
                    }
                  };
                  input.click();
                });
              }}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ingredients (one per line)">
              <textarea
                className={`${inputClass} min-h-[220px] font-mono text-sm`}
                value={current.ingredientsText}
                onChange={(event) =>
                  patch("ingredientsText", event.target.value)
                }
              />
            </Field>
            <Field label="Instructions (one step per line)">
              <textarea
                className={`${inputClass} min-h-[220px] font-mono text-sm`}
                value={current.instructionsText}
                onChange={(event) =>
                  patch("instructionsText", event.target.value)
                }
              />
            </Field>
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#e5d8c8] bg-[#fffdf9] p-4">
            <h2 className="font-serif text-xl text-[#8b1a1a]">Featured image</h2>
            <div className="mt-3 space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleFeaturedUpload(event.target.files?.[0] ?? null)
                }
              />
              <Field label="Image URL">
                <input
                  className={inputClass}
                  value={current.featuredImage}
                  onChange={(event) =>
                    patch("featuredImage", event.target.value)
                  }
                />
              </Field>
              {current.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.featuredImage}
                  alt={current.featuredImageAlt || current.title}
                  className="max-h-48 w-full rounded-xl object-cover"
                />
              ) : null}
              <Field label="Alt text">
                <input
                  className={inputClass}
                  value={current.featuredImageAlt}
                  onChange={(event) =>
                    patch("featuredImageAlt", event.target.value)
                  }
                />
              </Field>
              <Field label="Caption">
                <input
                  className={inputClass}
                  value={current.featuredImageCaption}
                  onChange={(event) =>
                    patch("featuredImageCaption", event.target.value)
                  }
                />
              </Field>
              <Field label="Image description">
                <textarea
                  className={`${inputClass} min-h-[70px]`}
                  value={current.featuredImageDescription}
                  onChange={(event) =>
                    patch("featuredImageDescription", event.target.value)
                  }
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5d8c8] bg-[#fffdf9] p-4">
            <h2 className="font-serif text-xl text-[#8b1a1a]">SEO</h2>
            <p className="mt-1 text-xs text-[#6b5b4f]">
              Aim ~50–60 chars title, ~150–160 description.
            </p>
            <div className="mt-3 space-y-3">
              <Field label="Primary keyword">
                <input
                  className={inputClass}
                  value={current.focusKeyword}
                  onChange={(event) =>
                    patch("focusKeyword", event.target.value)
                  }
                  placeholder="banana pancakes"
                />
              </Field>
              <Field label={`Meta title (${seoTitleLen})`}>
                <input
                  className={inputClass}
                  value={current.seoTitle}
                  onChange={(event) => patch("seoTitle", event.target.value)}
                />
              </Field>
              <Field label={`Meta description (${seoDescLen})`}>
                <textarea
                  className={`${inputClass} min-h-[90px]`}
                  value={current.seoDescription}
                  onChange={(event) =>
                    patch("seoDescription", event.target.value)
                  }
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5d8c8] bg-[#fffdf9] p-4">
            <h2 className="font-serif text-xl text-[#8b1a1a]">Recipe details</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["prepTime", "Prep time"],
                  ["cookTime", "Cook time"],
                  ["totalTime", "Total time"],
                  ["servings", "Servings"],
                  ["calories", "Calories"],
                  ["cuisine", "Cuisine"],
                  ["course", "Course"],
                  ["publishedAt", "Publish date"],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    className={inputClass}
                    type={key === "publishedAt" ? "date" : "text"}
                    value={current[key]}
                    onChange={(event) => patch(key, event.target.value)}
                  />
                </Field>
              ))}
            </div>
          </section>
        </aside>
      </section>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#3d2b1f]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#e5d8c8] bg-white px-3 py-2.5 text-sm text-[#2c241b] outline-none focus:border-[#d4a574]";
