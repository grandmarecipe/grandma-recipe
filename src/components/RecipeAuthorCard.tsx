import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/types";

export function RecipeAuthorCard() {
  return (
    <aside
      aria-label="About the author"
      className="mt-14 rounded-3xl border border-border bg-[#f8f2ea] p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Link
          href="/about-us/#grandma-millie"
          className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md sm:mx-0"
        >
          <Image
            src={SITE.author.image}
            alt={SITE.author.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </Link>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Recipe author
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[#8b1a1a]">
            <Link
              href="/about-us/#grandma-millie"
              className="transition hover:text-accent"
            >
              {SITE.author.name}
            </Link>
          </h2>
          <p className="mt-3 leading-7 text-muted">{SITE.author.description}</p>
          <p className="mt-3 leading-7 text-muted">
            Every recipe here is kitchen-tested for real home cooks — clear
            steps, honest notes, and the little fixes that save a batch.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold sm:justify-start">
            <Link
              href="/about-us/#grandma-millie"
              className="text-accent transition hover:text-accent-dark"
            >
              More about Millie →
            </Link>
            <Link
              href="/how-we-test-recipes/"
              className="text-accent transition hover:text-accent-dark"
            >
              How we test recipes →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
