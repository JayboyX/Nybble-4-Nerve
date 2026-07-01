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
      background: "#f9fafb",
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
        <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
          SafeCheck SA
        </span>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          <span style={{ fontWeight: 600, color: "#111827" }}>Admin sign in</span>
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
              fontSize: 13, color: "#DC2626", margin: 0,
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 6, padding: "10px 14px",
            }}>
              {error}
            </p>
          )}

          <div>
            <label style={{
              display: "block", fontSize: 13, fontWeight: 500,
              color: "#111827", marginBottom: 6,
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
                border: "1px solid #d1d5db", borderRadius: 6,
                background: "#fff", fontSize: 14, color: "#111827",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%", height: 44,
              background: loading || !password ? "#d1d5db" : "#DC2626",
              color: loading || !password ? "#9ca3af" : "#fff",
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
        background: "#111827",
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
