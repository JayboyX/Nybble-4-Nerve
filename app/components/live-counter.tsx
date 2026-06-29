"use client";

import { useEffect, useState } from "react";

function fmt(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getBaseCount(): number {
  const now = new Date();
  const saHour =
    now.getUTCHours() + 2 >= 24
      ? now.getUTCHours() + 2 - 24
      : now.getUTCHours() + 2;
  const minuteOfDay = saHour * 60 + now.getMinutes();
  const dayProgress = minuteOfDay / 1440;
  return Math.round(16400 + dayProgress * (43600 - 16400));
}

export function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getBaseCount());

    const tick = () => {
      const delay = 800 + Math.random() * 4200;
      const burst =
        Math.random() < 0.2
          ? Math.round(6 + Math.random() * 17)
          : Math.round(1 + Math.random() * 3);
      setCount((c) => (c ?? getBaseCount()) + burst);
      setTimeout(tick, delay);
    };
    const id = setTimeout(tick, 1000 + Math.random() * 2000);
    return () => clearTimeout(id);
  }, []);

  if (count === null) return <>--</>;
  return <>{fmt(count)}</>;
}
