"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icon";
import type { RiskResult } from "@/app/lib/risk";
import { getLevelColor } from "@/app/lib/risk";

function FearBar({ label, pct, delay }: { label: string; pct: number; delay: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "var(--color-text)" }}>{label}</span>
        <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "var(--color-border)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 3, background: "var(--color-primary)" }}
        />
      </div>
    </div>
  );
}

const THEFT_METHODS = [
  "Relay attack on keyless entry",
  "Signal jammer at parking lots",
  "Driveway ambush / follow-home",
  "Fake roadblock or accident",
  "Tow truck removal in broad daylight",
  "Key cloning at valet or service centre",
];

export function FearAccordion({ risk }: { risk: RiskResult }) {
  const [open, setOpen] = useState(false);

  const carFears = [
    { label: `${risk.make} ${risk.model} theft rate (national)`, pct: Math.min(95, risk.score + 5) },
    { label: "Armed hijacking probability", pct: Math.min(90, Math.round(risk.score * 0.85)) },
    { label: "Insurance claim rejection rate", pct: Math.round(22 + risk.score * 0.3) },
    { label: "Repeat targeting likelihood", pct: Math.round(15 + risk.score * 0.5) },
  ];

  const provinceFears = [
    { label: `${risk.province} vehicle crime index`, pct: Math.min(98, risk.score + 8) },
    { label: `${risk.province} hijacking hotspot density`, pct: Math.min(92, Math.round(risk.score * 0.9)) },
    { label: `${risk.province} cross-border export risk`, pct: Math.round(20 + risk.score * 0.45) },
    { label: `${risk.province} recovery success rate`, pct: risk.recoveredPct },
  ];

  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: 10,
      border: "1px solid var(--color-border)",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>
          Detailed Risk Breakdown
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="chevron-down-outline" size={18} color="var(--color-text-muted)" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 16px 20px" }}>
              {/* Vehicle-specific fears */}
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 12px" }}>
                Vehicle Risk — {risk.make} {risk.model}
              </p>
              {carFears.map((f, i) => (
                <FearBar key={f.label} label={f.label} pct={f.pct} delay={i * 0.15} />
              ))}

              {/* Province fears */}
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "20px 0 12px" }}>
                Provincial Risk — {risk.province}
              </p>
              {provinceFears.map((f, i) => (
                <FearBar key={f.label} label={f.label} pct={f.pct} delay={i * 0.15} />
              ))}

              {/* Theft methods */}
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "20px 0 12px" }}>
                Common Theft Methods
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {THEFT_METHODS.map((m) => (
                  <div key={m} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text)" }}>
                    <Icon name="alert-circle-outline" size={14} color="var(--color-primary)" />
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
