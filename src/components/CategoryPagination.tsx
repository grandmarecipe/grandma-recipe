import Link from "next/link";
import type { CategorySlug } from "@/lib/types";
import { categoryPagePath } from "@/lib/pagination";

interface CategoryPaginationProps {
  slug: CategorySlug;
  page: number;
  totalPages: number;
}

function pageItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);

  return items;
}

export function CategoryPagination({
  slug,
  page,
  totalPages,
}: CategoryPaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = page > 1 ? categoryPagePath(slug, page - 1) : null;
  const nextHref = page < totalPages ? categoryPagePath(slug, page + 1) : null;

  return (
    <nav
      aria-label="Category pagination"
      className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8"
    >
      <p className="text-sm text-muted">
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {prevHref ? (
          <Link
            href={prevHref}
            rel="prev"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-full border border-border bg-[#f8f2ea] px-4 py-2 text-sm text-muted">
            Previous
          </span>
        )}

        {pageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={categoryPagePath(slug, item)}
              aria-current={item === page ? "page" : undefined}
              className={`min-w-10 rounded-full px-3 py-2 text-center text-sm font-semibold transition ${
                item === page
                  ? "bg-accent !text-white"
                  : "border border-border bg-white text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {item}
            </Link>
          ),
        )}

        {nextHref ? (
          <Link
            href={nextHref}
            rel="next"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-full border border-border bg-[#f8f2ea] px-4 py-2 text-sm text-muted">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
