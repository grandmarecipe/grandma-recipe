"use client";

import Link from "next/link";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAdminAuth } from "@/components/admin/AdminProviders";

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const { results, status, loadMore } = usePaginatedQuery(
    api.articles.list,
    token ? { token } : "skip",
    { initialNumItems: 40 },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[#8b1a1a]">Articles</h1>
          <p className="mt-1 text-sm text-[#6b5b4f]">
            Draft and publish recipes. Published CMS articles appear on the live
            site and override matching file-based recipes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/generate/"
            className="rounded-full border border-[#d4a574] px-4 py-2 text-sm font-semibold text-[#b8860b]"
          >
            Generate with AI
          </Link>
          <Link
            href="/admin/articles/new/"
            className="rounded-full bg-[#5a822b] px-4 py-2 text-sm font-semibold text-white"
          >
            New article
          </Link>
        </div>
      </div>

      {!token ? (
        <p className="text-sm text-[#6b5b4f]">Sign in to manage articles.</p>
      ) : status === "LoadingFirstPage" ? (
        <p className="text-sm text-[#6b5b4f]">Loading…</p>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d4a574] bg-white px-6 py-10 text-center">
          <p className="text-[#6b5b4f]">No CMS articles yet.</p>
          <Link
            href="/admin/articles/new/"
            className="mt-3 inline-block font-semibold text-[#8b1a1a]"
          >
            Write your first article →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-[#e5d8c8] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#e5d8c8] bg-[#fffdf9] text-[#6b5b4f]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Primary keyword</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {results.map((article) => (
                  <tr
                    key={article._id}
                    className="border-b border-[#f0e6da] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#2c241b]">
                        {article.title}
                      </div>
                      <div className="text-xs text-[#6b5b4f]">
                        /{article.slug}/
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6b5b4f]">
                      {article.focusKeyword?.trim() || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          article.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6b5b4f]">
                      {article.modifiedAt.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/articles/${article._id}/`}
                        className="font-semibold text-[#8b1a1a]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {status === "CanLoadMore" || status === "LoadingMore" ? (
            <button
              type="button"
              disabled={status === "LoadingMore"}
              onClick={() => loadMore(40)}
              className="rounded-full border border-[#d4a574] px-4 py-2 text-sm font-semibold text-[#b8860b] disabled:opacity-60"
            >
              {status === "LoadingMore" ? "Loading…" : "Load more"}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
