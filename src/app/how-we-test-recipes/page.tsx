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
    title: "Ingredients that match the method",
    text: "Our review checklist starts with quantities, units, and ingredient names. The recipe card and the longer instructions should describe the same dish.",
  },
  {
    title: "Clear steps before pretty words",
    text: "Our goal is to explain the order of the steps, the equipment, and the signs of doneness. If a step is unclear, please tell us where you got stuck.",
  },
  {
    title: "Cooking tests described accurately",
    text: "An editorial review is a check of the written recipe. A kitchen test means actually cooking it. Any kitchen-test claim should be supported by notes on that specific recipe.",
  },
  {
    title: "Reader feedback and corrections",
    text: "Spot a missing ingredient or a confusing quantity? Send the recipe link and the detail through our contact page so it can be reviewed and corrected.",
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
              { label: "Our recipe standards" },
            ]}
          />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">
                Recipe care
              </p>
              <h1 className="mt-3 font-serif text-5xl text-[#8b1a1a] sm:text-6xl">
                Our recipe standards
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                At {SITE.name}, we want you to feel comfortable following a
                recipe from the first ingredient to the final serving. These
                standards guide our ongoing review of the recipes on this site.
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
        <h2 className="font-serif text-3xl text-[#8b1a1a]">
          A little care behind the recipe
        </h2>
        <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
          <p>
            These pages are written for home cooks using everyday tools and
            grocery-store ingredients. Our review focuses on consistent
            quantities, understandable instructions, and useful serving notes.
          </p>
          <p>
            We do not claim that every recipe has been cooked and tested by
            Grandma Millie. When a cooking test is documented, its details
            belong on the individual
            recipe page, where you can see what was tried.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-[#f8f2ea]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            What we look for during review
          </p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl text-[#8b1a1a]">
            Four standards for clearer recipes
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
