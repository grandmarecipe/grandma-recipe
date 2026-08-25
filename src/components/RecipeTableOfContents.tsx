"use client";

import { useId, useState } from "react";
import type { TocItem } from "@/lib/html";
import { scrollToAnchor } from "@/lib/scroll-to-anchor";

interface RecipeTableOfContentsProps {
  items: TocItem[];
}

export function RecipeTableOfContents({ items }: RecipeTableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="scroll-mt-36 rounded-3xl border border-border bg-[#fffdf9] p-6 sm:p-8"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <h2 className="font-serif text-2xl text-[#8b1a1a]">Table of Contents</h2>
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-lg text-[#8b1a1a] transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open ? (
        <ul id={panelId} className="mt-4 list-disc space-y-2 pl-5 marker:text-accent">
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
      ) : null}
    </nav>
  );
}
