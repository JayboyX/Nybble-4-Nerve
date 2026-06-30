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
      background: "#0d0d0d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44,
            background: "var(--color-primary)",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>SC</span>
          </div>
          <h1 style={{ color: "#f9fafb", fontWeight: 700, fontSize: 18, margin: "0 0 4px" }}>
            SafeCheck Admin
          </h1>
          <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
            Lead management dashboard
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 16,
          padding: 24,
        }}>
          {error && (
            <div style={{
              marginBottom: 16,
              padding: "10px 14px",
              background: "rgba(220,38,38,0.12)",
              border: "1px solid rgba(220,38,38,0.3)",
              borderRadius: 8,
              fontSize: 13,
              color: "#fca5a5",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600,
                color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="Enter password"
                style={{
                  width: "100%", height: 44,
                  background: "#222", border: "1px solid #333",
                  borderRadius: 8, padding: "0 14px",
                  fontSize: 14, color: "#f9fafb", outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "#333")}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: "100%", height: 44,
                background: loading || !password ? "#333" : "var(--color-primary)",
                color: loading || !password ? "#6b7280" : "#fff",
                border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: loading || !password ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#374151", marginTop: 20 }}>
          SafeCheck SA &mdash; Powered by Nerve &mdash; IDT
        </p>
      </div>
    </div>
  );
}
