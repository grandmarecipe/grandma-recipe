import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

type ScheduledPublishResult = {
  now: string;
  publishedSlugs: string[];
  skipped: Array<{ slug: string; reason: string }>;
  revalidated?: boolean;
  revalidateStatus?: number;
  reason?: string;
};

/**
 * Cron entry: publish due drafts, then ask Next.js to revalidate those URLs.
 * Set SITE_URL (optional) + CMS_IMPORT_SECRET on the Convex deployment.
 */
export const runScheduledPublish = internalAction({
  args: {},
  handler: async (ctx): Promise<ScheduledPublishResult> => {
    const result: {
      now: string;
      publishedSlugs: string[];
      skipped: Array<{ slug: string; reason: string }>;
    } = await ctx.runMutation(internal.articles.publishDueScheduled, {});

    if (result.publishedSlugs.length === 0) {
      return result;
    }

    const secret = process.env.CMS_IMPORT_SECRET?.trim();
    const siteUrl = (
      process.env.SITE_URL?.trim() || "https://www.grandmarecipe.com"
    ).replace(/\/$/, "");

    if (!secret) {
      return {
        ...result,
        revalidated: false,
        reason: "missing CMS_IMPORT_SECRET",
      };
    }

    try {
      const response = await fetch(`${siteUrl}/api/revalidate-cms`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-cms-secret": secret,
        },
        body: JSON.stringify({ slugs: result.publishedSlugs }),
      });
      return {
        ...result,
        revalidated: response.ok,
        revalidateStatus: response.status,
      };
    } catch (error) {
      return {
        ...result,
        revalidated: false,
        reason: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
