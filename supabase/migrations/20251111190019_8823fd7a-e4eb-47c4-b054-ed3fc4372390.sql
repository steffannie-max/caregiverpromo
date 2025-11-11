-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for interview videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'interview-videos',
  'interview-videos',
  true,
  104857600,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
);

-- Create table for video metadata
CREATE TABLE public.interview_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL CHECK (section IN ('section1', 'section2', 'section3')),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  duration NUMERIC,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interview_videos ENABLE ROW LEVEL SECURITY;

-- Public can view videos (for students)
CREATE POLICY "Anyone can view interview videos" 
ON public.interview_videos 
FOR SELECT 
USING (true);

-- Only authenticated users can upload/manage videos (for Dr. Bryson)
CREATE POLICY "Authenticated users can insert videos" 
ON public.interview_videos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update videos" 
ON public.interview_videos 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete videos" 
ON public.interview_videos 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Storage policies for interview videos bucket
CREATE POLICY "Public can view interview videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'interview-videos');

CREATE POLICY "Authenticated users can upload interview videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'interview-videos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update interview videos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'interview-videos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete interview videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'interview-videos' 
  AND auth.uid() IS NOT NULL
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_interview_videos_updated_at
BEFORE UPDATE ON public.interview_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_interview_videos_section ON public.interview_videos(section);