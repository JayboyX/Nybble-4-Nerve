"use client";

import { motion } from "framer-motion";
import { Icon, IonIconLoader } from "@/components/icon";
import { SocialProofNotifications } from "@/components/social-proof";
import type { RiskResult } from "@/app/lib/risk";

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

function RiskMeter({ score, color }: { score: number; color: string }) {
  const filled = Math.round(score / 10);
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.2 }}
          style={{
            width: "100%",
            height: 8,
            borderRadius: 2,
            backgroundColor: i < filled ? color : "var(--color-border)",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{ ...card, padding: "16px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
        <Icon name={icon} size={18} color="var(--color-text-muted)" />
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text)", marginBottom: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
        {label}
      </div>
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
  const car = `${risk.make} ${risk.model}`;

  if (!risk.found) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
        <IonIconLoader />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
          <div style={{ ...card, padding: 40 }}>
            <Icon name="alert-circle-outline" size={40} color="var(--color-text-muted)" />
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)", margin: "16px 0 8px" }}>
              No Data Available
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              We don't have theft statistics for the {car} yet. We're constantly expanding our database.
            </p>
            <a
              href="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 24px", borderRadius: 8, border: "none",
                backgroundColor: "var(--color-primary)", color: "#fff",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}
            >
              <Icon name="arrow-back-outline" size={16} color="#fff" />
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

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px 100px" }}>
        <div className="results-grid">
          {/* Left — Risk Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ ...card, padding: 24, borderLeft: `4px solid ${levelColor}` }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 2px" }}>Risk Assessment</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>{car} {risk.year}</p>
                <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "2px 0 0" }}>{risk.province}</p>
              </div>
              <div style={{
                padding: "4px 12px", borderRadius: 20,
                backgroundColor: levelBg, color: levelColor,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", flexShrink: 0,
              }}>
                {risk.level}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 48, fontWeight: 800, color: levelColor, lineHeight: 1 }}>{risk.score}</span>
              <span style={{ fontSize: 16, color: "var(--color-text-muted)" }}>/100</span>
              {risk.trend !== "STABLE" && (
                <span style={{
                  marginLeft: 8, padding: "3px 10px", borderRadius: 20,
                  backgroundColor: levelBg, color: levelColor,
                  fontSize: 11, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>
                  <Icon name="trending-up-outline" size={12} color={levelColor} />
                  {risk.trend} +{risk.trendPct}%
                </span>
              )}
            </div>

            <RiskMeter score={risk.score} color={levelColor} />

            {/* Stats grid inside the card */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--color-border)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>{risk.stolenPerYear.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Stolen / yr</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>{risk.recoveredPct}%</div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Recovered</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>{risk.gonePct}%</div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Gone forever</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>{risk.minutesApart}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Min apart</div>
              </div>
            </div>
          </motion.div>

          {/* Right — CTA + Context */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Protection CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ ...card, padding: 24 }}
            >
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", margin: "0 0 4px" }}>
                Is your {car} currently insured?
              </p>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "0 0 16px" }}>
                Schedule a free call with a licensed advisor.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["No — I need protection", "Yes — but I want to compare", "Not sure — help me check"].map((opt, i) => (
                  <a
                    key={opt}
                    href="#lead-form"
                    style={{
                      display: "block",
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: i === 0 ? "none" : "1px solid var(--color-border)",
                      backgroundColor: i === 0 ? "var(--color-primary)" : "#fff",
                      color: i === 0 ? "#fff" : "var(--color-text)",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "center",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {opt}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Risk summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{ ...card, padding: 20 }}
            >
              <p style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.7, margin: 0 }}>
                In {risk.province}, a <strong>{car}</strong> is stolen every <strong>{risk.minutesApart} minutes</strong>.
                Only <strong>{risk.recoveredPct}%</strong> are recovered.
                {risk.trend !== "STABLE" && (
                  <> Theft of this model is <strong>{risk.trend.toLowerCase()}</strong> at <strong>+{risk.trendPct}%</strong> year-on-year.</>
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
