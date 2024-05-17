CREATE OR REPLACE FUNCTION generate_user_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_core
AS
$$
SELECT $1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
$4 $$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_event_from_req (TEXT,TEXT,TEXT) RETURNS users_events
AS
$$
SELECT MD5($1||$2||$3),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
1 $$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_artist_from_req (TEXT,TEXT,TEXT) RETURNS artists_core
AS
$$
SELECT $1,
$2,
TO_TIMESTAMP(CAST($3 AS NUMERIC)) $$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_artist_event_from_req (TEXT,TEXT,TEXT) RETURNS artists_events
AS
$$
SELECT MD5($1||$2||$3),
$1,
TO_TIMESTAMP(CAST($2 AS NUMERIC)),
$3,
1 $$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_work_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS works_core
AS
$$
SELECT $1,
$2,
TO_TIMESTAMP(CAST($3 AS NUMERIC)),
$4 $$ LANGUAGE SQL;

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
END,
CASE
WHEN $3 IN ('submit','view','like') THEN 1
WHEN $3 = 'withdraw' THEN -1
WHEN $3 = 'unlike' THEN -1
ELSE 0
END $$LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_artist_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_artists_core
AS
$$
SELECT $1,
$2,
$3,
TO_TIMESTAMP(CAST($4 AS NUMERIC)) $$ LANGUAGE SQL;


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

CREATE OR REPLACE FUNCTION generate_user_work_from_req (TEXT,TEXT,TEXT,TEXT) RETURNS users_works_core
AS
$$
SELECT $1,
$2,
$3,
TO_TIMESTAMP(CAST($4 AS NUMERIC)) $$ LANGUAGE SQL;


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
