--Main tables and views by granularity users, artists, works, users_artists, users_works
CREATE TABLE IF NOT EXISTS users_core
(
id              VARCHAR(256) PRIMARY KEY,
creation_time   TIMESTAMP,
user_name       VARCHAR(256) NULL,
pwd             VARCHAR(256) NULL
);

CREATE TABLE IF NOT EXISTS users_events
(
id        VARCHAR(256) PRIMARY KEY,
user_id   VARCHAR(256) REFERENCES users_core (id),
_time     TIMESTAMP,
key_      VARCHAR(256),
value     INT
);

CREATE OR REPLACE VIEW users_last_event
AS
(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY user_id ORDER BY _time DESC) AS rk FROM users_events) WHERE rk = 1);

CREATE OR REPLACE VIEW users AS (
SELECT MD5(user_id||key_) AS id,
       user_id,
       creation_time,
       user_name,
       pwd,
       key_,
       MAX(value) AS value
FROM (SELECT t0.id AS user_id,
             t0.creation_time,
             t0.user_name,
             t0.pwd,
             t1.key_,
             t1.value
      FROM users_core t0
        JOIN users_events t1 ON t0.id = t1.user_id)
GROUP BY user_id,
         creation_time,
         user_name,
         pwd,
         key_
);

CREATE TABLE IF NOT EXISTS artists_core
(
id              VARCHAR(256) PRIMARY KEY,
user_id         VARCHAR(256) REFERENCES users_core (id),
creation_time   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists_events
(
id          VARCHAR(256) PRIMARY KEY,
artist_id   VARCHAR(256) REFERENCES artists_core (id),
_time       TIMESTAMP,
key_        VARCHAR(256),
value       INT
);

CREATE OR REPLACE VIEW artists_last_event
AS
(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY artist_id ORDER BY _time DESC) AS rk FROM artists_events) WHERE rk = 1);

CREATE OR REPLACE VIEW artists AS (
SELECT MD5(artist_id||key_) AS id,
       artist_id,
       user_id,
       creation_time,
       key_,
       MAX(value) AS value
FROM (SELECT t0.id AS artist_id,
             t0.user_id,
             t0.creation_time,
             t1.key_,
             t1.value
      FROM artists_core t0
        JOIN artists_events t1 ON t0.id = t1.artist_id)
GROUP BY artist_id,
         user_id,
         creation_time,
         key_
);

CREATE TABLE IF NOT EXISTS works_core
(
id              VARCHAR(256) PRIMARY KEY,
artist_id       VARCHAR(256) REFERENCES artists_core (id),
creation_time   TIMESTAMP,
work_name       VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS works_events
(
id        VARCHAR(256),
work_id   VARCHAR(256) REFERENCES works_core (id),
_time     TIMESTAMP,
key_      VARCHAR(256),
value     INT
);

CREATE OR REPLACE VIEW works_last_event
AS
(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY work_id ORDER BY _time DESC) AS rk FROM works_events) WHERE rk = 1);

CREATE OR REPLACE VIEW works AS (
SELECT 
MD5(work_id||key_) AS id,
work_id,
artist_id,
creation_time,
work_name,
key_,
SUM(value) AS value
FROM (SELECT t0.id AS work_id,
t0.artist_id,
t0.creation_time,
t0.work_name,
t1.key_,
t1.value
FROM works_core t0
JOIN works_events t1 ON t0.id = t1.work_id)
GROUP BY work_id,
artist_id,
creation_time,
work_name,
key_
);

CREATE TABLE IF NOT EXISTS users_artists_core
(
id              VARCHAR(256) PRIMARY KEY,
user_id         VARCHAR(256) REFERENCES users_core (id),
artist_id       VARCHAR(256) REFERENCES artists_core (id),
creation_time   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_artists_events
(
id               VARCHAR(256) PRIMARY KEY,
user_artist_id   VARCHAR(256) REFERENCES users_artists_core (id) NULL,
_time            TIMESTAMP,
key_             VARCHAR(256),
value            INT
);

CREATE OR REPLACE VIEW users_artists_last_event
AS
(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY user_artist_id ORDER BY _time DESC) AS rk FROM users_artists_events) WHERE rk = 1);

CREATE OR REPLACE VIEW users_artists AS (
SELECT MD5(user_artist_id||key_) AS id,
       user_artist_id,
       user_id,
       artist_id,
       creation_time,
       key_,
       CASE
         WHEN key_ = 'ban' THEN MAX(value)
         ELSE SUM(value)
       END AS value
FROM (SELECT t0.id AS user_artist_id,
             t0.user_id,
             t0.artist_id,
             t0.creation_time,
             t1.key_,
             t1.value
      FROM users_artists_core t0
        JOIN users_artists_events t1 ON t0.id = t1.user_artist_id)
GROUP BY user_artist_id,
         user_id,
         artist_id,
         creation_time,
         key_
);

