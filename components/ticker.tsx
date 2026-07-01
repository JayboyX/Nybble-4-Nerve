"use client";

import { useState, useEffect } from "react";

const BASE_INCIDENTS = [
  "Toyota Hilux stolen — Midrand, Gauteng — 14 min ago",
  "VW Polo hijacked — Berea, Durban — 22 min ago",
  "Ford Ranger recovered (stripped) — Mamelodi, Pretoria — 38 min ago",
  "Hyundai Tucson stolen — Parow, Cape Town — 51 min ago",
  "Toyota Fortuner hijacked — Fourways, Johannesburg — 1hr ago",
  "Nissan NP200 stolen — Nelspruit, Mpumalanga — 1hr ago",
  "BMW 3 Series hijacked — Sandton, Gauteng — 2hr ago",
  "Kia Seltos stolen — Centurion, Gauteng — 2hr ago",
];

const DYNAMIC_VEHICLES = [
  "Toyota Corolla", "VW Golf", "Renault Kiger", "Haval H6",
  "Suzuki Swift", "Ford Fiesta", "Nissan Magnite", "Kia Sportage",
  "Toyota Urban Cruiser", "Mercedes C200", "BMW X3", "Hyundai i20",
];

const DYNAMIC_LOCATIONS = [
  "Roodepoort, Gauteng", "Pinetown, KZN", "Bellville, Cape Town",
  "Polokwane, Limpopo", "Boksburg, Gauteng", "East London, EC",
  "Alberton, Gauteng", "Mitchells Plain, Cape Town", "Umlazi, KZN",
  "Soshanguve, Pretoria", "Krugersdorp, Gauteng", "Port Elizabeth, EC",
];

const INCIDENT_TYPES = ["stolen", "hijacked", "recovered (stripped)", "reported missing"];

let minAgo = 3;

function generateIncident(): string {
  const vehicle = DYNAMIC_VEHICLES[Math.floor(Math.random() * DYNAMIC_VEHICLES.length)];
  const location = DYNAMIC_LOCATIONS[Math.floor(Math.random() * DYNAMIC_LOCATIONS.length)];
  const type = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
  const time = minAgo <= 1 ? "just now" : `${minAgo} min ago`;
  minAgo = Math.max(1, minAgo - Math.floor(Math.random() * 2));
  return `${vehicle} ${type} — ${location} — ${time}`;
}

export function Ticker() {
  const [items, setItems] = useState<string[]>(BASE_INCIDENTS);

  // Add 2-3 new incidents every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newItems = [generateIncident(), generateIncident()];
      if (Math.random() > 0.5) newItems.push(generateIncident());
      setItems((prev) => [...newItems, ...prev].slice(0, 20));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="scanline-host" style={{ width: "100%", overflow: "hidden", background: "var(--color-primary-dark)", color: "#fff", display: "flex", alignItems: "stretch" }}>
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
        padding: "0 12px", background: "var(--color-primary)",
        borderRight: "1px solid rgba(255,255,255,0.2)",
        fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", whiteSpace: "nowrap",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} className="pulse-border" />
        PUBLIC DATA
      </div>
      <div style={{ position: "relative", height: 32, flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div
          key={items.length}
          className="animate-ticker"
          style={{ display: "flex", whiteSpace: "nowrap", gap: 48, fontSize: 13 }}
        >
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
