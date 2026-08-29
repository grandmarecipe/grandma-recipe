"use client";

import { useState } from "react";

export interface RecipeCommentItem {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

interface RecipeCommentsProps {
  slug: string;
  initialComments?: RecipeCommentItem[];
}

function formatCommentDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function RecipeComments({
  slug,
  initialComments = [],
}: RecipeCommentsProps) {
  const [comments, setComments] = useState<RecipeCommentItem[]>(initialComments);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/comments/${slug}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body, website }),
      });
      const data = (await response.json()) as {
        comments?: RecipeCommentItem[];
        error?: string;
      };

      if (!response.ok) {
        setError(data.error || "Could not post your comment.");
        return;
      }

      if (Array.isArray(data.comments)) {
        setComments(data.comments);
      }
      setName("");
      setBody("");
      setWebsite("");
      setMessage("Thanks! Your comment was posted.");
    } catch {
      setError("Could not post your comment. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      id="comments"
      className="no-print mt-14 scroll-mt-36 rounded-3xl border border-border bg-white p-6 sm:p-8"
    >
      <h2 className="font-serif text-3xl text-[#8b1a1a]">Comments</h2>
      <p className="mt-2 text-sm text-muted">
        Made this recipe? Share how it turned out for your family.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="relative grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-foreground">Name</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={40}
              autoComplete="name"
              className="mt-1.5 w-full rounded-xl border border-border bg-[#fffdf9] px-3 py-2.5 text-foreground outline-none transition focus:border-accent"
              placeholder="Your name"
            />
          </label>

          {/* Honeypot — hidden from real users */}
          <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
            Website
            <input
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-semibold text-foreground">Comment</span>
          <textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            minLength={5}
            maxLength={800}
            rows={4}
            className="mt-1.5 w-full rounded-xl border border-border bg-[#fffdf9] px-3 py-2.5 text-foreground outline-none transition focus:border-accent"
            placeholder="Tell Grandma how it went…"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-accent-dark disabled:opacity-60"
          >
            {pending ? "Posting…" : "Post comment"}
          </button>
          {message ? (
            <p className="text-sm font-medium text-[#5a822b]">{message}</p>
          ) : null}
          {error ? (
            <p className="text-sm font-medium text-[#8b1a1a]">{error}</p>
          ) : null}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-[#fffdf9] px-4 py-6 text-sm text-muted">
            No comments yet — be the first to leave a note.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-border bg-[#fffdf9] px-4 py-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-foreground">{comment.name}</h3>
                <time
                  dateTime={comment.createdAt}
                  className="text-xs text-muted"
                >
                  {formatCommentDate(comment.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#4d4036]">
                {comment.body}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
