"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icon";
import type { RiskResult } from "@/app/lib/risk";

type Intent = "no" | "yes" | "notsure";

const CALL_TIMES = [
  { label: "Morning", range: "8:00 – 12:00" },
  { label: "Afternoon", range: "12:00 – 17:00" },
  { label: "Evening", range: "17:00 – 20:00" },
  { label: "Any time", range: "Business hours" },
];

const INTENT_CONFIG: Record<Intent, { heading: string; sub: string; hook: (car: string, pct: number, mins: number) => string }> = {
  no: {
    heading: "Get your vehicle protected",
    sub: "Free call · FSCA-licensed advisor · No obligation",
    hook: (car, pct, mins) =>
      `${100 - pct}% of stolen ${car}s are never recovered. A licensed advisor can get you covered today.`,
  },
  yes: {
    heading: "Compare your cover",
    sub: "Most people overpay — let us check your rate",
    hook: (car, _pct, mins) =>
      `A ${car} is stolen every ${mins} minutes in SA. Make sure your cover actually pays out when it matters.`,
  },
  notsure: {
    heading: "Let us check your cover",
    sub: "Free cover review · No commitment",
    hook: (car, pct, _mins) =>
      `Only ${pct}% of stolen ${car}s are recovered. Gaps in your cover could leave you exposed.`,
  },
};

