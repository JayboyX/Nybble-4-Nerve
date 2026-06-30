"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icon";
import type { RiskResult } from "@/app/lib/risk";

type FlowState = "initial" | "yes" | "overlay";

const REGRET_STORIES = [
  (car: string) =>
    `My ${car} was taken outside Pick n Pay in broad daylight. No comprehensive cover. The bank still made me pay every month.`,
  (car: string) =>
    `Three weeks without insurance on my ${car}. It was hijacked at a robot in Randburg. I had to walk home.`,
  (car: string) =>
    `Thought nothing would happen to my ${car} in a gated complex. Stolen in 4 minutes flat. No payout.`,
];

const PROTECTED_STORIES = [
  (car: string) =>
    `My ${car} was stolen from the mall parking lot. Insurance paid out in 9 days. Drove off in a newer one.`,
  (car: string) =>
    `Tracker picked up my ${car} within 2 hours. Recovered it before it left Joburg. Glad I had cover.`,
];

const CALL_TIMES = [
  { label: "Morning", range: "8:00 AM–12:00 PM" },
  { label: "Afternoon", range: "12:00 PM–5:00 PM" },
  { label: "Evening", range: "5:00 PM–8:00 PM" },
  { label: "Any time", range: "Any time during business hours" },
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

export function ProtectionFlow({ risk }: { risk: RiskResult }) {
  const car = `${risk.make} ${risk.model}`;

  const [flowState, setFlowState] = useState<FlowState>("initial");
  const [overlayIntent, setOverlayIntent] = useState<"no" | "notsure">("no");
  const [storyIdx, setStoryIdx] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [callTime, setCallTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentTime, setConsentTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStoryIdx((i) => (i + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  function openOverlay(intent: "no" | "notsure") {
    setOverlayIntent(intent);
    setFlowState("overlay");
  }

  function closeOverlay() {
    setFlowState("initial");
    setName("");
    setPhone("");
    setPhoneVerified(false);
    setVerifying(false);
    setCallTime("");
    setConsent(false);
    setConsentTime("");
    setSubmitted(false);
  }

  function handlePhoneChange(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    setPhoneVerified(false);
  }

  async function handleVerify() {
    if (phone.length !== 10 || verifying || phoneVerified) return;
    setVerifying(true);
    // TODO: Replace with Twilio Lookup API — await fetch(`/api/verify-phone?number=${phone}`)
    await new Promise((r) => setTimeout(r, 2500));
    setVerifying(false);
    setPhoneVerified(true);
  }

  function handleConsentChange(checked: boolean) {
    setConsent(checked);
    if (checked) setConsentTime(new Date().toISOString());
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const lead = {
      vehicle_make: risk.make,
      vehicle_model: risk.model,
      vehicle_year: String(risk.year),
      province: risk.province,
      risk_level: risk.level,
      risk_score: risk.score,
      name: name.trim(),
      phone,
      preferred_call_time: callTime,
      phone_verified: phoneVerified,
      consent_given: true,
      consent_timestamp: consentTime,
      consent_method: "web_checkbox",
      created_at: new Date().toISOString(),
    };
    try {
      const existing: typeof lead[] = JSON.parse(localStorage.getItem("safecheck_leads") || "[]");
      // Deduplicate: update existing lead for same phone instead of adding a duplicate
      const idx = existing.findIndex((l) => l.phone === phone);
      if (idx >= 0) {
        existing[idx] = lead;
      } else {
        existing.push(lead);
      }
      localStorage.setItem("safecheck_leads", JSON.stringify(existing));
      // TODO: POST lead to backend webhook — await fetch("/api/leads", { method: "POST", body: JSON.stringify(lead) })
    } catch {
      // storage unavailable
    }
    setSubmitted(true);
  }

  const canSubmit =
    name.trim().length > 0 &&
    phone.length === 10 &&
    phoneVerified &&
    callTime !== "" &&
    consent;

  const accentColor = overlayIntent === "no" ? "var(--color-primary)" : "var(--color-warning)";
  const accentBg = overlayIntent === "no" ? "var(--color-primary-pale)" : "var(--color-warning-bg)";
  const accentIcon = overlayIntent === "no" ? "shield-outline" : "help-circle-outline";

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
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "0 0 16px" }}>
              Get a free call from a licensed advisor today.
            </p>

            {/* 3 buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {/* YES */}
              <button
                onClick={() => setFlowState("yes")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 8, border: "1px solid var(--color-border)",
                  background: flowState === "yes" ? "var(--color-success-bg)" : "#fff",
                  cursor: "pointer", width: "100%", textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="checkmark-circle-outline" size={20} color="var(--color-success)" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>Yes</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>I have insurance cover</div>
                  </div>
                </div>
                <Icon name="chevron-forward-outline" size={16} color="var(--color-text-muted)" />
              </button>

              {/* NO */}
              <button
                onClick={() => openOverlay("no")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 8, border: "none",
                  background: "var(--color-primary)", cursor: "pointer", width: "100%", textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="close-circle-outline" size={20} color="#fff" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>No</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>I need protection now</div>
                  </div>
                </div>
                <Icon name="chevron-forward-outline" size={16} color="rgba(255,255,255,0.75)" />
              </button>

              {/* NOT SURE */}
              <button
                onClick={() => openOverlay("notsure")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 8, border: "1px solid var(--color-border)",
                  background: "#fff", cursor: "pointer", width: "100%", textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="help-circle-outline" size={20} color="var(--color-warning)" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>Not sure</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Help me check my cover</div>
                  </div>
                </div>
                <Icon name="chevron-forward-outline" size={16} color="var(--color-text-muted)" />
              </button>
            </div>

            {/* YES content */}
            <AnimatePresence>
              {flowState === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    padding: 16, borderRadius: 8,
                    background: "var(--color-success-bg)",
                    border: "1px solid #bbf7d0",
                    marginBottom: 0,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <Icon name="shield-checkmark-outline" size={18} color="var(--color-success)" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-success)" }}>
                        Good — your {car} has some protection.
                      </span>
                    </div>
                    <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        "Make sure you have comprehensive cover, not just third-party.",
                        "Check your excess amount — high excess means big out-of-pocket costs.",
                        "Confirm your tracker subscription is active and monitored 24/7.",
                      ].map((item) => (
                        <li key={item} style={{ fontSize: 12, color: "var(--color-text)", lineHeight: 1.5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rotating comment boxes */}
            {flowState === "initial" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`regret-${storyIdx}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: "10px 12px", borderRadius: 8,
                      background: "var(--color-primary-pale)",
                      border: "1px solid #fecaca",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <Icon name="warning-outline" size={14} color="var(--color-primary)" />
                      <p style={{ fontSize: 11, color: "var(--color-primary)", margin: 0, lineHeight: 1.5 }}>
                        {REGRET_STORIES[storyIdx % REGRET_STORIES.length](car)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`protected-${storyIdx}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{
                      padding: "10px 12px", borderRadius: 8,
                      background: "var(--color-success-bg)",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <Icon name="shield-checkmark-outline" size={14} color="var(--color-success)" />
                      <p style={{ fontSize: 11, color: "var(--color-success)", margin: 0, lineHeight: 1.5 }}>
                        {PROTECTED_STORIES[storyIdx % PROTECTED_STORIES.length](car)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
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
              background: "rgba(17, 24, 39, 0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "#fff", borderRadius: 12,
                width: "100%", maxWidth: 480,
                maxHeight: "calc(100vh - 32px)",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
            >
              {submitted ? (
                /* Success state */
                <div style={{ padding: 32, textAlign: "center" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "var(--color-success-bg)", margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="checkmark-circle" size={32} color="var(--color-success)" />
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-text)", margin: "0 0 8px" }}>
                    We'll call you, {name.trim()}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
                    A licensed advisor will contact you about your {car} during{" "}
                    <strong>{callTime}</strong>.
                  </p>
                  <div style={{
                    padding: "10px 14px", borderRadius: 8,
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    fontSize: 11, color: "var(--color-text-muted)",
                    textAlign: "left", lineHeight: 1.6,
                  }}>
                    POPIA consent recorded at {consentTime ? new Date(consentTime).toLocaleString("en-ZA") : "—"}
                  </div>
                  <button
                    onClick={closeOverlay}
                    style={{
                      marginTop: 16, width: "100%", height: 44,
                      borderRadius: 8, border: "none",
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
                    padding: "16px 20px 12px",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                    position: "sticky", top: 0, background: "#fff", zIndex: 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: accentBg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Icon name={accentIcon} size={20} color={accentColor} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>
                          {overlayIntent === "no" ? "Get your vehicle protected" : "Let us check your cover"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                          Free call with an FSCA-licensed advisor
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeOverlay}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: 4, color: "var(--color-text-muted)",
                        display: "flex", alignItems: "center", borderRadius: "50%",
                        width: 32, height: 32, flexShrink: 0,
                      }}
                    >
                      <Icon name="close-outline" size={20} color="var(--color-text-muted)" />
                    </button>
                  </div>

                  <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Rotating risk story */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`overlay-story-${storyIdx}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          padding: "10px 12px", borderRadius: 8,
                          background: accentBg,
                          border: `1px solid ${overlayIntent === "no" ? "#fecaca" : "#fde68a"}`,
                        }}
                      >
                        <p style={{ fontSize: 11, color: accentColor, margin: 0, lineHeight: 1.55 }}>
                          {REGRET_STORIES[storyIdx % REGRET_STORIES.length](car)}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Fear bullets */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {[
                        risk.minutesApart > 0
                          ? `One ${car} stolen every ${risk.minutesApart} minutes in SA`
                          : `${car} is among the most targeted vehicles in SA`,
                        `Only ${risk.recoveredPct}% of stolen vehicles are ever recovered`,
                        `${risk.gonePct}% are gone permanently — usually across the border`,
                      ].map((bullet) => (
                        <div key={bullet} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <Icon name="alert-circle-outline" size={13} color={accentColor} />
                          <span style={{ fontSize: 11, color: "var(--color-text)", lineHeight: 1.5 }}>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    {/* Name */}
                    <div>
                      <label style={labelStyle}>Your name</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                      />
                    </div>

                    {/* Phone + verify */}
                    <div>
                      <label style={labelStyle}>Cell number</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="tel"
                          placeholder="0821234567"
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          style={{ ...inputStyle, flex: 1 }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                          maxLength={10}
                        />
                        <button
                          onClick={handleVerify}
                          disabled={phone.length !== 10 || verifying || phoneVerified}
                          style={{
                            height: 44, padding: "0 14px", borderRadius: 8,
                            border: "none", flexShrink: 0,
                            background: phoneVerified
                              ? "var(--color-success-bg)"
                              : phone.length === 10 && !verifying
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                            color: phoneVerified
                              ? "var(--color-success)"
                              : phone.length === 10 && !verifying
                              ? "#fff"
                              : "var(--color-text-muted)",
                            fontSize: 12, fontWeight: 600, cursor: phoneVerified || phone.length !== 10 ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", gap: 5,
                            transition: "background 0.2s",
                          }}
                        >
                          {verifying ? (
                            <>
                              <span style={{
                                width: 12, height: 12, borderRadius: "50%",
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "#fff",
                                display: "inline-block",
                                animation: "spin 0.7s linear infinite",
                              }} />
                              Checking
                            </>
                          ) : phoneVerified ? (
                            <>
                              <Icon name="checkmark-circle" size={14} color="var(--color-success)" />
                              OK
                            </>
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
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
                              padding: "9px 10px", borderRadius: 8, cursor: "pointer",
                              border: callTime === t.label
                                ? `2px solid var(--color-primary)`
                                : "1px solid var(--color-border)",
                              background: callTime === t.label ? "var(--color-primary-pale)" : "#fff",
                              textAlign: "left",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 600, color: callTime === t.label ? "var(--color-primary)" : "var(--color-text)" }}>
                              {t.label}
                            </div>
                            <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 1 }}>
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
                        I consent to being contacted by FSCA-licensed providers about vehicle insurance. I have read and agree to the{" "}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: "var(--color-primary)", textDecoration: "none" }}
                        >
                          Privacy Policy
                        </a>
                        .
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      style={{
                        width: "100%", height: 48, borderRadius: 8, border: "none",
                        background: canSubmit ? "var(--color-primary)" : "var(--color-border)",
                        color: canSubmit ? "#fff" : "var(--color-text-muted)",
                        fontSize: 14, fontWeight: 700,
                        cursor: canSubmit ? "pointer" : "not-allowed",
                        transition: "background 0.15s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}
                    >
                      <Icon name="call-outline" size={16} color={canSubmit ? "#fff" : "var(--color-text-muted)"} />
                      Request My Free Call
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
