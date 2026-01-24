-- SQL script to remove username column from users table
-- Run this script after updating the User entity

-- Remove username column from users table
ALTER TABLE users DROP COLUMN IF EXISTS username;

-- Note: This will permanently delete the username data
-- Make sure to backup your database before running this script if needed
