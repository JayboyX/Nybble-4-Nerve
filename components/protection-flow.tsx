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
    border: "1px solid var(--color-border)", borderRadius: 6,
    fontSize: 13, color: "var(--color-text)", background: "var(--color-surface-raised)",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const fieldLabel: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "var(--color-text-muted)", marginBottom: 4,
    textTransform: "uppercase", letterSpacing: "0.05em",
  };

  return (
    <>
      {/* ── Card ── */}
      <div style={{ background: "var(--color-surface)", borderRadius: 8, border: "1px solid var(--color-border)", padding: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", margin: "0 0 2px" }}>
          Is your {car} protected right now?
        </p>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 16px" }}>
          If someone took it tonight — would you be covered?
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {([
            { i: "yes" as Intent, label: "Yes", sub: "I have cover", icon: "checkmark-circle", accent: "var(--color-success)" },
            { i: "no" as Intent, label: "No", sub: "Not covered", icon: "close-circle", accent: "var(--color-primary)" },
            { i: "notsure" as Intent, label: "Not sure", sub: "I think so", icon: "help-circle", accent: "var(--color-warning)" },
          ]).map(({ i, label, sub, icon, accent }) => (
            <button
              key={i}
              onClick={() => openModal(i)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "12px 8px", borderRadius: 8,
                border: "1px solid var(--color-border)", background: "var(--color-surface-raised)",
                cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = accent; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)"; }}
            >
              <Icon name={icon} size={22} color={accent} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{label}</span>
              <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{sub}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 5 }}>
          <Icon name="shield-checkmark-outline" size={12} color="var(--color-text-muted)" />
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>FSCA-licensed · POPIA compliant · No commitment</span>
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
              background: "rgba(2, 6, 23, 0.9)",
              backdropFilter: "blur(4px)",
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
                background: "var(--color-surface)", borderRadius: 10,
                width: "100%", maxWidth: 460,
                maxHeight: "calc(100vh - 32px)", overflowY: "auto",
                border: "1px solid var(--color-border)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              {submitted ? (
                /* ── Success ── */
                <div style={{ padding: "36px 28px", textAlign: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "var(--color-success-bg)", margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="checkmark-circle" size={26} color="var(--color-success)" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)", margin: "0 0 6px" }}>
                    We&apos;ll call you, {name.trim().split(" ")[0]}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
                    A licensed advisor will contact you about your <strong style={{ color: "var(--color-text)" }}>{car}</strong> during <strong style={{ color: "var(--color-text)" }}>{callTime}</strong>.
                  </p>
                  {reference && (
                    <div style={{
                      padding: "8px 12px", borderRadius: 6, marginBottom: 14,
                      background: "var(--color-surface-raised)", border: "1px solid var(--color-border)",
                      fontSize: 12, color: "var(--color-text-muted)", textAlign: "left",
                    }}>
                      <span style={{ fontWeight: 600, color: "var(--color-text)" }}>Ref: {reference}</span>
                      <br />
                      Consent recorded · {new Date(consentTime).toLocaleString("en-ZA")}
                    </div>
                  )}
                  <button
                    onClick={closeModal}
                    style={{
                      width: "100%", height: 36, borderRadius: 6, border: "1px solid var(--color-primary)",
                      background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Modal header — fear banner */}
                  <div style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--color-border)",
                    background: intent === "yes"
                      ? "var(--color-surface-raised)"
                      : "linear-gradient(to right, var(--color-primary-pale), transparent)",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "var(--color-text)", margin: "0 0 1px" }}>{cfg.heading}</p>
                      <p style={{ fontSize: 11, color: intent === "yes" ? "var(--color-text-muted)" : "var(--color-primary)", fontWeight: 600, margin: 0 }}>{cfg.sub}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      aria-label="Close"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "2px 4px", color: "var(--color-text-muted)", fontSize: 18, lineHeight: 1,
                        borderRadius: 4, transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)")}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Hook */}
                    <div style={{
                      padding: "10px 12px", borderRadius: 6,
                      background: "var(--color-primary-pale)", border: "1px solid rgba(239, 68, 68, 0.25)",
                      fontSize: 12, color: "var(--color-primary-light)", lineHeight: 1.6,
                    }}>
                      {cfg.hook(car, risk.recoveredPct, risk.minutesApart)}
                    </div>

                    {/* Name */}
                    <div>
                      <label style={fieldLabel} htmlFor="pf-name">Name</label>
                      <input id="pf-name" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={input}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")} />
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={fieldLabel} htmlFor="pf-phone">Cell number</label>
                      <input id="pf-phone" type="tel" placeholder="0821234567" value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} style={input} maxLength={10}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")} />
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
                                border: selected ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                                background: selected ? "var(--color-primary-pale)" : "var(--color-surface-raised)",
                                textAlign: "left", transition: "border-color 0.15s, background 0.15s",
                              }}
                            >
                              <div style={{ fontSize: 12, fontWeight: 600, color: selected ? "var(--color-primary-light)" : "var(--color-text)" }}>
                                {t.label}
                              </div>
                              <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 1 }}>{t.range}</div>
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
                        style={{ marginTop: 3, flexShrink: 0, accentColor: "var(--color-primary)", cursor: "pointer" }}
                      />
                      <label htmlFor="popia-consent" style={{ fontSize: 11, color: "var(--color-text-muted)", lineHeight: 1.6, cursor: "pointer" }}>
                        I consent to being contacted by FSCA-licensed providers. I&apos;ve read the{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>.
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      className={canSubmit && !submitting ? "heartbeat" : undefined}
                      style={{
                        width: "100%", height: 40, borderRadius: 6, border: "none",
                        background: canSubmit && !submitting ? "var(--color-primary)" : "var(--color-surface-raised)",
                        color: canSubmit && !submitting ? "#fff" : "var(--color-text-muted)",
                        fontSize: 13, fontWeight: 700,
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
