-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create attractions bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('attractions', 'attractions', true)
ON CONFLICT (id) DO NOTHING;

-- Create barcodes bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('barcodes', 'barcodes', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for attractions bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'attractions');

CREATE POLICY "Partner Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'attractions'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Partner Delete Access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'attractions'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for barcodes bucket
CREATE POLICY "Partner Upload Barcodes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'barcodes'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Partner Access Barcodes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'barcodes'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Partner Delete Barcodes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'barcodes'
  AND auth.uid()::text = (storage.foldername(name))[1]
); 