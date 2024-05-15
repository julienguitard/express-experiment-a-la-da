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
SELECT MD5($1||$2),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
1 $$ LANGUAGE SQL;

CREATE OR REPLACE VIEW users_last_event
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY user_id ORDER BY _time DESC) AS rk FROM users_events) WHERE rk = 1);

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
SELECT MD5($1||$2),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
1 $$ LANGUAGE SQL;

CREATE OR REPLACE VIEW artists_last_event
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY artist_id ORDER BY _time DESC) AS rk FROM artists_events) WHERE rk = 1);

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
SELECT MD5($1||$2),
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
SELECT MD5($1||$2),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
CASE
WHEN $3 IN ('watch','ban') THEN $3
WHEN $3 = 'unwatch' THEN 'watch'
ELSE CAST(NULL AS VARCHAR(256))
END ,
CASE
WHEN $3 IN ('watch','ban') THEN 1
WHEN $3 = 'unwatch' THEN -1
ELSE 0
END $$LANGUAGE SQL;

CREATE OR REPLACE VIEW users_artists_last_event
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY user_artist_id ORDER BY _time DESC) AS rk FROM users_artists_events) WHERE rk = 1);


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
SELECT MD5($1||$2),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
CASE
WHEN $3 IN ('view','like') THEN $3
WHEN $3 IN ('unview','unlike') THEN RIGHT($3,LENGTH($3)-2)
ELSE CAST(NULL AS VARCHAR(256))
END ,
CASE
WHEN $3 IN ('view','like') THEN 1
WHEN $3 IN ('unview','unlike') THEN -1
ELSE 0
END $$ LANGUAGE SQL;

CREATE OR REPLACE VIEW users_works_last_event
AS

(SELECT * FROM (SELECT *, RANK() OVER (PARTITION BY user_work_id ORDER BY _time DESC) AS rk FROM users_works_events) WHERE rk = 1);


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

SELECT CAST(EXTRACT(EPOCH FROM NOW()) AS VARCHAR(256));

SELECT MD5(CAST(n AS VARCHAR(256)) || 'gil'),
       CAST(EXTRACT(EPOCH FROM n) AS VARCHAR(256)),
       u,
       n
FROM (SELECT NOW() AS n, 'good_version' AS u);


SELECT *
FROM generate_user_from_req ('bc4c3ea077d95736a64b34a222c6eb0e','1715757590.133518','ju','pwd');

SELECT *
FROM generate_user_from_req ('58a9fce14954d73241cce675d68d378a','1715757590.133518','jo','pwd');

SELECT *
FROM generate_user_from_req ('69d8c607e3aebfc7dfca444df0cce5b6','1715787866.255043','jake','pwd');

SELECT *
FROM generate_user_event_from_req ('58a9fce14954d73241cce675d68d378a','1715784312.887661','delete');

SELECT *
FROM generate_user_from_req ('455bb199857541d35e424cef5a5f5f4b','1715784349.218725','gil','pwd');

SELECT *
FROM generate_artist_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','455bb199857541d35e424cef5a5f5f4b','1715784383.308397');

SELECT *
FROM generate_artist_event_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','1715785383.133518','be');

SELECT *
FROM generate_work_from_req ('37f04ec184a353752e2bda51abd7b45e','1e0bb3ab006e8f93efdfc385c1e13722','1715788048.570381','first_draft');

SELECT *
FROM generate_work_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1e0bb3ab006e8f93efdfc385c1e13722','1715788158.501315','second_draft');

SELECT *
FROM generate_work_from_req ('408661a97a79ce10a01ff23f5cc64b1a','1e0bb3ab006e8f93efdfc385c1e13722','1715788251.594415','good_version');

SELECT *
FROM generate_work_event_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1715789251.133518','withdrawn');

SELECT *
FROM generate_user_artist_from_req ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715790251.135181');

SELECT *
FROM generate_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','1715792251.13351','watch');

SELECT *
FROM generate_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','1715793251.13351','unwatch');


SELECT *
FROM generate_user_work_from_req ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715800251.135181');

SELECT *
FROM generate_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','1715801251.135181','view');

SELECT *
FROM generate_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','1715820251.135181','like');


