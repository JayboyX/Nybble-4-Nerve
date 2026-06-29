# Nybble Schema Reference
> SafeCheck SA — Nerve Lead Generation Pipeline
> Date: 2026-06-29

---

## Environment

| | Dev |
|---|---|
| Supabase Project Ref | `wqgvvvxcxiupucfoyrwo` |
| Pooler Host | `aws-1-eu-central-1.pooler.supabase.com` |
| Database | `postgres` |
| User | `postgres.wqgvvvxcxiupucfoyrwo` |

> All tables prefixed with `nyb_`.

---

## Tables

### TIER 1 — Core Data

#### `nyb_vehicles`
> Reference data for SA vehicle makes/models and their theft statistics.

```sql
CREATE TABLE public.nyb_vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  make text NOT NULL,
  model text NOT NULL,
  year_from integer,
  year_to integer,

  -- Theft stats
  annual_thefts integer NOT NULL DEFAULT 0,
  annual_hijackings integer NOT NULL DEFAULT 0,
  recovery_rate_pct numeric(5,2) NOT NULL DEFAULT 0,
  trend_pct numeric(5,2) NOT NULL DEFAULT 0,
  risk_score integer NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),

  -- Metadata
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  PRIMARY KEY (id)
);

CREATE INDEX idx_nyb_vehicles_make_model ON public.nyb_vehicles (make, model);
```

---

#### `nyb_provinces`
> Province-level risk data.

```sql
CREATE TABLE public.nyb_provinces (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  name text NOT NULL UNIQUE,
  risk_level text NOT NULL CHECK (risk_level IN ('critical', 'high', 'moderate', 'low')),
  theft_index integer NOT NULL DEFAULT 0,
  hijack_index integer NOT NULL DEFAULT 0,

  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  PRIMARY KEY (id)
);
```

---

### TIER 2 — Leads

#### `nyb_leads`
> POPIA-compliant lead capture. Every lead must have consent_at set.

```sql
CREATE TABLE public.nyb_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  -- Contact
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  province text,

  -- Vehicle checked
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer,

  -- Risk result
  risk_score integer,

  -- POPIA consent
  consent_given boolean NOT NULL DEFAULT false,
  consent_at timestamp with time zone,

  -- Lead status
  -- new       = just captured
  -- qualified = meets criteria for handoff
  -- sent      = delivered to insurance partner
  -- converted = partner confirmed policy sale
  -- rejected  = partner rejected or lead unresponsive
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'qualified', 'sent', 'converted', 'rejected')),

  -- Partner handoff
  partner_id uuid REFERENCES public.nyb_partners(id),
  sent_at timestamp with time zone,

  -- Source tracking
  utm_source text,
  utm_medium text,
  referrer_check_id uuid,

  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  PRIMARY KEY (id)
);

CREATE INDEX idx_nyb_leads_status ON public.nyb_leads (status);
CREATE INDEX idx_nyb_leads_created ON public.nyb_leads (created_at DESC);
```

---

#### `nyb_partners`
> FSCA-licensed insurance partners who receive leads.

```sql
CREATE TABLE public.nyb_partners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  name text NOT NULL,
  fsca_number text,
  contact_name text,
  contact_email text,
  contact_phone text,

  -- Revenue
  rate_per_lead numeric(10,2) NOT NULL DEFAULT 0,

  is_active boolean NOT NULL DEFAULT true,

  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  PRIMARY KEY (id)
);
```

---

### TIER 3 — Risk Checks

#### `nyb_checks`
> Every risk check performed by a visitor. Anonymous until lead is captured.

```sql
CREATE TABLE public.nyb_checks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  -- What was checked
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer,
  province text,

  -- Result
  risk_score integer NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('critical', 'high', 'moderate', 'low')),

  -- Tracking
  session_id text,
  ip_hash text,
  user_agent text,
  referrer text,

  -- If this check led to a lead
  lead_id uuid REFERENCES public.nyb_leads(id),

  created_at timestamp with time zone NOT NULL DEFAULT now(),

  PRIMARY KEY (id)
);

CREATE INDEX idx_nyb_checks_created ON public.nyb_checks (created_at DESC);
CREATE INDEX idx_nyb_checks_vehicle ON public.nyb_checks (vehicle_make, vehicle_model);
```

---

### TIER 4 — Content & Config

#### `nyb_stories`
> Representative claim stories for the landing page feed.

```sql
CREATE TABLE public.nyb_stories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  location text NOT NULL,
  car text NOT NULL,
  summary text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,

  created_at timestamp with time zone NOT NULL DEFAULT now(),

  PRIMARY KEY (id)
);
```

#### `nyb_stats`
> Global stats displayed on the landing page. Single-row config table.

```sql
CREATE TABLE public.nyb_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  stolen_today integer NOT NULL DEFAULT 47,
  annual_thefts integer NOT NULL DEFAULT 72614,
  recovery_rate_pct numeric(5,2) NOT NULL DEFAULT 38.0,
  time_to_border_min integer NOT NULL DEFAULT 45,

  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  PRIMARY KEY (id)
);
```

---

## Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-29 | Initial schema — vehicles, provinces, leads, partners, checks, stories, stats | Justice |
