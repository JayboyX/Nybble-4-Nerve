"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import { StolenTodayCounter } from "./live-stats";
import { AnimatedCounter } from "./animated-counter";
import { CarCheckForm } from "./car-check-form";
import { ScanScreen } from "./scan-screen";

type FormData = { make: string; model: string; year: string; province: string };

function HeroStatBox({
  icon, label, value, subtext, tone,
}: {
  icon: string; label: string; value: React.ReactNode; subtext: string; tone: "danger" | "warning" | "neutral";
}) {
  const accent = tone === "danger" ? "var(--color-primary)" : tone === "warning" ? "var(--color-warning)" : "var(--color-text-muted)";
  const border = tone === "danger" ? "rgba(239, 68, 68, 0.3)" : tone === "warning" ? "rgba(245, 158, 11, 0.3)" : "var(--color-border)";
  const bg = tone === "danger" ? "var(--color-primary-pale)" : tone === "warning" ? "var(--color-warning-bg)" : "var(--color-surface-raised)";
  return (
    <div style={{ flex: "1 1 130px", minWidth: 0, textAlign: "left", padding: "7px 10px", borderRadius: 8, border: `1px solid ${border}`, background: bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
        <Icon name={icon} size={11} color={accent} />
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: "var(--color-text-muted)", marginTop: 2 }}>{subtext}</div>
    </div>
  );
}

export function HeroSection({
  stolenToday,
  annualThefts,
  recoveryRatePct,
  timeToBorderMin,
}: {
  stolenToday: number;
  annualThefts: number;
  recoveryRatePct: number;
  timeToBorderMin: number;
}) {
  const [scanning, setScanning] = useState<FormData | null>(null);
  const router = useRouter();

  function handleFormSubmit(data: FormData) {
    setScanning(data);
  }

  const handleScanComplete = useCallback(() => {
    if (!scanning) return;
    const params = new URLSearchParams(scanning);
    router.push(`/results?${params.toString()}`);
  }, [scanning, router]);

  return (
    <>
      <section id="hero-section" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 16px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 12px",
                borderRadius: 20,
                background: "var(--color-primary-pale)",
                color: "var(--color-primary)",
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-primary)" }} className="pulse-border" />
              Based on publicly available SAPS crime statistics 2025–2026
            </div>
            <h1
              className="hero-title"
              style={{
                fontWeight: 800,
                color: "var(--color-text)",
                lineHeight: 1.15,
                margin: "0 auto 8px",
                maxWidth: 640,
                letterSpacing: "-0.02em",
              }}
            >
              Is <span style={{ color: "var(--color-primary)" }}>YOUR</span> Car on the Most-Hijacked List?
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                maxWidth: 480,
                margin: "0 auto 14px",
                lineHeight: 1.5,
              }}
            >
              50 vehicles are hijacked every single day in South Africa. Check your
              risk in 30 seconds. Free. No registration required.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 480, margin: "0 auto 14px" }}>
              <HeroStatBox
                icon="alert-circle-outline"
                label="Stolen Today"
                value={<StolenTodayCounter initial={stolenToday} />}
                subtext="And counting..."
                tone="danger"
              />
              <HeroStatBox
                icon="trending-up-outline"
                label="Annual Thefts"
                value={<AnimatedCounter target={annualThefts} />}
                subtext="Public statistics"
                tone="warning"
              />
              <HeroStatBox
                icon="locate-outline"
                label="Recovery Rate"
                value={<AnimatedCounter target={recoveryRatePct} suffix="%" />}
                subtext="Never recovered"
                tone="neutral"
              />
              <HeroStatBox
                icon="time-outline"
                label="Time to Border"
                value={<AnimatedCounter target={timeToBorderMin} suffix=" min" />}
                subtext="Average escape time"
                tone="neutral"
              />
            </div>

            <CarCheckForm onSubmit={handleFormSubmit} />
          </motion.div>
        </div>
      </section>

      {/* Scan overlay */}
      <AnimatePresence>
        {scanning && (
          <ScanScreen
            make={scanning.make}
            model={scanning.model}
            year={scanning.year}
            province={scanning.province}
            onComplete={handleScanComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
