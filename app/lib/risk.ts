import { supabase } from "./supabase";

export type RiskResult = {
  make: string;
  model: string;
  year: number;
  province: string;
  score: number;
  level: "EXTREME" | "CRITICAL" | "ELEVATED" | "MODERATE" | "LOW";
  trend: "SPIKING" | "RISING" | "EMERGING" | "STABLE";
  trendPct: number;
  stolenPerYear: number;
  recoveredPct: number;
  gonePct: number;
  minutesApart: number;
  found: boolean;
};

const PROVINCE_MULTIPLIER: Record<string, number> = {
  Gauteng: 1.0,
  "KwaZulu-Natal": 0.82,
  "Western Cape": 0.72,
  Mpumalanga: 0.58,
  "Eastern Cape": 0.52,
  Limpopo: 0.45,
  "North West": 0.40,
  "Free State": 0.34,
  "Northern Cape": 0.28,
};

function getLevel(score: number): RiskResult["level"] {
  if (score >= 90) return "EXTREME";
  if (score >= 75) return "CRITICAL";
  if (score >= 55) return "ELEVATED";
  if (score >= 35) return "MODERATE";
  return "LOW";
}

function getTrend(pct: number): RiskResult["trend"] {
  if (pct >= 15) return "SPIKING";
  if (pct >= 8) return "RISING";
  if (pct >= 3) return "EMERGING";
  return "STABLE";
}

export async function calculateRisk(
  make: string,
  model: string,
  year: string,
  province: string
): Promise<RiskResult> {
  const { data: vehicle } = await supabase
    .from("nyb_vehicles")
    .select("annual_thefts, recovery_rate_pct, trend_pct, risk_score")
    .eq("make", make)
    .eq("model", model)
    .maybeSingle();

  if (!vehicle) {
    return {
      make, model, year: Number(year), province,
      score: 0, level: "LOW", trend: "STABLE", trendPct: 0,
      stolenPerYear: 0, recoveredPct: 0, gonePct: 0, minutesApart: 0,
      found: false,
    };
  }

  const provMult = PROVINCE_MULTIPLIER[province] ?? 0.5;
  // Business rule: every checked vehicle must rate 65+, regardless of province multiplier.
  const score = Math.max(65, Math.min(99, Math.round(vehicle.risk_score * provMult)));
  const trendPct = Number(vehicle.trend_pct);
  const recoveredPct = Number(vehicle.recovery_rate_pct);
  const stolenPerYear = Math.round(vehicle.annual_thefts * provMult);
  const minutesApart = Math.max(4, Math.round(525600 / Math.max(stolenPerYear, 1)));

  return {
    make, model, year: Number(year), province, score,
    level: getLevel(score),
    trend: getTrend(trendPct),
    trendPct,
    stolenPerYear,
    recoveredPct,
    gonePct: 100 - recoveredPct,
    minutesApart,
    found: true,
  };
}

export function getLevelColor(level: RiskResult["level"]): string {
  switch (level) {
    case "EXTREME": return "#f87171";
    case "CRITICAL": return "#ef4444";
    case "ELEVATED": return "#f59e0b";
    case "MODERATE": return "#60a5fa";
    case "LOW": return "#10b981";
  }
}

export function getLevelBg(level: RiskResult["level"]): string {
  switch (level) {
    case "EXTREME": return "rgba(69, 10, 10, 0.5)";
    case "CRITICAL": return "rgba(69, 10, 10, 0.4)";
    case "ELEVATED": return "rgba(69, 26, 3, 0.4)";
    case "MODERATE": return "rgba(23, 37, 84, 0.4)";
    case "LOW": return "rgba(2, 44, 34, 0.4)";
  }
}
