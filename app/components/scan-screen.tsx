"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "./icon";

const STEPS = [
  { label: "SAPS Crime Statistics", source: "PUBLIC DATA", delay: 600 },
  { label: "National Theft Database", source: "SAPS RECORD", delay: 800 },
  { label: "Provincial Hijack Index", source: "PROVINCIAL", delay: 700 },
  { label: "Recovery Rate Analysis", source: "TRACKER DATA", delay: 900 },
  { label: "Insurance Claim Patterns", source: "SAIA REPORT", delay: 750 },
  { label: "Cross-Border Risk Data", source: "BORDER CTRL", delay: 650 },
  { label: "Risk Score Calculation", source: "ALGORITHM", delay: 800 },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.delay, 0);

function useChartData() {
  const [data, setData] = useState<{ t: number; v: number }[]>([]);

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setData((prev) => {
        const base = 20 + Math.sin(frame * 0.3) * 15;
        const spike = Math.random() < 0.15 ? Math.random() * 40 : 0;
        const next = [...prev, { t: frame, v: Math.round(base + spike + Math.random() * 10) }];
        return next.length > 50 ? next.slice(-50) : next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return data;
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

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
  const chartData = useChartData();

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
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Header + Progress */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid var(--color-border)",
        padding: "20px 20px 16px",
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 2px", fontWeight: 500 }}>
              Scanning verified sources
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
              {make} {model} {year} <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>{province}</span>
            </p>
          </div>
          <div style={{
            height: 6,
            borderRadius: 3,
            background: "var(--color-border)",
            overflow: "hidden",
          }}>
            <motion.div
              style={{
                height: "100%",
                borderRadius: 3,
                background: done ? "#16a34a" : "var(--color-primary)",
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              {done ? "Analysis complete" : "Analyzing data..."}
            </span>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}>
        <div className="scan-layout" style={{ maxWidth: 960, width: "100%", display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>
          {/* Steps */}
          <div style={{ ...card, overflow: "hidden" }}>
            {STEPS.map((step, i) => {
              const isCompleted = completedSteps.includes(i);
              const isActive = activeStep === i && !isCompleted;
              const isLast = i === STEPS.length - 1;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.15 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    borderBottom: isLast ? "none" : "1px solid var(--color-border)",
                    backgroundColor: isActive ? "var(--color-warning-bg)" : "#fff",
                    transition: "background-color 0.2s",
                  }}
                >
                  <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isCompleted ? (
                      <Icon name="checkmark-circle" size={18} color="#16a34a" />
                    ) : isActive ? (
                      <div style={{
                        width: 16,
                        height: 16,
                        border: "2px solid var(--color-border)",
                        borderTopColor: "#d97706",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }} />
                    ) : (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-border)" }} />
                    )}
                  </div>

                  <span style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isCompleted
                      ? "var(--color-text-muted)"
                      : isActive
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                  }}>
                    {step.label}
                  </span>

                  <AnimatePresence>
                    {isCompleted && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#16a34a",
                          letterSpacing: "0.04em",
                          flexShrink: 0,
                        }}
                      >
                        {step.source}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Chart */}
          <div style={{ ...card, padding: 16, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}>
                Data Processing
              </span>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                {(chartData.length * 147).toLocaleString()} records
              </span>
            </div>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <defs>
                    <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis hide domain={[0, 80]} />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#DC2626"
                    strokeWidth={2}
                    fill="url(#scanGrad)"
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
