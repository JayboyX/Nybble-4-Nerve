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
  height: 48,
  padding: "0 14px",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 14,
  color: "var(--color-text)",
  backgroundColor: "#fff",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  transition: "border-color 0.15s",
};

const selectDisabledStyle: React.CSSProperties = {
  ...selectStyle,
  opacity: 0.5,
  cursor: "not-allowed",
  backgroundColor: "#f9fafb",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--color-text-muted)",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
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
  const { recent: recentModels, all: allModels } = useMemo(
    () => getModelsForMake(make),
    [make]
  );
  const years = useMemo(
    () => getYearsForModel(make, model),
    [make, model]
  );

  const isComplete = make && model && year && province;

  function handleMakeChange(val: string) {
    setMake(val);
    setModel("");
    setYear("");
  }

  function handleModelChange(val: string) {
    setModel(val);
    setYear("");
  }

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
        background: "#fff",
        borderRadius: 10,
        border: "1px solid var(--color-border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        padding: 28,
        maxWidth: 520,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", margin: "0 0 4px" }}>
            Check Your Vehicle
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0 }}>
            Select your car to see its risk profile
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: 32,
              height: 32,
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-background)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <Icon name="close-outline" size={20} color="var(--color-text-muted)" />
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Make */}
        <div>
          <label style={labelStyle}>Make</label>
          <select
            value={make}
            onChange={(e) => handleMakeChange(e.target.value)}
            style={selectStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          >
            <option value="">Select make</option>
            <optgroup label="Popular">
              {recentMakes.map((m) => (
                <option key={`r-${m}`} value={m}>{m}</option>
              ))}
            </optgroup>
            <optgroup label="All Makes">
              {allMakes
                .filter((m) => !recentMakes.includes(m))
                .map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
            </optgroup>
          </select>
        </div>

        {/* Model */}
        <div>
          <label style={labelStyle}>Model</label>
          <select
            value={model}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={!make}
            style={make ? selectStyle : selectDisabledStyle}
            onFocus={(e) => { if (make) e.target.style.borderColor = "var(--color-primary)"; }}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          >
            <option value="">Select model</option>
            {recentModels.length > 0 && (
              <optgroup label="Popular">
                {recentModels.map((m) => (
                  <option key={`r-${m.name}`} value={m.name}>{m.name}</option>
                ))}
              </optgroup>
            )}
            <optgroup label="All Models">
              {allModels
                .filter((m) => !recentModels.some((r) => r.name === m.name))
                .map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
            </optgroup>
          </select>
        </div>

        {/* Year */}
        <div>
          <label style={labelStyle}>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={!model}
            style={model ? selectStyle : selectDisabledStyle}
            onFocus={(e) => { if (model) e.target.style.borderColor = "var(--color-primary)"; }}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          >
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Province */}
        <div>
          <label style={labelStyle}>Province</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            style={selectStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          >
            <option value="">Select province</option>
            {SA_PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            height: 52,
            borderRadius: 8,
            border: "none",
            background: isComplete ? "var(--color-primary)" : "#d1d5db",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: isComplete ? "pointer" : "not-allowed",
            opacity: isComplete ? 1 : 0.6,
            transition: "background 0.15s, opacity 0.15s",
            boxShadow: isComplete ? "0 4px 14px rgba(220, 38, 38, 0.2)" : "none",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            if (isComplete) e.currentTarget.style.background = "var(--color-primary-dark)";
          }}
          onMouseLeave={(e) => {
            if (isComplete) e.currentTarget.style.background = "var(--color-primary)";
          }}
        >
          {isComplete ? (
            <>
              CHECK MY RISK
              <Icon name="arrow-forward-outline" size={16} color="#fff" />
            </>
          ) : (
            "SELECT YOUR VEHICLE"
          )}
        </button>

        {/* Privacy note */}
        <p style={{ fontSize: 11, color: "var(--color-text-muted)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
          Your privacy matters. Data shared only with your consent.
        </p>
      </div>
    </div>
  );
}
