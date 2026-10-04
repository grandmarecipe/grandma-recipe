import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { AdSenseConsent } from "@/components/AdSenseConsent";
import { AdSenseLoader } from "@/components/AdSenseLoader";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { GtmPageView } from "@/components/GtmPageView";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { JsonLd } from "@/components/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/seo";
import { HOME_SEO } from "@/lib/page-seo";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { SITE } from "@/lib/types";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: HOME_SEO.title,
    template: `%s | ${SITE.name}`,
  },
  description: HOME_SEO.description,
  alternates: {
    canonical: `${SITE.url}/`,
  },
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [
      {
        url: SITE.defaultOgImage,
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [SITE.defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <AdSenseConsent />
        <GoogleTagManager />
        <Suspense fallback={null}>
          <GtmPageView />
        </Suspense>
        <AdSenseLoader />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            ...buildOrganizationJsonLd(),
          }}
        />
        <Header />
        <main className="pb-[4.5rem] lg:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
        <CookieConsent />
      </body>
    </html>
  );
}
