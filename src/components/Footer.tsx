import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/types";

const footerLinks = [
  { href: "/about-us/", label: "About Us" },
  { href: "/how-we-test-recipes/", label: "How We Test Recipes" },
  { href: "/contact-us/", label: "Contact Us" },
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/disclaimers/", label: "Disclaimers" },
  { href: "/affiliate-disclosure/", label: "Affiliate Disclosure" },
  { href: "/terms-of-service/", label: "Terms of Service" },
  {
    href: "/gdpr-ccpa-privacy-policy-for-grandma-recipe/",
    label: "GDPR & CCPA",
  },
];

const SOCIAL_ICONS: Record<string, ReactNode> = {
  Facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9c0-.6.4-1 1-1Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  ),
  Pinterest: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.2-1.8 0-2.6l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.1-.9 3.3-.2.9.5 1.7 1.4 1.7 1.7 0 2.9-2.1 2.9-4.6 0-1.9-1.3-3.3-3.6-3.3-2.6 0-4.2 1.9-4.2 4.1 0 .8.2 1.4.6 1.9.1.1.1.2.1.3l-.2.9c0 .1-.1.2-.3.1-1.2-.5-1.8-1.9-1.8-3.4 0-2.5 2.1-5.5 6.3-5.5 3.4 0 5.6 2.4 5.6 5.1 0 3.5-1.9 6.1-4.8 6.1-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.8-.8 1.8-1.2 2.4A9 9 0 1 0 12 3Z" />
    </svg>
  ),
  Tumblr: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M14.6 20.8c-3.3 0-5.8-1.7-5.8-5.8V10H6.5V7.2C9 6.6 10 4.8 10.2 3h2.7v4.5H16v2.5h-3.1v4.5c0 1.3.7 1.8 1.7 1.8.5 0 1.1-.1 1.6-.3l1 .3c-.4 1.6-1.7 2.5-3.6 2.5Z" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-[#f8f2ea] pb-[4.5rem] lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-serif text-2xl text-accent">{SITE.name}</p>
            <p className="mt-3 max-w-md text-sm text-muted">{SITE.description}</p>
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                Follow along
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SITE.socialLinks.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent"
                      aria-label={social.label}
                    >
                      {SOCIAL_ICONS[social.label]}
                      <span>{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">
              Explore
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted transition hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-6 text-sm text-muted">
          Copyright © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
