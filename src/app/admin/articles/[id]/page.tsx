"use client";

import { use } from "react";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import type { Id } from "../../../../../convex/_generated/dataModel";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ArticleEditor articleId={id as Id<"articles">} />;
}
