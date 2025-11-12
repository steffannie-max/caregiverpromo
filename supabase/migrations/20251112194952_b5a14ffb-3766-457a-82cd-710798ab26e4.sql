-- Create table for video analysis responses
CREATE TABLE public.video_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  lens TEXT NOT NULL,
  response_text TEXT NOT NULL,
  respondent_name TEXT,
  video_title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can view responses (for admin view)
CREATE POLICY "Anyone can view responses"
  ON public.video_responses
  FOR SELECT
  USING (true);

-- Anyone can insert responses (anonymous or named)
CREATE POLICY "Anyone can insert responses"
  ON public.video_responses
  FOR INSERT
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX idx_video_responses_created_at ON public.video_responses(created_at DESC);
CREATE INDEX idx_video_responses_video_title ON public.video_responses(video_title);