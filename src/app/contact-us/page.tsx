import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { buildContactPageJsonLd } from "@/lib/seo";
import { STATIC_PAGE_SEO, buildPageMetadata } from "@/lib/page-seo";
import { SITE } from "@/lib/types";

export const metadata: Metadata = buildPageMetadata(
  STATIC_PAGE_SEO["contact-us"],
  "/contact-us/",
);

const HERO_IMAGE =
  "https://www.grandmarecipe.com/wp-content/uploads/2025/06/Reflection-Cooking-Joy-www.garndmarecipe.com_.jpg";

const reasons = [
  "Ask a question about a recipe",
  "Share a family favorite",
  "Suggest a collaboration",
  "Say hello from your kitchen",
];

export default function ContactUsPage() {
  return (
    <div className="bg-[#fffdf9]">
      <JsonLd data={buildContactPageJsonLd()} />
      <section className="border-b border-border bg-[radial-gradient(circle_at_top,#fff7ef_0%,#fffdf9_55%,#f8f2ea_100%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1fr_1fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">
              Get in touch
            </p>
            <h1 className="mt-3 font-serif text-5xl text-[#8b1a1a] sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              We&apos;d love to hear from you! Whether you have a question about
              a recipe, want to share a family favorite, or just want to say
              hello, we&apos;re here to connect.
            </p>
            <p className="mt-4 max-w-xl leading-8 text-muted">
              At {SITE.name}, we believe in building a warm, food-loving
              community — just like gathering around the kitchen table.
            </p>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border-8 border-white shadow-2xl ring-4 ring-[#e8d4b8]">
            <Image
              src={HERO_IMAGE}
              alt="Grandma Millie smiling while cooking in a sunlit kitchen"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-wide text-accent uppercase">
                Grandma Millie
              </p>
              <p className="mt-3 leading-7 text-muted">
                I&apos;m <strong className="text-foreground">Grandma Millie</strong>
                , and I hope this cozy kitchen corner feels like home — full of
                love, laughter, and recipes passed down from flour-dusted counters
                and handwritten cards.
              </p>
              <Link
                href="/about-us/"
                className="mt-4 inline-block font-semibold text-accent"
              >
                See more about me →
              </Link>
            </div>

            <div className="rounded-3xl border border-border bg-[#f8f2ea] p-6">
              <p className="font-serif text-xl text-accent-dark">Email us</p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-3 block text-lg font-semibold text-accent break-all"
              >
                {SITE.email}
              </a>
              <p className="mt-4 text-sm leading-6 text-muted">
                Reach out anytime for collaborations, feedback, or simply to share
                your love for homemade cooking.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-white p-6">
              <p className="font-serif text-xl text-accent-dark">
                You can write about
              </p>
              <ul className="mt-4 space-y-3 text-muted">
                {reasons.map((reason) => (
                  <li key={reason} className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-3xl text-[#8b1a1a]">Send a message</h2>
            <p className="mt-2 text-muted">
              Fill out the form below and your email app will open with everything
              ready to send.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
