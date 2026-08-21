import type { CategorySlug } from "./types";

export const CATEGORY_PAGE_SIZE = 24;

export function getTotalPages(totalItems: number, pageSize = CATEGORY_PAGE_SIZE) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = CATEGORY_PAGE_SIZE,
): {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
} {
  const totalItems = items.length;
  const totalPages = getTotalPages(totalItems, pageSize);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    page: safePage,
    totalPages,
    totalItems,
    startIndex,
  };
}

export function categoryPagePath(slug: CategorySlug, page: number): string {
  if (page <= 1) return `/category/${slug}/`;
  return `/category/${slug}/page/${page}/`;
}

export function parsePageParam(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return null;
  return page;
}
