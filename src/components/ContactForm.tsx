"use client";

import { useState } from "react";
import { SITE } from "@/lib/types";

export function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Message from ${firstName} ${lastName} — Grandma Recipe`,
    );
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\n\n${message}`,
    );

    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-[#f8f2ea] p-8 text-center">
        <p className="font-serif text-2xl text-accent-dark">Thank you, dear!</p>
        <p className="mt-3 text-muted">
          Your email app should open with your message ready to send. If it
          didn&apos;t, write to us directly at{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-accent">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">
            First name
          </span>
          <input
            type="text"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="given-name"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none ring-accent focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">
            Last name
          </span>
          <input
            type="text"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="family-name"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none ring-accent focus:ring-2"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-foreground">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none ring-accent focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-foreground">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none ring-accent focus:ring-2"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark sm:w-auto"
      >
        Send message
      </button>
    </form>
  );
}
