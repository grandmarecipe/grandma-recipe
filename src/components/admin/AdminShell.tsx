"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAdminAuth } from "./AdminProviders";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { token, email, setSession, ready } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useMutation(api.adminAuth.logout);

  const isAuthPage =
    pathname === "/admin/login/" || pathname === "/admin/signup/";

  async function handleLogout() {
    if (token) {
      try {
        await logout({ token });
      } catch {
        // still clear local session
      }
    }
    setSession(null);
    router.replace("/admin/login/");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f1e8] text-sm text-[#6b5b4f]">
        Loading admin…
      </div>
    );
  }

  if (!token && !isAuthPage) {
    if (typeof window !== "undefined") {
      router.replace("/admin/login/");
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f1e8] text-sm text-[#6b5b4f]">
        Redirecting to sign in…
      </div>
    );
  }

  if (token && isAuthPage) {
    if (typeof window !== "undefined") {
      router.replace("/admin/");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-[#2c241b]">
      {!isAuthPage ? (
        <header className="border-b border-[#e5d8c8] bg-[#fffdf9]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-4">
              <Link href="/admin/" className="font-serif text-xl text-[#8b1a1a]">
                Grandma Recipe Admin
              </Link>
              <nav className="flex gap-3 text-sm">
                <Link
                  href="/admin/"
                  className="text-[#6b5b4f] hover:text-[#8b1a1a]"
                >
                  Articles
                </Link>
                <Link
                  href="/admin/generate/"
                  className="text-[#6b5b4f] hover:text-[#8b1a1a]"
                >
                  Generate
                </Link>
                <Link
                  href="/admin/articles/new/"
                  className="text-[#6b5b4f] hover:text-[#8b1a1a]"
                >
                  New article
                </Link>
                <Link
                  href="/"
                  className="text-[#6b5b4f] hover:text-[#8b1a1a]"
                  target="_blank"
                >
                  View site
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[#6b5b4f]">{email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#d4a574] px-3 py-1.5 font-semibold text-[#b8860b]"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
