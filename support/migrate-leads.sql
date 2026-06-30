-- SafeCheck SA — Lead table migration
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wqgvvvxcxiupucfoyrwo/sql

ALTER TABLE public.nyb_leads
  ADD COLUMN IF NOT EXISTS risk_level text,
  ADD COLUMN IF NOT EXISTS preferred_call_time text,
  ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_method text DEFAULT 'web_checkbox';

-- Update existing rows
UPDATE public.nyb_leads SET consent_method = 'web_checkbox' WHERE consent_method IS NULL;
