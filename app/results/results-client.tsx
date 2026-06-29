"use client";

import { motion } from "framer-motion";
import { Icon, IonIconLoader } from "../components/icon";
import { SocialProofNotifications } from "../components/social-proof";
import { FearAccordion } from "../components/fear-accordion";
import type { RiskResult } from "../lib/risk";

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
    <div style={{ ...card, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
        <Icon name={icon} size={18} color="var(--color-text-muted)" />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)", marginBottom: 2 }}>
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
  stories,
  levelColor,
  levelBg,
}: {
  risk: RiskResult;
  stories: string[];
  levelColor: string;
  levelBg: string;
}) {
  const car = `${risk.make} ${risk.model}`;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <IonIconLoader />
      <SocialProofNotifications />

      {/* Risk Card + Protection CTA — must fit first screen on mobile */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 0" }}>

        {/* Risk Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            ...card,
            padding: "20px",
            borderLeft: `4px solid ${levelColor}`,
          }}
        >
          {/* Vehicle + Level */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 2px" }}>
                Risk Assessment
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                {car} {risk.year}
              </p>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "2px 0 0" }}>
                {risk.province}
              </p>
            </div>
            <div style={{
              padding: "4px 10px",
              borderRadius: 20,
              backgroundColor: levelBg,
              color: levelColor,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}>
              {risk.level}
            </div>
          </div>

          {/* Score */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: levelColor, lineHeight: 1 }}>
              {risk.score}
            </span>
            <span style={{ fontSize: 14, color: "var(--color-text-muted)" }}>/100</span>
            {risk.trend !== "STABLE" && (
              <span style={{
                marginLeft: 8,
                padding: "2px 8px",
                borderRadius: 20,
                backgroundColor: levelBg,
                color: levelColor,
                fontSize: 10,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
              }}>
                <Icon name="trending-up-outline" size={12} color={levelColor} />
                {risk.trend} +{risk.trendPct}%
              </span>
            )}
          </div>

          {/* Risk Meter */}
          <RiskMeter score={risk.score} color={levelColor} />
        </motion.div>

        {/* Protection Question */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{ ...card, padding: "16px 20px", marginTop: 12 }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", margin: "0 0 12px" }}>
            Is your {car} currently insured?
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {["Yes", "No", "Not sure"].map((opt) => (
              <a
                key={opt}
                href="#lead-form"
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  backgroundColor: opt === "No" ? "var(--color-primary)" : "#fff",
                  color: opt === "No" ? "#fff" : "var(--color-text)",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                }}
              >
                {opt}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stat Tiles */}
      <div style={{ maxWidth: 560, margin: "16px auto 0", padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          <StatTile label="Stolen / year" value={risk.stolenPerYear.toLocaleString()} icon="car-outline" />
          <StatTile label="Recovered" value={`${risk.recoveredPct}%`} icon="locate-outline" />
          <StatTile label="Gone forever" value={`${risk.gonePct}%`} icon="close-circle-outline" />
          <StatTile label="Min apart" value={`${risk.minutesApart}`} icon="time-outline" />
        </div>
      </div>

      {/* Fear Accordion */}
      <div style={{ maxWidth: 560, margin: "16px auto 0", padding: "0 16px" }}>
        <FearAccordion risk={risk} />
      </div>

      {/* Victim Stories */}
      <div style={{ maxWidth: 560, margin: "16px auto 0", padding: "0 16px 40px" }}>
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--color-border)" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", margin: 0 }}>
              Recent {car} Incidents
            </p>
            <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "2px 0 0" }}>
              Based on reported claims and police records
            </p>
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {stories.map((story, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderBottom: i < stories.length - 1 ? "1px solid var(--color-border)" : "none",
                  fontSize: 13,
                  color: "var(--color-text)",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%",
                    backgroundColor: levelBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <Icon name="alert-circle" size={12} color={levelColor} />
                  </span>
                  <span>{story}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 16px", borderTop: "1px solid var(--color-border)" }}>
            <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: 0 }}>
              Based on actual claim patterns reported to SAIA. Names withheld for privacy. Representative examples.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        position: "sticky",
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid var(--color-border)",
        padding: "12px 16px",
        textAlign: "center",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
      }}>
        <a
          href="#lead-form"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(220, 38, 38, 0.2)",
          }}
        >
          Get Protected Now
          <Icon name="shield-checkmark-outline" size={16} color="#fff" />
        </a>
      </div>
    </div>
  );
}
