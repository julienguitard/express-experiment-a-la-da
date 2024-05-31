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
SELECT t0.user_id,
       COALESCE(t1.artist_id,'undefined') AS artist_id
FROM (SELECT user_id
      FROM users_without_deleted
      WHERE user_name = 'jake'
      AND   pwd = 'pwd') t0
  LEFT JOIN (SELECT artist_id, user_id FROM artists_without_deleted) t1 ON t0.user_id = t1.user_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_my_watchers_from_req (TEXT) RETURNS artists
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_users_from_req (TEXT) RETURNS artists
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;



CREATE OR REPLACE FUNCTION see_my_works_from_req (TEXT) RETURNS artists
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_of_my_works_from_req (TEXT) RETURNS artists
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_my_watched_artists_from_req (TEXT) RETURNS artists
AS
$$
SELECT t0.artist_id,
       t1.user_name,
       t0.value AS watch
FROM (SELECT *
      FROM users_artists_without_banned
      WHERE user_id = $1 AND key_ = 'watch') t0
  JOIN (SELECT DISTINCT user_id, user_name FROM users_without_deleted) t1 USING (user_id)
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_artists_from_req (TEXT) RETURNS artists
AS
$$
SELECT artist_id,
       user_id,
       O AS watch
FROM (SELECT t0.artist_id,
             t0.user_id,
             t1.artist_id AS artist_id_
      FROM (SELECT t00.artist_id,
                   t01.user_name
            FROM (SELECT DISTINCT artist_id,
                         user_içd
                  FROM artists_without_deleted) t00
              JOIN (SELECT DISTINCT user_id, user_name FROM users_without_deleted) t01 USING (user_id)) t0
        LEFT JOIN (SELECT artist_id
                   FROM users_artists_without_banned
                   WHERE user_id = $1
                   AND   key_ = 'watch') t1 USING (artist_id))
WHERE artist_id IS NULL
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION see_my_liked_works_from_req (TEXT) RETURNS artists
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_works_from_req (TEXT) RETURNS artists
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION insert_into_requests_logs (TEXT,TEXT,TEXT) RETURNS requests_logs
AS
$$
INSERT INTO requests_logs
(
  SELECT*FROM generate_requests_logs_event($1,$2,$3)
);

SELECT *
FROM generate_requests_logs_event ($1,$2,$3);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_into_responses_logs (TEXT,TEXT,TEXT,TEXT) RETURNS responses_logs
AS
$$
INSERT INTO responses_logs
(
  SELECT*FROM generate_responses_logs_event($1,$2,$3,$4)
);

SELECT *
FROM generate_responses_logs_event ($1,$2,$3,$4);

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION insert_into_errors_logs (TEXT,TEXT,TEXT,TEXT) RETURNS errors_logs
AS
$$
INSERT INTO errors_logs
(
  SELECT*FROM generate_errors_logs_event($1,$2,$3,$4)
);

SELECT *
FROM generate_errors_logs_event ($1,$2,$3,$4);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION select_full_logs () RETURNS full_logs
AS
$$


SELECT *
FROM full_logs ORDER BY time_ DESC LIMIT 100;

$$ LANGUAGE SQL;