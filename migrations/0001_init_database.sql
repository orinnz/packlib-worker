-- Migration number: 0001 	 2026-02-06T16:21:34.786Z

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
  user_id INTEGER PRIMARY KEY,
  age INTEGER,
  gender INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE articles (
	id integer primary key AUTOINCREMENT,
  	slug text NOT NULL,
  	user_id integer not NULL,
  	original_url text not null, 
  	title text not null,
  	byline text,
  	excerpt text,
  	content_markdown text,
  	status text default "idle",
  	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  	FOREIGN KEY (user_id) REFERENCES users(id)
 	
  	
);

CREATE table tags (
	id integer primary key AUTOINCREMENT,
  	name text not null UNIQUE,
  	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE table article_tags (
	article_id integer,
  	tag_id integer,
  	primary key (article_id, tag_id),
  	FOREIGN key (article_id) REFERENCES articles(id),
  	FOREIGN key (tag_id) REFERENCES articles(id)
);