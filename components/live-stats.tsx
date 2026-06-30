"use client";

import { useState, useEffect } from "react";

// Checks-today hourly baseline (peaks ~7AM commute, dips overnight)
const HOURLY_BASE = [
  18200, // 0 midnight
  17100, // 1
  16500, // 2
  16400, // 3
  17000, // 4
  20000, // 5
  29000, // 6
  41000, // 7 — morning rush peak
  35500, // 8
  30200, // 9
  27000, // 10
  25500, // 11
  25000, // 12
  24500, // 13
  25500, // 14
  27000, // 15
  30000, // 16
  33000, // 17
  30000, // 18
  27000, // 19
  24000, // 20
  22000, // 21
  21000, // 22
  19500, // 23
];

function fmt(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getChecksBase(): number {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const base = HOURLY_BASE[h];
  const next = HOURLY_BASE[(h + 1) % 24];
  return Math.round(base + (next - base) * (m / 60));
}

export function StolenTodayCounter({ initial }: { initial: number }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(initial);

    const tick = () => {
      // I-008: most increments are +1, occasional burst of 6+
      const burst = Math.random() < 0.15;
      const increment = burst ? Math.floor(Math.random() * 8) + 6 : 1;
      setCount((c) => (c ?? initial) + increment);

      // Next increment: 45–90 seconds
      const nextMs = 45000 + Math.random() * 45000;
      timeout = setTimeout(tick, nextMs);
    };

    // I-005: first increment within 60 seconds
    let timeout = setTimeout(tick, 30000 + Math.random() * 25000);
    return () => clearTimeout(timeout);
  }, [initial]);

  if (count === null) return <span>--</span>;
  return <span>{fmt(count)}</span>;
}

export function ChecksTodayCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const base = getChecksBase();
    setCount(base);

    const interval = setInterval(() => {
      setCount((c) => (c ?? base) + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (count === null) return <span>--</span>;
  return <span>{fmt(count)}</span>;
}
