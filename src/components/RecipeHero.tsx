import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContentImage } from "@/components/ContentImage";
import { formatRecipeDate, sameCalendarDay } from "@/lib/dates";
import type { RecipeRatingAggregate } from "@/lib/ratings";
import type { Recipe } from "@/lib/types";
import { HERO_IMAGE_SIZES } from "@/lib/hero-image";
import { CATEGORIES, SITE } from "@/lib/types";
import Image from "next/image";

interface RecipeHeroProps {
  recipe: Recipe;
  rating?: RecipeRatingAggregate;
}

export function RecipeHero({ recipe, rating }: RecipeHeroProps) {
  const category = CATEGORIES.find((item) => item.slug === recipe.category);
  const published = formatRecipeDate(recipe.publishedAt);
  const updated = formatRecipeDate(recipe.modifiedAt);
  const showUpdated =
    Boolean(updated) &&
    !sameCalendarDay(recipe.publishedAt, recipe.modifiedAt);

  return (
    <section className="no-print border-b border-border bg-[linear-gradient(180deg,#fffdf9_0%,#f8f2ea_100%)]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <Breadcrumbs
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              {
                label: category?.name || recipe.category,
                href: `/category/${recipe.category}/`,
              },
              { label: recipe.title },
            ]}
          />
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {recipe.category}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#8b1a1a] sm:text-5xl">
            {recipe.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#6b5b4f]">
            <Link
              href="/about-us/#grandma-millie"
              className="inline-flex items-center gap-2 font-semibold text-foreground transition hover:text-accent"
            >
              <span className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                <Image
                  src={SITE.author.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </span>
              By {SITE.author.name}
            </Link>
            {published && (
              <>
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
                <time dateTime={recipe.publishedAt}>
                  Published {published}
                </time>
              </>
            )}
            {showUpdated && (
              <>
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
                <time dateTime={recipe.modifiedAt}>Updated {updated}</time>
              </>
            )}
          </div>

          {rating && rating.ratingCount > 0 ? (
            <p className="mt-3 text-sm text-[#6b5b4f]">
              <span className="font-semibold text-[#c45c26]">
                {rating.ratingValue.toFixed(1)} ★
              </span>
              <span>
                {" "}
                ({rating.ratingCount}{" "}
                {rating.ratingCount === 1 ? "rating" : "ratings"})
              </span>
              <a
                href="#recipe"
                className="ml-2 font-semibold text-accent hover:text-accent-dark"
              >
                Rate this recipe
              </a>
            </p>
          ) : (
            <p className="mt-3 text-sm">
              <a
                href="#recipe"
                className="font-semibold text-accent hover:text-accent-dark"
              >
                Be the first to rate this recipe
              </a>
            </p>
          )}
        </div>

        {recipe.featuredImage && (
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-3xl bg-[#f3e8dc] shadow-xl lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <ContentImage
              src={recipe.featuredImage}
              alt={recipe.featuredImageAlt || recipe.title}
              fill
              optimize
              priority
              fetchPriority="high"
              quality={75}
              className="object-cover"
              sizes={HERO_IMAGE_SIZES}
            />
          </div>
        )}

        <div className="order-3 lg:col-start-1 lg:row-start-2">
          <p className="max-w-2xl text-xl leading-relaxed text-muted">
            {recipe.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {recipe.prepTime && (
              <MetaPill label="Prep" value={recipe.prepTime} />
            )}
            {recipe.cookTime && (
              <MetaPill label="Cook" value={recipe.cookTime} />
            )}
            {recipe.totalTime && (
              <MetaPill label="Total" value={recipe.totalTime} />
            )}
            {recipe.servings && (
              <MetaPill label="Serves" value={recipe.servings} />
            )}
            {recipe.calories && (
              <MetaPill label="Calories" value={recipe.calories} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border bg-white px-4 py-2">
      <span className="text-muted">{label}: </span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
