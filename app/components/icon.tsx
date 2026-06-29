"use client";

import { useEffect, useRef, useState } from "react";

let scriptsLoaded = false;

export function IonIconLoader() {
  useEffect(() => {
    if (scriptsLoaded) return;
    scriptsLoaded = true;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://unpkg.com/ionicons@7.4.0/dist/ionicons/ionicons.esm.js";
    document.head.appendChild(s);
  }, []);
  return null;
}

export function Icon({
  name,
  size = 18,
  color,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span style={{ display: "inline-block", width: size, height: size, ...style }} />;
  }

  return (
    <span
      ref={ref}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{
        __html: `<ion-icon name="${name}" style="font-size:${size}px;${color ? `color:${color};` : ""}display:block;"></ion-icon>`,
      }}
    />
  );
}
