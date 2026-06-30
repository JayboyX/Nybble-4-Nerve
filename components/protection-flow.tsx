"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icon";
import type { RiskResult } from "@/app/lib/risk";

type Intent = "no" | "yes" | "notsure";

const CALL_TIMES = [
  { label: "Morning", range: "8:00 – 12:00" },
  { label: "Afternoon", range: "12:00 – 17:00" },
  { label: "Evening", range: "17:00 – 20:00" },
  { label: "Any time", range: "Business hours" },
];

const INTENT: Record<Intent, { heading: string; sub: string; hook: (car: string, pct: number, mins: number) => string }> = {
  no: {
    heading: "Get protected — free call",
    sub: "FSCA-licensed advisor · No obligation",
    hook: (car, pct) => `${100 - pct}% of stolen ${car}s are never recovered. A licensed advisor can get you covered today.`,
  },
  yes: {
    heading: "Compare your cover",
    sub: "Most people overpay — let us check your rate",
    hook: (car, _, mins) => `A ${car} is stolen every ${mins} minutes in SA. Make sure your cover pays out when it matters.`,
  },
  notsure: {
    heading: "Let us check your cover",
    sub: "Free review · No commitment",
    hook: (car, pct) => `Only ${pct}% of stolen ${car}s are recovered. Gaps in cover could leave you fully exposed.`,
  },
};

