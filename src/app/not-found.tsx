import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, SITE } from "@/lib/types";

export const metadata: Metadata = {
  title: "Page not found",
  description: `That page isn’t in Grandma Millie’s kitchen. Browse recipes on ${SITE.name}.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="marble-hero border-b border-border">
      <div className="marble-hero-content mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
        <p className="font-serif text-7xl text-[#8b1a1a]/40 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[#8b1a1a] sm:text-5xl">
          This recipe wandered off
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#8b1a1a]/80">
          The page you’re looking for isn’t in Grandma Millie’s kitchen —
          maybe the link is old, or the recipe moved. Let’s get you back to
          something delicious.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#8b1a1a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6e1515]"
          >
            Back to home
          </Link>
          <Link
            href="/search/"
            className="rounded-full border border-[#d4a574] bg-white/80 px-6 py-3 text-sm font-semibold text-[#b8860b] transition hover:border-[#8b1a1a] hover:text-[#8b1a1a]"
          >
            Search recipes
          </Link>
        </div>

        <div className="mx-auto mt-14 h-px w-24 bg-[#d4a574]" />

        <h2 className="mt-10 font-serif text-2xl text-[#5c4f28]">
          Browse a category
        </h2>
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}/`}
                className="inline-block rounded-full border border-[#e5d8c8] bg-white/70 px-4 py-2 text-sm font-semibold text-[#3d2b1f] transition hover:border-[#8b1a1a] hover:text-[#8b1a1a]"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
