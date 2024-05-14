DROP TABLE IF EXISTS users_works_events_history CASCADE;

DROP TABLE IF EXISTS users_works_core CASCADE;

DROP TABLE IF EXISTS users_artists_events_history CASCADE;

DROP TABLE IF EXISTS users_artists_core CASCADE;

DROP TABLE IF EXISTS works_events_history CASCADE;

DROP TABLE IF EXISTS works_core CASCADE;

DROP TABLE IF EXISTS artists_events_history CASCADE;

DROP TABLE IF EXISTS artists_core CASCADE;

DROP TABLE IF EXISTS users_events_history CASCADE;

DROP TABLE IF EXISTS users_core CASCADE;

CREATE TABLE IF NOT EXISTS users_core 
(
  id          VARCHAR(256) PRIMARY KEY,
  creation_time       TIMESTAMP,
  user_name   VARCHAR(256) NULL,
  pwd         VARCHAR(256) NULL
);

CREATE OR REPLACE FUNCTION generate_user_from_req(TEXT,TEXT,TEXT,TEXT) RETURNS users_core
AS
$$
SELECT $1, TO_TIMESTAMP(CAST($2 AS NUMERIC)),$3,$4
$$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS users_events_history 
(
  id          VARCHAR(256) PRIMARY KEY,
  user_id     VARCHAR(256) REFERENCES users_core(id),
  _time       TIMESTAMP,
  key_   VARCHAR(256),
  value  INT
);


CREATE OR REPLACE FUNCTION generate_users_event_from_req(TEXT,TEXT,TEXT) RETURNS users_events_history
AS
$$
SELECT MD5($1||$2),$1, TO_TIMESTAMP(CAST($2 AS NUMERIC)),$3,1
$$ LANGUAGE SQL;


CREATE OR REPLACE VIEW users_events 
AS
(SELECT *
FROM (SELECT *,
             RANK() OVER (PARTITION BY id ORDER BY _time DESC) AS rk
      FROM users_events_history)
WHERE rk = 1
);

CREATE TABLE IF NOT EXISTS artists_core
(
  id          VARCHAR(256) PRIMARY KEY,
  user_id     VARCHAR(256) REFERENCES users_core(id),
  creation_time TIMESTAMP
);

CREATE OR REPLACE FUNCTION generate_artist_from_req(TEXT,TEXT,TEXT) RETURNS artists_core
AS
$$
SELECT $1, $2,TO_TIMESTAMP(CAST($3 AS NUMERIC))
$$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS artists_events_history 
(
  id          VARCHAR(256) PRIMARY KEY,
  artist_id   VARCHAR(256) REFERENCES artists_core(id),
  _time       TIMESTAMP,
  key_   VARCHAR(256),
  value  INT
);

CREATE OR REPLACE FUNCTION generate_artists_event_from_req(TEXT,TEXT,TEXT) RETURNS artists_events_history
AS
$$
SELECT MD5($1||$2),$1, TO_TIMESTAMP(CAST($2 AS NUMERIC)),$3,1
$$ LANGUAGE SQL;


CREATE OR REPLACE VIEW artists_events 
AS
(SELECT *
FROM (SELECT *,
             RANK() OVER (PARTITION BY id ORDER BY _time DESC) AS rk
      FROM artists_events_history)
WHERE rk = 1
);

CREATE TABLE IF NOT EXISTS works_core 
(
  id          VARCHAR(256),
  artist_id   VARCHAR(256) REFERENCES artists_core(id),
  user_id     VARCHAR(256) REFERENCES users_core(id),
  creation_time       TIMESTAMP,
  work_name   VARCHAR(256)
);

