"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icon";
import type { RiskResult } from "@/app/lib/risk";

function buildShareMessage(risk: RiskResult, url: string): string {
  const make = risk.make.toUpperCase();
  const model = risk.model.toUpperCase();
  const level = risk.level;
  return [
    `\u{1F6A8} WARNING: Your ${make} ${model} could be next.`,
    ``,
    `SafeCheck SA rated the ${make} ${model} as ${level} risk in ${risk.province}.`,
    `${risk.score}/100 risk score — only ${risk.recoveredPct}% are ever recovered.`,
    ``,
    `Check YOUR car now: ${url}`,
    ``,
    `Is YOUR car on the list? \u{1F6A8}`,
  ].join("\n");
}

export function ShareModal({
  risk,
  onClose,
}: {
  risk: RiskResult;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const message = buildShareMessage(risk, url || "https://safecheck.intermediateds.co.za");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = message;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: message, url });
      } catch {
        // user cancelled or API unavailable
      }
    } else {
      handleCopy();
    }
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={backdropRef}
        onClick={handleBackdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(17,24,39,0.55)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
        className="share-backdrop"
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          style={{
            background: "#fff",
            width: "100%",
            maxWidth: 520,
            borderRadius: "16px 16px 0 0",
            padding: "24px 20px 32px",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
          }}
          className="share-modal-inner"
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                Warn Your Network
              </p>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "2px 0 0" }}>
                Share this risk alert about the {risk.make} {risk.model}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close share modal"
              style={{
                background: "none", border: "none", cursor: "pointer",
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <Icon name="close-outline" size={20} color="var(--color-text-muted)" />
            </button>
          </div>

          {/* Pre-filled message preview */}
          <div style={{
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 16,
            fontSize: 13,
            color: "var(--color-text)",
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            maxHeight: 180,
            overflowY: "auto",
          }}>
            {message}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Copy */}
            <button
              onClick={handleCopy}
              style={{
                width: "100%", height: 48, borderRadius: 8,
                border: `1px solid ${copied ? "#bbf7d0" : "var(--color-border)"}`,
                background: copied ? "var(--color-success-bg)" : "var(--color-background)",
                color: copied ? "var(--color-success)" : "var(--color-text)",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <Icon
                name={copied ? "checkmark-circle-outline" : "copy-outline"}
                size={18}
                color={copied ? "var(--color-success)" : "var(--color-text-muted)"}
              />
              {copied ? "Copied!" : "Copy Alert Message"}
            </button>

            {/* Native share / WhatsApp */}
            <button
              onClick={handleNativeShare}
              style={{
                width: "100%", height: 48, borderRadius: 8, border: "none",
                background: "var(--color-primary)", color: "#fff",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Icon name="share-social-outline" size={18} color="#fff" />
              Share Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
