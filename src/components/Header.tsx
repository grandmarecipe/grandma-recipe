"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/types";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-4 w-5" aria-hidden>
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0"
            onClick={() => setOpen(false)}
          >
            <Image
              src={SITE.logo}
              alt={SITE.logoAlt}
              width={150}
              height={150}
              className="h-14 w-auto sm:h-[72px]"
              fetchPriority="low"
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base transition-colors ${
                  isActive(pathname, link.href)
                    ? "font-semibold text-accent"
                    : "font-medium text-foreground hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/search/"
            className="ml-auto rounded-full border border-border px-3 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent sm:px-4 sm:py-2 lg:ml-0"
            onClick={() => setOpen(false)}
          >
            Search
          </Link>
        </div>

        <nav
          id="mobile-nav"
          className={`border-t border-border bg-background lg:hidden ${
            open ? "block" : "hidden"
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 py-3">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-3 py-3 text-base transition ${
                      isActive(pathname, link.href)
                        ? "bg-[#faf4eb] font-semibold text-accent"
                        : "font-medium text-foreground hover:bg-[#faf4eb]/70 hover:text-accent"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/25 lg:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
