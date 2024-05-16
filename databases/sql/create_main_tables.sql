DROP TABLE IF EXISTS users_works_events_buffer CASCADE;

DROP TABLE IF EXISTS users_works_core_buffer CASCADE;

DROP TABLE IF EXISTS users_works_events CASCADE;

DROP TABLE IF EXISTS users_works_core CASCADE;

DROP TABLE IF EXISTS users_artists_events_buffer CASCADE;

DROP TABLE IF EXISTS users_artists_core_buffer CASCADE;

DROP TABLE IF EXISTS users_artists_events CASCADE;

DROP TABLE IF EXISTS users_artists_core CASCADE;

DROP TABLE IF EXISTS works_events_buffer CASCADE;

DROP TABLE IF EXISTS works_core_buffer CASCADE;

DROP TABLE IF EXISTS works_events CASCADE;

DROP TABLE IF EXISTS works_core CASCADE;

DROP TABLE IF EXISTS artists_events_buffer CASCADE;

DROP TABLE IF EXISTS artists_core_buffer CASCADE;

DROP TABLE IF EXISTS artists_events CASCADE;

DROP TABLE IF EXISTS artists_core CASCADE;

DROP TABLE IF EXISTS users_events_buffer CASCADE;

DROP TABLE IF EXISTS users_core_buffer CASCADE;

DROP TABLE IF EXISTS users_events CASCADE;

DROP TABLE IF EXISTS users_core CASCADE;

CREATE TABLE IF NOT EXISTS users_core
(
id              VARCHAR(256) PRIMARY KEY,
creation_time   TIMESTAMP,
user_name       VARCHAR(256) NULL,
pwd             VARCHAR(256) NULL
);

CREATE OR REPLACE FUNCTION generate_user_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_core
AS
$$
SELECT $1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
$4 $$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS users_events
(
id        VARCHAR(256) PRIMARY KEY,
user_id   VARCHAR(256) REFERENCES users_core (id),
_time     TIMESTAMP,
key_      VARCHAR(256),
value     INT
);

CREATE OR REPLACE FUNCTION generate_user_event_from_req (TEXT,TEXT,TEXT) RETURNS users_events
AS
$$
SELECT MD5($1||$2||$3),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
1 $$ LANGUAGE SQL;

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


CREATE OR REPLACE FUNCTION generate_artist_from_req (TEXT,TEXT,TEXT) RETURNS artists_core
AS
$$
SELECT $1,
$2,
TO_TIMESTAMP(CAST($3 AS NUMERIC)) $$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS artists_events
(
id          VARCHAR(256) PRIMARY KEY,
artist_id   VARCHAR(256) REFERENCES artists_core (id),
_time       TIMESTAMP,
key_        VARCHAR(256),
value       INT
);

CREATE OR REPLACE FUNCTION generate_artist_event_from_req (TEXT,TEXT,TEXT) RETURNS artists_events
AS
$$
SELECT MD5($1||$2||$3),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
1 $$ LANGUAGE SQL;

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

CREATE OR REPLACE FUNCTION generate_work_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS works_core
AS
$$
SELECT $1,
$2,
TO_TIMESTAMP(CAST($3 AS NUMERIC)),
$4 $$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS works_events
(
id        VARCHAR(256),
work_id   VARCHAR(256) REFERENCES works_core (id),
_time     TIMESTAMP,
key_      VARCHAR(256),
value     INT
);

CREATE OR REPLACE FUNCTION generate_work_event_from_req (TEXT,TEXT,TEXT) RETURNS works_events
AS
$$
SELECT MD5($1||$2||$3),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
CASE
WHEN $3 IN ('submit','view','like') THEN $3
WHEN $3 = 'withdraw' THEN 'submit'
WHEN $3 = 'unlike' THEN 'like'
ELSE CAST(NULL AS VARCHAR(256))
END
,
CASE
WHEN $3 IN ('submit','view','like') THEN 1
WHEN $3 = 'withdraw' THEN -1
WHEN $3 = 'unlike' THEN -1
ELSE 0
END $$LANGUAGE SQL;

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

CREATE OR REPLACE FUNCTION generate_user_artist_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_artists_core
AS
$$
SELECT $1,
$2,
$3,
TO_TIMESTAMP(CAST($4 AS NUMERIC)) $$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS users_artists_events
(
id               VARCHAR(256) PRIMARY KEY,
user_artist_id   VARCHAR(256) REFERENCES users_artists_core (id) NULL,
_time            TIMESTAMP,
key_             VARCHAR(256),
value            INT
);

