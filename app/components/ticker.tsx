"use client";

import { Icon } from "./icon";

const INCIDENTS = [
  "Toyota Hilux stolen — Midrand, Gauteng — 14 min ago",
  "VW Polo hijacked — Berea, Durban — 22 min ago",
  "Ford Ranger recovered (stripped) — Mamelodi, Pretoria — 38 min ago",
  "Hyundai Tucson stolen — Parow, Cape Town — 51 min ago",
  "Toyota Fortuner hijacked — Fourways, Johannesburg — 1hr ago",
  "Nissan NP200 stolen — Nelspruit, Mpumalanga — 1hr ago",
  "BMW 3 Series hijacked — Sandton, Gauteng — 2hr ago",
  "Kia Seltos stolen — Centurion, Gauteng — 2hr ago",
];

export function Ticker() {
  const doubled = [...INCIDENTS, ...INCIDENTS];

  return (
    <div style={{ width: "100%", overflow: "hidden", background: "#111827", color: "#f9fafb" }}>
      <div
        style={{
          padding: "6px 16px",
          fontSize: 11,
          color: "#9ca3af",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Icon name="information-circle-outline" size={14} color="#9ca3af" />
        Representative crime scenarios — not live incident reports
      </div>
      <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
        <div className="animate-ticker" style={{ display: "flex", whiteSpace: "nowrap", gap: 48, fontSize: 13 }}>
          {doubled.map((text, i) => (
            <span key={i} style={{ display: "inline-block", padding: "0 16px" }}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
