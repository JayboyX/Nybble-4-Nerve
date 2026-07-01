-- Run in Supabase SQL Editor AFTER the seed/migration files have all been run.
--
-- Root cause: nyb_vehicles has no uniqueness constraint on (make, model), so
-- seed-vehicles.sql, migrate-more-vehicles.sql, and migrate-all-dropdown-vehicles.sql
-- each inserted a row for the same 74 make/model pairs (e.g. Volkswagen Amarok,
-- Toyota Starlet). calculateRisk() uses .maybeSingle(), which throws when more
-- than one row matches — that error surfaces as "No Data Available" even
-- though real data exists.
--
-- Step 1: keep one row per (make, model) — the most recently created one —
-- and delete the rest.
DELETE FROM public.nyb_vehicles a
USING public.nyb_vehicles b
WHERE a.make = b.make
  AND a.model = b.model
  AND a.created_at < b.created_at;

-- Step 1b: for any pairs inserted in the same statement (identical created_at),
-- fall back to ctid to break the tie deterministically.
DELETE FROM public.nyb_vehicles a
USING public.nyb_vehicles b
WHERE a.make = b.make
  AND a.model = b.model
  AND a.created_at = b.created_at
  AND a.ctid < b.ctid;

-- Step 2: prevent this from ever happening again — makes ON CONFLICT DO
-- NOTHING in future seed files actually work as intended.
ALTER TABLE public.nyb_vehicles
  ADD CONSTRAINT nyb_vehicles_make_model_key UNIQUE (make, model);

-- Verify: should return zero rows.
SELECT make, model, count(*)
FROM public.nyb_vehicles
GROUP BY make, model
HAVING count(*) > 1;