CREATE TABLE IF NOT EXISTS users_works_core
(
id              VARCHAR(256) PRIMARY KEY,
user_id         VARCHAR(256) REFERENCES users_core (id),
work_id         VARCHAR(256) REFERENCES works_core (id),
creation_time   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_works_events
(
id             VARCHAR(256) PRIMARY KEY,
user_work_id   VARCHAR(256) REFERENCES users_works_core (id) NULL,
_time          TIMESTAMP,
key_           VARCHAR(256),
value          INT
);

CREATE OR REPLACE VIEW users_works_last_event
AS
(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY user_work_id ORDER BY _time DESC) AS rk FROM users_works_events) WHERE rk = 1);

CREATE OR REPLACE VIEW users_works AS (
SELECT MD5(user_work_id||key_) AS id,
       user_work_id,
       user_id,
       work_id,
       creation_time,
       key_,
       SUM(value) AS value
FROM (SELECT t0.id AS user_work_id,
             t0.user_id,
             t0.work_id,
             t0.creation_time,
             t1.key_,
             t1.value
      FROM users_works_core t0
        JOIN users_works_events t1 ON t0.id = t1.user_work_id)
GROUP BY user_work_id,
         user_id,
         work_id,
         creation_time,
         key_
);

--Views to propagate user deletion, work withdrawal and user ban


CREATE OR REPLACE VIEW non_deleted_users_ids AS (
SELECT user_id
FROM (SELECT t0.user_id,
             CAST(t1.user_id IS NULL AS INT) AS non_deleted
      FROM (SELECT DISTINCT user_id FROM users) t0
        LEFT JOIN (SELECT DISTINCT user_id
                   FROM users
                   WHERE key_ = 'delete'
                   AND   value = 1) t1 USING (user_id))
WHERE non_deleted = 1
);


CREATE OR REPLACE VIEW users_without_deleted AS(
SELECT *
FROM users
  JOIN non_deleted_users_ids USING (user_id)
);

CREATE OR REPLACE VIEW artists_without_deleted AS
(
SELECT *
FROM artists
  JOIN non_deleted_users_ids USING (user_id)
);

CREATE OR REPLACE VIEW non_deleted_artists_ids AS
(
SELECT DISTINCT artist_id
FROM artists_without_deleted
);

CREATE OR REPLACE VIEW works_without_deleted AS
(SELECT *
FROM works
  JOIN non_deleted_artists_ids USING (artist_id)
);

CREATE OR REPLACE VIEW non_deleted_works_ids AS
(
SELECT DISTINCT work_id
FROM works_without_deleted
);

CREATE OR REPLACE VIEW users_artists_without_deleted AS
(
SELECT *
FROM (SELECT *
      FROM users_artists
        JOIN non_deleted_users_ids USING (user_id))
  JOIN non_deleted_artists_ids USING (artist_id)
);


CREATE OR REPLACE VIEW users_works_without_deleted AS
(
SELECT *
FROM (SELECT *
      FROM users_works
        JOIN non_deleted_users_ids USING (user_id))
  JOIN non_deleted_works_ids USING (artist_id)
);

--Buffers for procedure

CREATE TABLE IF NOT EXISTS users_works_events_buffer
AS
(SELECT *
FROM users_works_events LIMIT 1);

CREATE TABLE IF NOT EXISTS users_works_core_buffer
AS
(SELECT *
FROM users_works_core LIMIT 1);

CREATE TABLE IF NOT EXISTS users_artists_events_buffer
AS
(SELECT *
FROM users_artists_events LIMIT 1);

CREATE TABLE IF NOT EXISTS users_artists_core_buffer
AS
(SELECT *
FROM users_artists_core LIMIT 1);

CREATE TABLE IF NOT EXISTS works_events_buffer
AS
(SELECT *
FROM works_events LIMIT 1);

CREATE TABLE IF NOT EXISTS works_core_buffer
AS
(SELECT *
FROM works_core LIMIT 1);

CREATE TABLE IF NOT EXISTS artists_events_buffer
AS
(SELECT *
FROM artists_events LIMIT 1);

CREATE TABLE IF NOT EXISTS artists_core_buffer
AS
(SELECT *
FROM artists_core LIMIT 1);

CREATE TABLE IF NOT EXISTS users_events_buffer
AS
(SELECT *
FROM users_events LIMIT 1);

CREATE TABLE IF NOT EXISTS users_core_buffer
AS
(SELECT *
FROM users_core LIMIT 1);