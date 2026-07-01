"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon, IonIconLoader } from "@/components/icon";
import { SocialProofNotifications } from "@/components/social-proof";
import { ProtectionFlow } from "@/components/protection-flow";
import { ShareModal } from "@/components/share-modal";
import { FearAccordion } from "@/components/fear-accordion";
import { LiveFeed } from "@/components/live-feed";
import type { RiskResult } from "@/app/lib/risk";

type Story = { location: string; car: string; summary: string };

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
            background: i < filled ? color : "var(--color-border)",
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
  stories,
}: {
  risk: RiskResult;
  levelColor: string;
  levelBg: string;
  stories: Story[];
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
      <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
        <IonIconLoader />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
          <div style={{ background: "var(--color-surface)", borderRadius: 8, border: "1px solid var(--color-border)", padding: 40 }}>
            <Icon name="alert-circle-outline" size={32} color="var(--color-text-muted)" />
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)", margin: "14px 0 6px" }}>No Data Available</p>
            <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "0 0 20px" }}>
              We don't have theft statistics for the {car} yet.
            </p>
            <a href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 6,
              background: "var(--color-primary)", color: "#fff",
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
    <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
      <IonIconLoader />
      <SocialProofNotifications />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Top nav row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--color-text-muted)", textDecoration: "none", fontWeight: 500,
          }}>
            <Icon name="arrow-back-outline" size={14} color="var(--color-text-muted)" />
            Check another car
          </a>
          <button
            onClick={() => { setShowShare(true); track("share_clicked", { make: risk.make, model: risk.model }); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: "var(--color-primary)", fontWeight: 700,
            }}
          >
            <Icon name="share-social-outline" size={14} color="var(--color-primary)" />
            Warn friends
          </button>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "0 0 18px", lineHeight: 1.6 }}>
          Based on SAIA claim data. Not affiliated with SAPS or any government agency. Representative examples only.
        </p>

        <div className="results-grid">

          {/* ── Risk Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: "var(--color-surface)", borderRadius: 8, border: "1px solid var(--color-border)", overflow: "hidden" }}
          >
            {/* Header strip */}
            <div style={{
              padding: "16px 20px 14px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Risk Assessment · {risk.province}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                  {car} <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>{risk.year}</span>
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
                <span style={{ fontSize: 16, color: "var(--color-text-muted)", fontWeight: 300 }}>/100</span>
                {risk.trend !== "STABLE" && (
                  <span style={{
                    marginLeft: 6, padding: "2px 8px", borderRadius: 20,
                    background: "var(--color-primary-pale)", color: "var(--color-primary-light)",
                    fontSize: 11, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 3,
                  }}>
                    <Icon name="trending-up-outline" size={11} color="var(--color-primary-light)" />
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
              borderTop: "1px solid var(--color-border)",
            }}>
              {[
                { value: risk.stolenPerYear.toLocaleString(), label: "Stolen / yr" },
                { value: `${risk.recoveredPct}%`, label: "Recovered" },
                { value: `${risk.gonePct}%`, label: "Gone forever" },
                { value: `${risk.minutesApart}`, label: "Min apart" },
              ].map((s, i, arr) => (
                <div key={s.label} style={{
                  padding: "14px 0", textAlign: "center",
                  borderRight: i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)", marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 500 }}>{s.label}</div>
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
              background: "var(--color-surface)", borderRadius: 8,
              border: "1px solid var(--color-border)", padding: "14px 16px",
            }}>
              <p style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.75, margin: 0 }}>
                In <strong>{risk.province}</strong>, a <strong>{car}</strong> is stolen every{" "}
                <strong>{risk.minutesApart} minutes</strong>. Only{" "}
                <strong style={{ color: "var(--color-primary)" }}>{risk.recoveredPct}%</strong> are recovered.
                {risk.trend !== "STABLE" && (
                  <> Theft is <strong style={{ color: "var(--color-primary)" }}>{risk.trend.toLowerCase()}</strong> at +{risk.trendPct}% year-on-year.</>
                )}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Urgent Share CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.18 }}
          className="pulse-border"
          style={{
            marginTop: 16,
            background: "var(--color-primary-pale)",
            borderRadius: 10,
            border: "2px solid var(--color-primary)",
            padding: "20px 24px",
            textAlign: "center",
          }}
        >
          <p style={{
            fontSize: 13, fontWeight: 800, color: "var(--color-primary-light)", margin: "0 0 6px",
            textTransform: "uppercase", letterSpacing: "0.04em",
          }}>
            Protect your community — warn them now
          </p>
          <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 16px", maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Your family, friends, and colleagues are driving on SA roads completely unaware. Sharing this risk report spreads immediate awareness across WhatsApp groups.
          </p>
          <button
            onClick={() => { setShowShare(true); track("share_clicked", { make: risk.make, model: risk.model }); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 8,
              border: "none", background: "var(--color-primary)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Icon name="logo-whatsapp" size={16} color="#fff" />
            Warn Them Now on WhatsApp
          </button>
        </motion.div>

        {/* ── Detailed Risk Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.26 }}
          style={{ marginTop: 16 }}
        >
          <FearAccordion risk={risk} />
        </motion.div>

        {/* ── Representative Claim Scenarios ── */}
        {stories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.34 }}
            style={{
              marginTop: 16, background: "var(--color-surface)", borderRadius: 8,
              border: "1px solid var(--color-border)", padding: 20,
            }}
          >
            <LiveFeed initialStories={stories} />
          </motion.div>
        )}
      </div>

      {showShare && <ShareModal risk={risk} onClose={() => setShowShare(false)} />}
    </div>
  );
}
