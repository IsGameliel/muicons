
-- Public read for both buckets (so signed URLs work for everyone)
CREATE POLICY "public read contestant photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'contestant-photos');
CREATE POLICY "public read payment proofs" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'payment-proofs');

-- Anyone can upload a payment proof
CREATE POLICY "anyone upload payment proof" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'payment-proofs');

-- Only admins can manage contestant photos
CREATE POLICY "admin upload contestant photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'contestant-photos' AND public.is_admin());
CREATE POLICY "admin update contestant photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'contestant-photos' AND public.is_admin());
CREATE POLICY "admin delete contestant photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'contestant-photos' AND public.is_admin());

-- Admin manage payment proofs
CREATE POLICY "admin update payment proofs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'payment-proofs' AND public.is_admin());
CREATE POLICY "admin delete payment proofs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'payment-proofs' AND public.is_admin());
