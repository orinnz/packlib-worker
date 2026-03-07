-- Migration number: 0006 	 2026-03-07T07:11:54.600Z
-- Recreate related tables to use email as foreign key reference

-- 1. Recreate profiles table
CREATE TABLE profiles_new (
  user_email TEXT PRIMARY KEY,
  age INTEGER,
  gender INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email)
);

INSERT INTO profiles_new (user_email, age, gender, updated_at)
SELECT u.email, p.age, p.gender, p.updated_at 
FROM profiles p
INNER JOIN users u ON p.user_id = u.id;

DROP TABLE profiles;
ALTER TABLE profiles_new RENAME TO profiles;

-- 2. Recreate articles table
CREATE TABLE articles_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  user_email TEXT NOT NULL,
  original_url TEXT NOT NULL,
  title TEXT NOT NULL,
  byline TEXT,
  excerpt TEXT,
  content_markdown TEXT,
  status TEXT DEFAULT 'idle',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email)
);

INSERT INTO articles_new (id, slug, user_email, original_url, title, byline, excerpt, content_markdown, status, created_at, updated_at)
SELECT a.id, a.slug, u.email, a.original_url, a.title, a.byline, a.excerpt, a.content_markdown, a.status, a.created_at, a.updated_at
FROM articles a
INNER JOIN users u ON a.user_id = u.id;

DROP TABLE articles;
ALTER TABLE articles_new RENAME TO articles;

-- 3. Remove id column from users table (no longer needed for foreign keys)
CREATE TABLE users_new (
  email TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'user',
  full_name TEXT,
  email_verified_at DATETIME,
  avatar_url TEXT
);

INSERT INTO users_new (email, username, created_at, updated_at, role, full_name, email_verified_at, avatar_url)
SELECT email, username, created_at, updated_at, role, full_name, email_verified_at, avatar_url FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;
