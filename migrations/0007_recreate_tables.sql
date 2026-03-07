-- Migration number: 0007 	 2026-03-07T07:21:06.133Z
-- Drop and recreate all tables with email as PRIMARY KEY for users

-- Drop tables in correct order (dependent tables first)
DROP TABLE IF EXISTS article_tags;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;

-- Create users table with email as PRIMARY KEY
CREATE TABLE users (
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

-- Create profiles table
CREATE TABLE profiles (
  user_email TEXT PRIMARY KEY,
  age INTEGER,
  gender INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Create articles table
CREATE TABLE articles (
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

-- Create tags table
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create article_tags table
CREATE TABLE article_tags (
  article_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
