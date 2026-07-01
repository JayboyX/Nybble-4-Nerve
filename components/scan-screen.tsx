"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icon";

const STEPS = [
  { label: "Connecting to SAPS Crime Statistics Database...", icon: "server-outline", delay: 600 },
  { label: "Cross-referencing National Theft Database...", icon: "car-outline", delay: 800 },
  { label: "Analyzing Provincial Hijack Index...", icon: "map-outline", delay: 700 },
  { label: "Retrieving Recovery Rate Analysis...", icon: "locate-outline", delay: 900 },
  { label: "Reviewing Insurance Claim Patterns...", icon: "document-text-outline", delay: 750 },
  { label: "Checking Cross-Border Risk Data...", icon: "warning-outline", delay: 650 },
  { label: "Generating finalized Risk Score...", icon: "trending-up-outline", delay: 800 },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.delay, 0);

export function ScanScreen({
  make,
  model,
  year,
  province,
  onComplete,
}: {
  make: string;
  model: string;
  year: string;
  province: string;
  onComplete: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setActiveStep(i), elapsed));
      elapsed += step.delay;
      timers.push(
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, i]);
          if (i < STEPS.length - 1) setActiveStep(i + 1);
        }, elapsed)
      );
    });

    timers.push(setTimeout(onComplete, elapsed + 400));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / TOTAL_DURATION, 1);
      setProgress(p * 100);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const done = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--color-background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        padding: "24px 20px",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Spinner */}
        <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "4px solid var(--color-primary-pale)",
            borderTopColor: "var(--color-primary)",
            animation: "spin 1s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: 8, borderRadius: "50%",
            background: "var(--color-primary-pale)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="pulse-outline" size={24} color="var(--color-primary)" />
          </div>
        </div>

        <h3 style={{
          fontSize: 20, fontWeight: 800, color: "var(--color-text)",
          margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.03em",
        }}>
          Analyzing Risk Metrics
        </h3>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "0 0 24px", lineHeight: 1.6 }}>
          Scanning community hotspots and crime reports for {make} {model} {year} in {province}...
        </p>

        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 2, background: "var(--color-border)", overflow: "hidden", marginBottom: 20 }}>
          <motion.div
            style={{ height: "100%", borderRadius: 2, background: done ? "var(--color-success)" : "var(--color-primary)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>

        {/* Terminal log */}
        <div
          className="scrollbar-hide"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 10,
            padding: 16,
            textAlign: "left",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 12,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          <AnimatePresence initial={false}>
            {STEPS.slice(0, activeStep + 1).map((step, i) => {
              const isCompleted = completedSteps.includes(i);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}
                >
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <Icon
                      name={isCompleted ? "checkmark-circle" : step.icon}
                      size={13}
                      color={isCompleted ? "var(--color-success)" : "var(--color-primary)"}
                    />
                  </span>
                  <span style={{ color: "var(--color-text-muted)", lineHeight: 1.5 }}>{step.label}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {!done && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text-muted)", fontStyle: "italic" }}>
              <Icon name="reload-outline" size={12} color="var(--color-text-muted)" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
