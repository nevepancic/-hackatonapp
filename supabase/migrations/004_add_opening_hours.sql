-- Add media fields to attractions table
ALTER TABLE attractions
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS barcode_url TEXT;

-- Add opening hours fields to attractions table
ALTER TABLE attractions
ADD COLUMN IF NOT EXISTS opening_hours JSONB DEFAULT '{
  "monday": {"open": "09:00", "close": "17:00"},
  "tuesday": {"open": "09:00", "close": "17:00"},
  "wednesday": {"open": "09:00", "close": "17:00"},
  "thursday": {"open": "09:00", "close": "17:00"},
  "friday": {"open": "09:00", "close": "17:00"},
  "saturday": {"open": "10:00", "close": "18:00"},
  "sunday": {"open": "10:00", "close": "18:00"}
}'::jsonb; 