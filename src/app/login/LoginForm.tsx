"use client";

import { Icon } from "@iconify/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      router.replace("/");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "linear-gradient(145deg, #062A4F 0%, #0B3B70 55%, #0176D3 140%)", fontFamily: "Inter, system-ui, sans-serif" }}>
      <section style={{ width: "min(420px, 100%)", borderRadius: 16, background: "#fff", padding: 28, boxShadow: "0 28px 80px rgba(0,0,0,.3)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, display: "grid", placeItems: "center", background: "#0176D3", color: "#fff", marginBottom: 20 }}>
          <Icon icon="lucide:cloud" width={25} height={25} />
        </div>
        <p style={{ margin: 0, color: "#0176D3", fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>CRM · AI Edition</p>
        <h1 style={{ margin: "8px 0 6px", color: "#111827", fontSize: 25, lineHeight: 1.2 }}>Sign in to continue</h1>
        <p style={{ margin: "0 0 22px", color: "#6B7280", fontSize: 13, lineHeight: 1.55 }}>Access is limited to authorized accounts.</p>

        <form onSubmit={submit}>
          <label htmlFor="username" style={{ display: "block", color: "#374151", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={event => setUsername(event.target.value)}
            style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 11px", color: "#111827", outlineColor: "#0176D3", fontSize: 13, marginBottom: 14 }}
          />

          <label htmlFor="password" style={{ display: "block", color: "#374151", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 11px", color: "#111827", outlineColor: "#0176D3", fontSize: 13 }}
          />

          {error && (
            <div role="alert" style={{ marginTop: 14, border: "1px solid #FCA5A5", borderRadius: 8, background: "#FEF2F2", color: "#B91C1C", padding: "9px 10px", fontSize: 11, lineHeight: 1.45 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !username || !password}
            style={{ width: "100%", marginTop: 18, border: 0, borderRadius: 8, background: submitting || !username || !password ? "#93C5FD" : "#0176D3", color: "#fff", padding: "11px 14px", cursor: submitting || !username || !password ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 800 }}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

