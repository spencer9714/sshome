-- ============================================================
-- Storage Bucket & Policies
-- ============================================================
-- NOTE: Run this in Supabase SQL editor or via CLI.
-- The bucket creation may need to be done via the Supabase Dashboard
-- if running via migrations (storage.buckets isn't always available in migrations).

-- Create the portfolio bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can read objects in portfolio bucket
CREATE POLICY "Public can read portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- Policy: Only admins can upload to portfolio bucket
CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Only admins can update objects in portfolio bucket
CREATE POLICY "Admins can update portfolio images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Only admins can delete objects in portfolio bucket
CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
