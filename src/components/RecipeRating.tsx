"use client";

import { useEffect, useState } from "react";

interface RecipeRatingProps {
  slug: string;
  initialRatingValue?: number;
  initialRatingCount?: number;
  compact?: boolean;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="m12 3.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6 7.2 18.1l.9-5.4-3.9-3.8 5.4-.8L12 3.2Z" />
    </svg>
  );
}

export function RecipeRating({
  slug,
  initialRatingValue = 0,
  initialRatingCount = 0,
  compact = false,
}: RecipeRatingProps) {
  const [ratingValue, setRatingValue] = useState(initialRatingValue);
  const [ratingCount, setRatingCount] = useState(initialRatingCount);
  const [hover, setHover] = useState(0);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/ratings/${slug}/`);
        if (!response.ok) return;
        const data = (await response.json()) as {
          ratingValue: number;
          ratingCount: number;
          alreadyRated: boolean;
        };
        if (cancelled) return;
        setRatingValue(data.ratingValue);
        setRatingCount(data.ratingCount);
        setAlreadyRated(data.alreadyRated);
      } catch {
        // Keep SSR defaults if the API is unavailable.
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function submitRating(stars: number) {
    if (alreadyRated || pending) return;
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/ratings/${slug}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: stars }),
      });
      const data = (await response.json()) as {
        ratingValue?: number;
        ratingCount?: number;
        alreadyRated?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setAlreadyRated(Boolean(data.alreadyRated));
        setMessage(data.error || "Could not save your rating.");
        return;
      }

      setRatingValue(data.ratingValue || 0);
      setRatingCount(data.ratingCount || 0);
      setAlreadyRated(true);
      setMessage("Thanks for rating this recipe!");
    } catch {
      setMessage("Could not save your rating. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const displayStars = hover || Math.round(ratingValue);

  return (
    <div
      className={
        compact
          ? "inline-flex flex-wrap items-center gap-2"
          : "rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-4"
      }
      aria-label="Recipe rating"
    >
      {!compact ? (
        <p className="text-sm font-semibold text-[#3d2b1f]">
          {alreadyRated ? "Your rating" : "Rate this recipe"}
        </p>
      ) : null}

      <div className="mt-0 flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-0.5 text-[#c45c26]"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={alreadyRated || pending}
              aria-label={`Rate ${star} out of 5 stars`}
              className="rounded p-0.5 transition enabled:hover:scale-110 disabled:cursor-default"
              onMouseEnter={() => {
                if (!alreadyRated) setHover(star);
              }}
              onFocus={() => {
                if (!alreadyRated) setHover(star);
              }}
              onClick={() => void submitRating(star)}
            >
              <StarIcon filled={star <= displayStars} />
            </button>
          ))}
        </div>

        <p className="text-sm text-[#6b5b4f]">
          {ratingCount > 0 ? (
            <>
              <span className="font-semibold text-[#3d2b1f]">
                {ratingValue.toFixed(1)}
              </span>
              <span aria-hidden> ★ </span>
              <span>
                ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
              </span>
            </>
          ) : (
            <span>Be the first to rate</span>
          )}
        </p>
      </div>

      {message && !compact ? (
        <p className="mt-2 text-sm text-[#5a822b]">{message}</p>
      ) : null}
    </div>
  );
}
