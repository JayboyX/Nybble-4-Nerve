"use client";

import { useState, useMemo } from "react";
import { Icon } from "./icon";
import {
  getRecentMakes,
  getAllMakes,
  getModelsForMake,
  getYearsForModel,
  SA_PROVINCES,
} from "@/app/lib/vehicles";

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 10px",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  fontSize: 13,
  color: "var(--color-text)",
  backgroundColor: "var(--color-surface-raised)",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  transition: "border-color 0.15s",
};

export function CarCheckForm({
  onClose,
  onSubmit,
}: {
  onClose?: () => void;
  onSubmit?: (data: { make: string; model: string; year: string; province: string }) => void;
}) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [province, setProvince] = useState("");

  const recentMakes = useMemo(() => getRecentMakes(), []);
  const allMakes = useMemo(() => getAllMakes(), []);
  const { recent: recentModels, all: allModels } = useMemo(() => getModelsForMake(make), [make]);
  const years = useMemo(() => getYearsForModel(make, model), [make, model]);

  const isComplete = make && model && year && province;

  function handleMakeChange(val: string) { setMake(val); setModel(""); setYear(""); }
  function handleModelChange(val: string) { setModel(val); setYear(""); }

  function handleSubmit() {
    if (!isComplete) return;
    if (onSubmit) {
      onSubmit({ make, model, year, province });
    } else {
      const params = new URLSearchParams({ make, model, year, province });
      window.location.href = `/results?${params.toString()}`;
    }
  }

  return (
    <div
      id="check"
      style={{
        background: "var(--color-surface)",
        borderRadius: 10,
        border: "1px solid var(--color-border)",
        padding: 14,
        maxWidth: 480,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {onClose && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 4, color: "var(--color-text-muted)", borderRadius: 4,
              display: "flex", alignItems: "center", transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)")}
          >
            <Icon name="close-outline" size={18} color="currentColor" />
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <select value={make} onChange={(e) => handleMakeChange(e.target.value)} style={selectStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}>
          <option value="">Make...</option>
          <optgroup label="Popular">
            {recentMakes.map((m) => <option key={`r-${m}`} value={m}>{m}</option>)}
          </optgroup>
          <optgroup label="All Makes">
            {allMakes.filter((m) => !recentMakes.includes(m)).map((m) => <option key={m} value={m}>{m}</option>)}
          </optgroup>
        </select>

        <select value={model} onChange={(e) => handleModelChange(e.target.value)} disabled={!make}
          style={{ ...selectStyle, opacity: make ? 1 : 0.5, cursor: make ? "pointer" : "not-allowed", background: make ? "var(--color-surface-raised)" : "var(--color-background)" }}
          onFocus={(e) => { if (make) e.target.style.borderColor = "var(--color-primary)"; }}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}>
          <option value="">Model...</option>
          {recentModels.length > 0 && (
            <optgroup label="Popular">
              {recentModels.map((m) => <option key={`r-${m.name}`} value={m.name}>{m.name}</option>)}
            </optgroup>
          )}
          <optgroup label="All Models">
            {allModels.filter((m) => !recentModels.some((r) => r.name === m.name)).map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
          </optgroup>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} disabled={!model}
          style={{ ...selectStyle, opacity: model ? 1 : 0.5, cursor: model ? "pointer" : "not-allowed", background: model ? "var(--color-surface-raised)" : "var(--color-background)" }}
          onFocus={(e) => { if (model) e.target.style.borderColor = "var(--color-primary)"; }}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}>
          <option value="">Year...</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select value={province} onChange={(e) => setProvince(e.target.value)} style={selectStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}>
          <option value="">Province...</option>
          {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isComplete}
        style={{
          width: "100%", height: 42, marginTop: 10, borderRadius: 6, border: "none",
          background: isComplete ? "var(--color-primary)" : "var(--color-surface-raised)",
          color: isComplete ? "#fff" : "var(--color-text-muted)",
          fontSize: 13, fontWeight: 700, letterSpacing: "0.02em",
          cursor: isComplete ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => { if (isComplete) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-dark)"; }}
        onMouseLeave={(e) => { if (isComplete) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary)"; }}
      >
        <Icon name="warning-outline" size={14} color="currentColor" />
        {isComplete ? "CHECK MY RISK" : "SELECT YOUR VEHICLE"}
      </button>

      <p style={{ fontSize: 10, color: "var(--color-text-muted)", textAlign: "center", margin: "8px 0 0" }}>
        <Icon name="lock-closed-outline" size={9} color="var(--color-text-muted)" style={{ marginRight: 3 }} />
        Your privacy matters. Data shared only with your consent.
      </p>
    </div>
  );
}
