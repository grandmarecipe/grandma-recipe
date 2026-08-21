"use client";

import Link from "next/link";
import { scrollToAnchor } from "@/lib/scroll-to-anchor";

interface RecipeJumpBarProps {
  slug: string;
}

export function RecipeJumpBar({ slug }: RecipeJumpBarProps) {
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
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-3 py-2 text-xs whitespace-nowrap sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
        <a
          href="#recipe"
          className="rounded-full bg-accent px-3 py-1.5 font-semibold !text-white hover:bg-accent-dark hover:!text-white sm:px-4 sm:py-2"
          onClick={(event) => handleAnchorClick(event, "recipe")}
        >
          Jump to Recipe
        </a>
        <a
          href="#story"
          className="rounded-full border border-border px-3 py-1.5 text-muted hover:text-accent sm:px-4 sm:py-2"
          onClick={(event) => handleAnchorClick(event, "story")}
        >
          Full recipe
        </a>
        <a
          href="#faqs"
          className="rounded-full border border-border px-3 py-1.5 text-muted hover:text-accent sm:px-4 sm:py-2"
          onClick={(event) => handleAnchorClick(event, "faqs")}
        >
          FAQs
        </a>
        <a
          href="#comments"
          className="rounded-full border border-border px-3 py-1.5 text-muted hover:text-accent sm:px-4 sm:py-2"
          onClick={(event) => handleAnchorClick(event, "comments")}
        >
          Comments
        </a>
        <Link
          href={`/print/${slug}/`}
          className="rounded-full border border-border px-3 py-1.5 text-muted hover:text-accent sm:px-4 sm:py-2"
        >
          Print / PDF
        </Link>
      </div>
    </div>
  );
}
