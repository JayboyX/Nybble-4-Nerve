-- Run in Supabase SQL Editor
-- Expands nyb_vehicles coverage so more real-world makes/models return a
-- genuine risk score instead of "No Data Available" on the results page.
--
-- IMPORTANT: figures below are placeholder estimates scaled to sit consistently
-- alongside the existing seed data (support/seed-vehicles.sql) — they are NOT
-- sourced from a specific SAIA/SAPS report. Review and replace with verified
-- annual_thefts / recovery_rate_pct / trend_pct figures before treating this
-- as production data. Do not present these numbers as officially sourced
-- until confirmed.

INSERT INTO public.nyb_vehicles (make, model, annual_thefts, annual_hijackings, recovery_rate_pct, trend_pct, risk_score) VALUES
  ('Audi','A4',680,260,28,8,58),
  ('Audi','Q3',540,220,30,10,54),
  ('Audi','Q5',760,340,24,12,62),
  ('Chevrolet','Utility',920,240,34,4,52),
  ('Chevrolet','Trailblazer',480,220,28,9,50),
  ('Datsun','Go+',360,90,42,6,34),
  ('Peugeot','2008',320,110,36,7,40),
  ('Peugeot','3008',280,120,32,9,42),
  ('Volvo','XC60',420,200,26,8,56),
  ('Volvo','XC40',360,160,28,10,50),
  ('Subaru','Forester',300,130,30,6,46),
  ('Subaru','Outback',260,110,32,5,42),
  ('Mini','Cooper',340,140,30,8,46),
  ('Lexus','RX',380,190,22,11,58),
  ('Lexus','NX',320,160,24,10,54),
  ('Skoda','Octavia',420,170,28,9,50),
  ('Skoda','Kodiaq',300,140,26,11,48),
  ('Fiat','500',220,60,38,4,32),
  ('Tata','Nexon',260,80,36,12,38),
  ('MG','ZS',480,180,32,20,44),
  ('MG','HS',320,140,30,18,46),
  ('Jaguar','F-Pace',300,150,22,9,56),
  ('Dodge','RAM 1500',260,140,24,10,52),
  ('Citroën','C3',240,80,36,6,36),
  ('Opel','Corsa',280,90,34,5,38),
  ('Chery','Tiggo 7 Pro',380,150,32,22,44),
  ('Jac','T6',300,110,30,14,42)
ON CONFLICT DO NOTHING;
