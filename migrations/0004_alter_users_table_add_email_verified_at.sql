-- Migration number: 0004 	 2026-02-25T07:51:40.586Z
ALTER TABLE Users ADD COLUMN email_verified_at DATETIME;
ALTER TABLE Users DROP COLUMN password;
ALTER TABLE Users ADD COLUMN avatar_url TEXT;

