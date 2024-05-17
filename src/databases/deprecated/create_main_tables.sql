DROP VIEW IF EXISTS users_works;

DROP FUNCTION IF EXISTS generate_users_works_event_from_req;

DROP TABLE IF EXISTS users_works_events;

DROP TABLE IF EXISTS users_works_;

DROP VIEW IF EXISTS users_artists;

DROP FUNCTION IF EXISTS generate_users_artists_event_from_req;

DROP TABLE IF EXISTS users_artists_events;

DROP TABLE IF EXISTS users_artists_;

DROP VIEW IF EXISTS works;

DROP FUNCTION IF EXISTS generate_works_event_from_req;

DROP TABLE IF EXISTS works_events;

DROP TABLE IF EXISTS works_;

DROP VIEW IF EXISTS artists;

DROP FUNCTION IF EXISTS generate_artists_event_from_req;

DROP TABLE IF EXISTS artists_events;

DROP TABLE IF EXISTS artists_;

DROP VIEW IF EXISTS users;

DROP FUNCTION IF EXISTS generate_users_event_from_req;

DROP TABLE IF EXISTS users_events;

DROP TABLE IF EXISTS users_;

CREATE TABLE IF NOT EXISTS users_ 
(
  id              VARCHAR(256) PRIMARY KEY,
  user_name       VARCHAR(256),
  creation_time   TIMESTAMP,
  archived        INT,
  deleted         INT,
  is_artist       INT,
  watches         BIGINT,
  visits          BIGINT,
  likes           BIGINT,
  views           BIGINT,
  last_updated    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_events 
(
  id          VARCHAR(256) PRIMARY KEY,
  user_id     VARCHAR(256) REFERENCES users_ (id) NULL,
  time_       TIMESTAMP,
  user_name   VARCHAR(256) NULL,
  create_     INT,
  archive     INT,
  delete_     INT
);

CREATE FUNCTION generate_users_event_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_events
AS
$$
SELECT MD5(CONCAT (CONCAT ($1,$2),CONCAT ($2,$3))) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         ELSE MD5(CONCAT ($1,$2))
       END AS user_id,
       CAST($2 AS TIMESTAMP) AS time_,
       CASE
         WHEN LENGTH($1) = 0 AND LENGTH($3) > 0 THEN $3
         ELSE CAST(NULL AS VARCHAR(256))
       END AS user_name,
       CAST($4 = 'create' AS INT) AS create_,
       CAST($4 = 'archive' AS INT) AS archive,
       CAST($4 = 'delete' AS INT) AS delete_ $$ LANGUAGE SQL;

CREATE VIEW users 
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY id ORDER BY last_updated DESC) AS rk FROM users_) WHERE rk = 1);

CREATE TABLE IF NOT EXISTS artists_ 
(
  id                 VARCHAR(256) PRIMARY KEY,
  user_id            VARCHAR(256) REFERENCES users_ (id),
  first_submission   TIMESTAMP,
  active             INT,
  works              INT,
  viewers            BIGINT,
  watchers           BIGINT,
  likers             BIGINT,
  views              BIGINT,
  likes              BIGINT,
  last_updated       TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists_events 
(
  id          VARCHAR(256) PRIMARY KEY,
  artist_id   VARCHAR(256) REFERENCES artists_ (id) NULL,
  user_id     VARCHAR(256) REFERENCES users_ (id) NULL,
  time_       TIMESTAMP
);

CREATE FUNCTION generate_artists_event_from_req (TEXT,TEXT,TEXT) RETURNS artists_events
AS
$$
SELECT MD5(CONCAT (CONCAT ($1,$3),CONCAT ($2,$3))) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         WHEN LENGTH($1) = 0 AND LENGTH($2) > 0 THEN MD5(CONCAT ($2,$3))
         ELSE CAST(NULL AS VARCHAR(256))
       END AS artist_id,
       CASE
         WHEN LENGTH($2) > 0 THEN $2
         ELSE CAST(NULL AS VARCHAR(256))
       END AS user_id,
       CAST($3 AS TIMESTAMP) AS time_ $$ LANGUAGE SQL;

CREATE VIEW artists 
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY id ORDER BY last_updated DESC) AS rk FROM artists_) WHERE rk = 1);

CREATE TABLE IF NOT EXISTS works_ 
(
  id              VARCHAR(256) PRIMARY KEY,
  user_id         VARCHAR(256) REFERENCES users_ (id),
  artist_id       VARCHAR(256) REFERENCES artists_ (id),
  creation_time   TIMESTAMP,
  archived        INT,
  deleted         INT,
  viewers         BIGINT,
  likers          BIGINT,
  views           BIGINT,
  likes           BIGINT,
  last_updated    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS works_events 
(
  id          VARCHAR(256) PRIMARY KEY,
  work_id     VARCHAR(256) REFERENCES works_ (id) NULL,
  artist_id   VARCHAR(256) REFERENCES artists_ (id) NULL,
  time_       TIMESTAMP,
  submit      INT,
  archive     INT,
  delete_     INT
);

CREATE FUNCTION generate_works_event_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS works_events
AS
$$
SELECT MD5(CONCAT (CONCAT ($1,$3),CONCAT ($2,$3))) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         ELSE MD5(CONCAT ($2,$3))
       END AS work_id,
       CASE
         WHEN LENGTH($2) > 0 THEN $2
         ELSE CAST(NULL AS VARCHAR(256))
       END AS artist_id,
       CAST($3 AS TIMESTAMP) AS time_,
       CAST($4 = 'submit' AS INT) AS submit_,
       CAST($4 = 'archive' AS INT) AS archive,
       CAST($4 = 'delete' AS INT) AS delete_ $$ LANGUAGE SQL;

CREATE VIEW works 
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY id ORDER BY last_updated DESC) AS rk FROM works_) WHERE rk = 1);

