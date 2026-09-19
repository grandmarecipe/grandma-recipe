import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { assertCompletePrompts } from "@/lib/complete-article-images";
import type { ImagePromptBundle } from "@/lib/image-prompt-types";

export const runtime = "nodejs";

const SIGNAL_PATH = path.join(
  process.cwd(),
  ".cursor",
  "signals",
  "complete-article.json",
);

function writeAgentSignal(payload: Record<string, unknown>) {
  fs.mkdirSync(path.dirname(SIGNAL_PATH), { recursive: true });
  fs.writeFileSync(
    SIGNAL_PATH,
    `${JSON.stringify({ ...payload, writtenAt: new Date().toISOString() }, null, 2)}\n`,
  );
}

/**
 * Complete article = signal the Cursor agent to generate images with
 * Cursor GenerateImage (not DALL·E). The agent picks up
 * `.cursor/signals/complete-article.json`.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      token?: string;
      articleId?: string;
    };

    const token = body.token?.trim();
    const articleId = body.articleId?.trim() as Id<"articles"> | undefined;
    if (!token || !articleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const convex = getConvexClient();
    const admin = await convex.query(api.adminAuth.me, { token });
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const article = await convex.query(api.articles.get, {
      token,
      id: articleId,
    });
    if (!article) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const prompts = article.imagePrompts as ImagePromptBundle | undefined;
    try {
      assertCompletePrompts(prompts);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Missing prompts." },
        { status: 400 },
      );
    }

    const focusKeyword =
      article.focusKeyword?.trim() ||
      prompts!.focusKeyword ||
      article.title;

    const basename = article.slug
      .replace(/^what-is-a-/, "")
      .replace(/-a-bright.*$/, "")
      .slice(0, 48) || article.slug.slice(0, 48);

    writeAgentSignal({
      status: "pending",
      engine: "cursor-generate-image",
      articleId,
      slug: article.slug,
      title: article.title,
      focusKeyword,
      suggestedBasename: basename,
      adminEmail: admin.email,
      ratios: {
        feature: "16:9",
        ingredients: "3:4",
        how_to_make: "3:4",
        how_to_serve: "3:4",
      },
      note: "Use Cursor GenerateImage only — never OpenAI DALL·E.",
    });

    return NextResponse.json({
      ok: true,
      mode: "cursor-agent",
      message:
        "Queued for Cursor agent (GenerateImage — not DALL·E). Keep Agent chat open or send any message; it will finish images + metadata from the signal.",
      signalPath: ".cursor/signals/complete-article.json",
      slug: article.slug,
      articleId,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Complete article failed.",
      },
      { status: 500 },
    );
  }
}
