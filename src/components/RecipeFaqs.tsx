import type { FaqItem } from "@/lib/schema-data";

interface RecipeFaqsProps {
  faqs: FaqItem[];
}

export function RecipeFaqs({ faqs }: RecipeFaqsProps) {
  if (faqs.length === 0) return null;

  return (
    <section id="faqs" className="mt-14 scroll-mt-36">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">
        Quick answers
      </p>
      <h2 className="mt-2 font-serif text-3xl text-[#8b1a1a]">
        Frequently asked questions
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Straight answers from the kitchen — storage, swaps, and common sticking
        points for this recipe.
      </p>

      <div className="mt-6 space-y-3">
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
    </section>
  );
}
