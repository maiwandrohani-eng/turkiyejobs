"use client";

import { useState } from "react";

type Props = {
  source?: string;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
};

export function NewsletterSignup({
  source = "resources",
  placeholder = "you@email.com",
  buttonLabel = "Join list",
  className,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }
    setStatus("loading");
    void fetch("/api/newsletter/subscribe", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed, source }),
    })
      .then(async (res) => {
        const data = (await res.json()) as {
          ok?: boolean;
          alreadySubscribed?: boolean;
          error?: unknown;
        };
        if (!res.ok) {
          const err =
            typeof data.error === "string"
              ? data.error
              : res.status === 503
                ? "Signups are not available right now. Please try again later."
                : "Something went wrong. Please try again.";
          setStatus("error");
          setMessage(err);
          return;
        }
        setStatus("success");
        setMessage(
          data.alreadySubscribed
            ? "You’re already on the list — thanks for checking in."
            : "You’re subscribed. We’ll send you weekly digests.",
        );
        setEmail("");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  };

  return (
    <form
      onSubmit={onSubmit}
      className={
        className ??
        "mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
      }
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage(null);
            if (status !== "idle" && status !== "loading") setStatus("idle");
          }}
          disabled={status === "loading"}
          className="input-brand"
        />
        {message ? (
          <p
            className={`text-sm ${
              status === "error" ? "text-red-700" : "text-emerald-800"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary shrink-0 px-6 py-2.5 text-sm"
      >
        {status === "loading" ? "Saving…" : buttonLabel}
      </button>
    </form>
  );
}
