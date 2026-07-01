"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import { LiveCounter } from "./live-counter";
import { StolenTodayCounter } from "./live-stats";
import { AnimatedCounter } from "./animated-counter";
import { CarCheckForm } from "./car-check-form";
import { ScanScreen } from "./scan-screen";

type FormData = { make: string; model: string; year: string; province: string };

function HeroStatBox({
  icon, label, value, subtext, tone,
}: {
  icon: string; label: string; value: React.ReactNode; subtext: string; tone: "danger" | "warning";
}) {
  const accent = tone === "danger" ? "var(--color-primary)" : "var(--color-warning)";
  const border = tone === "danger" ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)";
  const bg = tone === "danger" ? "var(--color-primary-pale)" : "var(--color-warning-bg)";
  return (
    <div style={{ flex: 1, minWidth: 0, textAlign: "left", padding: "10px 14px", borderRadius: 8, border: `1px solid ${border}`, background: bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <Icon name={icon} size={13} color={accent} />
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 3 }}>{subtext}</div>
    </div>
  );
}

export function HeroSection({
  stolenToday,
  annualThefts,
}: {
  stolenToday: number;
  annualThefts: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const [scanning, setScanning] = useState<FormData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setShowForm(true);
    window.addEventListener("open-check-form", handler);
    return () => window.removeEventListener("open-check-form", handler);
  }, []);

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
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 14px",
                    borderRadius: 20,
                    background: "var(--color-primary-pale)",
                    color: "var(--color-primary)",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 20,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)" }} className="pulse-border" />
                  Based on publicly available SAPS crime statistics 2025–2026
                </div>
                <h1
                  className="hero-title"
                  style={{
                    fontWeight: 800,
                    color: "var(--color-text)",
                    lineHeight: 1.15,
                    margin: "0 auto 16px",
                    maxWidth: 640,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Is <span style={{ color: "var(--color-primary)" }}>YOUR</span> Car on the Most-Hijacked List?
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: "var(--color-text-muted)",
                    maxWidth: 480,
                    margin: "0 auto 28px",
                    lineHeight: 1.6,
                  }}
                >
                  50 vehicles are hijacked every single day in South Africa. Check your
                  risk in 30 seconds. Free. No registration required.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 6,
                    border: "none",
                    background: "var(--color-primary)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-dark)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary)")}
                >
                  Check My Car Now
                  <Icon name="arrow-forward-outline" size={15} color="#fff" />
                </button>

                <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "28px auto 0" }}>
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
                </div>

                <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 16 }}>
                  <LiveCounter /> checks today
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <CarCheckForm
                  onClose={() => setShowForm(false)}
                  onSubmit={handleFormSubmit}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
