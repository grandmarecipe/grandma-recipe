import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildHowWeTestPageJsonLd } from "@/lib/seo";
import { STATIC_PAGE_SEO, buildPageMetadata } from "@/lib/page-seo";
import { SITE } from "@/lib/types";

export const metadata: Metadata = buildPageMetadata(
  STATIC_PAGE_SEO["how-we-test-recipes"],
  "/how-we-test-recipes/",
);

const PORTRAIT = SITE.author.image;

const standards = [
  {
    title: "Cooked in a real home kitchen",
    text: "Recipes are made with everyday pans, grocery-store ingredients, and the kind of timing a busy weeknight actually allows — not a test-kitchen fantasy.",
  },
  {
    title: "Clear steps before pretty words",
    text: "If a step is fuzzy, we rewrite it. You should know what “done” looks like, smells like, and feels like before you take the dish out of the oven.",
  },
  {
    title: "Honest notes when things go sideways",
    text: "Burned biscuits, runny fillings, and “why is this pale?” moments get written down so you can skip the mistakes Millie already made.",
  },
  {
    title: "Updated when readers teach us better",
    text: "When comments, emails, or retests show a clearer method, we revise the recipe and bump the updated date so you can trust what’s current.",
  },
];

export default function HowWeTestRecipesPage() {
  return (
    <div className="bg-[#fffdf9]">
      <JsonLd data={buildHowWeTestPageJsonLd()} />

      <section className="border-b border-border bg-[radial-gradient(circle_at_top,#fff7ef_0%,#fffdf9_55%,#f8f2ea_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "How we test recipes" },
            ]}
          />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">
                Kitchen standards
              </p>
              <h1 className="mt-3 font-serif text-5xl text-[#8b1a1a] sm:text-6xl">
                How we test recipes
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                At {SITE.name}, a recipe earns its place only after it works in a
                real kitchen — with clear steps, honest notes, and food worth
                sharing at the table.
              </p>
            </div>

            <div className="mx-auto">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-8 border-white shadow-2xl ring-4 ring-[#e8d4b8] sm:h-72 sm:w-72">
                <Image
                  src={PORTRAIT}
                  alt={`${SITE.author.name} in the kitchen`}
                  fill
                  priority
                  className="object-cover"
                  sizes="288px"
                />
              </div>
              <p className="mt-4 text-center font-serif text-lg text-accent">
                {SITE.author.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-serif text-3xl text-[#8b1a1a]">Our promise</h2>
        <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
          <p>
            These pages are written for home cooks, not food-lab technicians.{" "}
            {SITE.author.name} tests recipes the way you will cook them: with
            ordinary tools, pantry staples, and enough patience for a second
            (or third) try when something needs fixing.
          </p>
          <p>
            That experience shows up as practical tips, timing you can trust,
            and updates when a better method comes along. If a dish is still
            evolving, the recipe page says so through its updated date.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-[#f8f2ea]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            What “kitchen-tested” means here
          </p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl text-[#8b1a1a]">
            Four standards behind every recipe card
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {standards.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-white p-6"
              >
                <h3 className="font-serif text-xl text-accent-dark">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-serif text-3xl text-[#8b1a1a]">
          How we handle updates
        </h2>
        <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
          <p>
            Published dates show when a recipe first went live. Updated dates
            appear when ingredients, steps, timing, or notes change in a
            meaningful way — not for tiny typos alone.
          </p>
          <p>
            Nutrition figures, when listed, are estimates meant for general
            guidance. Always use your judgment for allergies, dietary needs, and
            food safety. See our{" "}
            <Link href="/disclaimers/" className="font-semibold text-accent">
              disclaimers
            </Link>{" "}
            for the full details.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="font-serif text-3xl text-[#8b1a1a]">
            Questions from your kitchen?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            If a step still feels unclear, write in — reader feedback helps the
            next cook succeed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/about-us/#grandma-millie"
              className="rounded-full border border-border bg-[#fffdf9] px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
            >
              Meet {SITE.author.name}
            </Link>
            <Link
              href="/contact-us/"
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
