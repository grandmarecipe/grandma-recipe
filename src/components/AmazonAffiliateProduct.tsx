import Image from "next/image";
import Link from "next/link";
import type { AmazonAffiliateProduct as AmazonAffiliateProductData } from "@/lib/amazon-affiliates";

interface AmazonAffiliateProductProps {
  product: AmazonAffiliateProductData;
  /** When false, omit the Associates line (use once for a product group). */
  showDisclosure?: boolean;
}

export function AmazonAffiliateProduct({
  product,
  showDisclosure = true,
}: AmazonAffiliateProductProps) {
  return (
    <aside
      className="rounded-2xl border border-border bg-[#fffdf9] p-4 sm:p-5"
      aria-label={`Shop ${product.title} on Amazon`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white sm:mx-0">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            width={112}
            height={112}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            Kitchen pick
          </p>
          <p className="mt-1 font-serif text-lg leading-snug text-foreground">
            {product.title}
          </p>
          {product.blurb ? (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {product.blurb}
            </p>
          ) : null}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-accent-dark"
          >
            View on Amazon
          </a>
          {showDisclosure ? <AmazonAffiliateDisclosure /> : null}
        </div>
      </div>
    </aside>
  );
}

export function AmazonAffiliateDisclosure() {
  return (
    <p className="mt-3 text-xs leading-relaxed text-[#8a7a6c]">
      As an Amazon Associate I earn from qualifying purchases. If you buy
      through these links, we may earn a small commission at no extra cost to
      you.{" "}
      <Link
        href="/affiliate-disclosure/"
        className="font-semibold text-accent transition hover:text-accent-dark"
      >
        Affiliate disclosure
      </Link>
    </p>
  );
}

interface AmazonAffiliateProductListProps {
  products: AmazonAffiliateProductData[];
  className?: string;
}

/** Renders one or more affiliate picks with a single shared disclosure. */
export function AmazonAffiliateProductList({
  products,
  className = "mt-4 space-y-3",
}: AmazonAffiliateProductListProps) {
  if (products.length === 0) return null;

  return (
    <div className={className}>
      {products.map((product) => (
        <AmazonAffiliateProduct
          key={product.affiliateUrl}
          product={product}
          showDisclosure={false}
        />
      ))}
      <AmazonAffiliateDisclosure />
    </div>
  );
}
