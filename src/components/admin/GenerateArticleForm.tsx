"use client";

import { FormEvent, useDeferredValue, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useAdminAuth } from "./AdminProviders";
import type {
  GenerateMode,
  GeneratedArticle,
} from "@/lib/article-generate-types";

export function GenerateArticleForm() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const createArticle = useMutation(api.articles.create);

  const [mode, setMode] = useState<GenerateMode>("keyword");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [notes, setNotes] = useState("");
  const [recipePaste, setRecipePaste] = useState("");
  const [pastedDraft, setPastedDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const deferredKeyword = useDeferredValue(primaryKeyword.trim());
  const existingKeyword = useQuery(
    api.articles.findByFocusKeyword,
    token && deferredKeyword.length >= 2
      ? { token, keyword: deferredKeyword }
      : "skip",
  );
  const keywordAlreadyUsed = Boolean(existingKeyword);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    if (keywordAlreadyUsed && existingKeyword) {
      setError(
        `Primary keyword already used by “${existingKeyword.title}”. Pick a different keyword.`,
      );
      return;
    }

    setBusy(true);
    setError(null);
    setStatus("Generating recipe data and article with OpenAI…");

    try {
      const response = await fetch("/api/admin/generate-article/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          mode,
          primaryKeyword,
          notes,
          recipePaste,
          pastedDraft,
        }),
      });

      const payload = (await response.json()) as {
        article?: GeneratedArticle;
        error?: string;
      };

      if (!response.ok || !payload.article) {
        throw new Error(payload.error || "Generation failed.");
      }

      setStatus("Saving draft in CMS…");
      const article = payload.article;
      const created = await createArticle({
        token,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        categories: [article.category],
        contentHtml: article.contentHtml,
        ingredients: article.ingredients,
        instructions: article.instructions,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        focusKeyword: article.focusKeyword,
        prepTime: article.prepTime,
        cookTime: article.cookTime,
        totalTime: article.totalTime,
        servings: article.servings,
        calories: article.calories,
        cuisine: article.cuisine,
        course: article.course,
        status: "draft",
      });

      setStatus("Draft ready — opening editor…");
      router.push(`/admin/articles/${created.id}/`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#8b1a1a]">Generate article</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6b5b4f]">
          OpenAI fills title, SEO, story HTML, ingredients, instructions, and
          times. Add images manually in the editor after generation.
        </p>
      </div>

      <fieldset className="space-y-3 rounded-2xl border border-[#e5d8c8] bg-white p-4">
        <legend className="px-1 text-sm font-semibold">Input mode</legend>
        {(
          [
            ["keyword", "Primary keyword only"],
            ["keyword_recipe", "Keyword + paste recipe"],
            ["paste", "Paste a ChatGPT draft"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mode"
              checked={mode === value}
              onChange={() => setMode(value)}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-semibold">
            {mode === "paste"
              ? "Primary keyword (optional hint)"
              : "Primary keyword"}
          </span>
          <input
            className={`${inputClass} ${
              keywordAlreadyUsed
                ? "border-amber-500 focus:border-amber-600"
                : ""
            }`}
            value={primaryKeyword}
            onChange={(event) => setPrimaryKeyword(event.target.value)}
            placeholder="mini doughnut hot buttered cheerios"
            required={mode !== "paste"}
            aria-invalid={keywordAlreadyUsed}
          />
          {keywordAlreadyUsed && existingKeyword ? (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              This primary keyword is already used by{" "}
              <Link
                href={`/admin/articles/${existingKeyword._id}/`}
                className="font-semibold underline"
              >
                {existingKeyword.title}
              </Link>{" "}
              ({existingKeyword.status}
              {existingKeyword.focusKeyword
                ? ` · “${existingKeyword.focusKeyword}”`
                : ""}
              ). Choose a different keyword to avoid duplicates.
            </p>
          ) : deferredKeyword.length >= 2 &&
            existingKeyword === null &&
            deferredKeyword === primaryKeyword.trim() ? (
            <p className="mt-1.5 text-xs text-[#5a822b]">
              Keyword looks available.
            </p>
          ) : null}
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-semibold">Notes (optional)</span>
          <input
            className={inputClass}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="No nuts, weeknight-friendly, etc."
          />
          <span className="mt-1.5 block text-xs text-[#6b5b4f]">
            Category is detected automatically (breakfast, lunch, dinner,
            snacks, or dessert).
          </span>
        </label>
      </div>

      {mode === "keyword_recipe" ? (
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">
            Paste recipe (messy OK)
          </span>
          <textarea
            className={`${inputClass} min-h-[220px] font-mono`}
            value={recipePaste}
            onChange={(event) => setRecipePaste(event.target.value)}
            required
            placeholder={`🍫🥧 Chocolate Pie! Rich, creamy…

Ingredients
5 ounces chocolate pudding mix
3 cups cold milk
stabilized whipped cream
1 baked pie crust (9 inch)

(Instructions optional — AI will write them if missing)`}
          />
          <span className="mt-1.5 block text-xs text-[#6b5b4f]">
            Paste title + ingredients as you copied them. Missing steps are fine
            — the AI cleans the list and writes instructions.
          </span>
        </label>
      ) : null}

      {mode === "paste" ? (
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">Paste full draft</span>
          <textarea
            className={`${inputClass} min-h-[260px] font-mono`}
            value={pastedDraft}
            onChange={(event) => setPastedDraft(event.target.value)}
            required
            placeholder="Paste the full ChatGPT article here…"
          />
        </label>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="rounded-lg border border-[#e5d8c8] bg-[#fffdf9] px-4 py-3 text-sm text-[#6b5b4f]">
          {status}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || keywordAlreadyUsed}
        className="rounded-full bg-[#5a822b] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy
          ? "Generating…"
          : keywordAlreadyUsed
            ? "Keyword already used"
            : "Generate draft article"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#e5d8c8] bg-white px-3 py-2.5 text-sm text-[#2c241b] outline-none focus:border-[#d4a574]";
