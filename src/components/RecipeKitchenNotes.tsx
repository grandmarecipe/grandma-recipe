import Link from "next/link";

interface RecipeKitchenNotesProps {
  hasNutrition: boolean;
}

/**
 * Trust / AEO notes for recipes that publish calories or nutrition figures.
 * Uses general methodology references — not fabricated per-recipe citations.
 */
export function RecipeKitchenNotes({ hasNutrition }: RecipeKitchenNotesProps) {
  if (!hasNutrition) return null;

  return (
    <section
      id="kitchen-notes"
      className="mt-14 scroll-mt-36 rounded-3xl border border-border bg-[#fffdf9] p-6 sm:p-8"
    >
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">
        Kitchen notes
      </p>
      <h2 className="mt-2 font-serif text-2xl text-[#8b1a1a]">
        Nutrition &amp; sources
      </h2>
      <div className="mt-4 space-y-4 leading-7 text-muted">
        <p>
          Calorie and nutrition figures on this page are{" "}
          <strong className="text-foreground">estimates</strong> meant for
          general home-cooking guidance. Actual values vary with brands,
          portion size, and how the recipe is prepared.
        </p>
        <p>
          Estimates draw on typical ingredient data from public nutrition
          databases such as the USDA{" "}
          <a
            href="https://fdc.nal.usda.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent transition hover:text-accent-dark"
          >
            FoodData Central
          </a>
          . They are not a substitute for professional medical or dietary advice.
        </p>
        <p>
          For how recipes are tested and when pages are updated, see{" "}
          <Link
            href="/how-we-test-recipes/"
            className="font-semibold text-accent transition hover:text-accent-dark"
          >
            How we test recipes
          </Link>
          . Full legal context lives in our{" "}
          <Link
            href="/disclaimers/"
            className="font-semibold text-accent transition hover:text-accent-dark"
          >
            disclaimers
          </Link>{" "}
          and{" "}
          <Link
            href="/affiliate-disclosure/"
            className="font-semibold text-accent transition hover:text-accent-dark"
          >
            affiliate disclosure
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