CREATE OR REPLACE FUNCTION generate_artist_from_req(TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS works_core
AS
$$
SELECT $1, $2,$3,TO_TIMESTAMP(CAST($4 AS NUMERIC)),$5
$$ LANGUAGE SQL;



CREATE TABLE IF NOT EXISTS works_events_history 
(
  id          VARCHAR(256),
  work_id     VARCHAR(256),
  artist_id   VARCHAR(256),
  user_id     VARCHAR(256),
  _time       TIMESTAMP,
  work_name   VARCHAR(256),
  submitted   INT,
  deleted     INT,
  viewed      BIGINT,
  liked       BIGINT
);


CREATE OR REPLACE FUNCTION generate_works_event_from_req(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS works_events_history
AS
$$
SELECT MD5($1||$2||$3||$4) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         ELSE MD5($2||$3||$4)
       END AS work_id,
       CASE
         WHEN LENGTH($2) > 0 THEN $2
         ELSE CAST(NULL AS VARCHAR(256))
       END AS artist_id,
       CASE
         WHEN LENGTH($3) > 0 THEN $3
         ELSE CAST(NULL AS VARCHAR(256))
       END AS user_id,
       CAST($4 AS TIMESTAMP) AS time_,
       CASE
         WHEN LENGTH($1) = 0 AND LENGTH($5) > 0 THEN $5
         ELSE CAST(NULL AS VARCHAR(256))
       END AS work_name,
       CAST($6 = 'submitted' AS INT) AS submitted,
       CAST($6 = 'deleted' AS INT) AS deleted,
       CAST($6 = 'viewed' AS INT) AS viewed,
       CAST($6 = 'liked' AS INT) AS liked 
   $$ LANGUAGE SQL;

CREATE OR REPLACE VIEW works_events 
AS
(SELECT *
FROM (SELECT *,
             RANK() OVER (PARTITION BY id ORDER BY _time DESC) AS rk
      FROM works_events_history)
WHERE rk = 1
);

CREATE OR REPLACE VIEW works_first_events 
AS
(SELECT *
FROM (SELECT *,
             RANK() OVER (PARTITION BY id ORDER BY time_) AS rk
      FROM works_events_history)
WHERE rk = 1
);


CREATE OR REPLACE VIEW works_history 
AS
(
SELECT id,
       artist_id,
       user_id,
       time_,
       work_name,
       MAX(submitted) AS submitted,
       MAX(deleted) AS deleted,
       SUM(viewed) AS viewed,
       SUM(liked) AS liked
FROM (SELECT t0.work_id AS id,
             t0.artist_id,
             t0.user_id,
             t1.time_,
             t0.work_name,
             t2.submitted,
             t2.deleted,
             t2.viewed,
             t2.liked
      FROM works_first_events t0
        JOIN works_events_history t1 ON t0.work_id = t1.work_id
        JOIN works_events_history t2
          ON t0.work_id = t2.work_id
         AND t1._time >= t2.time_)
GROUP BY id,
         artist_id,
         user_id,
         time_,
         work_name
);

CREATE OR REPLACE VIEW works 
AS
(SELECT *
FROM (SELECT *,
             RANK() OVER (PARTITION BY id ORDER BY _time DESC) AS rk
      FROM works_history)
WHERE rk = 1
);


CREATE TABLE IF NOT EXISTS users_artists_ 
(
  id                   VARCHAR(256) PRIMARY KEY,
  user_id              VARCHAR(256) REFERENCES users_(id),
  artist_user_id       VARCHAR(256) REFERENCES users_(id),
  artist_id            VARCHAR(256) REFERENCES artists_(id),
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
  user_artist_id   VARCHAR(256) REFERENCES users_artists_(id) NULL,
  user_id          VARCHAR(256) REFERENCES users_(id) NULL,
  artist_id        VARCHAR(256) REFERENCES artists_(id) NULL,
  _time            TIMESTAMP,
  view_profile     INT,
  watch            INT,
  unwatch          INT,
  ban              INT
);

CREATE FUNCTION generate_users_artists_event_from_req(TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS users_artists_events
AS
$$
SELECT MD5(CONCAT(CONCAT(CONCAT($1,$4),CONCAT($2,$4)),CONCAT($3,$4))) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         ELSE MD5(CONCAT($2,$3))
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

(SELECT * FROM(SELECT *, RANK() OVER(PARTITION BY id ORDER BY last_updated DESC) AS rk FROM users_artists_) WHERE rk = 1);

CREATE TABLE IF NOT EXISTS users_works_ 
(
  id               VARCHAR(256) PRIMARY KEY,
  user_id          VARCHAR(256) REFERENCES users_(id),
  artist_user_id   VARCHAR(256) REFERENCES users_(id),
  artist_id        VARCHAR(256) REFERENCES artists_(id),
  work_id          VARCHAR(256) REFERENCES works_(id),
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
  user_work_id   VARCHAR(256) REFERENCES users_works_(id) NULL,
  user_id        VARCHAR(256) REFERENCES users_(id) NULL,
  work_id        VARCHAR(256) REFERENCES works_(id) NULL,
  _time          TIMESTAMP,
  view_          INT,
  like_          INT,
  unlike         INT
);

CREATE FUNCTION generate_users_works_event_from_req(TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS users_works_events
AS
$$
SELECT MD5(CONCAT(CONCAT(CONCAT($1,$4),CONCAT($2,$4)),CONCAT($3,$4))) AS id,
       CASE
         WHEN LENGTH($1) > 0 THEN $1
         ELSE MD5(CONCAT($2,$3))
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

