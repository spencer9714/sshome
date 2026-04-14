ALTER TABLE floors
  ADD COLUMN IF NOT EXISTS total_width_cm int,
  ADD COLUMN IF NOT EXISTS total_depth_cm int;
