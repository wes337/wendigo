CREATE SCHEMA IF NOT EXISTS wendigo;

CREATE TABLE IF NOT EXISTS wendigo.posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Wendigo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wendigo.files (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  size BIGINT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wendigo.post_files (
  post_id INTEGER REFERENCES wendigo.posts(id) ON DELETE CASCADE,
  file_id INTEGER REFERENCES wendigo.files(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, file_id)
);

CREATE TABLE IF NOT EXISTS wendigo.post_reactions (
  post_id INTEGER NOT NULL REFERENCES wendigo.posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  reaction TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, visitor_id),
  UNIQUE (post_id, ip_hash)
);

CREATE TABLE IF NOT EXISTS wendigo.articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Wendigo Corp PR Dept.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wendigo.inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wendigo.pages (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wendigo.slogans (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wendigo.events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  url TEXT,
  icon TEXT NOT NULL DEFAULT 'events',
  color TEXT NOT NULL DEFAULT 'blue',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
