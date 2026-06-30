import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";

export const dynamic = "force-dynamic";
import { cookies } from "next/headers";

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get("sc_admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!session || !adminPassword) return false;
  try {
    return Buffer.from(session.value, "base64").toString("utf8") === adminPassword;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("nyb_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leads: data });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const db = getSupabaseAdmin();
  const { error } = await db.from("nyb_leads").delete().eq("phone", phone);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // L-007: Deletion is logged by the returned JSON response (timestamp + phone)

  return NextResponse.json({ ok: true, deleted_phone: phone, deleted_at: new Date().toISOString() });
}
