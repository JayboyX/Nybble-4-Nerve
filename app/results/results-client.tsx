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
    <div style={{ display: "flex", gap: 4 }} role="meter" aria-label={`Risk score ${score} out of 100`} aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4 + i * 0.06, duration: 0.2 }}
          style={{
            flex: 1, height: 6, borderRadius: 3,
            backgroundColor: i < filled ? color : "rgba(255,255,255,0.2)",
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
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: 40 }}>
            <Icon name="alert-circle-outline" size={40} color="#6b7280" />
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "16px 0 8px" }}>
              No Data Available
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              We don't have theft statistics for the {car} yet.
            </p>
            <a href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 24px", borderRadius: 8, border: "none",
              backgroundColor: "#DC2626", color: "#fff",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
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

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 20px", lineHeight: 1.6 }}>
          Based on actual SAIA claim data. Not affiliated with SAPS or any government agency.
        </p>

        <div className="results-grid">

          {/* ── Left: Risk Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
          >
            {/* Dark header */}
            <div style={{ background: "#1E3A5F", padding: "28px 28px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Risk Assessment · {risk.province}
                  </p>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                    {car}
                    <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.5)", marginLeft: 8 }}>{risk.year}</span>
                  </h1>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 20, flexShrink: 0,
                  background: levelBg, color: levelColor,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                }}>
                  {risk.level}
                </div>
              </div>

              {/* Score */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 64, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{risk.score}</span>
                <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>/100</span>
                {risk.trend !== "STABLE" && (
                  <span style={{
                    marginLeft: 4, padding: "3px 10px", borderRadius: 20,
                    background: "rgba(220,38,38,0.2)", color: "#fca5a5",
                    fontSize: 11, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 4,
                  }}>
                    <Icon name="trending-up-outline" size={12} color="#fca5a5" />
                    {risk.trend} +{risk.trendPct}%
                  </span>
                )}
              </div>

              <RiskMeter score={risk.score} color={levelColor} />
            </div>

            {/* Stats row */}
            <div style={{
              background: "#fff",
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "none",
            }}>
              {[
                { value: risk.stolenPerYear.toLocaleString(), label: "Stolen / yr" },
                { value: `${risk.recoveredPct}%`, label: "Recovered" },
                { value: `${risk.gonePct}%`, label: "Gone forever" },
                { value: `${risk.minutesApart}`, label: "Min apart" },
              ].map((stat, i, arr) => (
                <div key={stat.label} style={{
                  padding: "20px 0", textAlign: "center",
                  borderRight: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 2 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Protection + Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <ProtectionFlow risk={risk} />

            {/* Risk summary */}
            <div style={{
              background: "#fff", borderRadius: 10,
              border: "1px solid #e5e7eb", padding: "16px 20px",
            }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>
                In <strong>{risk.province}</strong>, a <strong>{car}</strong> is stolen every{" "}
                <strong>{risk.minutesApart} minutes</strong>. Only{" "}
                <strong style={{ color: "#DC2626" }}>{risk.recoveredPct}%</strong> are recovered.
                {risk.trend !== "STABLE" && (
                  <> Theft is <strong style={{ color: "#DC2626" }}>{risk.trend.toLowerCase()}</strong> at +{risk.trendPct}% this year.</>
                )}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Share CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          style={{
            marginTop: 20,
            background: "#1E3A5F",
            borderRadius: 10,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>
              Know someone with a {car}?
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>
              Send them this risk alert — it could save their car.
            </p>
          </div>
          <button
            onClick={() => { setShowShare(true); track("share_clicked", { make: risk.make, model: risk.model }); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 20px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)", color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
              backdropFilter: "blur(4px)",
            }}
          >
            <Icon name="logo-whatsapp" size={16} color="#fff" />
            Share Risk Alert
          </button>
        </motion.div>
      </div>

      {showShare && (
        <ShareModal risk={risk} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
