import Link from "next/link";
import { CategoryCircle } from "@/components/CategoryCircle";
import { HomeRecipeSection } from "@/components/HomeRecipeSection";
import { JsonLd } from "@/components/JsonLd";
import { SiteFaqs } from "@/components/SiteFaqs";
import { getAllRecipeMeta, getRecipesByCategory } from "@/lib/content";
import { HOME_FAQS } from "@/lib/home-faqs";
import { buildHomePageJsonLd } from "@/lib/seo";
import { CATEGORIES, SITE } from "@/lib/types";

const GRANDMAS_PICKS = [
  {
    slug: "falafel-bowl",
    emoji: "🍽️",
    blurb:
      "A sun-kissed Mediterranean delight packed with protein and herbs, perfect for any lunch or light dinner.",
  },
  {
    slug: "shakshouka",
    emoji: "🍳",
    blurb:
      "A vibrant North African breakfast made with poached eggs in spicy tomato sauce. Comfort in every spoonful.",
  },
  {
    slug: "minted-greens",
    emoji: "🥗",
    blurb:
      "A fresh and cooling salad of leafy greens tossed with zesty mint and lemon, perfect as a side or light bite.",
  },
  {
    slug: "broasted-chicken",
    emoji: "🍗",
    blurb:
      "Crispy on the outside, juicy on the inside — a golden chicken family weekend favorite.",
  },
  {
    slug: "navy-beans",
    emoji: "🥣",
    blurb:
      "A cozy, protein-rich bowl of creamy white beans slow-cooked with love and simplicity.",
  },
];

export default function HomePage() {
  const allRecipes = getAllRecipeMeta();
  const picks = GRANDMAS_PICKS.map((pick) => {
    const recipe = allRecipes.find((item) => item.slug === pick.slug);
    return recipe ? { ...pick, title: recipe.title } : null;
  }).filter(Boolean) as Array<(typeof GRANDMAS_PICKS)[number] & { title: string }>;

  const categoryImages = Object.fromEntries(
    CATEGORIES.map((category) => {
      const first = getRecipesByCategory(category.slug)[0];
      return [category.slug, first?.featuredImage];
    }),
  ) as Record<string, string | undefined>;

  return (
    <>
      <JsonLd data={buildHomePageJsonLd()} />

      <section className="marble-hero border-b border-border">
        <div className="marble-hero-content mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <h1 className="font-serif text-4xl text-[#8b1a1a] sm:text-6xl">
            {SITE.tagline}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-[#8b1a1a]/80">
            {SITE.description}
          </p>

          <h2 className="mt-16 font-serif text-3xl font-semibold text-[#5c4f28] sm:mt-20">
            Browse Our Categories
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-10">
            {CATEGORIES.map((category, index) => (
              <CategoryCircle
                key={category.slug}
                category={category}
                image={categoryImages[category.slug]}
                overlayLabel
                priority={index < 3}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f6ebdf] font-serif text-2xl text-accent">
            GM
          </div>
          <p className="mt-6 text-lg text-muted">
            I&apos;m <strong>Grandma Millie</strong>, and I hope this cozy
            kitchen corner feels like home, full of love, laughter, and recipes
            passed down from flour-dusted counters and handwritten cards.
          </p>
          <Link
            href="/about-us/"
            className="mt-4 inline-block font-semibold text-accent"
          >
            See more about me →
          </Link>
          <div className="mx-auto mt-10 h-px w-24 bg-accent" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="font-serif text-3xl text-[#8b1a1a]">Why Grandma Recipe</h2>
        <p className="mt-5 text-lg leading-8 text-muted">
          At {SITE.name}, we believe food is more than just nourishment —
          it&apos;s tradition, love, and connection. From nostalgic weekend
          dishes to quick weekday meals, our curated recipes reflect real
          stories and real flavors. Whether you&apos;re a first-time cook or a
          seasoned food lover, there&apos;s something comforting and flavorful
          waiting for you in every click.
        </p>
      </section>

      <HomeRecipeSection
        title="Rise and shine with homemade goodness"
        description="From cozy classics to quick bites on the go, our breakfast recipes help you start the day with flavor, comfort, and a full heart."
        categoryHref="/category/breakfast/"
        categoryLabel="All breakfast recipes"
        recipes={getRecipesByCategory("breakfast").slice(0, 3)}
        prioritizeFirstImage
      />

      <section className="border-y border-border bg-[#f8f2ea] py-10 text-center">
        <h2 className="font-serif text-3xl text-[#8b1a1a]">
          From sunrise to supper
        </h2>
        <p className="mt-2 text-lg text-muted">
          Grandma recipes got your cravings covered.
        </p>
      </section>

      <HomeRecipeSection
        title="Midday meals made easy"
        description="Refresh your routine with light, satisfying lunches that keep you going, from vibrant salads to quick, hearty bites."
        categoryHref="/category/lunch/"
        categoryLabel="All lunch recipes"
        recipes={getRecipesByCategory("lunch").slice(0, 3)}
      />

      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-center text-sm font-semibold tracking-wide text-accent uppercase">
            Grandma&apos;s Picks
          </p>
          <h2 className="mt-2 text-center font-serif text-3xl text-[#8b1a1a]">
            Our Favorite Recipes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            Discover the heart of Grandma&apos;s kitchen with these timeless and
            flavorful dishes.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {picks.map((pick, index) => (
              <Link
                key={pick.slug}
                href={`/${pick.slug}/`}
                className={`flex gap-4 rounded-2xl border border-border bg-[#fffdf9] p-5 transition hover:border-accent hover:shadow-sm ${
                  index === picks.length - 1
                    ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-0.5rem)]"
                    : ""
                }`}
              >
                <span className="text-2xl">{pick.emoji}</span>
                <div>
                  <p className="font-serif text-xl text-accent">{pick.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{pick.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeRecipeSection
        title="End the day on a delicious note"
        description="Whether it's a simple skillet meal or a comforting family classic, our dinner recipes make every evening feel like home."
        categoryHref="/category/dinner/"
        categoryLabel="All dinner recipes"
        recipes={getRecipesByCategory("dinner").slice(0, 3)}
      />

      <HomeRecipeSection
        title="Because snacks should never be boring"
        description="Whether you're fueling up for the afternoon or treating yourself between meals, our snack recipes bring joy in every bite."
        categoryHref="/category/snacks/"
        categoryLabel="All snack recipes"
        recipes={getRecipesByCategory("snacks").slice(0, 3)}
      />

      <HomeRecipeSection
        title="Treat yourself, you've earned it"
        description="From nostalgic bakes to easy no-bake delights, our dessert recipes bring a sweet finish to any day."
        categoryHref="/category/dessert/"
        categoryLabel="All dessert recipes"
        recipes={getRecipesByCategory("dessert").slice(0, 3)}
      />

      <SiteFaqs
        faqs={HOME_FAQS}
        eyebrow="About this kitchen"
        title="Frequently asked questions"
        description="Straight answers about Grandma Recipe — testing, ratings, nutrition estimates, and how this cozy kitchen corner works."
      />
    </>
  );
}
