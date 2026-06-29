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

function yearFactor(year: number): number {
  const age = 2026 - year;
  if (age <= 2) return 1.1;
  if (age <= 5) return 1.0;
  if (age <= 10) return 0.85;
  if (age <= 15) return 0.7;
  return 0.55;
}

function getLevel(score: number): RiskResult["level"] {
  if (score >= 90) return "EXTREME";
  if (score >= 75) return "CRITICAL";
  if (score >= 55) return "ELEVATED";
  if (score >= 35) return "MODERATE";
  return "LOW";
}

function getTrend(trendPct: number): RiskResult["trend"] {
  if (trendPct >= 15) return "SPIKING";
  if (trendPct >= 8) return "RISING";
  if (trendPct >= 3) return "EMERGING";
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

  const baseScore = vehicle?.risk_score ?? 45 + Math.round(make.length * 3.7 + model.length * 2.3) % 30;
  const baseTrend = vehicle ? Number(vehicle.trend_pct) : 5 + (model.charCodeAt(0) % 12);
  const baseThefts = vehicle?.annual_thefts ?? 800 + ((make.length * model.length * 137) % 2000);
  const baseRecovery = vehicle ? Number(vehicle.recovery_rate_pct) : 25 + ((model.charCodeAt(0) * 7) % 30);

  const provMult = PROVINCE_MULTIPLIER[province] ?? 0.5;
  const yFactor = yearFactor(Number(year));

  const rawScore = Math.round(baseScore * provMult * yFactor);
  const score = Math.max(12, Math.min(99, rawScore));

  const stolenPerYear = Math.round(baseThefts * provMult);
  const recoveredPct = Math.max(15, Math.min(65, Math.round(baseRecovery * (1.3 - provMult * 0.5))));
  const gonePct = 100 - recoveredPct;
  const minutesApart = Math.max(4, Math.round((525600 / Math.max(stolenPerYear, 1))));

  const trendAdjusted = Math.round(baseTrend * provMult * yFactor);
  const trend = getTrend(trendAdjusted);

  return {
    make,
    model,
    year: Number(year),
    province,
    score,
    level: getLevel(score),
    trend,
    trendPct: trendAdjusted,
    stolenPerYear,
    recoveredPct,
    gonePct,
    minutesApart,
  };
}

export function generateStories(make: string, model: string, province: string): string[] {
  const car = `${make} ${model}`;
  const stories = [
    `${car} stolen from secure parking at Menlyn Mall. CCTV shows two suspects with a signal jammer. Vehicle found 3 days later — stripped of all parts worth R180,000.`,
    `Owner of a ${car} hijacked at gunpoint while waiting at a red light in ${province}. Vehicle never recovered. Outstanding finance of R340,000 with no insurance payout — policy had lapsed.`,
    `A ${car} was stolen overnight from a gated estate. The tracker was disabled within 6 minutes. Insurance paid out after 3 months but the excess was R52,000.`,
    `${car} hijacked in a driveway ambush. Owner's child was in the back seat. Vehicle abandoned 2km away but declared a write-off. Trauma counselling costs exceeded R25,000.`,
    `Claim rejected on a stolen ${car} — owner had aftermarket rims not declared on the policy. Total loss: R410,000 vehicle plus R45,000 in modifications.`,
    `${car} stolen using relay attack on keyless entry. Took 47 seconds from approach to departure. SAPS case opened but no leads after 6 months.`,
    `${car} taken at a petrol station while owner went inside to pay. Keys were in the ignition. Insurance denied — "negligence" clause invoked.`,
    `Fleet vehicle (${car}) hijacked during delivery run in ${province}. Driver assaulted and hospitalised. Company lost vehicle, cargo, and 3 weeks of productivity.`,
    `Owner discovered their ${car} was cloned — identical plates spotted in two provinces simultaneously. Real vehicle seized by SAPS for investigation, held for 4 months.`,
    `${car} stolen from dealership forecourt during test drive scam. Fake ID and license used by the "buyer." Vehicle exported within 48 hours.`,
    `A ${car} was hijacked at a school drop-off zone. Three armed suspects. Vehicle found in a chop shop with the VIN already ground off.`,
    `Owner of a ${car} returned from holiday to find the vehicle gone from airport long-term parking. Parking company denied liability. Insurance contested the claim.`,
    `${car} taken in a follow-home robbery from a shopping centre in ${province}. Suspects tracked the owner for 12km before striking at the driveway gate.`,
    `Second-hand ${car} purchased privately turned out to be previously stolen. Vehicle seized by SAPS. Buyer lost R290,000 and has no legal recourse against the seller.`,
    `${car} stolen from a workshop during routine service. Workshop's insurance covered only R150,000 of the R380,000 value. Owner sued for the difference.`,
    `Armed hijacking of a ${car} at a traffic circle. Owner pepper-sprayed and left on the roadside. Vehicle used in a subsequent armed robbery before being torched.`,
    `A ${car} was stolen using a tow truck in broad daylight in ${province}. Neighbours assumed it was a legitimate repossession. No witnesses came forward.`,
    `Insurance renewal on a ${car} increased by 340% after a claim. Owner couldn't afford the premium and cancelled — vehicle stolen 6 weeks later, uninsured.`,
    `${car} disappeared from a guarded parking lot. Guards found unconscious — drugged. CCTV hard drives were removed. No footage, no recovery.`,
    `Owner of a ${car} was forced at gunpoint to drive to an ATM and withdraw cash before the vehicle was taken. Total loss exceeded R500,000 including medical bills.`,
    `${car} was flagged by a tracker company as stationary in a known chop-shop zone. By the time SAPS responded, only the shell remained.`,
    `New ${car} stolen from owner's driveway within 72 hours of purchase. Bank still required full loan repayment. Owner now paying R6,800/month for a car they don't have.`,
    `${car} involved in a smash-and-grab that escalated to a full hijacking when the owner resisted. Medical bills: R78,000. Vehicle recovered but written off.`,
    `A ${car} with a baby seat inside was taken during a house robbery in ${province}. Vehicle found abandoned but the personal items, including the child's medication, were gone.`,
    `Owner's ${car} was stolen after keys were taken during a home invasion. Insurance voided the claim because the alarm system had been deactivated for repairs.`,
  ];
  return stories;
}

export function getLevelColor(level: RiskResult["level"]): string {
  switch (level) {
    case "EXTREME": return "#7f1d1d";
    case "CRITICAL": return "#DC2626";
    case "ELEVATED": return "#D97706";
    case "MODERATE": return "#2563EB";
    case "LOW": return "#16a34a";
  }
}

export function getLevelBg(level: RiskResult["level"]): string {
  switch (level) {
    case "EXTREME": return "#fef2f2";
    case "CRITICAL": return "#fef2f2";
    case "ELEVATED": return "#fffbeb";
    case "MODERATE": return "#eff6ff";
    case "LOW": return "#f0fdf4";
  }
}
