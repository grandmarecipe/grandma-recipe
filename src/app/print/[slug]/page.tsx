import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipePrintView } from "@/components/RecipePrintView";
import { getAllRecipeSlugs, getRecipeBySlug } from "@/lib/content";
import { SITE } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRecipeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return {};

  return {
    title: { absolute: recipe.title },
    description: `Printable recipe card for ${recipe.title}.`,
    robots: { index: false, follow: true },
  };
}

export default async function RecipePrintPage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  return <RecipePrintView recipe={recipe} />;
}
