import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  addRecipeComment,
  commentedCookieName,
  getRecipeComments,
} from "@/lib/comments";
import { getRecipeBySlugResolved } from "@/lib/cms-content";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

const COMMENT_COOLDOWN_SECONDS = 60 * 10;

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!(await getRecipeBySlugResolved(slug))) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  }

  const jar = await cookies();
  return NextResponse.json({
    comments: await getRecipeComments(slug),
    alreadyCommented: jar.has(commentedCookieName(slug)),
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!(await getRecipeBySlugResolved(slug))) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  }

  const jar = await cookies();
  const cookieKey = commentedCookieName(slug);
  if (jar.has(cookieKey)) {
    return NextResponse.json(
      {
        error: "Please wait a bit before posting another comment on this recipe.",
        comments: await getRecipeComments(slug),
        alreadyCommented: true,
      },
      { status: 429 },
    );
  }

  let body: { name?: unknown; body?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const comment = await addRecipeComment(slug, {
      name: typeof body.name === "string" ? body.name : "",
      body: typeof body.body === "string" ? body.body : "",
      website: typeof body.website === "string" ? body.website : "",
    });

    const comments = await getRecipeComments(slug);
    const response = NextResponse.json({
      comment,
      comments,
      alreadyCommented: true,
    });

    response.cookies.set(cookieKey, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COMMENT_COOLDOWN_SECONDS,
    });

    revalidateTag(`comments-${slug}`);
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/`);

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save comment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
