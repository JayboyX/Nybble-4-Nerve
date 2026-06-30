"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icon";
import type { RiskResult } from "@/app/lib/risk";

type FlowState = "initial" | "yes" | "overlay";

const CALL_TIMES = [
  { label: "Morning", range: "8:00 AM – 12:00 PM" },
  { label: "Afternoon", range: "12:00 PM – 5:00 PM" },
  { label: "Evening", range: "5:00 PM – 8:00 PM" },
  { label: "Any time", range: "Business hours" },
];

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 12px",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 14,
  color: "var(--color-text)",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--color-text-muted)",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

function track(event: string, props: Record<string, unknown>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).__posthog;
    if (ph) ph.capture(event, props);
  } catch {
    // non-fatal
  }
}

export function ProtectionFlow({ risk }: { risk: RiskResult }) {
  const car = `${risk.make} ${risk.model}`;

  const [flowState, setFlowState] = useState<FlowState>("initial");
  const [overlayIntent, setOverlayIntent] = useState<"no" | "notsure">("no");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [callTime, setCallTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentTime, setConsentTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  function openOverlay(intent: "no" | "notsure") {
    setOverlayIntent(intent);
    setFlowState("overlay");
    track("protection_status", { status: intent, make: risk.make, model: risk.model });
  }

  function closeOverlay() {
    setFlowState("initial");
    setName("");
    setPhone("");
    setSubmitting(false);
    setCallTime("");
    setConsent(false);
    setConsentTime("");
    setSubmitted(false);
    setReference("");
  }

  function handleConsentChange(checked: boolean) {
    setConsent(checked);
    if (checked) setConsentTime(new Date().toISOString());
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

  return (
    <>
      {/* Initial card */}
      <AnimatePresence mode="wait">
        {flowState !== "overlay" && (
          <motion.div
            key="protection-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{ ...card, padding: 24 }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)", margin: "0 0 4px" }}>
              Is your {car} currently insured?
            </p>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 18px" }}>
              Schedule a free call with a licensed advisor.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* NO — primary action */}
              <button
                onClick={() => openOverlay("no")}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 8, border: "none",
                  background: "var(--color-primary)", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "center",
                }}
              >
                No — I need protection
              </button>

              {/* YES */}
              <button
                onClick={() => {
                  setFlowState("yes");
                  track("protection_status", { status: "yes", make: risk.make, model: risk.model });
                }}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 8,
                  border: "1px solid var(--color-border)", background: "#fff",
                  fontSize: 14, fontWeight: 600, color: "var(--color-text)", cursor: "pointer", textAlign: "center",
                }}
              >
                Yes — but I want to compare
              </button>

              {/* NOT SURE */}
              <button
                onClick={() => openOverlay("notsure")}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 8,
                  border: "1px solid var(--color-border)", background: "#fff",
                  fontSize: 14, fontWeight: 600, color: "var(--color-text)", cursor: "pointer", textAlign: "center",
                }}
              >
                Not sure — help me check
              </button>
            </div>

            {/* YES expanded */}
            <AnimatePresence>
              {flowState === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden", marginTop: 12 }}
                >
                  <div style={{
                    padding: "14px 16px", borderRadius: 8,
                    background: "#f9fafb", border: "1px solid var(--color-border)",
                  }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)", margin: "0 0 8px" }}>
                      Good — make sure your cover is solid:
                    </p>
                    <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 5 }}>
                      {[
                        "Comprehensive cover — not just third-party.",
                        "Check your excess. High excess = big out-of-pocket costs.",
                        "Confirm your tracker subscription is active 24/7.",
                      ].map((item) => (
                        <li key={item} style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openOverlay("notsure")}
                      style={{
                        marginTop: 12, padding: "8px 14px", borderRadius: 6,
                        border: "1px solid var(--color-border)", background: "#fff",
                        fontSize: 12, fontWeight: 600, color: "var(--color-text)", cursor: "pointer",
                      }}
                    >
                      Compare my cover anyway
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {flowState === "overlay" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "#fff", borderRadius: 12,
                width: "100%", maxWidth: 460,
                maxHeight: "calc(100vh - 32px)", overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              {submitted ? (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "#f0fdf4", margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="checkmark-circle" size={30} color="#16a34a" />
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-text)", margin: "0 0 8px" }}>
                    We'll call you, {name.trim()}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
                    A licensed advisor will contact you about your {car} during <strong>{callTime}</strong>.
                  </p>
                  {reference && (
                    <div style={{
                      padding: "10px 14px", borderRadius: 8, marginBottom: 12,
                      background: "#f9fafb", border: "1px solid var(--color-border)",
                      fontSize: 12, color: "var(--color-text-muted)", textAlign: "left",
                    }}>
                      <span style={{ fontWeight: 700, color: "var(--color-text)" }}>Ref: {reference}</span>
                      <br />
                      Consent recorded at {new Date(consentTime).toLocaleString("en-ZA")}
                    </div>
                  )}
                  <button
                    onClick={closeOverlay}
                    style={{
                      width: "100%", height: 44, borderRadius: 8, border: "none",
                      background: "var(--color-primary)", color: "#fff",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "sticky", top: 0, background: "#fff", zIndex: 1,
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>
                        {overlayIntent === "no" ? "Get protected — free call" : "Let us check your cover"}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                        FSCA-licensed advisor · No obligation
                      </div>
                    </div>
                    <button
                      onClick={closeOverlay}
                      aria-label="Close"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: 6, color: "var(--color-text-muted)",
                        display: "flex", alignItems: "center",
                      }}
                    >
                      <Icon name="close-outline" size={20} color="var(--color-text-muted)" />
                    </button>
                  </div>

                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Risk context */}
                    <div style={{
                      padding: "12px 14px", borderRadius: 8,
                      background: "var(--color-primary-pale)",
                      border: "1px solid #fecaca",
                    }}>
                      <p style={{ fontSize: 12, color: "var(--color-primary)", margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
                        A {car} is stolen every <strong>{risk.minutesApart} minutes</strong> in SA.
                        Only <strong>{risk.recoveredPct}%</strong> are ever recovered.
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
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
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
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                        maxLength={10}
                      />
                    </div>

                    {/* Call time */}
                    <div>
                      <label style={labelStyle}>Best time to call</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {CALL_TIMES.map((t) => (
                          <button
                            key={t.label}
                            onClick={() => setCallTime(t.label)}
                            style={{
                              padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                              border: callTime === t.label
                                ? "2px solid var(--color-primary)"
                                : "1px solid var(--color-border)",
                              background: callTime === t.label ? "var(--color-primary-pale)" : "#fff",
                              textAlign: "left",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 600, color: callTime === t.label ? "var(--color-primary)" : "var(--color-text)" }}>
                              {t.label}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 1 }}>
                              {t.range}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* POPIA consent */}
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <input
                        id="popia-consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => handleConsentChange(e.target.checked)}
                        style={{ marginTop: 2, flexShrink: 0, accentColor: "var(--color-primary)", cursor: "pointer" }}
                      />
                      <label htmlFor="popia-consent" style={{ fontSize: 11, color: "var(--color-text-muted)", lineHeight: 1.55, cursor: "pointer" }}>
                        I consent to being contacted by FSCA-licensed providers about vehicle insurance. I've read the{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                          Privacy Policy
                        </a>.
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      style={{
                        width: "100%", height: 48, borderRadius: 8, border: "none",
                        background: canSubmit && !submitting ? "var(--color-primary)" : "var(--color-border)",
                        color: canSubmit && !submitting ? "#fff" : "var(--color-text-muted)",
                        fontSize: 14, fontWeight: 700,
                        cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                        transition: "background 0.15s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}
                    >
                      {submitting ? "Submitting..." : "Request My Free Call"}
                    </button>
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
