import { v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { hashPassword, randomToken, verifyPassword } from "./lib/password";

const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

function allowedAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getSessionUser(
  ctx: QueryCtx | MutationCtx,
  token: string | undefined,
) {
  if (!token) return null;
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (!session) return null;
  if (session.expiresAt < Date.now()) return null;
  return { userId: session.userId, email: session.email };
}

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  token: string | undefined,
) {
  const user = await getSessionUser(ctx, token);
  if (!user) throw new Error("Unauthorized. Please sign in.");
  return user;
}

export const me = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => getSessionUser(ctx, token),
});

export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    const normalized = normalizeEmail(email);
    const allowlist = allowedAdminEmails();

    if (allowlist.size === 0) {
      throw new Error(
        "ADMIN_EMAILS is not set in Convex. Run: npx convex env set ADMIN_EMAILS your@email.com",
      );
    }
    if (!allowlist.has(normalized)) {
      throw new Error("This email is not allowed to become an admin.");
    }
    if (password.length < 10) {
      throw new Error("Password must be at least 10 characters.");
    }

    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();
    if (existing) {
      throw new Error(
        "An admin account already exists for this email. Sign in instead.",
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = await ctx.db.insert("adminUsers", {
      email: normalized,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    const token = randomToken();
    await ctx.db.insert("adminSessions", {
      token,
      userId,
      email: normalized,
      expiresAt: Date.now() + SESSION_MS,
    });

    return { token, email: normalized };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    const normalized = normalizeEmail(email);
    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new Error("Invalid email or password.");
    }

    const allowlist = allowedAdminEmails();
    if (allowlist.size > 0 && !allowlist.has(normalized)) {
      throw new Error("This email is no longer allowed as admin.");
    }

    const token = randomToken();
    await ctx.db.insert("adminSessions", {
      token,
      userId: user._id,
      email: normalized,
      expiresAt: Date.now() + SESSION_MS,
    });

    return { token, email: normalized };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (session) await ctx.db.delete(session._id);
    return { ok: true as const };
  },
});
