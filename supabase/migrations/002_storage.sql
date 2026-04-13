-- ============================================================
-- FurnishAI - Storage Buckets
-- ============================================================

-- Floor plan images (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('floor-plans', 'floor-plans', false)
ON CONFLICT (id) DO NOTHING;

-- Furniture product images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('furniture', 'furniture', true)
ON CONFLICT (id) DO NOTHING;

-- floor-plans: authenticated users can upload
CREATE POLICY "Authenticated users can upload floor plans"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'floor-plans' AND auth.role() = 'authenticated');

-- floor-plans: users can view files in their own folder (user_id/...)
CREATE POLICY "Users can view own floor plans"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'floor-plans'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own floor plans"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'floor-plans'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- furniture images: public read, admin write
CREATE POLICY "Public can view furniture images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'furniture');

CREATE POLICY "Admins can upload furniture images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'furniture'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete furniture images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'furniture'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
