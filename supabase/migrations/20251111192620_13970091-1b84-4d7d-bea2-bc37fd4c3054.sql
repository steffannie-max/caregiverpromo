-- Create storage bucket for presenter videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('presenter-videos', 'presenter-videos', true);

-- Create table to store slide video mappings
CREATE TABLE public.slide_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_number INTEGER NOT NULL UNIQUE,
  video_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.slide_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view slide videos"
ON public.slide_videos FOR SELECT
USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Authenticated users can manage slide videos"
ON public.slide_videos FOR ALL
USING (auth.role() = 'authenticated');

-- Storage policies for presenter videos
CREATE POLICY "Public access to presenter videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'presenter-videos');

CREATE POLICY "Authenticated users can upload presenter videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'presenter-videos' AND auth.role() = 'authenticated');