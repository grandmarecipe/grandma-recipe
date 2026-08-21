"use client";

import type { TocItem } from "@/lib/html";
import { scrollToAnchor } from "@/lib/scroll-to-anchor";

interface RecipeTableOfContentsProps {
  items: TocItem[];
}

export function RecipeTableOfContents({ items }: RecipeTableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="scroll-mt-36 rounded-3xl border border-border bg-[#fffdf9] p-6 sm:p-8"
    >
      <h2 className="font-serif text-2xl text-[#8b1a1a]">Table of Contents</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => {
          const id = item.href.replace(/^#/, "");

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-accent transition hover:text-accent-dark hover:underline"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToAnchor(id);
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
