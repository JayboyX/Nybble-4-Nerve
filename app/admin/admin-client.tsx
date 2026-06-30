"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  full_name: string;
  phone: string;
  province: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  risk_score: number;
  risk_level: string;
  preferred_call_time: string;
  consent_given: boolean;
  consent_at: string;
  consent_method: string;
  status: string;
  created_at: string;
};

function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" });
}

function exportCsv(leads: Lead[]) {
  const headers = [
    "Name", "Phone", "Province", "Make", "Model", "Year",
    "Risk Score", "Risk Level", "Call Time", "Consent At", "Status", "Created",
  ];
  const rows = leads.map((l) => [
    l.full_name, l.phone, l.province, l.vehicle_make, l.vehicle_model, l.vehicle_year,
    l.risk_score, l.risk_level, l.preferred_call_time,
    l.consent_at, l.status, l.created_at,
  ].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `safecheck-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 12,
  color: "#d1d5db",
  borderBottom: "1px solid #1f1f1f",
  whiteSpace: "nowrap",
};

const thStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b7280",
  textAlign: "left",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: "1px solid #2a2a2a",
  whiteSpace: "nowrap",
};

export function AdminClient({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const filtered = leads.filter((l) =>
    !search ||
    l.phone.includes(search) ||
    l.full_name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(phone: string) {
    if (!confirm(`Delete ALL leads for phone ${phone}? This cannot be undone.`)) return;
    setDeleting(phone);
    const res = await fetch(`/api/admin/leads?phone=${encodeURIComponent(phone)}`, { method: "DELETE" });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.phone !== phone));
    } else {
      alert("Delete failed");
    }
    setDeleting(null);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const levelColor = (level: string) => {
    if (!level) return "#6b7280";
    if (level === "EXTREME" || level === "CRITICAL") return "#f87171";
    if (level === "ELEVATED") return "#fbbf24";
    if (level === "MODERATE") return "#60a5fa";
    return "#4ade80";
  };

  return (
    <div>
      {/* Top bar */}
      <div style={{
        background: "#111", borderBottom: "1px solid #1f1f1f",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--color-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>SC</span>
          </div>
          <div>
            <span style={{ color: "#f9fafb", fontWeight: 700, fontSize: 14 }}>SafeCheck Admin</span>
            <span style={{ color: "#6b7280", fontSize: 12, marginLeft: 12 }}>
              {leads.length} lead{leads.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => exportCsv(filtered)}
            style={{
              height: 36, padding: "0 16px", borderRadius: 8,
              background: "#1f1f1f", border: "1px solid #2a2a2a",
              color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              height: 36, padding: "0 16px", borderRadius: 8,
              background: "transparent", border: "1px solid #333",
              color: "#9ca3af", fontSize: 12, cursor: "pointer",
            }}
          >
            {loggingOut ? "..." : "Sign out"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1f1f1f" }}>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            height: 40, width: 300, padding: "0 14px",
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            borderRadius: 8, color: "#f9fafb", fontSize: 13, outline: "none",
          }}
        />
        {search && (
          <span style={{ marginLeft: 12, fontSize: 12, color: "#6b7280" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Phone", "Vehicle", "Province", "Risk", "Call Time", "Consent At", "Status", ""].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "#4b5563", padding: "40px 0" }}>
                  No leads found
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead.id} style={{ transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#141414")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={tdStyle}>{lead.full_name}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace" }}>{lead.phone}</td>
                  <td style={tdStyle}>{lead.vehicle_make} {lead.vehicle_model} {lead.vehicle_year}</td>
                  <td style={tdStyle}>{lead.province ?? "—"}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 4,
                      fontSize: 11, fontWeight: 700,
                      color: levelColor(lead.risk_level),
                      background: "rgba(255,255,255,0.05)",
                    }}>
                      {lead.risk_level ?? "—"} {lead.risk_score ? `(${lead.risk_score})` : ""}
                    </span>
                  </td>
                  <td style={tdStyle}>{lead.preferred_call_time ?? "—"}</td>
                  <td style={tdStyle}>{fmt(lead.consent_at)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                      color: lead.status === "new" ? "#60a5fa" : "#4ade80",
                      background: "rgba(255,255,255,0.05)",
                    }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDelete(lead.phone)}
                      disabled={deleting === lead.phone}
                      style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 11,
                        background: "rgba(220,38,38,0.12)",
                        border: "1px solid rgba(220,38,38,0.25)",
                        color: "#f87171", cursor: "pointer",
                      }}
                    >
                      {deleting === lead.phone ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
