import Link from "next/link";
import type { IntroPart } from "@/lib/categories";

export function CategoryIntro({ intro }: { intro: IntroPart[] }) {
  return (
    <p className="max-w-3xl text-lg leading-8 text-muted">
      {intro.map((part, index) =>
        typeof part === "string" ? (
          <span key={`${index}-text`}>{part}</span>
        ) : (
          <Link
            key={`${index}-${part.slug}`}
            href={`/${part.slug}/`}
            className="font-semibold text-accent underline underline-offset-4"
          >
            {part.text}
          </Link>
        ),
      )}
    </p>
  );
}
