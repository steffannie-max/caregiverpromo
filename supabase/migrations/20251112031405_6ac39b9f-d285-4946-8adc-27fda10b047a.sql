-- Update the interview-videos bucket to allow larger files (up to 500MB)
UPDATE storage.buckets 
SET file_size_limit = 524288000  -- 500MB in bytes
WHERE id = 'interview-videos';

-- Also update presenter-videos bucket for consistency
UPDATE storage.buckets 
SET file_size_limit = 524288000  -- 500MB in bytes
WHERE id = 'presenter-videos';