CREATE OR REPLACE FUNCTION insert_user_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_core
AS
$$
DELETE FROM users_core_buffer;
DELETE FROM users_events_buffer;
INSERT INTO users_core_buffer SELECT * FROM generate_user_from_req ($1,$2,$3,$4);
INSERT INTO users_events_buffer SELECT * FROM generate_user_event_from_req ($1,$2,'create');
INSERT INTO users_core SELECT * FROM users_core_buffer;
INSERT INTO users_events SELECT * FROM users_events_buffer ;
SELECT * FROM users_core_buffer
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_event_from_req (TEXT,TEXT,TEXT) RETURNS users_events
AS
$$
DELETE FROM users_events_buffer;
INSERT INTO users_events_buffer SELECT * FROM generate_user_event_from_req ($1,$2,$3);
INSERT INTO users_events SELECT * FROM users_events_buffer ;
SELECT * FROM users_events_buffer
$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION insert_artist_from_req (TEXT,TEXT,TEXT) RETURNS artists_core
AS
$$
DELETE FROM artists_core_buffer;
DELETE FROM artists_events_buffer;
INSERT INTO artists_core_buffer SELECT * FROM generate_artist_from_req ($1,$2,$3);
INSERT INTO artists_events_buffer SELECT * FROM generate_artist_event_from_req ($1,$3,'create');
INSERT INTO artists_core SELECT * FROM artists_core_buffer;
INSERT INTO artists_events SELECT * FROM artists_events_buffer ;
SELECT * FROM artists_core_buffer
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_artist_event_from_req (TEXT,TEXT,TEXT) RETURNS artists_events
AS
$$
DELETE FROM artists_events_buffer;
INSERT INTO artists_events_buffer SELECT * FROM generate_artist_event_from_req ($1,$2,$3);
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
INSERT INTO works_core SELECT * FROM works_core_buffer;
INSERT INTO works_events SELECT * FROM works_events_buffer ;
SELECT * FROM works_core_buffer
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_work_event_from_req (TEXT,TEXT,TEXT) RETURNS works_events
AS
$$
DELETE FROM works_events_buffer;
INSERT INTO works_events_buffer SELECT * FROM generate_work_event_from_req ($1,$2,$3);
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
INSERT INTO users_artists_core SELECT * FROM users_artists_core_buffer;
INSERT INTO users_artists_events SELECT * FROM users_artists_events_buffer ;
SELECT * FROM users_artists_core_buffer
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_artist_event_from_req (TEXT,TEXT,TEXT) RETURNS users_artists_events
AS
$$
DELETE FROM users_artists_events_buffer;
INSERT INTO users_artists_events_buffer SELECT * FROM generate_user_artist_event_from_req ($1,$2,$3);
INSERT INTO users_artists_events SELECT * FROM users_artists_events_buffer ;
SELECT * FROM users_artists_events_buffer
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_work_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_works_core
AS
$$
DELETE FROM users_works_core_buffer;
DELETE FROM users_works_events_buffer;
INSERT INTO users_works_core_buffer SELECT * FROM generate_user_work_from_req ($1,$2,$3,$4);
INSERT INTO users_works_events_buffer SELECT * FROM generate_user_work_event_from_req ($1,$4,'create');
INSERT INTO users_works_core SELECT * FROM users_works_core_buffer;
INSERT INTO users_works_events SELECT * FROM users_works_events_buffer ;
SELECT * FROM users_works_core_buffer
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_work_event_from_req (TEXT,TEXT,TEXT) RETURNS users_works_events
AS
$$
DELETE FROM users_works_events_buffer;
INSERT INTO users_works_events_buffer SELECT * FROM generate_user_work_event_from_req ($1,$2,$3);
INSERT INTO users_works_events SELECT * FROM users_works_events_buffer ;
SELECT * FROM users_works_events_buffer
$$ LANGUAGE SQL;



SELECT *
FROM insert_user_from_req ('bc4c3ea077d95736a64b34a222c6eb0e','1715757590.133518','ju','pwd');

SELECT *
FROM insert_user_from_req ('58a9fce14954d73241cce675d68d378a','1715757590.133518','jo','pwd');

SELECT *
FROM insert_user_from_req ('69d8c607e3aebfc7dfca444df0cce5b6','1715787866.255043','jake','pwd');

SELECT *
FROM insert_user_event_from_req ('58a9fce14954d73241cce675d68d378a','1715784312.887661','delete');

SELECT *
FROM insert_user_from_req ('455bb199857541d35e424cef5a5f5f4b','1715784349.218725','gil','pwd');

SELECT *
FROM insert_artist_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','455bb199857541d35e424cef5a5f5f4b','1715784383.308397');

SELECT *
FROM insert_artist_event_from_req ('1e0bb3ab006e8f93efdfc385c1e13722','1715785383.308397','be');

SELECT *
FROM insert_work_from_req ('37f04ec184a353752e2bda51abd7b45e','1e0bb3ab006e8f93efdfc385c1e13722','1715788048.570381','first_draft');

SELECT *
FROM insert_work_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1e0bb3ab006e8f93efdfc385c1e13722','1715788158.501315','second_draft');

SELECT *
FROM insert_work_from_req ('408661a97a79ce10a01ff23f5cc64b1a','1e0bb3ab006e8f93efdfc385c1e13722','1715788251.594415','good_version');


SELECT *
FROM insert_work_event_from_req ('2f0ae6871c0924a605169ad43fcf15a5','1715789251.133518','withdrawn');

SELECT *
FROM insert_user_artist_from_req ('095a719c0b977dafed9eff3e5efdfc54','bc4c3ea077d95736a64b34a222c6eb0e','1e0bb3ab006e8f93efdfc385c1e13722','1715790251.135181');

SELECT *
FROM insert_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','1715792251.13351','watch');

SELECT *
FROM insert_user_artist_event_from_req ('095a719c0b977dafed9eff3e5efdfc54','1715793251.13351','unwatch');

SELECT *
FROM insert_user_work_from_req ('290203d452028cf5e3f36a708bb2279b','bc4c3ea077d95736a64b34a222c6eb0e','408661a97a79ce10a01ff23f5cc64b1a','1715800251.135181');

SELECT *
FROM insert_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','1715801251.135181','view');

SELECT *
FROM insert_user_work_event_from_req ('290203d452028cf5e3f36a708bb2279b','1715820251.135181','like');

