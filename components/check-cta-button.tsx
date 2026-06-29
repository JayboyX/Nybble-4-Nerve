"use client";

import { Icon } from "./icon";

export function CheckCtaButton() {
  function handleClick() {
    const hero = document.getElementById("hero-section");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-check-form"));
      }, 400);
    }
  }

  return (
    <button
      onClick={handleClick}
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
        transition: "background 0.15s",
        boxShadow: "0 4px 14px rgba(220, 38, 38, 0.2)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-dark)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-primary)")}
    >
      Check My Car Now
      <Icon name="arrow-forward-outline" size={16} color="#fff" />
    </button>
  );
}
