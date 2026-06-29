import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wqgvvvxcxiupucfoyrwo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZ3Z2dnhjeGl1cHVjZm95cndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDU2NjEsImV4cCI6MjA5NDg4MTY2MX0.7ng6526q_EGTBFdKbRKlFqbCbWNLvclgndBAULzL6lY"
);

const tables = [
  `CREATE TABLE IF NOT EXISTS public.nyb_stats (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    stolen_today integer NOT NULL DEFAULT 47,
    annual_thefts integer NOT NULL DEFAULT 72614,
    recovery_rate_pct numeric(5,2) NOT NULL DEFAULT 38.0,
    time_to_border_min integer NOT NULL DEFAULT 45,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE TABLE IF NOT EXISTS public.nyb_vehicles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    make text NOT NULL,
    model text NOT NULL,
    year_from integer,
    year_to integer,
    annual_thefts integer NOT NULL DEFAULT 0,
    annual_hijackings integer NOT NULL DEFAULT 0,
    recovery_rate_pct numeric(5,2) NOT NULL DEFAULT 0,
    trend_pct numeric(5,2) NOT NULL DEFAULT 0,
    risk_score integer NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE TABLE IF NOT EXISTS public.nyb_provinces (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    risk_level text NOT NULL CHECK (risk_level IN ('critical', 'high', 'moderate', 'low')),
    theft_index integer NOT NULL DEFAULT 0,
    hijack_index integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE TABLE IF NOT EXISTS public.nyb_partners (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    fsca_number text,
    contact_name text,
    contact_email text,
    contact_phone text,
    rate_per_lead numeric(10,2) NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE TABLE IF NOT EXISTS public.nyb_leads (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    phone text NOT NULL,
    email text,
    province text,
    vehicle_make text NOT NULL,
    vehicle_model text NOT NULL,
    vehicle_year integer,
    risk_score integer,
    consent_given boolean NOT NULL DEFAULT false,
    consent_at timestamp with time zone,
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'sent', 'converted', 'rejected')),
    partner_id uuid,
    sent_at timestamp with time zone,
    utm_source text,
    utm_medium text,
    referrer_check_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE TABLE IF NOT EXISTS public.nyb_checks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    vehicle_make text NOT NULL,
    vehicle_model text NOT NULL,
    vehicle_year integer,
    province text,
    risk_score integer NOT NULL,
    risk_level text NOT NULL CHECK (risk_level IN ('critical', 'high', 'moderate', 'low')),
    session_id text,
    ip_hash text,
    user_agent text,
    referrer text,
    lead_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE TABLE IF NOT EXISTS public.nyb_stories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    location text NOT NULL,
    car text NOT NULL,
    summary text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,
];

const seeds = [
  // Stats (single row)
  `INSERT INTO public.nyb_stats (stolen_today, annual_thefts, recovery_rate_pct, time_to_border_min)
   SELECT 47, 72614, 38.0, 45
   WHERE NOT EXISTS (SELECT 1 FROM public.nyb_stats)`,

  // Vehicles — Top 5
  `INSERT INTO public.nyb_vehicles (make, model, annual_thefts, trend_pct, risk_score) VALUES
    ('Toyota', 'Hilux', 5823, 12, 92),
    ('Volkswagen', 'Polo', 4917, 8, 87),
    ('Toyota', 'Fortuner', 3641, 15, 84),
    ('Ford', 'Ranger', 3288, 6, 80),
    ('Hyundai', 'Tucson', 2754, 19, 76)
   ON CONFLICT DO NOTHING`,

  // Provinces
  `INSERT INTO public.nyb_provinces (name, risk_level, theft_index, hijack_index) VALUES
    ('Gauteng', 'critical', 100, 100),
    ('KwaZulu-Natal', 'high', 68, 72),
    ('Western Cape', 'high', 52, 45),
    ('Mpumalanga', 'moderate', 38, 34),
    ('Eastern Cape', 'moderate', 34, 30),
    ('Limpopo', 'moderate', 28, 25),
    ('North West', 'low', 24, 20),
    ('Free State', 'low', 18, 15)
   ON CONFLICT DO NOTHING`,

  // Stories
  `INSERT INTO public.nyb_stories (location, car, summary, sort_order) VALUES
    ('Sandton, Gauteng', '2023 Toyota Fortuner', 'Claim rejected after hijacking — policy lapsed 3 days prior. Owner left with R780,000 outstanding finance and no vehicle.', 1),
    ('Umhlanga, KZN', '2022 VW Polo GTI', 'Stolen from driveway at 2am. Tracker disabled within 8 minutes. Insurance paid out but excess was R45,000 — owner didn''t read the fine print.', 2),
    ('Centurion, Gauteng', '2024 Ford Ranger Wildtrak', 'Hijacked at traffic light on N1. Vehicle found stripped in Soshanguve 6 days later. Total write-off. Claim took 4 months to settle.', 3),
    ('Bellville, Western Cape', '2021 Hyundai Tucson', 'Owner''s son was driving without being listed on the policy. Claim denied outright after theft from mall parking. R420,000 loss.', 4)
   ON CONFLICT DO NOTHING`,
];

async function run() {
  console.log("Creating tables...");
  for (const sql of tables) {
    const { error } = await supabase.rpc("exec_sql", { query: sql });
    if (error) {
      // Try via raw SQL if RPC not available
      console.log("RPC not available, tables must be created via Supabase SQL editor.");
      console.log("\\nCopy-paste the SQL from support/guide/NYB_SCHEMA.md into the Supabase SQL editor.");
      console.log("Then run this script again to seed data.");
      process.exit(1);
    }
  }
  console.log("Tables created.");

  console.log("Seeding data...");
  for (const sql of seeds) {
    const { error } = await supabase.rpc("exec_sql", { query: sql });
    if (error) console.error("Seed error:", error.message);
  }
  console.log("Done.");
}

run();
