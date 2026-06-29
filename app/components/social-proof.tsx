"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icon";

const FIRST_NAMES = [
  "Thabo", "Sipho", "Nomsa", "Lerato", "Kagiso", "Zanele", "Bongani",
  "Palesa", "Andile", "Naledi", "Mpho", "Lindiwe", "Tshepo", "Ayanda",
  "Katlego", "Refiloe", "Sibusiso", "Thandi", "Lesego", "Mandla",
];

const LOCATIONS = [
  "Sandton", "Centurion", "Durban North", "Fourways", "Umhlanga",
  "Bellville", "Midrand", "Boksburg", "Randburg", "Hatfield",
  "Kempton Park", "Roodepoort", "Benoni", "Alberton", "Edenvale",
];

const CARS = [
  "Toyota Hilux", "VW Polo", "Ford Ranger", "Toyota Fortuner",
  "Hyundai Tucson", "BMW 3 Series", "Kia Seltos", "Nissan NP200",
  "Mercedes C-Class", "Hyundai Creta", "Toyota Corolla", "Mazda CX-5",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SocialProofNotifications() {
  const [notification, setNotification] = useState<{ name: string; location: string; car: string } | null>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    setNotification({
      name: randomFrom(FIRST_NAMES),
      location: randomFrom(LOCATIONS),
      car: randomFrom(CARS),
    });
    setVisible(true);
  }, []);

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    const firstDelay = 4000 + Math.random() * 1000;
    const t1 = setTimeout(show, firstDelay);

    const interval = setInterval(() => {
      show();
    }, 12000 + Math.random() * 8000);

    return () => { clearTimeout(t1); clearInterval(interval); };
  }, [show]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, 6000);
    return () => clearTimeout(t);
  }, [visible, notification, dismiss]);

  return (
    <AnimatePresence>
      {visible && notification && (
        <motion.div
          initial={{ opacity: 0, y: 60, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            right: 20,
            maxWidth: 380,
            zIndex: 200,
            background: "#fff",
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--color-success-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Icon name="shield-checkmark" size={16} color="#16a34a" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, color: "var(--color-text)", margin: 0, lineHeight: 1.5 }}>
              <strong>{notification.name}</strong> from {notification.location} just scheduled a protection call for their <strong>{notification.car}</strong>
            </p>
            <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "4px 0 0" }}>
              Just now
            </p>
          </div>
          <button
            onClick={dismiss}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 2, color: "var(--color-text-muted)", flexShrink: 0,
            }}
          >
            <Icon name="close-outline" size={16} color="var(--color-text-muted)" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
