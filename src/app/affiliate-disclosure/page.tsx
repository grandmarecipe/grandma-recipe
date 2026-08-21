import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LEGAL_NAV } from "@/lib/legal-pages";
import { STATIC_PAGE_SEO, buildPageMetadata } from "@/lib/page-seo";
import { buildAffiliateDisclosureJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/types";

export const metadata: Metadata = buildPageMetadata(
  STATIC_PAGE_SEO["affiliate-disclosure"],
  "/affiliate-disclosure/",
);

const sections = [
  {
    id: "what-affiliate-links-mean",
    title: "What affiliate links mean",
    body: `Some posts on ${SITE.name} may include affiliate links. If you click one of those links and make a purchase, we may earn a small commission — at no extra cost to you.`,
  },
  {
    id: "how-we-choose-products",
    title: "How we choose products",
    body: "We only recommend tools, ingredients, or services we genuinely believe can help a home cook. An affiliate relationship never changes our kitchen standards or whether a recipe earns its place on the site.",
  },
  {
    id: "your-cost",
    title: "Your cost",
    body: "Using an affiliate link does not increase the price you pay. Commissions help keep Grandma Millie’s recipes free to read and test.",
  },
  {
    id: "transparency",
    title: "Transparency",
    body: "If a page includes affiliate links, this disclosure applies sitewide. For nutrition estimates, recipe results, and other legal notes, please also read our disclaimers.",
  },
];

export default function AffiliateDisclosurePage() {
  return (
    <div className="bg-[#fffdf9]">
      <JsonLd data={buildAffiliateDisclosureJsonLd()} />

      <section className="border-b border-border bg-[radial-gradient(circle_at_top,#fff7ef_0%,#fffdf9_55%,#f8f2ea_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:py-16">
          <Breadcrumbs
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: "Affiliate Disclosure" },
            ]}
          />
          <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">
            Legal information
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl text-[#8b1a1a] sm:text-5xl">
            Affiliate Disclosure
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            A clear note on how {SITE.name} may earn commissions from links — and
            how that never changes what we recommend from the kitchen.
          </p>
          <dl className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm">
              <dt className="inline font-semibold text-foreground">
                Last updated:{" "}
              </dt>
              <dd className="inline text-muted">August 21, 2026</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:py-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav
            aria-label="Legal pages"
            className="rounded-2xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Legal pages
            </p>
            <ul className="mt-4 space-y-1">
              {LEGAL_NAV.map((item) => {
                const active = item.slug === "affiliate-disclosure";
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
        </aside>

        <article className="min-w-0">
          <div className="space-y-8 rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="font-serif text-2xl text-[#8b1a1a]">
                  {section.title}
                </h2>
                <p className="mt-3 text-lg leading-8 text-muted">{section.body}</p>
              </section>
            ))}
            <p className="text-lg leading-8 text-muted">
              Related reading:{" "}
              <Link
                href="/disclaimers/"
                className="font-semibold text-accent hover:text-accent-dark"
              >
                Disclaimers
              </Link>
              {" · "}
              <Link
                href="/privacy-policy/"
                className="font-semibold text-accent hover:text-accent-dark"
              >
                Privacy Policy
              </Link>
              {" · "}
              <Link
                href="/how-we-test-recipes/"
                className="font-semibold text-accent hover:text-accent-dark"
              >
                How we test recipes
              </Link>
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-[#faf4eb] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#8b1a1a]">
              Questions about these policies?
            </h2>
            <p className="mt-3 text-muted">
              If anything here is unclear, we are happy to help.
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
