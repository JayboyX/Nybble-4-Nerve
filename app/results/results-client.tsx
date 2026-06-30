"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon, IonIconLoader } from "@/components/icon";
import { SocialProofNotifications } from "@/components/social-proof";
import { ProtectionFlow } from "@/components/protection-flow";
import { ShareModal } from "@/components/share-modal";
import { posthog } from "@/components/posthog-provider";
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
    <div style={{ display: "flex", gap: 3 }} role="meter" aria-label={`Risk score ${score} out of 100`} aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
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
  const [showShare, setShowShare] = useState(false);
  const car = `${risk.make} ${risk.model}`;

  // L-008: Track car_checked event
  useEffect(() => {
    posthog.capture("car_checked", {
      make: risk.make, model: risk.model, year: risk.year,
      province: risk.province, risk_level: risk.level, risk_score: risk.score,
    });
  }, []);

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
        <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
          Based on actual claim rejection patterns reported to SAIA. Names withheld for privacy. These are representative examples. Not affiliated with SAPS or any government agency.
        </p>
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

          {/* Right — Protection Flow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <ProtectionFlow risk={risk} />

            {/* Risk summary */}
            <div style={{ ...card, padding: 20 }}>
              <p style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.7, margin: 0 }}>
                In {risk.province}, a <strong>{car}</strong> is stolen every <strong>{risk.minutesApart} minutes</strong>.
                Only <strong>{risk.recoveredPct}%</strong> are recovered.
                {risk.trend !== "STABLE" && (
                  <> Theft is <strong>{risk.trend.toLowerCase()}</strong> at <strong>+{risk.trendPct}%</strong> year-on-year.</>
                )}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Share CTA — J-005 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="pulse-border"
          style={{
            marginTop: 20,
            borderRadius: 10,
            border: "2px solid var(--color-primary)",
            background: "var(--color-primary-pale)",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-primary)", margin: "0 0 2px" }}>
              Know someone with a {car}?
            </p>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: 0 }}>
              Send them this risk alert — it could save their car.
            </p>
          </div>
          <button
            onClick={() => { setShowShare(true); posthog.capture("share_clicked", { make: risk.make, model: risk.model }); }}
            className="heartbeat"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 20px", borderRadius: 8, border: "none",
              background: "var(--color-primary)", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Icon name="warning-outline" size={16} color="#fff" />
            WARN THEM NOW
          </button>
        </motion.div>
      </div>

      {showShare && (
        <ShareModal risk={risk} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
