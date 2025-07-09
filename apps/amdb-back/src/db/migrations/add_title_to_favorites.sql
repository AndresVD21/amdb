-- Add title column to favorites table
ALTER TABLE favorites ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '';

-- Update the default value to empty string for existing rows
UPDATE favorites SET title = '' WHERE title IS NULL;
