"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CATEGORIES, type CategorySlug } from "@/lib/types";

const CATEGORY_ICONS: Record<CategorySlug, ReactNode> = {
  breakfast: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  lunch: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M4 10h16v2a8 8 0 0 1-16 0v-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  dinner: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M8 3v8M6 3v5a2 2 0 0 0 4 0V3M8 11v10M16 3v18M14 3c0 3 2 4 2 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  snacks: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 4c-3 2-5 5-5 8a5 5 0 0 0 10 0c0-3-2-6-5-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 14.5c.8.8 1.7 1.2 2.5 1.2s1.7-.4 2.5-1.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  dessert: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6 11h12l-1.2 8.2A2 2 0 0 1 14.8 21H9.2a2 2 0 0 1-2-1.8L6 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 11c0-3 1.5-5 4-6 2.5 1 4 3 4 6M12 5V3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  ...CATEGORIES.map((category) => ({
    href: `/category/${category.slug}/`,
    label: category.name,
    icon: CATEGORY_ICONS[category.slug],
  })),
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/print")) return null;

  return (
    <nav
      className="mobile-bottom-nav no-print fixed inset-x-0 bottom-0 z-50 border-t border-white/25 bg-[#fffdf9]/30 shadow-[0_-6px_20px_rgba(61,43,31,0.06)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile categories"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1.5 px-2 pt-2.5 pb-2">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-full border px-1 py-2 text-[0.62rem] leading-tight transition ${
                  active
                    ? "border-accent bg-accent font-semibold !text-white shadow-sm"
                    : "border-white/40 bg-white/45 font-medium text-muted shadow-sm backdrop-blur-sm hover:border-accent hover:text-accent"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={active ? "!text-white" : undefined}
                  aria-hidden
                >
                  {item.icon}
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
