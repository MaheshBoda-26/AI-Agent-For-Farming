-- Create storage bucket for crop images
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-images', 'crop-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload images (since no auth)
CREATE POLICY "Anyone can upload crop images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'crop-images');

-- Allow anyone to view crop images
CREATE POLICY "Anyone can view crop images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'crop-images');

-- Allow anyone to delete their uploaded images (by path pattern)
CREATE POLICY "Anyone can delete crop images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'crop-images');