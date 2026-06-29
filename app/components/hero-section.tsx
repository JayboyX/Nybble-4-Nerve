"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import { LiveCounter } from "./live-counter";
import { CarCheckForm } from "./car-check-form";
import { ScanScreen } from "./scan-screen";

type FormData = { make: string; model: string; year: string; province: string };

export function HeroSection() {
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
      <section id="hero-section" style={{ background: "#fff", borderBottom: "1px solid var(--color-border)", overflow: "hidden" }}>
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
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 24,
                  }}
                >
                  <Icon name="shield-checkmark-outline" size={16} color="var(--color-primary)" />
                  <LiveCounter /> checks today
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
                  Is YOUR Car on the Most-Hijacked List?
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: "var(--color-text-muted)",
                    maxWidth: 480,
                    margin: "0 auto 32px",
                    lineHeight: 1.6,
                  }}
                >
                  Check your vehicle against real South African theft and hijacking
                  statistics. Free. Instant. Anonymous.
                </p>
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 28px",
                    borderRadius: 8,
                    border: "none",
                    background: "var(--color-primary)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(220, 38, 38, 0.2)",
                  }}
                >
                  Check My Car Now
                  <Icon name="arrow-forward-outline" size={16} color="#fff" />
                </motion.button>
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
