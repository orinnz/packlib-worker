-- Migration number: 0005   2026-03-07T07:02:47.171Z
-- Recreate users table with email as PRIMARY KEY

CREATE TABLE users_new (
  email TEXT PRIMARY KEY,
  id INTEGER,
  username TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'user',
  full_name TEXT,
  email_verified_at DATETIME,
  avatar_url TEXT
);

INSERT INTO users_new (email, id, username, created_at, updated_at, role, full_name, email_verified_at, avatar_url)
SELECT email, id, username, created_at, updated_at, role, full_name, email_verified_at, avatar_url FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;
