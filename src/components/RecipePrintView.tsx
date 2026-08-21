"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getRecipeCardMeta,
  getRecipeMetaPills,
  getRecipeTimingRows,
} from "@/lib/recipe-card-meta";
import type { Recipe } from "@/lib/types";
import { SITE } from "@/lib/types";
import {
  extractEquipmentFromHtml,
  extractNotesFromHtml,
} from "@/lib/wprm";

type TextSize = "smaller" | "normal" | "larger";

interface RecipePrintViewProps {
  recipe: Recipe;
}

const ICONS = {
  ingredients: (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M16 34c0-6 4-10 8-10s8 4 8 10M18 18c1.5-4 4-6 6-6s4.5 2 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="22" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  equipment: (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M18 14v16M30 12v18M24 10v20M14 34h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  method: (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden>
      <circle cx="24" cy="26" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 12v4M20 26h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  notes: (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M14 12h16l4 4v20H14V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18 20h10M18 26h10M18 32h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export function RecipePrintView({ recipe }: RecipePrintViewProps) {
  const [showImage, setShowImage] = useState(true);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [textSize, setTextSize] = useState<TextSize>("normal");

  const cardMeta = useMemo(() => getRecipeCardMeta(recipe), [recipe]);
  const timing = useMemo(() => getRecipeTimingRows(cardMeta), [cardMeta]);
  const pills = useMemo(() => getRecipeMetaPills(cardMeta), [cardMeta]);
  const equipment = useMemo(
    () => extractEquipmentFromHtml(recipe.contentHtml),
    [recipe.contentHtml],
  );
  const notes = useMemo(
    () => extractNotesFromHtml(recipe.contentHtml),
    [recipe.contentHtml],
  );

  const sizeClass =
    textSize === "smaller"
      ? "text-[0.92rem]"
      : textSize === "larger"
        ? "text-[1.08rem]"
        : "text-[1rem]";

  const summary =
    recipe.seoDescription ||
    recipe.excerpt?.replace(/\s*\[&hellip;\]\s*$/, "").trim() ||
    "";

  return (
    <div className={`recipe-print-page min-h-screen bg-[#f7f3eb] ${sizeClass}`}>
      <div className="print-toolbar no-print border-b border-[#e4d9c8] bg-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${recipe.slug}/`}
              className="rounded-full border border-[#d7c8b3] bg-white px-5 py-2 text-sm font-semibold text-[#3d2b1f] transition hover:border-[#5a822b] hover:text-[#5a822b]"
            >
              Go Back
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-[#5a822b] px-5 py-2 text-sm font-semibold !text-white transition hover:bg-[#4a6c23]"
            >
              Print
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#3d2b1f]">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showImage}
                onChange={(event) => setShowImage(event.target.checked)}
                className="accent-[#5a822b]"
              />
              Recipe Image
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showEquipment}
                onChange={(event) => setShowEquipment(event.target.checked)}
                disabled={equipment.length === 0}
                className="accent-[#5a822b]"
              />
              Equipment
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={(event) => setShowNotes(event.target.checked)}
                disabled={!notes}
                className="accent-[#5a822b]"
              />
              Notes
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {(
              [
                ["smaller", "Smaller"],
                ["normal", "Normal"],
                ["larger", "Larger"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTextSize(value)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  textSize === value
                    ? "bg-[#5a822b] !text-white"
                    : "border border-[#d7c8b3] bg-white text-[#3d2b1f] hover:border-[#5a822b]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <article className="recipe-print-sheet mx-auto max-w-4xl bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#eadfce] pb-4">
          <div className="flex items-center gap-3">
            <img
              src={SITE.logo}
              alt={SITE.name}
              width={64}
              height={64}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p className="font-serif text-xl text-[#8b1a1a]">{SITE.name}</p>
              <p className="text-xs text-[#6b5b4f]">{SITE.tagline}</p>
            </div>
          </div>
          <p className="hidden text-xs text-[#5a822b] sm:block">
            {SITE.url.replace(/^https?:\/\//, "")}
          </p>
        </div>

        <header className="recipe-print-hero grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-start">
          {showImage && recipe.featuredImage ? (
            <div className="recipe-print-image overflow-hidden rounded-2xl border border-[#eadfce]">
              <img
                src={recipe.featuredImage}
                alt={recipe.featuredImageAlt || recipe.title}
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className={
              showImage && recipe.featuredImage ? "" : "sm:col-span-2"
            }
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[#5a822b] uppercase">
              {recipe.category}
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-[#1f1a14] sm:text-5xl">
              {recipe.title}
            </h1>
            {summary ? (
              <p className="mt-3 max-w-2xl text-[0.95em] leading-relaxed text-[#4d4036]">
                {summary}
              </p>
            ) : null}
          </div>
        </header>

        {timing.length > 0 ? (
          <dl className="mt-8 grid gap-3 border-y border-[#c9d4b8] py-4 text-center sm:grid-cols-4">
            {timing.map((item) => (
              <div key={item.label} className="px-2">
                <dt className="text-xs tracking-wide text-[#6b5b4f] uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-[#1f1a14]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {pills.length > 0 ? (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {pills.map((item) => (
              <span
                key={item.label}
                className="rounded-full bg-[#5a822b] px-3.5 py-1.5 text-sm font-semibold !text-white"
              >
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-b border-[#eadfce] pb-5 text-[#5a822b]">
          {[
            { id: "ingredients", label: "Ingredients", icon: ICONS.ingredients },
            ...(showEquipment && equipment.length > 0
              ? [{ id: "equipment", label: "Equipment", icon: ICONS.equipment }]
              : []),
            { id: "method", label: "Method", icon: ICONS.method },
            ...(showNotes && notes
              ? [{ id: "notes", label: "Notes", icon: ICONS.notes }]
              : []),
          ].map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-1">
              {item.icon}
              <span className="text-xs font-semibold">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="recipe-print-body mt-6 grid gap-8 rounded-2xl bg-[#f7f3eb] p-4 sm:grid-cols-2 sm:p-6">
          <div className="recipe-print-col space-y-6">
            <section id="ingredients">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-[#1f1a14]">
                {ICONS.ingredients}
                Ingredients
              </h2>
              <ul className="mt-3 overflow-hidden rounded-xl border border-[#eadfce] bg-white">
                {recipe.ingredients.map((item) => (
                  <li
                    key={item}
                    className="border-b border-[#eadfce] px-4 py-2.5 text-[0.95em] leading-relaxed text-[#3d2b1f] last:border-b-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {showEquipment && equipment.length > 0 ? (
              <section id="equipment">
                <h2 className="flex items-center gap-2 font-serif text-2xl text-[#1f1a14]">
                  {ICONS.equipment}
                  Equipment
                </h2>
                <ul className="mt-3 overflow-hidden rounded-xl border border-[#eadfce] bg-white">
                  {equipment.map((item) => (
                    <li
                      key={`${item.name}-${item.notes || ""}`}
                      className="border-b border-[#eadfce] px-4 py-2.5 text-[0.95em] leading-relaxed text-[#3d2b1f] last:border-b-0"
                    >
                      <span className="font-medium">{item.name}</span>
                      {item.notes ? (
                        <span className="text-[#6b5b4f]"> — {item.notes}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <div className="recipe-print-col space-y-6">
            <section id="method">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-[#1f1a14]">
                {ICONS.method}
                Method
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#5a822b]">
                Instructions
              </p>
              <ol className="mt-3 space-y-3">
                {recipe.instructions.map((step, index) => (
                  <li
                    key={`${index}-${step.slice(0, 24)}`}
                    className="text-[0.95em] leading-relaxed text-[#3d2b1f]"
                  >
                    <span className="font-semibold text-[#1f1a14]">
                      Step {index + 1}:
                    </span>{" "}
                    {step.replace(/^Step\s*\d+\s*:\s*/i, "")}
                  </li>
                ))}
              </ol>
            </section>

            {showNotes && notes ? (
              <section id="notes">
                <h2 className="flex items-center gap-2 font-serif text-2xl text-[#1f1a14]">
                  {ICONS.notes}
                  Notes
                </h2>
                {notes.nutrition.length > 0 ? (
                  <>
                    <p className="mt-1 text-sm font-semibold text-[#5a822b]">
                      Nutrient Amount per Serving
                    </p>
                    <ul className="mt-3 overflow-hidden rounded-xl border border-[#eadfce] bg-white">
                      {notes.nutrition.map((row) => (
                        <li
                          key={row.nutrient}
                          className="flex justify-between gap-4 border-b border-[#eadfce] px-4 py-2.5 text-[0.95em] last:border-b-0"
                        >
                          <span className="text-[#6b5b4f]">{row.nutrient}</span>
                          <span className="font-semibold text-[#1f1a14]">
                            {row.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-3 text-[0.95em] leading-relaxed text-[#3d2b1f]">
                    {notes.text}
                  </p>
                )}
              </section>
            ) : null}
          </div>
        </div>

        <footer className="mt-8 border-t border-[#eadfce] pt-4 text-center text-xs text-[#6b5b4f]">
          <p>
            Printed from {SITE.name} · {SITE.url}/{recipe.slug}/
          </p>
          <p className="mt-1">Made with love in Grandma Millie&apos;s kitchen</p>
        </footer>
      </article>
    </div>
  );
}
