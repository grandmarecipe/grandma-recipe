"use client";

import { scrollToAnchor } from "@/lib/scroll-to-anchor";
import {
  getRecipeCardMeta,
  getRecipeMetaPills,
  getRecipeTimingRows,
} from "@/lib/recipe-card-meta";
import type { Recipe } from "@/lib/types";

interface RecipeCardDetailsProps {
  recipe: Recipe;
  hasEquipment?: boolean;
  hasNotes?: boolean;
}

const JUMP_LINKS = [
  {
    id: "ingredients",
    label: "Ingredients",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
        <path
          d="M16 34c0-6 4-10 8-10s8 4 8 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 18c1.5-4 4-6 6-6s4.5 2 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="22" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 38h24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "equipment",
    label: "Equipment",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
        <path
          d="M14 30c4-8 16-8 20 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 18v6M30 14v10M24 12v14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 34h24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "instructions",
    label: "Method",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
        <circle cx="24" cy="26" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 12v4M30 14l-2 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 26h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "notes",
    label: "Notes",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
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
  },
] as const;

export function RecipeCardDetails({
  recipe,
  hasEquipment = true,
  hasNotes = true,
}: RecipeCardDetailsProps) {
  const meta = getRecipeCardMeta(recipe);
  const timing = getRecipeTimingRows(meta);
  const pills = getRecipeMetaPills(meta);
  const jumpLinks = JUMP_LINKS.filter((link) => {
    if (link.id === "equipment") return hasEquipment;
    if (link.id === "notes") return hasNotes;
    if (link.id === "ingredients") return recipe.ingredients.length > 0;
    if (link.id === "instructions") return recipe.instructions.length > 0;
    return true;
  });

  if (timing.length === 0 && pills.length === 0 && jumpLinks.length === 0) {
    return null;
  }

  function handleJump(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    event.preventDefault();
    scrollToAnchor(id);
  }

  return (
    <div className="mt-8 space-y-6">
      {timing.length > 0 ? (
        <div className="border-y-2 border-[#5a822b]/70 py-4">
          <dl
            className={`grid gap-4 text-center ${
              timing.length === 1
                ? "grid-cols-1"
                : timing.length === 2
                  ? "grid-cols-2"
                  : timing.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            {timing.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {pills.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {pills.map((item) => (
            <div
              key={item.label}
              className="rounded-full bg-[#5a822b] px-4 py-2 text-sm font-semibold !text-white"
            >
              <span className="opacity-90">{item.label}: </span>
              {item.value}
            </div>
          ))}
        </div>
      ) : null}

      {jumpLinks.length > 0 ? (
        <div className="rounded-2xl bg-[#f4eee4] px-3 py-4 sm:px-5">
          <div
            className={`grid gap-3 ${
              jumpLinks.length === 1
                ? "grid-cols-1"
                : jumpLinks.length === 2
                  ? "grid-cols-2"
                  : jumpLinks.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            {jumpLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(event) => handleJump(event, link.id)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white px-3 py-4 text-[#5a822b] shadow-sm transition hover:shadow-md"
              >
                {link.icon}
                <span className="text-sm font-semibold">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
