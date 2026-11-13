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
      className="@container rounded-2xl border border-border bg-[#fffdf9] p-4 sm:p-5"
      aria-label={`Shop ${product.title} on Amazon`}
    >
      <div className="flex flex-col gap-4 @[28rem]:flex-row @[28rem]:items-center">
        <div className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white @[28rem]:mx-0">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            width={112}
            height={112}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1 text-center @[28rem]:text-left">
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
            aria-label="View on Amazon"
            className="mt-3 inline-flex h-12 max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#FCD200] bg-[#FFD814] px-5 shadow-sm transition hover:bg-[#F7CA00]"
          >
            <span className="text-[19px] font-semibold leading-none tracking-tight !text-[#0F1111]">
              View on
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element -- local brand mark; avoid stale image optimizer cache */}
            <img
              src="/brand/amazon-logo.png?v=5"
              alt=""
              width={196}
              height={62}
              className="h-6 w-auto shrink-0 translate-y-[1px]"
            />
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
