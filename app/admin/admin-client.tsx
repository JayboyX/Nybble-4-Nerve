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

const levelColor = (level: string) => {
  if (!level) return "#6b7280";
  if (level === "EXTREME" || level === "CRITICAL") return "#f87171";
  if (level === "ELEVATED") return "#fbbf24";
  if (level === "MODERATE") return "#60a5fa";
  return "#4ade80";
};

export function AdminClient({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "converted">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const filtered = leads.filter((l) => {
    const matchSearch = !search ||
      l.phone.includes(search) ||
      l.full_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

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

  const statCards = [
    { label: "Total Leads", value: stats.total, color: "#f9fafb" },
    { label: "New", value: stats.newLeads, color: "#60a5fa" },
    { label: "Contacted", value: stats.contacted, color: "#fbbf24" },
    { label: "Converted", value: stats.converted, color: "#4ade80" },
  ];

  const filterTabs: { label: string; value: "all" | "new" | "contacted" | "converted" }[] = [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Converted", value: "converted" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f9fafb" }}>

      {/* Top bar */}
      <div style={{
        borderBottom: "1px solid #1e1e1e",
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: "var(--color-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>SC</span>
          </div>
          <span style={{ color: "#f9fafb", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
            SafeCheck Admin
          </span>
          <span style={{
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            borderRadius: 20, padding: "2px 10px",
            fontSize: 11, color: "#666", marginLeft: 4,
          }}>
            {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => exportCsv(filtered)}
            style={{
              height: 32, padding: "0 14px", borderRadius: 6,
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              color: "#aaa", fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#222")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a")}
          >
            Export CSV
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              height: 32, padding: "0 14px", borderRadius: 6,
              background: "transparent", border: "1px solid #2a2a2a",
              color: "#666", fontSize: 12, cursor: "pointer",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#aaa")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#666")}
          >
            {loggingOut ? "..." : "Sign out"}
          </button>
        </div>
      </div>

      <div style={{ padding: "24px" }}>

        {/* Stat cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}>
          {statCards.map((s) => (
            <div key={s.label} style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 12,
              padding: "16px 20px",
            }}>
              <p style={{ fontSize: 11, color: "#666", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                {s.label}
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap",
        }}>
          {/* Status tabs */}
          <div style={{
            display: "flex", gap: 2,
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            borderRadius: 8, padding: 3,
          }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                style={{
                  height: 28, padding: "0 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: "none", cursor: "pointer", transition: "all 0.15s",
                  background: statusFilter === tab.value ? "#fff" : "transparent",
                  color: statusFilter === tab.value ? "#111" : "#666",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: 36, padding: "0 14px",
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              borderRadius: 8, color: "#f9fafb", fontSize: 13, outline: "none",
              width: 240, transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
          />
          {search && (
            <span style={{ fontSize: 12, color: "#555" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Table card */}
        <div style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Name", "Phone", "Vehicle", "Province", "Risk", "Call Time", "Consent At", "Status", ""].map((h) => (
                    <th key={h} style={{
                      padding: "10px 16px",
                      fontSize: 11, fontWeight: 600, color: "#555",
                      textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "1px solid #2a2a2a", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{
                      padding: "48px 0", textAlign: "center",
                      fontSize: 13, color: "#444",
                    }}>
                      {search || statusFilter !== "all" ? "No leads match this filter" : "No leads yet"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead, idx) => (
                    <tr
                      key={lead.id}
                      style={{ transition: "background 0.1s", borderBottom: idx < filtered.length - 1 ? "1px solid #222" : "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#202020")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "10px 16px", fontSize: 13, color: "#e5e7eb", whiteSpace: "nowrap" }}>
                        {lead.full_name}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "#aaa", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                        {lead.phone}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "#d1d5db", whiteSpace: "nowrap" }}>
                        {lead.vehicle_make} {lead.vehicle_model} {lead.vehicle_year}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {lead.province ?? "—"}
                      </td>
                      <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4,
                          fontSize: 11, fontWeight: 700,
                          color: levelColor(lead.risk_level),
                          background: "rgba(255,255,255,0.05)",
                        }}>
                          {lead.risk_level ?? "—"} {lead.risk_score ? `(${lead.risk_score})` : ""}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {lead.preferred_call_time ?? "—"}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
                        {fmt(lead.consent_at)}
                      </td>
                      <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                          color: lead.status === "new" ? "#60a5fa" : lead.status === "contacted" ? "#fbbf24" : "#4ade80",
                          background: "rgba(255,255,255,0.05)",
                        }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => handleDelete(lead.phone)}
                          disabled={deleting === lead.phone}
                          style={{
                            padding: "4px 10px", borderRadius: 6, fontSize: 11,
                            background: "rgba(220,38,38,0.1)",
                            border: "1px solid rgba(220,38,38,0.2)",
                            color: "#f87171", cursor: "pointer", transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.2)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.1)")}
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

      </div>
    </div>
  );
}
