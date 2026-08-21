import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LEGAL_NAV, type LegalPageMeta } from "@/lib/legal-pages";
import type { TocItem } from "@/lib/html";
import { SITE } from "@/lib/types";

interface LegalPageProps {
  title: string;
  slug: string;
  contentHtml: string;
  meta: LegalPageMeta;
  sections: TocItem[];
}

export function LegalPage({
  title,
  slug,
  contentHtml,
  meta,
  sections,
}: LegalPageProps) {
  const displayTitle =
    LEGAL_NAV.find((item) => item.slug === slug)?.label ?? title;

  return (
    <div className="bg-[#fffdf9]">
      <section className="border-b border-border bg-[radial-gradient(circle_at_top,#fff7ef_0%,#fffdf9_55%,#f8f2ea_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:py-16">
          <Breadcrumbs
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: displayTitle },
            ]}
          />
          <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">
            Legal information
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl text-[#8b1a1a] sm:text-5xl">
            {displayTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Important policies about how {SITE.name} works, how we handle your
            data, and the terms for using our recipes and website.
          </p>

          {(meta.effectiveDate || meta.lastUpdated) && (
            <dl className="mt-8 flex flex-wrap gap-3">
              {meta.effectiveDate ? (
                <div className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm">
                  <dt className="inline font-semibold text-foreground">
                    Effective date:{" "}
                  </dt>
                  <dd className="inline text-muted">{meta.effectiveDate}</dd>
                </div>
              ) : null}
              {meta.lastUpdated ? (
                <div className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm">
                  <dt className="inline font-semibold text-foreground">
                    Last updated:{" "}
                  </dt>
                  <dd className="inline text-muted">{meta.lastUpdated}</dd>
                </div>
              ) : null}
            </dl>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:py-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Legal pages" className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Legal pages
            </p>
            <ul className="mt-4 space-y-1">
              {LEGAL_NAV.map((item) => {
                const active = item.slug === slug;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/${item.slug}/`}
                      className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-[#faf4eb] font-semibold text-accent"
                          : "text-muted hover:bg-[#faf4eb]/60 hover:text-foreground"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {sections.length > 0 ? (
            <nav
              aria-label="On this page"
              className="mt-6 hidden rounded-2xl border border-border bg-white p-5 shadow-sm lg:block"
            >
              <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                On this page
              </p>
              <ul className="mt-4 max-h-[28rem] space-y-1 overflow-y-auto text-sm">
                {sections.map((section) => (
                  <li key={section.href}>
                    <a
                      href={section.href}
                      className="block rounded-lg px-2 py-1.5 text-muted transition hover:bg-[#faf4eb]/60 hover:text-accent"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>

        <article className="min-w-0">
          <div
            className="prose-legal rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-10"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div className="mt-8 rounded-2xl border border-border bg-[#faf4eb] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#8b1a1a]">
              Questions about these policies?
            </h2>
            <p className="mt-3 text-muted">
              If anything here is unclear, Grandma Millie and the team are happy
              to help.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact-us/"
                className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-accent-dark hover:!text-white"
              >
                Contact us
              </Link>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
