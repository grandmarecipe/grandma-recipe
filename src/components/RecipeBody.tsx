"use client";

import Link from "next/link";
import {
  buildRecipeTableOfContents,
  ensureHeadingIds,
  normalizeRecipeToc,
  splitHtmlAfterParagraphs,
  stripEquipmentBlockFromHtml,
  stripFaqBlockFromHtml,
  stripNutritionBlockFromHtml,
  stripWprmMarkup,
} from "@/lib/html";
import { extractFaqsFromHtml } from "@/lib/schema-data";
import type { Recipe } from "@/lib/types";
import {
  extractEquipmentFromHtml,
  extractNotesFromHtml,
} from "@/lib/wprm";
import type { RecipeRatingAggregate } from "@/lib/ratings";
import { ADSENSE_SLOTS } from "@/lib/adsense";
import { AdUnit } from "./AdUnit";
import { RecipeAuthorCard } from "./RecipeAuthorCard";
import { RecipeCardDetails } from "./RecipeCardDetails";
import { RecipeComments } from "./RecipeComments";
import { RecipeFaqs } from "./RecipeFaqs";
import { RecipeJumpBar } from "./RecipeJumpBar";
import { RecipeKitchenNotes } from "./RecipeKitchenNotes";
import { RecipeRating } from "./RecipeRating";
import { RecipeTableOfContents } from "./RecipeTableOfContents";

interface RecipeBodyProps {
  recipe: Recipe;
  rating?: RecipeRatingAggregate;
  comments?: Array<{
    id: string;
    name: string;
    body: string;
    createdAt: string;
  }>;
  /** Admin preview: hide ads, comments, and interactive widgets. */
  preview?: boolean;
}

