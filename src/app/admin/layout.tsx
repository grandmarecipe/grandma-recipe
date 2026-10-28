import type { Metadata } from "next";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  // Do not inherit the marketing homepage canonical — that confused
  // some embedded browsers on /admin/ (ERR_TOO_MANY_REDIRECTS).
  alternates: {
    canonical: "/admin/home/",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
