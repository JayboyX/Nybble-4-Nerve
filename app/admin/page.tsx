import { getSupabaseAdmin } from "@/app/lib/supabase-admin";
import { AdminClient } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: leads } = await getSupabaseAdmin()
    .from("nyb_leads")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminClient initialLeads={leads ?? []} />;
}
