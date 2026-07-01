"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Story = {
  location: string;
  car: string;
  summary: string;
};

type FeedItem = Story & { id: string; type: "theft" | "hijack" };

const THEFT_TEMPLATES = [
  (car: string, loc: string) => `${car} stolen from ${loc} parking lot. Owner returned to find empty space. No CCTV footage available.`,
  (car: string, loc: string) => `${car} taken from outside ${loc} in under 3 minutes. Tracker disabled before unit could respond.`,
  (car: string, loc: string) => `Unattended ${car} stolen from ${loc} driveway. Insurer required police case within 24 hours.`,
  (car: string, loc: string) => `${car} not recovered after theft in ${loc}. Finance institution still demanding full monthly instalments.`,
  (car: string, loc: string) => `${car} stripped and abandoned in ${loc} informal settlement 6 days after theft. Written off by insurer.`,
];

const HIJACK_TEMPLATES = [
  (car: string, loc: string) => `${car} hijacked at gunpoint at traffic light in ${loc}. Driver unharmed. Vehicle crossed border within 4 hours.`,
  (car: string, loc: string) => `Armed hijacking in ${loc} — ${car} taken at shopping centre entrance. Second incident this week at same spot.`,
  (car: string, loc: string) => `${car} hijacked in ${loc} during morning commute. Suspects had inside knowledge of route. Vehicle never recovered.`,
  (car: string, loc: string) => `Coordinated hijacking in ${loc}: ${car} blocked by two vehicles. Driver forced out at knifepoint.`,
  (car: string, loc: string) => `${car} hijacked from ${loc} petrol station forecourt. Suspects fled through a pre-planned escape route.`,
];

const VEHICLES = [
  "Toyota Hilux", "VW Polo", "Toyota Fortuner", "Ford Ranger",
  "Hyundai Tucson", "BMW 3 Series", "Kia Seltos", "Toyota Corolla",
  "Nissan NP200", "Renault Kiger", "Haval H6", "Mercedes C-Class",
];

const LOCATIONS = [
  "Sandton", "Midrand", "Centurion", "Roodepoort", "Boksburg",
  "Umhlanga", "Pinetown", "Bellville", "Parow", "Nelspruit",
  "Polokwane", "East London", "Soweto", "Alexandra", "Fourways",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let idCounter = 0;
function makeId() {
  return `feed-${Date.now()}-${idCounter++}`;
}

function generateTheft(): FeedItem {
  const car = randomFrom(VEHICLES);
  const loc = randomFrom(LOCATIONS);
  const tmpl = randomFrom(THEFT_TEMPLATES);
  return { id: makeId(), type: "theft", location: loc, car, summary: tmpl(car, loc) };
}

function generateHijack(): FeedItem {
  const car = randomFrom(VEHICLES);
  const loc = randomFrom(LOCATIONS);
  const tmpl = randomFrom(HIJACK_TEMPLATES);
  return { id: makeId(), type: "hijack", location: loc, car, summary: tmpl(car, loc) };
}

export function LiveFeed({ initialStories }: { initialStories: Story[] }) {
  const [activeTab, setActiveTab] = useState<"theft" | "hijack">("theft");
  const [theftItems, setTheftItems] = useState<FeedItem[]>(() =>
    initialStories.map((s) => ({ ...s, id: makeId(), type: "theft" as const }))
  );
  const [hijackItems, setHijackItems] = useState<FeedItem[]>(() =>
    [generateHijack(), generateHijack(), generateHijack()]
  );

  const theftRef = useRef(theftItems);
  const hijackRef = useRef(hijackItems);
  theftRef.current = theftItems;
  hijackRef.current = hijackItems;

  useEffect(() => {
    const interval = setInterval(() => {
      setTheftItems((prev) => [generateTheft(), ...prev].slice(0, 8));
      setHijackItems((prev) => [generateHijack(), ...prev].slice(0, 8));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const items = activeTab === "theft" ? theftItems : hijackItems;

  const tabStyle = (tab: "theft" | "hijack"): React.CSSProperties => ({
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: activeTab === tab ? "var(--color-primary)" : "transparent",
    color: activeTab === tab ? "#fff" : "var(--color-text-muted)",
    transition: "background 0.15s, color 0.15s",
  });

  return (
    <div>
      <div className="live-feed-header">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
          Live Feed
        </h2>
        <div
          role="tablist"
          aria-label="Feed category"
          style={{
            display: "flex", gap: 4, padding: 4, borderRadius: 8,
            background: "var(--color-background)", border: "1px solid var(--color-border)",
          }}
        >
          <button
            role="tab"
            aria-selected={activeTab === "theft"}
            style={tabStyle("theft")}
            onClick={() => setActiveTab("theft")}
          >
            Theft Reports
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "hijack"}
            style={tabStyle("hijack")}
            onClick={() => setActiveTab("hijack")}
          >
            Hijacking Alerts
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 200 }}>
        <AnimatePresence initial={false}>
          {items.slice(0, 4).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "var(--color-surface)",
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                padding: "14px 16px",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: activeTab === "theft" ? "var(--color-primary-pale)" : "var(--color-warning-bg)",
                  color: activeTab === "theft" ? "var(--color-primary)" : "var(--color-warning)",
                }}>
                  {item.location}
                </span>
                <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{item.car}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.6, margin: 0 }}>
                {item.summary}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "12px 0 0", lineHeight: 1.6 }}>
        Based on actual claim rejection patterns reported to SAIA. Names withheld for privacy. These are representative examples.
      </p>
    </div>
  );
}
