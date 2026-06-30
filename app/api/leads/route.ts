import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// In-memory rate limiter — resets per serverless instance
const rateMap = new Map<string, { count: number; reset: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const SPAM_NAMES = ["test", "testing", "admin", "null", "undefined", "asdf", "lorem", "xxx"];
const SPAM_PHONES = ["0000000000", "1111111111", "2222222222", "9999999999", "0123456789"];

function isSpam(name: string, phone: string): boolean {
  const n = name.toLowerCase().trim();
  if (SPAM_NAMES.some((s) => n.includes(s))) return true;
  if (SPAM_PHONES.includes(phone)) return true;
  return false;
}

function generateReference(): string {
  return "SC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  // L-009: Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // L-001: Validate consent
  if (body.consent_given !== true) {
    return NextResponse.json({ error: "Consent required" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
  }

  // L-010: Spam filter
  if (isSpam(name, phone)) {
    return NextResponse.json({ error: "Submission rejected" }, { status: 422 });
  }

  // L-002: Persist to Supabase nyb_leads
  const { error } = await supabase.from("nyb_leads").insert({
    full_name: name,
    phone,
    province: body.province,
    vehicle_make: body.vehicle_make,
    vehicle_model: body.vehicle_model,
    vehicle_year: Number(body.vehicle_year),
    risk_score: body.risk_score,
    risk_level: body.risk_level,
    preferred_call_time: body.preferred_call_time,
    phone_verified: body.phone_verified ?? false,
    consent_given: true,
    consent_at: body.consent_timestamp,
    consent_method: "web_checkbox",
    status: "new",
  });

  if (error) {
    console.error("Lead insert error:", error.message);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // L-004: Partner webhook — fire-and-forget if configured
  const webhookUrl = process.env.PARTNER_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, submitted_at: new Date().toISOString() }),
    }).catch(() => {});
  }

  // L-005: Return reference number
  const reference = generateReference();
  return NextResponse.json({ ok: true, reference });
}
