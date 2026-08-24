"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useAdminAuth } from "@/components/admin/AdminProviders";

export default function AdminSignupPage() {
  const signup = useMutation(api.adminAuth.signup);
  const { setSession } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await signup({ email, password });
      setSession(result);
      router.replace("/admin/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#e5d8c8] bg-white p-6 shadow-sm">
      <h1 className="font-serif text-3xl text-[#8b1a1a]">Create admin</h1>
      <p className="mt-2 text-sm text-[#6b5b4f]">
        Signup works only for emails listed in Convex{" "}
        <code className="rounded bg-[#f6ebdf] px-1">ADMIN_EMAILS</code>.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">Admin email</span>
          <input
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-[#e5d8c8] px-3 py-2.5"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">
            Password (min 10 characters)
          </span>
          <input
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className="w-full rounded-xl border border-[#e5d8c8] px-3 py-2.5"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[#5a822b] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create admin account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[#6b5b4f]">
        Already have an account?{" "}
        <Link href="/admin/login/" className="font-semibold text-[#8b1a1a]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
