"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAdminAuth } from "./AdminProviders";

function normalizeAdminPath(pathname: string) {
  if (!pathname) return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/** Hard nav avoids App Router soft-nav + trailingSlash redirect loops. */
function hardRedirect(path: string) {
  if (typeof window === "undefined") return;
  const target = path.endsWith("/") ? path : `${path}/`;
  if (normalizeAdminPath(window.location.pathname) === target) return;
  window.location.href = `${window.location.origin}${target}`;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { token, email, setSession, ready } = useAdminAuth();
  const pathname = normalizeAdminPath(usePathname() || "/");
  const logout = useMutation(api.adminAuth.logout);
  // Validate stored token against Convex — stale sessions used to crash
  // articles.list with an uncaught Unauthorized error.
  const me = useQuery(api.adminAuth.me, token ? { token } : "skip");
  const redirectingRef = useRef(false);

  const isAuthPage =
    pathname === "/admin/login/" || pathname === "/admin/signup/";
  const sessionInvalid = Boolean(token && me === null);

  useEffect(() => {
    if (!ready || redirectingRef.current) return;
    if (sessionInvalid) {
      setSession(null);
      if (!isAuthPage) {
        redirectingRef.current = true;
        hardRedirect("/admin/login/");
      }
      return;
    }
    if (!token && !isAuthPage) {
      redirectingRef.current = true;
      hardRedirect("/admin/login/");
      return;
    }
    if (token && me && isAuthPage) {
      redirectingRef.current = true;
      hardRedirect("/admin/home/");
    }
  }, [ready, token, me, sessionInvalid, isAuthPage, setSession]);

  async function handleLogout() {
    if (token) {
      try {
        await logout({ token });
      } catch {
        // still clear local session
      }
    }
    setSession(null);
    hardRedirect("/admin/login/");
  }

  if (!ready || (token && me === undefined && !isAuthPage)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f1e8] text-sm text-[#6b5b4f]">
        Loading admin…
      </div>
    );
  }

  if ((!token || sessionInvalid) && !isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f1e8] text-sm text-[#6b5b4f]">
        Redirecting to sign in…
      </div>
    );
  }

  if (token && me && isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f1e8] text-sm text-[#6b5b4f]">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-[#2c241b]">
      {!isAuthPage ? (
        <header className="border-b border-[#e5d8c8] bg-[#fffdf9]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/home/"
                className="font-serif text-xl text-[#8b1a1a]"
              >
                Grandma Recipe Admin
              </Link>
              <nav className="flex gap-3 text-sm">
                <Link
                  href="/admin/home/"
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
                {process.env.NODE_ENV === "development" ? (
                  <Link
                    href="/admin/keywords-research/"
                    className="text-[#6b5b4f] hover:text-[#8b1a1a]"
                  >
                    Keywords research
                  </Link>
                ) : null}
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