function track(event: string, props: Record<string, unknown>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).__posthog;
    if (ph) ph.capture(event, props);
  } catch { /* non-fatal */ }
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  padding: "0 14px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 14,
  color: "#111827",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b7280",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export function ProtectionFlow({ risk }: { risk: RiskResult }) {
  const car = `${risk.make} ${risk.model}`;

  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("no");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [callTime, setCallTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentTime, setConsentTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  function openModal(i: Intent) {
    setIntent(i);
    setOpen(true);
    track("protection_status", { status: i, make: risk.make, model: risk.model });
  }

  function closeModal() {
    setOpen(false);
    setName("");
    setPhone("");
    setSubmitting(false);
    setCallTime("");
    setConsent(false);
    setConsentTime("");
    setSubmitted(false);
    setReference("");
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const lead = {
      vehicle_make: risk.make,
      vehicle_model: risk.model,
      vehicle_year: String(risk.year),
      province: risk.province,
      risk_level: risk.level,
      risk_score: risk.score,
      name: name.trim(),
      phone: phone.replace(/\D/g, "").slice(0, 10),
      preferred_call_time: callTime,
      phone_verified: true,
      consent_given: true,
      consent_timestamp: consentTime,
      consent_method: "web_checkbox",
      created_at: new Date().toISOString(),
    };
    try {
      const existing: typeof lead[] = JSON.parse(localStorage.getItem("safecheck_leads") || "[]");
      const idx = existing.findIndex((l) => l.phone === lead.phone);
      if (idx >= 0) existing[idx] = lead; else existing.push(lead);
      localStorage.setItem("safecheck_leads", JSON.stringify(existing));
    } catch { /* storage unavailable */ }
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json();
      if (data.reference) setReference(data.reference);
    } catch { /* non-fatal */ }
    track("call_scheduled", { make: risk.make, model: risk.model, province: risk.province, call_time: callTime, risk_level: risk.level });
    setSubmitting(false);
    setSubmitted(true);
  }

  const canSubmit = name.trim().length > 0 && phone.replace(/\D/g, "").length === 10 && callTime !== "" && consent;
  const cfg = INTENT_CONFIG[intent];

  const BUTTONS: { intent: Intent; label: string; primary: boolean }[] = [
    { intent: "no", label: "No — I need protection", primary: true },
    { intent: "yes", label: "Yes — but I want to compare", primary: false },
    { intent: "notsure", label: "Not sure — help me check", primary: false },
  ];

  return (
    <>
      {/* Card */}
      <div style={{
        background: "#fff", borderRadius: 10,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        padding: 24,
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 6px", lineHeight: 1.3 }}>
          Is your {car} currently insured?
        </p>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 20px" }}>
          A licensed advisor can check your cover for free.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {BUTTONS.map(({ intent: i, label, primary }) => (
            <motion.button
              key={i}
              onClick={() => openModal(i)}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                width: "100%",
                padding: primary ? "15px 20px" : "13px 20px",
                borderRadius: 9,
                border: primary ? "none" : "1.5px solid #e5e7eb",
                background: primary ? "#DC2626" : "#fff",
                color: primary ? "#fff" : "#111827",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
                boxShadow: primary ? "0 4px 14px rgba(220,38,38,0.3)" : "none",
                letterSpacing: primary ? "-0.01em" : "0",
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Trust bar */}
        <div style={{
          marginTop: 18, paddingTop: 16,
          borderTop: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="shield-checkmark-outline" size={13} color="#9ca3af" />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>FSCA-licensed · No commitment · POPIA compliant</span>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              style={{
                background: "#fff",
                borderRadius: 14,
                width: "100%",
                maxWidth: 460,
                maxHeight: "calc(100vh - 32px)",
                overflowY: "auto",
                boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              }}
            >
              {submitted ? (
                /* ── Success ── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: "40px 32px", textAlign: "center" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    style={{
                      width: 60, height: 60, borderRadius: "50%",
                      background: "#f0fdf4", margin: "0 auto 20px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon name="checkmark-circle" size={34} color="#16a34a" />
                  </motion.div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>
                    We'll call you, {name.trim().split(" ")[0]}
                  </h2>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.7 }}>
                    A licensed advisor will contact you about your{" "}
                    <strong style={{ color: "#111827" }}>{car}</strong> during{" "}
                    <strong style={{ color: "#111827" }}>{callTime}</strong>.
                  </p>
                  {reference && (
                    <div style={{
                      padding: "10px 16px", borderRadius: 8, marginBottom: 16,
                      background: "#f9fafb", border: "1px solid #e5e7eb",
                      fontSize: 12, color: "#6b7280", textAlign: "left",
                    }}>
                      <span style={{ fontWeight: 700, color: "#111827", display: "block", marginBottom: 2 }}>
                        Ref: {reference}
                      </span>
                      Consent recorded · {new Date(consentTime).toLocaleString("en-ZA")}
                    </div>
                  )}
                  <motion.button
                    onClick={closeModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%", height: 46, borderRadius: 9, border: "none",
                      background: "#DC2626", color: "#fff",
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    Done
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {/* ── Modal header ── */}
                  <div style={{
                    background: "#1E3A5F",
                    borderRadius: "14px 14px 0 0",
                    padding: "20px 24px",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
                        {cfg.heading}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                        {cfg.sub}
                      </div>
                    </div>
                    <motion.button
                      onClick={closeModal}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close"
                      style={{
                        background: "rgba(255,255,255,0.1)", border: "none",
                        borderRadius: 6, padding: 6, cursor: "pointer",
                        display: "flex", alignItems: "center", color: "#fff",
                      }}
                    >
                      <Icon name="close-outline" size={18} color="rgba(255,255,255,0.8)" />
                    </motion.button>
                  </div>

                  <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Hook */}
                    <div style={{
                      padding: "12px 14px", borderRadius: 8,
                      background: "#fef2f2", border: "1px solid #fecaca",
                    }}>
                      <p style={{ fontSize: 12, color: "#991b1b", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                        {cfg.hook(car, risk.recoveredPct, risk.minutesApart)}
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label style={labelStyle} htmlFor="pf-name">Your name</label>
                      <input
                        id="pf-name"
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={labelStyle} htmlFor="pf-phone">Cell number</label>
                      <input
                        id="pf-phone"
                        type="tel"
                        placeholder="0821234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                        maxLength={10}
                      />
                    </div>

                    {/* Call time */}
                    <div>
                      <label style={labelStyle}>Best time to call</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {CALL_TIMES.map((t) => (
                          <motion.button
                            key={t.label}
                            onClick={() => setCallTime(t.label)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                              border: callTime === t.label ? "2px solid #DC2626" : "1.5px solid #e5e7eb",
                              background: callTime === t.label ? "#fef2f2" : "#fff",
                              textAlign: "left", transition: "border-color 0.12s, background 0.12s",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 700, color: callTime === t.label ? "#DC2626" : "#111827" }}>
                              {t.label}
                            </div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                              {t.range}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Consent */}
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <input
                        id="popia-consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (e.target.checked) setConsentTime(new Date().toISOString());
                        }}
                        style={{ marginTop: 2, flexShrink: 0, accentColor: "#DC2626", cursor: "pointer" }}
                      />
                      <label htmlFor="popia-consent" style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6, cursor: "pointer" }}>
                        I consent to being contacted by FSCA-licensed providers about vehicle insurance. I've read the{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          style={{ color: "#DC2626", textDecoration: "none", fontWeight: 600 }}>
                          Privacy Policy
                        </a>.
                      </label>
                    </div>

                    {/* Submit */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      whileHover={canSubmit && !submitting ? { scale: 1.015, y: -1 } : {}}
                      whileTap={canSubmit && !submitting ? { scale: 0.985 } : {}}
                      style={{
                        width: "100%", height: 50, borderRadius: 9, border: "none",
                        background: canSubmit && !submitting ? "#DC2626" : "#f3f4f6",
                        color: canSubmit && !submitting ? "#fff" : "#9ca3af",
                        fontSize: 14, fontWeight: 800,
                        cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                        transition: "background 0.15s, color 0.15s",
                        boxShadow: canSubmit && !submitting ? "0 4px 14px rgba(220,38,38,0.3)" : "none",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {submitting ? "Submitting..." : "Request My Free Call"}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
