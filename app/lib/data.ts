import { supabase } from "./supabase";

export async function getStats() {
  const { data } = await supabase
    .from("nyb_stats")
    .select("stolen_today, annual_thefts, recovery_rate_pct, time_to_border_min")
    .single();
  return data ?? { stolen_today: 47, annual_thefts: 72614, recovery_rate_pct: 38, time_to_border_min: 45 };
}

export async function getTopStolen() {
  const { data } = await supabase
    .from("nyb_vehicles")
    .select("make, model, annual_thefts, trend_pct")
    .order("annual_thefts", { ascending: false })
    .limit(5);
  return (data ?? []).map((v, i) => ({
    rank: i + 1,
    name: `${v.make} ${v.model}`,
    volume: v.annual_thefts,
    trend: `+${v.trend_pct}%`,
  }));
}

export async function getProvinces() {
  const { data } = await supabase
    .from("nyb_provinces")
    .select("name, risk_level, theft_index")
    .order("theft_index", { ascending: false });
  return (data ?? []).map((p) => ({
    name: p.name,
    pct: p.theft_index,
    level: p.risk_level.charAt(0).toUpperCase() + p.risk_level.slice(1),
  }));
}

export async function getStories() {
  const { data } = await supabase
    .from("nyb_stories")
    .select("location, car, summary")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export const HOW_IT_WORKS = [
  { step: 1, title: "Enter your vehicle", description: "Tell us your car make, model, and year." },
  { step: 2, title: "Get your risk score", description: "We cross-reference SAPS crime statistics for your exact vehicle." },
  { step: 3, title: "See the reality", description: "View theft rates, hijacking hotspots, and recovery odds for your car." },
  { step: 4, title: "Protect yourself", description: "Schedule a free call with a licensed insurance advisor." },
] as const;
