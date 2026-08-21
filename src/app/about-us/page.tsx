import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { buildAboutPageJsonLd } from "@/lib/seo";
import { STATIC_PAGE_SEO, buildPageMetadata } from "@/lib/page-seo";
import { CATEGORIES, SITE } from "@/lib/types";

export const metadata: Metadata = buildPageMetadata(
  STATIC_PAGE_SEO["about-us"],
  "/about-us/",
);

const PORTRAIT =
  "https://www.grandmarecipe.com/wp-content/uploads/2025/10/Warm-portrait-of-a-smiling-grandmother-in-a-cozy-kitchen.webp";

const highlights = [
  {
    title: "Comfort food with heart",
    text: "Stews that warm your bones and pies that make you close your eyes with the first bite. These are the kinds of meals that feel like a hug.",
  },
  {
    title: "Simple, no-fuss recipes",
    text: "Nothing fancy or fussy here. Just good, honest food with steps you can follow — whether you’ve been cooking for years or just now picking up the spoon.",
  },
  {
    title: "Stories with every dish",
    text: "You’ll find more than just ingredients. Every recipe comes with a bit of history — a memory, a Sunday tradition, or the reason why Grandpa still asks for it.",
  },
  {
    title: "Tips from trial and error",
    text: "I’ve burned my fair share of biscuits, so you don’t have to. I’ll share what works, what flops, and what you can skip without anyone noticing.",
  },
  {
    title: "Cooking with the seasons",
    text: "We’ll use what’s fresh, what’s ripe, and what makes your kitchen smell like home.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-[#fffdf9]">
      <JsonLd data={buildAboutPageJsonLd()} />
      <section className="border-b border-border bg-[radial-gradient(circle_at_top,#fff7ef_0%,#fffdf9_55%,#f8f2ea_100%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">
              Know more
            </p>
            <h1 className="mt-3 font-serif text-5xl text-[#8b1a1a] sm:text-6xl">
              About Me
            </h1>
            <p className="mt-5 max-w-xl text-xl text-muted">
              Welcome to {SITE.name} — where every recipe is made with love.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-foreground">
              Pull up a chair, dear — I’ve got something warm on the stove.
            </p>
          </div>

          <div className="mx-auto" id="grandma-millie">
            <div className="relative h-72 w-72 overflow-hidden rounded-full border-8 border-white shadow-2xl ring-4 ring-[#e8d4b8] sm:h-80 sm:w-80">
              <Image
                src={PORTRAIT}
                alt="Grandma Millie smiling in a sunlit rustic kitchen"
                fill
                priority
                className="object-cover"
                sizes="320px"
              />
            </div>
            <p className="mt-4 text-center font-serif text-lg text-accent">
              Grandma Millie
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <p className="font-serif text-2xl leading-9 text-foreground">
          Welcome to GrandmaRecipe.com — where every dish has a story.
        </p>
        <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
          <p>
            My name is <strong className="text-foreground">Grandma Millie</strong>
            , and while I might not be your real grandma, I hope this little
            kitchen corner of the internet makes you feel like you’ve come home.
            This blog was born out of flour-dusted counters, handwritten recipe
            cards tucked in cookie tins, and decades of Sunday dinners filled
            with laughter, love, and plenty of second helpings.
          </p>
          <p>
            I’ve been stirring sauces, rolling dough, and feeding hungry hearts
            for as long as I can remember. These recipes aren’t just
            instructions — they’re memories. The cinnamon rolls my grandkids
            beg for every holiday morning, the chicken pot pie that brings
            neighbors running, and the biscuits that could start family feuds if
            I ever changed the recipe.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-[#f8f2ea]">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
          <article className="rounded-3xl border border-border bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-[#8b1a1a]">A Little Extra</h2>
            <p className="mt-4 leading-8 text-muted">
              This isn’t just a recipe blog — it’s a{" "}
              <strong className="text-foreground">
                living scrapbook of flavors, memories, and soul.
              </strong>{" "}
              It’s a gentle invitation to slow down, stir a little deeper, and
              feed your people with care.
            </p>
            <p className="mt-4 leading-8 text-muted">
              So stay a while. Explore the recipes. Read the stories. Try
              something new — or maybe something beautifully old-fashioned. And
              if a little flour gets on your shirt? You’re doing it right.
            </p>
          </article>

          <article className="rounded-3xl border border-border bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-[#8b1a1a]">
              Why GrandmaRecipe
            </h2>
            <p className="mt-4 leading-8 text-muted">
              The name says it all — it’s not just about food, it’s about{" "}
              <strong className="text-foreground">home</strong>. Grandmas don’t
              rush. We don’t skip steps. We pour a little love (and maybe a bit
              of melted butter) into everything we make.
            </p>
            <p className="mt-4 leading-8 text-muted">
              This blog is my virtual kitchen table. A place to keep traditions
              alive, and start new ones too.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">
          What you’ll find here
        </p>
        <h2 className="mt-2 max-w-2xl font-serif text-3xl text-[#8b1a1a]">
          Now don’t be shy, sweetheart — let me tell you what’s bubbling in this
          pot of mine:
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-white p-6"
            >
              <h3 className="font-serif text-xl text-accent-dark">{item.title}</h3>
              <p className="mt-3 leading-7 text-muted">{item.text}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-lg leading-8 text-muted">
          So whether you’re cooking for a crowd, just yourself, or someone who
          needs a little love on a plate — my kitchen is open. There’s always
          room at Grandma Millie’s table.
        </p>
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="font-serif text-3xl text-[#8b1a1a]">Come cook with me</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Browse a category and find something cozy for tonight’s table — or
            read how every recipe gets kitchen-tested before it lands here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}/`}
                className="rounded-full border border-border bg-[#fffdf9] px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/how-we-test-recipes/"
              className="rounded-full border border-border bg-[#fffdf9] px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
            >
              How we test recipes
            </Link>
            <Link
              href="/contact-us/"
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
            >
              Say hello
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
