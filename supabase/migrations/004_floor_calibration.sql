-- Migration 004: Add floor plan calibration columns
-- scale_px_per_cm: how many image pixels = 1 cm (set by AI analysis or manual calibration)
-- calib_offset_x/y: pixel offset to align rendered rooms with the background image

ALTER TABLE floors
  ADD COLUMN IF NOT EXISTS scale_px_per_cm  FLOAT,
  ADD COLUMN IF NOT EXISTS calib_offset_x   INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS calib_offset_y   INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS planner_state    JSONB;
