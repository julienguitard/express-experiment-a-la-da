DROP TABLE IF EXISTS users_works_events;

DROP TABLE IF EXISTS users_works;

DROP TABLE IF EXISTS users_artists_events;

DROP TABLE IF EXISTS users_artists;

DROP TABLE IF EXISTS works_events;

DROP TABLE IF EXISTS works;

DROP TABLE IF EXISTS artists_events;

DROP TABLE IF EXISTS artists;

DROP TABLE IF EXISTS users_events;

DROP TABLE IF EXISTS users;

CREATE TABLE users 
(
  id              VARCHAR(256) PRIMARY KEY,
  user_name       VARCHAR(256),
  creation_time   TIMESTAMP,
  active          BOOLEAN,
  archived        BOOLEAN,
  deleted         BOOLEAN,
  is_artist       BOOLEAN,
  watches         BIGINT,
  visits          BIGINT,
  likes           BIGINT,
  views           BIGINT,
  last_updated    TIMESTAMP
);

CREATE TABLE users_events 
(
  id         VARCHAR(256) PRIMARY KEY,
  user_id    VARCHAR(256) REFERENCES users (id),
  time_      TIMESTAMP,
  activate   BOOLEAN,
  archive    BOOLEAN,
  delete_    BOOLEAN
);

CREATE TABLE artists 
(
  id                 VARCHAR(256) PRIMARY KEY,
  user_id            VARCHAR(256) REFERENCES users (id),
  first_submission   TIMESTAMP,
  active             BOOLEAN,
  works              BOOLEAN,
  viewers            BIGINT,
  watchers           BIGINT,
  likers             BIGINT,
  views              BIGINT,
  likes              BIGINT,
  last_updated       TIMESTAMP
);

CREATE TABLE artists_events 
(
  id              VARCHAR(256) PRIMARY KEY,
  artist_id       VARCHAR(256) REFERENCES artists (id),
  user_id         VARCHAR(256) REFERENCES users (id),
  time_           TIMESTAMP,
  first_submit    BOOLEAN,
  last_withdraw   BOOLEAN
);

CREATE TABLE works 
(
  id              VARCHAR(256) PRIMARY KEY,
  user_id         VARCHAR(256) REFERENCES users (id),
  artist_id       VARCHAR(256) REFERENCES artists (id),
  creation_time   TIMESTAMP,
  archived        BOOLEAN,
  deleted         BOOLEAN,
  viewers         BIGINT,
  likers          BIGINT,
  views           BIGINT,
  likes           BIGINT,
  last_updated    TIMESTAMP
);

CREATE TABLE works_events 
(
  id          VARCHAR(256) PRIMARY KEY,
  work_id     VARCHAR(256) REFERENCES works (id),
  user_id     VARCHAR(256) REFERENCES users (id),
  artist_id   VARCHAR(256) REFERENCES artists (id),
  time_       TIMESTAMP,
  submit      BOOLEAN,
  archive     BOOLEAN,
  delete_     BOOLEAN
);

CREATE TABLE users_artists 
(
  id                   VARCHAR(256) PRIMARY KEY,
  user_id              VARCHAR(256) REFERENCES users (id),
  artist_user_id       VARCHAR(256) REFERENCES users (id),
  artist_id            VARCHAR(256) REFERENCES artists (id),
  creation_time        TIMESTAMP,
  has_watched          BOOLEAN,
  watching             BOOLEAN,
  has_viewed           BOOLEAN,
  has_viewed_profile   BOOLEAN,
  profile_views        BIGINT,
  has_viewed_works     BOOLEAN,
  viewed_works         BIGINT,
  work_views           BOOLEAN,
  has_liked_works      BOOLEAN,
  like_works           BIGINT,
  last_updated         TIMESTAMP
);

CREATE TABLE users_artists_events 
(
  id               VARCHAR(256) PRIMARY KEY,
  user_artist_id   VARCHAR(256) REFERENCES users_artists (id),
  user_id          VARCHAR(256) REFERENCES users (id),
  artist_user_id   VARCHAR(256) REFERENCES users (id),
  artist_id        VARCHAR(256) REFERENCES artists (id),
  time_            TIMESTAMP,
  watch            BOOLEAN,
  unwatch          BOOLEAN,
  ban              BOOLEAN,
  view_profile     BOOLEAN
);

CREATE TABLE users_works 
(
  id               VARCHAR(256) PRIMARY KEY,
  user_id          VARCHAR(256) REFERENCES users (id),
  artist_user_id   VARCHAR(256) REFERENCES users (id),
  artist_id        VARCHAR(256) REFERENCES artists (id),
  work_id          VARCHAR(256) REFERENCES works (id),
  creation_time    TIMESTAMP,
  has_viewed       BOOLEAN,
  views            BIGINT,
  has_liked        BOOLEAN,
  like_            BOOLEAN,
  last_updated     TIMESTAMP
);

CREATE TABLE users_works_events 
(
  id               VARCHAR(256) PRIMARY KEY,
  user_work_id     VARCHAR(256) REFERENCES users_works (id),
  user_id          VARCHAR(256) REFERENCES users (id),
  artist_user_id   VARCHAR(256) REFERENCES users (id),
  artist_id        VARCHAR(256) REFERENCES artists (id),
  work_id          VARCHAR(256) REFERENCES works (id),
  time_            TIMESTAMP,
  view_            BOOLEAN,
  like_            BOOLEAN,
  unlike           BOOLEAN
);
