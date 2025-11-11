-- Drop the unique constraint first
ALTER TABLE slide_videos DROP CONSTRAINT IF EXISTS slide_videos_slide_number_key;

-- Add columns for multiple video support
ALTER TABLE slide_videos ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Recreate proper indexes
CREATE INDEX IF NOT EXISTS idx_slide_videos_slide_number ON slide_videos(slide_number);
CREATE INDEX IF NOT EXISTS idx_slide_videos_active ON slide_videos(slide_number, is_active);