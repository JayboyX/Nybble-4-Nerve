"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon, IonIconLoader } from "@/components/icon";
import { SocialProofNotifications } from "@/components/social-proof";
import { ProtectionFlow } from "@/components/protection-flow";
import { ShareModal } from "@/components/share-modal";
import type { RiskResult } from "@/app/lib/risk";

function track(event: string, props: Record<string, unknown>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).__posthog;
    if (ph) ph.capture(event, props);
  } catch { /* non-fatal */ }
}

function RiskMeter({ score, color }: { score: number; color: string }) {
  const filled = Math.round(score / 10);
  return (
    <div style={{ display: "flex", gap: 3 }} role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.18 }}
          style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < filled ? color : "#e5e7eb",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

export function ResultsClient({
  risk,
  levelColor,
  levelBg,
}: {
  risk: RiskResult;
  levelColor: string;
  levelBg: string;
}) {
  const [showShare, setShowShare] = useState(false);
  const car = `${risk.make} ${risk.model}`;

  useEffect(() => {
    track("car_checked", {
      make: risk.make, model: risk.model, year: risk.year,
      province: risk.province, risk_level: risk.level, risk_score: risk.score,
    });
  }, []);

  if (!risk.found) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
        <IonIconLoader />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: 40 }}>
            <Icon name="alert-circle-outline" size={32} color="#9ca3af" />
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "14px 0 6px" }}>No Data Available</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
              We don't have theft statistics for the {car} yet.
            </p>
            <a href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 6,
              background: "#DC2626", color: "#fff",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>
              Try Another Vehicle
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <IonIconLoader />
      <SocialProofNotifications />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 18px", lineHeight: 1.6 }}>
          Based on SAIA claim data. Not affiliated with SAPS or any government agency. Representative examples only.
        </p>

        <div className="results-grid">

          {/* ── Risk Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}
          >
            {/* Header strip */}
            <div style={{
              padding: "16px 20px 14px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Risk Assessment · {risk.province}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                  {car} <span style={{ fontWeight: 400, color: "#9ca3af" }}>{risk.year}</span>
                </p>
              </div>
              <span style={{
                padding: "3px 10px", borderRadius: 20,
                background: levelBg, color: levelColor,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", flexShrink: 0,
              }}>
                {risk.level}
              </span>
            </div>

            {/* Score area */}
            <div style={{ padding: "20px 20px 16px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 52, fontWeight: 800, color: levelColor, lineHeight: 1 }}>{risk.score}</span>
                <span style={{ fontSize: 16, color: "#9ca3af", fontWeight: 300 }}>/100</span>
                {risk.trend !== "STABLE" && (
                  <span style={{
                    marginLeft: 6, padding: "2px 8px", borderRadius: 20,
                    background: "#fef2f2", color: "#DC2626",
                    fontSize: 11, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 3,
                  }}>
                    <Icon name="trending-up-outline" size={11} color="#DC2626" />
                    {risk.trend} +{risk.trendPct}%
                  </span>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <RiskMeter score={risk.score} color={levelColor} />
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid #f3f4f6",
            }}>
              {[
                { value: risk.stolenPerYear.toLocaleString(), label: "Stolen / yr" },
                { value: `${risk.recoveredPct}%`, label: "Recovered" },
                { value: `${risk.gonePct}%`, label: "Gone forever" },
                { value: `${risk.minutesApart}`, label: "Min apart" },
              ].map((s, i, arr) => (
                <div key={s.label} style={{
                  padding: "14px 0", textAlign: "center",
                  borderRight: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <ProtectionFlow risk={risk} />

            {/* Risk summary */}
            <div style={{
              background: "#fff", borderRadius: 8,
              border: "1px solid #e5e7eb", padding: "14px 16px",
            }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>
                In <strong>{risk.province}</strong>, a <strong>{car}</strong> is stolen every{" "}
                <strong>{risk.minutesApart} minutes</strong>. Only{" "}
                <strong style={{ color: "#DC2626" }}>{risk.recoveredPct}%</strong> are recovered.
                {risk.trend !== "STABLE" && (
                  <> Theft is <strong style={{ color: "#DC2626" }}>{risk.trend.toLowerCase()}</strong> at +{risk.trendPct}% year-on-year.</>
                )}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Share CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.18 }}
          style={{
            marginTop: 16,
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 1px" }}>
              Know someone with a {car}?
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
              Send them this risk report — it could save their car.
            </p>
          </div>
          <button
            onClick={() => { setShowShare(true); track("share_clicked", { make: risk.make, model: risk.model }); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 6,
              border: "1px solid #e5e7eb", background: "#fff",
              color: "#374151", fontSize: 13, fontWeight: 600,
              cursor: "pointer", flexShrink: 0,
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#DC2626"; (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLButtonElement).style.color = "#374151"; }}
          >
            <Icon name="logo-whatsapp" size={14} color="currentColor" />
            Share Risk Report
          </button>
        </motion.div>
      </div>

      {showShare && <ShareModal risk={risk} onClose={() => setShowShare(false)} />}
    </div>
  );
}
