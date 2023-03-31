DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id VARCHAR(36),
  username VARCHAR(32) NOT NULL,
  content TEXT NOT NULL,
  timestamp DATETIME NOT NULL
);