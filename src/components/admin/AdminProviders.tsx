"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const STORAGE_KEY = "grandma-admin-session";

type AdminAuthState = {
  token: string | null;
  email: string | null;
  setSession: (session: { token: string; email: string } | null) => void;
  ready: boolean;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);

let convexClient: ConvexReactClient | null = null;

function getConvexClient() {
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  if (!convexClient) convexClient = new ConvexReactClient(url);
  return convexClient;
}

export function AdminProviders({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => getConvexClient(), []);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token?: string; email?: string };
        if (parsed.token && parsed.email) {
          setToken(parsed.token);
          setEmail(parsed.email);
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  function setSession(session: { token: string; email: string } | null) {
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setEmail(null);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setToken(session.token);
    setEmail(session.email);
  }

  const value: AdminAuthState = { token, email, setSession, ready };

  if (!client) {
    return (
      <div className="mx-auto max-w-lg p-8 text-sm text-red-800">
        Missing <code>NEXT_PUBLIC_CONVEX_URL</code>. Add it to{" "}
        <code>.env.local</code> and restart the dev server.
      </div>
    );
  }

  return (
    <ConvexProvider client={client}>
      <AdminAuthContext.Provider value={value}>
        {children}
      </AdminAuthContext.Provider>
    </ConvexProvider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminProviders");
  }
  return ctx;
}