CREATE TABLE IF NOT EXISTS users_artists_ 
(
  id                   VARCHAR(256) PRIMARY KEY,
  user_id              VARCHAR(256) REFERENCES users_ (id),
  artist_user_id       VARCHAR(256) REFERENCES users_ (id),
  artist_id            VARCHAR(256) REFERENCES artists_ (id),
  creation_time        TIMESTAMP,
  has_watched          INT,
  watching             INT,
  has_viewed           INT,
  has_viewed_profile   INT,
  profile_views        BIGINT,
  has_viewed_works     INT,
  viewed_works         BIGINT,
  work_views           INT,
  has_liked_works      INT,
  like_works           BIGINT,
  last_updated         TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_artists_events 
(
  id               VARCHAR(256) PRIMARY KEY,
  user_artist_id   VARCHAR(256) REFERENCES users_artists_ (id) NULL,
  user_id          VARCHAR(256) REFERENCES users_ (id) NULL,
  artist_id        VARCHAR(256) REFERENCES artists_ (id) NULL,
  time_            TIMESTAMP,
  view_profile     INT,
  watch            INT,
  unwatch          INT,
  ban              INT
);

CREATE FUNCTION generate_users_artists_event_from_req (TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS users_artists_events
AS
$$
SELECT MD5(CONCAT (CONCAT (CONCAT ($1,$4),CONCAT ($2,$4)),CONCAT ($3,$4))) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         ELSE MD5(CONCAT ($2,$3))
       END AS user_artist_id,
       CASE
         WHEN LENGTH($1) = 0 AND LENGTH($2) > 0 THEN $2
         ELSE CAST(NULL AS VARCHAR(256))
       END AS user_id,
       CASE
         WHEN LENGTH($1) = 0 AND LENGTH($3) > 0 THEN $3
         ELSE CAST(NULL AS VARCHAR(256))
       END AS artist_id,
       CAST($4 AS TIMESTAMP) AS time_,
       CAST($5 = 'view_profile' AS INT) AS view_profile,
       CAST($5 = 'watch' AS INT) AS watch,
       CAST($5 = 'unwatch' AS INT) AS unwatch,
       CAST($5 = 'ban' AS INT) AS ban $$ LANGUAGE SQL;

CREATE VIEW users_artists 
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY id ORDER BY last_updated DESC) AS rk FROM users_artists_) WHERE rk = 1);

CREATE TABLE IF NOT EXISTS users_works_ 
(
  id               VARCHAR(256) PRIMARY KEY,
  user_id          VARCHAR(256) REFERENCES users_ (id),
  artist_user_id   VARCHAR(256) REFERENCES users_ (id),
  artist_id        VARCHAR(256) REFERENCES artists_ (id),
  work_id          VARCHAR(256) REFERENCES works_ (id),
  creation_time    TIMESTAMP,
  has_viewed       INT,
  views            BIGINT,
  has_liked        INT,
  like_            INT,
  last_updated     TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_works_events 
(
  id             VARCHAR(256) PRIMARY KEY,
  user_work_id   VARCHAR(256) REFERENCES users_works_ (id) NULL,
  user_id        VARCHAR(256) REFERENCES users_ (id) NULL,
  work_id        VARCHAR(256) REFERENCES works_ (id) NULL,
  time_          TIMESTAMP,
  view_          INT,
  like_          INT,
  unlike         INT
);

CREATE FUNCTION generate_users_works_event_from_req (TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS users_works_events
AS
$$
SELECT MD5(CONCAT (CONCAT (CONCAT ($1,$4),CONCAT ($2,$4)),CONCAT ($3,$4))) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         ELSE MD5(CONCAT ($2,$3))
       END AS user_work_id,
       CASE
         WHEN LENGTH($1) = 0 AND LENGTH($2) > 0 THEN $2
         ELSE CAST(NULL AS VARCHAR(256))
       END AS user_id,
       CASE
         WHEN LENGTH($1) = 0 AND LENGTH($3) > 0 THEN $3
         ELSE CAST(NULL AS VARCHAR(256))
       END AS work_id,
       CAST($4 AS TIMESTAMP) AS time_,
       CAST($5 = 'view' AS INT) AS view_,
       CAST($5 = 'like' AS INT) AS like_,
       CAST($5 = 'unlike' AS INT) AS unlike $$ LANGUAGE SQL;

CREATE VIEW users_works 
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY id ORDER BY last_updated DESC) AS rk FROM users_works_) WHERE rk = 1);

