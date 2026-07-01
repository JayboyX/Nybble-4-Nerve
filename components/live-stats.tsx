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

// Cumulative share of the day's total reached by the start of each hour —
// low overnight, climbing through the day, reaching 100% by midnight.
const STOLEN_TODAY_CURVE = [
  0.02, 0.035, 0.045, 0.05, 0.06, 0.08, 0.12, 0.18,
  0.26, 0.34, 0.40, 0.46, 0.52, 0.57, 0.62, 0.67,
  0.73, 0.79, 0.85, 0.90, 0.94, 0.97, 0.99, 1.0,
];

// Derives a stable value from the real "stolen today" total based on time of
// day — e.g. 7-8am shows a lower share than 8-9am — instead of ticking up
// live while the page is open. Changes only when the hour changes or the
// page is revisited, so every visit within the same hour sees the same number.
function getStolenTodayValue(dailyTotal: number): number {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const share = STOLEN_TODAY_CURVE[h];
  const nextShare = STOLEN_TODAY_CURVE[(h + 1) % 24];
  const interpolated = share + (nextShare - share) * (m / 60);
  return Math.max(1, Math.round(dailyTotal * interpolated));
}

export function StolenTodayCounter({ initial }: { initial: number }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getStolenTodayValue(initial));
  }, [initial]);

  if (count === null) return <span>--</span>;
  return <span>{fmt(count)}</span>;
}

export function ChecksTodayCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getChecksBase());
  }, []);

  if (count === null) return <span>--</span>;
  return <span>{fmt(count)}</span>;
}
