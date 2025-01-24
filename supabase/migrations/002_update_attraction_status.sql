-- First, create a new enum type for the new status values
CREATE TYPE attraction_status AS ENUM ('pending', 'approved', 'declined');

-- Temporarily remove the status column constraint
ALTER TABLE attractions 
ALTER COLUMN status DROP DEFAULT,
ALTER COLUMN status TYPE attraction_status 
USING (
    CASE status::text
        WHEN 'draft' THEN 'pending'::attraction_status
        WHEN 'in_review' THEN 'pending'::attraction_status
        WHEN 'approved' THEN 'approved'::attraction_status
        WHEN 'declined' THEN 'declined'::attraction_status
        ELSE 'pending'::attraction_status
    END
);

-- Set the new default value
ALTER TABLE attractions 
ALTER COLUMN status SET DEFAULT 'pending'::attraction_status;

-- Drop the old enum type if it's no longer needed
DROP TYPE content_status; 