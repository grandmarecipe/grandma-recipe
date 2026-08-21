import Link from "next/link";
import type { FaqItem } from "@/lib/schema-data";

interface SiteFaqsProps {
  faqs: FaqItem[];
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function SiteFaqs({
  faqs,
  id = "faqs",
  eyebrow = "Quick answers",
  title = "Frequently asked questions",
  description,
}: SiteFaqsProps) {
  if (faqs.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-36 border-t border-border bg-[#f8f2ea]">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-[#8b1a1a]">{title}</h2>
        {description ? (
          <p className="mt-3 text-muted">{description}</p>
        ) : null}

        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-border bg-white open:bg-[#fffdf9]"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-serif text-lg text-[#8b1a1a] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent transition group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <div className="border-t border-border px-5 py-4 leading-7 text-muted">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <Link
            href="/about-us/#grandma-millie"
            className="text-accent transition hover:text-accent-dark"
          >
            About Millie →
          </Link>
          <Link
            href="/how-we-test-recipes/"
            className="text-accent transition hover:text-accent-dark"
          >
            How we test →
          </Link>
          <Link
            href="/affiliate-disclosure/"
            className="text-accent transition hover:text-accent-dark"
          >
            Affiliate disclosure →
          </Link>
          <Link
            href="/contact-us/"
            className="text-accent transition hover:text-accent-dark"
          >
            Contact →
          </Link>
        </div>
      </div>
    </section>
  );
}
