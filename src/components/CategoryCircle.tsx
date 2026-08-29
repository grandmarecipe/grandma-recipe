import Image from "next/image";
import Link from "next/link";
import type { CategoryInfo } from "@/lib/types";

interface CategoryCircleProps {
  category: CategoryInfo;
  image?: string;
  overlayLabel?: boolean;
  /** Prioritize image decode for above-the-fold category circles. */
  priority?: boolean;
}

export function CategoryCircle({
  category,
  image,
  overlayLabel = false,
  priority = false,
}: CategoryCircleProps) {
  return (
    <Link
      href={`/category/${category.slug}/`}
      className="group flex flex-col items-center gap-3 text-center"
    >
      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#d9c4a8] sm:h-36 sm:w-36">
        {image ? (
          <Image
            src={image}
            alt={category.name}
            width={144}
            height={144}
            priority={priority}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 112px, 144px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f6ebdf] to-[#e8c9a8] font-serif text-accent">
            {category.name.slice(0, 1)}
          </div>
        )}
        {overlayLabel && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 pb-3 pt-8 font-serif text-lg text-white drop-shadow">
            {category.name}
          </span>
        )}
      </div>
      {!overlayLabel && (
        <span className="font-serif text-lg text-foreground transition group-hover:text-accent">
          {category.name}
        </span>
      )}
    </Link>
  );
}