function track(event: string, props: Record<string, unknown>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).__posthog;
    if (ph) ph.capture(event, props);
  } catch { /* non-fatal */ }
}

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
    setName(""); setPhone(""); setCallTime("");
    setConsent(false); setConsentTime("");
    setSubmitted(false); setReference(""); setSubmitting(false);
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const lead = {
      vehicle_make: risk.make, vehicle_model: risk.model, vehicle_year: String(risk.year),
      province: risk.province, risk_level: risk.level, risk_score: risk.score,
      name: name.trim(), phone: phone.replace(/\D/g, "").slice(0, 10),
      preferred_call_time: callTime, phone_verified: true,
      consent_given: true, consent_timestamp: consentTime,
      consent_method: "web_checkbox", created_at: new Date().toISOString(),
    };
    try {
      const existing: typeof lead[] = JSON.parse(localStorage.getItem("safecheck_leads") || "[]");
      const idx = existing.findIndex((l) => l.phone === lead.phone);
      if (idx >= 0) existing[idx] = lead; else existing.push(lead);
      localStorage.setItem("safecheck_leads", JSON.stringify(existing));
    } catch { /* storage unavailable */ }
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
      const data = await res.json();
      if (data.reference) setReference(data.reference);
    } catch { /* non-fatal */ }
    track("call_scheduled", { make: risk.make, model: risk.model, province: risk.province, call_time: callTime, risk_level: risk.level });
    setSubmitting(false);
    setSubmitted(true);
  }

  const canSubmit = name.trim().length > 0 && phone.replace(/\D/g, "").length === 10 && callTime !== "" && consent;
  const cfg = INTENT[intent];

  // ─── shared styles ─────────────────────────────────────────
  const input: React.CSSProperties = {
    width: "100%", height: 36, padding: "0 10px",
    border: "1px solid #e5e7eb", borderRadius: 6,
    fontSize: 13, color: "#111827", background: "#fff",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const fieldLabel: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "#6b7280", marginBottom: 4,
    textTransform: "uppercase", letterSpacing: "0.05em",
  };

  return (
    <>
      {/* ── Card ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 2px" }}>
          Is your {car} currently insured?
        </p>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 16px" }}>
          A licensed advisor can review your cover for free.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {([
            { i: "no" as Intent, label: "No — I need protection", primary: true },
            { i: "yes" as Intent, label: "Yes — but I want to compare", primary: false },
            { i: "notsure" as Intent, label: "Not sure — help me check", primary: false },
          ]).map(({ i, label, primary }) => (
            <button
              key={i}
              onClick={() => openModal(i)}
              style={{
                width: "100%", padding: "8px 12px",
                borderRadius: 6, fontSize: 13, fontWeight: 600,
                cursor: "pointer", textAlign: "center",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
                ...(primary
                  ? { background: "#DC2626", color: "#fff", border: "1px solid #DC2626" }
                  : { background: "#fff", color: "#374151", border: "1px solid #e5e7eb" }),
              }}
              onMouseEnter={(e) => {
                if (!primary) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#DC2626";
                  (e.currentTarget as HTMLButtonElement).style.color = "#DC2626";
                } else {
                  (e.currentTarget as HTMLButtonElement).style.background = "#b91c1c";
                }
              }}
              onMouseLeave={(e) => {
                if (!primary) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                } else {
                  (e.currentTarget as HTMLButtonElement).style.background = "#DC2626";
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 5 }}>
          <Icon name="shield-checkmark-outline" size={12} color="#9ca3af" />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>FSCA-licensed · POPIA compliant · No commitment</span>
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              style={{
                background: "#fff", borderRadius: 10,
                width: "100%", maxWidth: 440,
                maxHeight: "calc(100vh - 32px)", overflowY: "auto",
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              }}
            >
              {submitted ? (
                /* ── Success ── */
                <div style={{ padding: "36px 28px", textAlign: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "#f0fdf4", margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="checkmark-circle" size={26} color="#16a34a" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                    We'll call you, {name.trim().split(" ")[0]}
                  </p>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.6 }}>
                    A licensed advisor will contact you about your <strong style={{ color: "#111827" }}>{car}</strong> during <strong style={{ color: "#111827" }}>{callTime}</strong>.
                  </p>
                  {reference && (
                    <div style={{
                      padding: "8px 12px", borderRadius: 6, marginBottom: 14,
                      background: "#f9fafb", border: "1px solid #e5e7eb",
                      fontSize: 12, color: "#6b7280", textAlign: "left",
                    }}>
                      <span style={{ fontWeight: 600, color: "#111827" }}>Ref: {reference}</span>
                      <br />
                      Consent recorded · {new Date(consentTime).toLocaleString("en-ZA")}
                    </div>
                  )}
                  <button
                    onClick={closeModal}
                    style={{
                      width: "100%", height: 36, borderRadius: 6, border: "1px solid #DC2626",
                      background: "#DC2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Modal header */}
                  <div style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 1px" }}>{cfg.heading}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{cfg.sub}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      aria-label="Close"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "2px 4px", color: "#9ca3af", fontSize: 18, lineHeight: 1,
                        borderRadius: 4, transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#374151")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Hook */}
                    <div style={{
                      padding: "10px 12px", borderRadius: 6,
                      background: "#fef2f2", border: "1px solid #fecaca",
                      fontSize: 12, color: "#991b1b", lineHeight: 1.6,
                    }}>
                      {cfg.hook(car, risk.recoveredPct, risk.minutesApart)}
                    </div>

                    {/* Name */}
                    <div>
                      <label style={fieldLabel} htmlFor="pf-name">Name</label>
                      <input id="pf-name" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={input}
                        onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={fieldLabel} htmlFor="pf-phone">Cell number</label>
                      <input id="pf-phone" type="tel" placeholder="0821234567" value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} style={input} maxLength={10}
                        onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
                    </div>

                    {/* Call time */}
                    <div>
                      <label style={fieldLabel}>Best time to call</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {CALL_TIMES.map((t) => {
                          const selected = callTime === t.label;
                          return (
                            <button
                              key={t.label}
                              onClick={() => setCallTime(t.label)}
                              style={{
                                padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                                border: selected ? "1px solid #DC2626" : "1px solid #e5e7eb",
                                background: selected ? "#fef2f2" : "#fff",
                                textAlign: "left", transition: "border-color 0.15s, background 0.15s",
                              }}
                            >
                              <div style={{ fontSize: 12, fontWeight: 600, color: selected ? "#DC2626" : "#111827" }}>
                                {t.label}
                              </div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{t.range}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Consent */}
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <input
                        id="popia-consent" type="checkbox" checked={consent}
                        onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentTime(new Date().toISOString()); }}
                        style={{ marginTop: 3, flexShrink: 0, accentColor: "#DC2626", cursor: "pointer" }}
                      />
                      <label htmlFor="popia-consent" style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6, cursor: "pointer" }}>
                        I consent to being contacted by FSCA-licensed providers. I've read the{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          style={{ color: "#DC2626", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>.
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      style={{
                        width: "100%", height: 36, borderRadius: 6, border: "none",
                        background: canSubmit && !submitting ? "#DC2626" : "#f3f4f6",
                        color: canSubmit && !submitting ? "#fff" : "#9ca3af",
                        fontSize: 13, fontWeight: 600,
                        cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                        transition: "background 0.15s, color 0.15s",
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
