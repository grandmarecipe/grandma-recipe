import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jsonCached } from "@/lib/api-cache";
import { getRecipeBySlugResolved } from "@/lib/cms-content";
import {
  addRecipeRating,
  getRecipeRating,
  ratedCookieName,
} from "@/lib/ratings";
import { UGC_RATING_SLUGS_TAG } from "@/lib/ugc-active";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const rating = await getRecipeRating(slug);
  const jar = await cookies();
  const alreadyRated = jar.has(ratedCookieName(slug));

  return jsonCached({ ...rating, alreadyRated });
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!(await getRecipeBySlugResolved(slug))) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  }

  const jar = await cookies();
  const cookieKey = ratedCookieName(slug);
  if (jar.has(cookieKey)) {
    const rating = await getRecipeRating(slug, { force: true });
    return NextResponse.json(
      {
        error: "You already rated this recipe.",
        ...rating,
        alreadyRated: true,
      },
      { status: 409 },
    );
  }

  let body: { rating?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const stars = Number(body.rating);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 },
    );
  }

  try {
    const rating = await addRecipeRating(slug, stars);
    const response = NextResponse.json({ ...rating, alreadyRated: true });
    response.cookies.set(cookieKey, String(stars), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    revalidateTag(UGC_RATING_SLUGS_TAG);
    revalidateTag(`rating-${slug}`);
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/`);

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save rating.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
