"use client";

import { useEffect, useRef, useState } from "react";

type Province = {
  name: string;
  level: string;
  pct: number;
};

export function ProvinceBars({ provinces }: { provinces: Province[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {provinces.map((prov) => {
        const color =
          prov.level === "Critical"
            ? "var(--color-primary)"
            : prov.level === "High"
            ? "var(--color-warning)"
            : "var(--color-text-muted)";

        return (
          <div key={prov.name}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "var(--color-text)" }}>{prov.name}</span>
              <span style={{ fontWeight: 600, color }}>{prov.level}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--color-border)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 3,
                  width: animated ? `${prov.pct}%` : "0%",
                  background: color,
                  transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