export function RecipeBody({
  recipe,
  rating,
  comments = [],
  preview = false,
}: RecipeBodyProps) {
  const faqs = extractFaqsFromHtml(recipe.contentHtml);
  const tableOfContents = normalizeRecipeToc(
    buildRecipeTableOfContents(recipe.contentHtml),
  );
  const articleHtml = ensureHeadingIds(
    stripFaqBlockFromHtml(
      stripNutritionBlockFromHtml(
        stripEquipmentBlockFromHtml(stripWprmMarkup(recipe.contentHtml)),
      ),
    ),
  );
  const [storyStart, storyRest] = splitHtmlAfterParagraphs(articleHtml, 2);
  const [storyMid, storyEnd] = splitHtmlAfterParagraphs(storyRest, 4);
  const equipment = extractEquipmentFromHtml(recipe.contentHtml);
  const notes = extractNotesFromHtml(recipe.contentHtml, {
    calories: recipe.calories,
  });
  const hasNutrition = Boolean(
    recipe.calories || (notes?.nutrition && notes.nutrition.length > 0),
  );

  return (
    <>
      {!preview ? <RecipeJumpBar slug={recipe.slug} /> : null}

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_300px] no-print">
        <article className="min-w-0">
          <RecipeTableOfContents items={tableOfContents} />

          <section
            id="recipe"
            className={`scroll-mt-36 rounded-3xl border border-border bg-white p-6 sm:p-8${tableOfContents.length > 0 ? " mt-8" : ""}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-3xl text-[#8b1a1a]">Recipe card</h2>
              {!preview ? (
                <Link
                  href={`/print/${recipe.slug}/`}
                  className="rounded-full border border-border bg-[#fffdf9] px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:text-accent-dark"
                >
                  Print / PDF
                </Link>
              ) : null}
            </div>
            <p className="mt-2 font-serif text-2xl text-accent-dark">
              {recipe.title}
            </p>

            {!preview ? (
              <div className="mt-4">
                <RecipeRating
                  slug={recipe.slug}
                  initialRatingValue={rating?.ratingValue}
                  initialRatingCount={rating?.ratingCount}
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#6b5b4f]">
                Ratings appear here on the live site.
              </p>
            )}

            <RecipeCardDetails
              recipe={recipe}
              hasEquipment={equipment.length > 0}
              hasNotes={Boolean(notes)}
            />

            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div>
                <h3
                  id="ingredients"
                  className="scroll-mt-36 font-serif text-xl"
                >
                  Ingredients
                </h3>
                {recipe.ingredients.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {recipe.ingredients.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-border bg-[#fffdf9] px-4 py-3 text-lg leading-relaxed text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-muted">No ingredients listed.</p>
                )}
              </div>

              <div>
                <h3
                  id="equipment"
                  className="scroll-mt-36 font-serif text-xl"
                >
                  Equipment
                </h3>
                {equipment.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {equipment.map((item) => (
                      <li
                        key={`${item.name}-${item.notes || ""}`}
                        className="rounded-xl border border-border bg-[#fffdf9] px-4 py-3 text-lg leading-relaxed text-muted"
                      >
                        <span className="font-medium text-foreground">
                          {item.name}
                        </span>
                        {item.notes ? (
                          <span className="text-muted"> — {item.notes}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-muted">No equipment listed.</p>
                )}
              </div>
            </div>

            <h3
              id="instructions"
              className="mt-10 scroll-mt-36 font-serif text-xl"
            >
              Method
            </h3>
            {recipe.instructions.length > 0 ? (
              <ol className="mt-4 space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li
                    key={`${index}-${step.slice(0, 20)}`}
                    id={`step-${index + 1}`}
                    className="flex scroll-mt-36 gap-4 rounded-2xl border border-border bg-[#fffdf9] p-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-semibold !text-white">
                      {index + 1}
                    </span>
                    <p className="text-lg leading-relaxed text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-muted">No instructions listed.</p>
            )}

            <h3 id="notes" className="mt-10 scroll-mt-36 font-serif text-xl">
              Notes
            </h3>
            {notes?.nutrition.length ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-left text-base">
                  <thead className="bg-[#f4eee4]">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground">
                        Nutrient
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground">
                        Amount per Serving
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.nutrition.map((row) => (
                      <tr
                        key={row.nutrient}
                        className="border-t border-border bg-[#fffdf9]"
                      >
                        <td className="px-4 py-3 text-muted">{row.nutrient}</td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {row.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : notes?.text ? (
              <div
                className="prose-recipe mt-4 rounded-2xl border border-border bg-[#fffdf9] px-4 py-3 text-muted"
                dangerouslySetInnerHTML={{
                  __html: notes.html || `<p>${notes.text}</p>`,
                }}
              />
            ) : (
              <p className="mt-4 text-muted">No notes listed.</p>
            )}
          </section>

          <section
            id="story"
            className="prose-recipe mt-14 max-w-none scroll-mt-36"
          >
            {storyStart ? (
              <div dangerouslySetInnerHTML={{ __html: storyStart }} />
            ) : null}
            {!preview ? (
              <AdUnit
                slot={ADSENSE_SLOTS.inArticle02}
                format="fluid"
                layout="in-article"
                className="my-8 not-prose"
              />
            ) : null}
            {storyMid ? (
              <div dangerouslySetInnerHTML={{ __html: storyMid }} />
            ) : null}
            {!preview ? (
              <AdUnit
                slot={ADSENSE_SLOTS.inArticle01}
                format="fluid"
                layout="in-article"
                className="my-8 not-prose"
              />
            ) : null}
            {storyEnd ? (
              <div dangerouslySetInnerHTML={{ __html: storyEnd }} />
            ) : null}
          </section>

          <RecipeFaqs faqs={faqs} />
          <RecipeKitchenNotes hasNutrition={hasNutrition} />
          <RecipeAuthorCard />

          {!preview ? (
            <AdUnit
              slot={ADSENSE_SLOTS.multiplexBottom}
              format="autorelaxed"
              className="my-10"
            />
          ) : null}

          {!preview ? (
            <RecipeComments slug={recipe.slug} initialComments={comments} />
          ) : null}
        </article>

        {!preview ? (
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <AdUnit slot={ADSENSE_SLOTS.displaySidebar} format="auto" />
            </div>
          </aside>
        ) : null}
      </div>
    </>
  );
}
