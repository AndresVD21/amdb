-- Add status column to favorites table
ALTER TABLE favorites ADD COLUMN status VARCHAR(20);

-- Create enum type for status
CREATE TYPE watch_status AS ENUM (
  'watching',
  'completed',
  'on-hold',
  'dropped',
  'plan-to-watch',
  'reading',
  'plan-to-read'
);

-- Update status column to use enum
ALTER TABLE favorites ALTER COLUMN status TYPE watch_status USING status::watch_status;
