-- Create background_music table for storing presentation music
CREATE TABLE IF NOT EXISTS public.background_music (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_number INTEGER NOT NULL,
  music_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.background_music ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read music files
CREATE POLICY "Anyone can view background music"
  ON public.background_music
  FOR SELECT
  USING (true);

-- Only authenticated users can manage music
CREATE POLICY "Authenticated users can insert music"
  ON public.background_music
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update music"
  ON public.background_music
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete music"
  ON public.background_music
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create storage bucket for music files
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for music bucket
CREATE POLICY "Anyone can view music files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'music');

CREATE POLICY "Authenticated users can upload music"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update music"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete music"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'music' AND auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_background_music_updated_at
  BEFORE UPDATE ON public.background_music
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();