CREATE OR REPLACE FUNCTION generate_user_artist_event_from_req (TEXT,TEXT,TEXT) RETURNS users_artists_events
AS
$$
SELECT MD5($1||$2||$3),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
CASE
WHEN $3 IN ('create','watch','ban') THEN $3
WHEN $3 = 'unwatch' THEN 'watch'
ELSE CAST(NULL AS VARCHAR(256))
END ,
CASE
WHEN $3 IN ('create','watch','ban') THEN 1
WHEN $3 = 'unwatch' THEN -1
ELSE 0
END $$LANGUAGE SQL;

CREATE OR REPLACE VIEW users_artists_last_event
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY user_artist_id ORDER BY _time DESC) AS rk FROM users_artists_events) WHERE rk = 1);

CREATE OR REPLACE VIEW users_artists AS (
SELECT MD5(user_artist_id||key_) AS id,
       user_artist_id user_id,
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

CREATE OR REPLACE FUNCTION generate_user_work_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_works_core
AS
$$
SELECT $1,
$2,
$3,
TO_TIMESTAMP(CAST($4 AS NUMERIC)) $$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS users_works_events
(
id             VARCHAR(256) PRIMARY KEY,
user_work_id   VARCHAR(256) REFERENCES users_works_core (id) NULL,
_time          TIMESTAMP,
key_           VARCHAR(256),
value          INT
);

CREATE OR REPLACE FUNCTION generate_user_work_event_from_req(TEXT,TEXT,TEXT) RETURNS users_works_events
AS
$$
SELECT MD5($1||$2||$3),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
CASE
WHEN $3 IN ('create','view','like') THEN $3
WHEN $3 IN ('unview','unlike') THEN RIGHT($3,LENGTH($3)-2)
ELSE CAST(NULL AS VARCHAR(256))
END ,
CASE
WHEN $3 IN ('create','view','like') THEN 1
WHEN $3 IN ('unview','unlike') THEN -1
ELSE 0
END $$ LANGUAGE SQL;

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


SELECT *
FROM generate_user_from_req ('bc4c3ea077d95736a64b34a222c6eb0e','1715750000','ju','pwd');

SELECT *
FROM generate_user_from_req ('58a9fce14954d73241cce675d68d378a','1715751000','jo','pwd');

SELECT *
FROM generate_user_from_req ('69d8c607e3aebfc7dfca444df0cce5b6','1715752000','jake','pwd');

SELECT *
FROM generate_user_event_from_req ('58a9fce14954d73241cce675d68d378a','1715753000','delete');

SELECT *
FROM generate_user_from_req ('455bb199857541d35e424cef5a5f5f4b','1715754000','gil','pwd');

SELECT *
FROM generate_user_from_req ('a6772d17a88788fc111d1e2637977401','1715754500','kyle','pwd');

SELECT *
FROM generate_artist_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','455bb199857541d35e424cef5a5f5f4b','1715755000');

SELECT *
FROM generate_artist_from_req ('61d6184592315a39b8f8bb9553700436','a6772d17a88788fc111d1e2637977401','1715755500');

SELECT *
FROM generate_artist_event_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','1715756000','be');

SELECT *
FROM generate_work_from_req ('37f04ec184a353752e2bda51abd7b45e','1e0bb3ab006e8f93efdfc385c1e13722','1715757000','first_draft');

SELECT *
FROM generate_work_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1e0bb3ab006e8f93efdfc385c1e13722','1715758000','second_draft');

SELECT *
FROM generate_work_from_req ('408661a97a79ce10a01ff23f5cc64b1a','1e0bb3ab006e8f93efdfc385c1e13722','1715759000','good_version');

SELECT *
FROM generate_work_from_req ('aad8a727b09600707339c4a4531208b8','61d6184592315a39b8f8bb9553700436','1715759500','experiment');

SELECT *
FROM generate_work_event_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1715760000','withdraw');

SELECT *
FROM generate_user_artist_from_req ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715761000');

SELECT *
FROM generate_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','1715762000','watch');

SELECT *
FROM generate_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','1715763000','unwatch');

SELECT *
FROM generate_user_artist_from_req ('7cfda70b457f9b97f79c54e36388d6a2','69d8c607e3aebfc7dfca444df0cce5b6','1e0bb3ab006e8f93efdfc385c1e13722','1715764000');

SELECT *
FROM generate_user_artist_event_from_req ('7cfda70b457f9b97f79c54e36388d6a2','1715765000','watch');

SELECT *
FROM generate_user_work_from_req ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715766000');

SELECT *
FROM generate_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','1715767000','view');

SELECT *
FROM generate_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','1715768000','like');

CREATE OR REPLACE FUNCTION insert_user_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_core
AS
$$

DELETE FROM users_core_buffer;
DELETE FROM users_events_buffer;

INSERT INTO users_core_buffer SELECT * FROM generate_user_from_req ($1,$2,$3,$4);
INSERT INTO users_events_buffer SELECT * FROM generate_user_event_from_req ($1,$2,'create');

MERGE INTO users_core_buffer cb
USING users_core c
ON cb.user_name = c.user_name
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_events_buffer  eb
USING users_events e
ON eb.user_id = e.user_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_core SELECT * FROM users_core_buffer;
INSERT INTO users_events
SELECT eb.id,
eb.user_id,
eb._time,
eb.key_,
eb.value
FROM users_events_buffer eb
JOIN users_core_buffer cb ON eb.user_id = cb.id;

SELECT * FROM users_core_buffer

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_event_from_req (TEXT,TEXT,TEXT) RETURNS users_events
AS
$$

DELETE FROM users_events_buffer;

INSERT INTO users_events_buffer SELECT * FROM generate_user_event_from_req ($1,$2,$3);

MERGE INTO users_events_buffer  eb
USING users_events e
ON eb.user_id = e.user_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_events SELECT * FROM users_events_buffer;

SELECT * FROM users_events_buffer

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION insert_artist_from_req (TEXT,TEXT,TEXT) RETURNS artists_core
AS
$$

DELETE FROM artists_core_buffer;
DELETE FROM artists_events_buffer;

INSERT INTO artists_core_buffer SELECT * FROM generate_artist_from_req ($1,$2,$3);
INSERT INTO artists_events_buffer SELECT * FROM generate_artist_event_from_req ($1,$3,'create');

MERGE INTO artists_core_buffer cb
USING artists_core c
ON cb.user_id = c.user_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO artists_events_buffer  eb
USING artists_events e
ON eb.artist_id = e.artist_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO artists_core SELECT * FROM artists_core_buffer;
INSERT INTO artists_events
SELECT eb.id,
eb.artist_id,
eb._time,
eb.key_,
eb.value
FROM artists_events_buffer eb
JOIN artists_core_buffer cb ON eb.artist_id = cb.id;

SELECT * FROM artists_core_buffer

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_artist_event_from_req (TEXT,TEXT,TEXT) RETURNS artists_events
AS
$$

DELETE FROM artists_events_buffer;

INSERT INTO artists_events_buffer SELECT * FROM generate_artist_event_from_req ($1,$2,$3);

MERGE INTO artists_events_buffer  eb
USING artists_events e
ON eb.artist_id = e.artist_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO artists_events SELECT * FROM artists_events_buffer ;

SELECT * FROM artists_events_buffer

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_work_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS works_core
AS
$$
DELETE FROM works_core_buffer;
DELETE FROM works_events_buffer;

INSERT INTO works_core_buffer SELECT * FROM generate_work_from_req ($1,$2,$3,$4);
INSERT INTO works_events_buffer SELECT * FROM generate_work_event_from_req ($1,$3,'submit');

MERGE INTO works_core_buffer cb
USING works_core c
ON cb.artist_id = c.artist_id AND cb.work_name = c.work_name
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO works_events_buffer  eb
USING works_events e
ON eb.work_id = e.work_id AND eb.key_ = e.key_ AND e.key_ = 'submit'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO works_core SELECT * FROM works_core_buffer;
INSERT INTO works_events
SELECT eb.id,
eb.work_id,
eb._time,
eb.key_,
eb.value
FROM works_events_buffer eb
JOIN works_core_buffer cb ON eb.work_id = cb.id;

SELECT * FROM works_core_buffer

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_work_event_from_req (TEXT,TEXT,TEXT) RETURNS works_events
AS
$$

DELETE FROM works_events_buffer;

INSERT INTO works_events_buffer SELECT * FROM generate_work_event_from_req ($1,$2,$3);

MERGE INTO works_events_buffer  eb
USING works_events e
ON eb.work_id = e.work_id AND eb.key_ = e.key_ AND e.key_ = 'submit' AND eb.value=1
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO works_events SELECT * FROM works_events_buffer ;

SELECT * FROM works_events_buffer

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_artist_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_artists_core
AS
$$

DELETE FROM users_artists_core_buffer;
DELETE FROM users_artists_events_buffer;

INSERT INTO users_artists_core_buffer SELECT * FROM generate_user_artist_from_req ($1,$2,$3,$4);
INSERT INTO users_artists_events_buffer SELECT * FROM generate_user_artist_event_from_req ($1,$4,'create');

MERGE INTO users_artists_core_buffer cb
USING users_artists_core c
ON cb.user_id = c.user_id AND cb.artist_id = c.artist_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_artists_events_buffer  eb
USING users_artists_events e
ON eb.user_artist_id = e.user_artist_id AND eb.key_ = e.key_ AND eb.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_artists_core SELECT * FROM users_artists_core_buffer;
INSERT INTO users_artists_events
SELECT eb.id,
eb.user_artist_id,
eb._time,
eb.key_,
eb.value
FROM users_artists_events_buffer eb
JOIN users_artists_core_buffer cb ON eb.user_artist_id = cb.id;

SELECT * FROM users_artists_core_buffer

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_artist_event_from_req (TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS users_artists_events
AS
$$

DELETE FROM users_artists_core_buffer;
DELETE FROM users_artists_events_buffer;

INSERT INTO users_artists_core_buffer SELECT * FROM generate_user_artist_from_req ($1,$2,$3,$4);
INSERT INTO users_artists_events_buffer SELECT * FROM generate_user_artist_event_from_req ($1,$4,$5);

MERGE INTO users_artists_core_buffer cb
USING users_artists_core c
ON cb.user_id = c.user_id AND cb.artist_id = c.artist_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_artists_events_buffer  eb
USING users_artists_events e
ON eb.user_artist_id = e.user_artist_id AND eb.key_ = e.key_ AND eb.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_artists_core SELECT * FROM users_artists_core_buffer;
INSERT INTO users_artists_events SELECT * FROM users_artists_events_buffer;

SELECT * FROM users_artists_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_work_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_works_core
AS
$$

DELETE FROM users_works_core_buffer;
DELETE FROM users_works_events_buffer;

INSERT INTO users_works_core_buffer SELECT * FROM generate_user_work_from_req ($1,$2,$3,$4);
INSERT INTO users_works_events_buffer SELECT * FROM generate_user_work_event_from_req ($1,$4,'create');

MERGE INTO users_works_core_buffer cb
USING users_works_core c
ON cb.user_id = c.user_id AND cb.work_id = c.work_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_works_events_buffer  eb
USING users_works_events e
ON eb.user_work_id = e.user_work_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_works_core SELECT * FROM users_works_core_buffer;
INSERT INTO users_works_events
SELECT eb.id,
eb.user_work_id,
eb._time,
eb.key_,
eb.value
FROM users_works_events_buffer eb
JOIN users_works_core_buffer cb ON eb.user_work_id = cb.id;

SELECT * FROM users_works_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_work_event_from_req (TEXT,TEXT,TEXT,TEXT,TEXT) RETURNS users_works_events
AS
$$

DELETE FROM users_works_events_buffer;

INSERT INTO users_works_core_buffer SELECT * FROM generate_user_work_from_req ($1,$2,$3,$4);
INSERT INTO users_works_events_buffer SELECT * FROM generate_user_work_event_from_req ($1,$4,$5);

MERGE INTO users_works_core_buffer cb
USING users_works_core c
ON cb.user_id = c.user_id AND cb.work_id = c.work_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_works_events_buffer  eb
USING users_works_events e
ON eb.user_work_id = e.user_work_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_works_core SELECT * FROM users_works_core_buffer;
INSERT INTO users_works_events SELECT * FROM users_works_events_buffer;

SELECT * FROM users_works_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION check_login_from_req (TEXT,TEXT) RETURNS users
AS
$$
SELECT * FROM users WHERE user_name=$1 AND pwd = $2;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_my_watched_artists_from_req (TEXT) RETURNS artists
AS
$$
SELECT t0.id,
       t0.artist_id,
       t0.user_id,
       t0.creation_time,
       t0.key_,
       t0.value
FROM artists t0
  JOIN (SELECT t10.artist_id
        FROM (SELECT DISTINCT artist_id
              FROM users_artists
              WHERE user_id = $1
              AND   key_ = 'watch'
              AND   value = 1) t10
          JOIN (SELECT DISTINCT artist_id
                FROM users_artists
                WHERE user_id = $1
                AND   key_ = 'ban'
                AND   value = 0) t11 USING(artist_id)) t1 USING(artist_id)
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_artists_from_req (TEXT) RETURNS artists
AS
$$

SELECT t0.id,
       t0.artist_id,
       t0.user_id,
       t0.creation_time,
       t0.key_,
       t0.value
FROM (SELECT *
      FROM (SELECT t00.id,
                   t00.artist_id,
                   t00.user_id,
                   t00.creation_time,
                   t00.key_,
                   t00.value,
                   t01.artist_id AS artist_id_
            FROM artists t00
              LEFT JOIN (SELECT DISTINCT artist_id
                         FROM users_artists
                         WHERE user_id = $1
                         AND   key_ = 'watch'
                         AND   value = 1) t01 USING (artist_id))
      WHERE artist_id_ IS NULL) t0
  JOIN (SELECT DISTINCT artist_id
        FROM users_artists
        WHERE user_id = $1
        AND   key_ = 'ban'
        AND   value = 0) t1 USING (artist_id)
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;


SELECT *
FROM insert_user_from_req ('bc4c3ea077d95736a64b34a222c6eb0e','1715750000','ju','pwd');

SELECT *
FROM insert_user_from_req ('58a9fce14954d73241cce675d68d378a','1715751000','jo','pwd');

SELECT *
FROM insert_user_from_req ('69d8c607e3aebfc7dfca444df0cce5b6','1715752000','jake','pwd');

SELECT *
FROM insert_user_event_from_req ('58a9fce14954d73241cce675d68d378a','1715753000','delete');

SELECT *
FROM insert_user_from_req ('455bb199857541d35e424cef5a5f5f4b','1715754000','gil','pwd');

SELECT *
FROM insert_user_from_req ('a6772d17a88788fc111d1e2637977401','1715754500','kyle','pwd');

SELECT *
FROM insert_artist_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','455bb199857541d35e424cef5a5f5f4b','1715755000');

SELECT *
FROM insert_artist_from_req ('61d6184592315a39b8f8bb9553700436','a6772d17a88788fc111d1e2637977401','1715755500');

SELECT *
FROM insert_artist_event_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','1715756000','be');

SELECT *
FROM insert_work_from_req ('37f04ec184a353752e2bda51abd7b45e','1e0bb3ab006e8f93efdfc385c1e13722','1715757000','first_draft');

SELECT *
FROM insert_work_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1e0bb3ab006e8f93efdfc385c1e13722','1715758000','second_draft');

SELECT *
FROM insert_work_from_req ('408661a97a79ce10a01ff23f5cc64b1a','1e0bb3ab006e8f93efdfc385c1e13722','1715759000','good_version');

SELECT *
FROM insert_work_from_req ('aad8a727b09600707339c4a4531208b8','61d6184592315a39b8f8bb9553700436','1715759500','experiment');

SELECT *
FROM insert_work_event_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1715760000','withdraw');


SELECT *
FROM insert_user_artist_from_req ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715761000');

SELECT *
FROM insert_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715762000','watch');

SELECT *
FROM insert_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715763000','unwatch');

SELECT *
FROM insert_user_artist_from_req ('7cfda70b457f9b97f79c54e36388d6a2','69d8c607e3aebfc7dfca444df0cce5b6','1e0bb3ab006e8f93efdfc385c1e13722','1715764000');

SELECT *
FROM insert_user_artist_event_from_req ('7cfda70b457f9b97f79c54e36388d6a2','69d8c607e3aebfc7dfca444df0cce5b6','1e0bb3ab006e8f93efdfc385c1e13722','1715765000','watch');



SELECT *
FROM insert_user_work_from_req ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715766000');

SELECT *
FROM insert_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715767000','view');

SELECT *
FROM insert_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715768000','like');

SELECT CAST(EXTRACT(EPOCH FROM NOW()) AS VARCHAR(256));

SELECT MD5(CAST(n AS VARCHAR(256)) || 'gil'),
CAST(EXTRACT(EPOCH FROM n) AS VARCHAR(256)),
u,
n
FROM (SELECT NOW() AS n, 'good_version' AS u);