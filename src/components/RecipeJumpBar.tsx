"use client";

import Link from "next/link";
import { scrollToAnchor } from "@/lib/scroll-to-anchor";

interface RecipeJumpBarProps {
  slug: string;
  /** Guides (no ingredients/method) skip recipe/print jumps. */
  isGuide?: boolean;
}

const pillClass =
  "shrink-0 rounded-full border border-border px-3 py-1.5 text-muted hover:text-accent sm:px-4 sm:py-2";

export function RecipeJumpBar({ slug, isGuide = false }: RecipeJumpBarProps) {
  function handleAnchorClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    event.preventDefault();
    scrollToAnchor(id);
  }

  return (
    <div
      data-recipe-jump-bar
      className="no-print sticky top-[4.5rem] z-40 border-b border-border bg-background/95 backdrop-blur sm:top-[5.5rem]"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2 px-3 py-2 text-xs sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
        {!isGuide ? (
          <a
            href="#recipe"
            className="shrink-0 rounded-full bg-accent px-3 py-1.5 font-semibold !text-white hover:bg-accent-dark hover:!text-white sm:px-4 sm:py-2"
            onClick={(event) => handleAnchorClick(event, "recipe")}
          >
            Jump to Recipe
          </a>
        ) : null}
        <a
          href="#story"
          className={
            isGuide
              ? "shrink-0 rounded-full bg-accent px-3 py-1.5 font-semibold !text-white hover:bg-accent-dark hover:!text-white sm:px-4 sm:py-2"
              : pillClass
          }
          onClick={(event) => handleAnchorClick(event, "story")}
        >
          {isGuide ? "Guide" : "Full recipe"}
        </a>
        <a
          href="#comments"
          className={pillClass}
          onClick={(event) => handleAnchorClick(event, "comments")}
        >
          Comments
        </a>
        {!isGuide ? (
          <Link href={`/print/${slug}/`} className={pillClass}>
            Print / PDF
          </Link>
        ) : null}
      </div>
    </div>
  );
}
