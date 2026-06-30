import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("nyb_leads").insert({
      full_name: body.name,
      phone: body.phone,
      province: body.province,
      vehicle_make: body.vehicle_make,
      vehicle_model: body.vehicle_model,
      vehicle_year: Number(body.vehicle_year),
      risk_score: body.risk_score,
      consent_given: true,
      consent_at: body.consent_timestamp,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
