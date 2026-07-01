"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-background)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.01em" }}>
          SafeCheck SA
        </span>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>
          <span style={{ fontWeight: 600, color: "var(--color-text)" }}>Admin sign in</span>
          {" · "}Lead management dashboard
        </p>
      </div>

      {/* Centered form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px", position: "relative", zIndex: 10,
      }}>
        <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 18 }}>

          {error && (
            <p style={{
              fontSize: 13, color: "var(--color-primary-light)", margin: 0,
              background: "var(--color-primary-pale)", border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 6, padding: "10px 14px",
            }}>
              {error}
            </p>
          )}

          <div>
            <label style={{
              display: "block", fontSize: 13, fontWeight: 500,
              color: "var(--color-text)", marginBottom: 6,
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="••••••••"
              style={{
                width: "100%", height: 44, padding: "0 14px",
                border: "1px solid var(--color-border)", borderRadius: 6,
                background: "var(--color-surface-raised)", fontSize: 14, color: "var(--color-text)",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%", height: 44,
              background: loading || !password ? "var(--color-surface-raised)" : "var(--color-primary)",
              color: loading || !password ? "var(--color-text-muted)" : "#fff",
              border: "none", borderRadius: 6,
              fontSize: 14, fontWeight: 600,
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "background 0.15s, opacity 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      {/* Footer bar */}
      <div style={{
        background: "var(--color-surface-dark)",
        padding: "12px 40px",
        textAlign: "right",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
          &copy; {new Date().getFullYear()} SafeCheck SA &mdash; Powered by Nerve &mdash; IDT
        </span>
      </div>
    </div>
  );
}
