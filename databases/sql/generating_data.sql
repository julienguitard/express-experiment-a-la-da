DROP TABLE IF EXISTS users_works;

DROP TABLE IF EXISTS users_artists;

DROP TABLE IF EXISTS works;

DROP TABLE IF EXISTS artists;

DROP TABLE IF EXISTS users;

CREATE TABLE users 
(
  id VARCHAR(256) PRIMARY KEY,
  user_name    VARCHAR(256),
  creation_time TIMESTAMP,
  active BOOLEAN,
  archived BOOLEAN,
  deleted BOOLEAN,
  is_artist BOOLEAN,
  watches BIGINT,
  visits BIGINT,
  likes BIGINT,
  views BIGINT,
  last_updated TIMESTAMP
);



CREATE TABLE artists 
(
  id VARCHAR(256) PRIMARY KEY,
  user_id   VARCHAR(256) REFERENCES users(id),
  first_submission TIMESTAMP,
  active BOOLEAN,
  works BOOLEAN,
  viewers BIGINT,
  watchers BIGINT,
  likers BIGINT,
  views BIGINT,
  likes BIGINT,
  last_updated TIMESTAMP
);


CREATE TABLE works
(
  id VARCHAR(256) PRIMARY KEY,
  user_id    VARCHAR(256) REFERENCES users(id),
  artist_id    VARCHAR(256) REFERENCES artists(id),
  creation_time TIMESTAMP,
  visible BOOLEAN,
  archived BOOLEAN,
  deleted BOOLEAN,
  viewers BIGINT,
  likers BIGINT,
  views BIGINT,
  likes BIGINT,
  last_updated TIMESTAMP
);

CREATE TABLE users_artists
(id VARCHAR(256) PRIMARY KEY,
  user_id    VARCHAR(256) REFERENCES users(id),
  artist_user_id    VARCHAR(256) REFERENCES users(id),
  artist_id    VARCHAR(256) REFERENCES artists(id),
  creation_time TIMESTAMP,
  has_watched BOOLEAN,
  watching BOOLEAN,
  has_viewed BOOLEAN,
  has_viewed_profile BOOLEAN,
  profile_views BIGINT,
  has_viewed_works BOOLEAN,
  viewed_works BIGINT,
  work_views BOOLEAN,
  has_liked_works BOOLEAN,
  like_works BIGINT,
  last_updated TIMESTAMP
 );
 
CREATE TABLE users_works
(id VARCHAR(256) PRIMARY KEY,
  user_id    VARCHAR(256) REFERENCES users(id),
  artist_user_id    VARCHAR(256) REFERENCES users(id),
  artist_id    VARCHAR(256) REFERENCES artists(id),
  work_id VARCHAR(256) REFERENCES works(id),
  creation_time TIMESTAMP,
  has_viewed BOOLEAN,
  views BIGINT,
  has_liked BOOLEAN,
  like_ BOOLEAN,
  last_updated TIMESTAMP
 );