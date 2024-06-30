CREATE OR REPLACE FUNCTION generate_user (user_id_arg TEXT, req_epoch_arg TEXT, user_name_arg TEXT, pwd_arg TEXT) RETURNS SETOF users_core
AS
$$

SELECT user_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC)),
       user_name_arg,
       pwd_arg;


$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_event (user_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF users_events
AS
$$

SELECT MD5(user_id_arg||req_epoch_arg||key__arg),
       user_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC)),
       key__arg,
       1;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_artist (artist_id_arg TEXT, user_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF artists_core
AS
$$

SELECT artist_id_arg,
       user_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC))

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_artist_event (artist_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF artists_events
AS
$$

SELECT MD5(artist_id_arg||req_epoch_arg||key__arg),
       artist_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC)),
       key__arg,
       1;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_work (work_id_arg TEXT, artist_id_arg TEXT, req_epoch_arg TEXT, work_name_arg TEXT) RETURNS SETOF works_core
AS
$$

SELECT work_id_arg,
       artist_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC)),
       work_name_arg;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_work_event (work_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT)  RETURNS SETOF works_events
AS
$$

SELECT MD5(work_id_arg||req_epoch_arg||key__arg),
       work_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC)),
       CASE
         WHEN key__arg IN ('submit','view','like') THEN key__arg
         WHEN key__arg = 'withdraw' THEN 'submit'
         WHEN key__arg = 'unlike' THEN 'like'
         ELSE CAST(NULL AS VARCHAR(256))
       END 
,
       CASE
         WHEN key__arg IN ('submit','view','like') THEN 1
         WHEN key__arg = 'withdraw' THEN -1
         WHEN key__arg = 'unlike' THEN -1
         ELSE 0
       END;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_artist (user_artist_id_arg TEXT, user_id_arg TEXT, artist_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_artists_core
AS
$$

SELECT user_artist_id_arg,
       user_id_arg,
       artist_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC));

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION generate_user_artist_event (user_artist_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF users_artists_events
AS
$$

SELECT MD5(user_artist_id_arg||req_epoch_arg||key__arg),
       user_artist_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC)),
       CASE
         WHEN key__arg IN ('create','watch','ban') THEN key__arg
         WHEN key__arg = 'unwatch' THEN 'watch'
         ELSE CAST(NULL AS VARCHAR(256))
       END 
,
       CASE
         WHEN key__arg IN ('create','watch','ban') THEN 1
         WHEN key__arg = 'unwatch' THEN -1
         ELSE 0
       END;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_work (user_work_id_arg TEXT, user_id_arg TEXT, artist_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_works_core
AS
$$

SELECT user_work_id_arg,
       user_id_arg,
       artist_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC));

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_work_event(user_work_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF users_works_events
AS
$$

SELECT MD5(user_work_id_arg||req_epoch_arg||key__arg),
       user_work_id_arg,
       TO_TIMESTAMP(CAST(req_epoch_arg AS NUMERIC)),
       CASE
         WHEN key__arg IN ('create','view','like') THEN key__arg
         WHEN key__arg IN ('unview','unlike') THEN RIGHT (key__arg,LENGTH(key__arg) -2)
         ELSE CAST(NULL AS VARCHAR(256))
       END 
,
       CASE
         WHEN key__arg IN ('create','view','like') THEN 1
         WHEN key__arg IN ('unview','unlike') THEN -1
         ELSE 0
       END;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user (user_id_arg TEXT, req_epoch_arg TEXT, user_name_arg TEXT, pwd_arg TEXT) RETURNS SETOF users_core
AS
$$

DELETE
FROM users_core_buffer;

DELETE
FROM users_events_buffer;

INSERT INTO users_core_buffer
SELECT *
FROM generate_user (user_id_arg,req_epoch_arg ,user_name_arg ,pwd_arg);

INSERT INTO users_events_buffer
SELECT *
FROM generate_user_event (user_id_arg ,req_epoch_arg ,'create');

MERGE INTO users_core_buffer cb
USING users_core c ON cb.user_name = c.user_name
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_events_buffer eb
USING users_events e ON eb.user_id = e.user_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_core
SELECT *
FROM users_core_buffer;

INSERT INTO users_events
SELECT eb.id,
       eb.user_id,
       eb._time,
       eb.key_,
       eb.value
FROM users_events_buffer eb
  JOIN users_core_buffer cb ON eb.user_id = cb.id;

SELECT *
FROM users_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_event (user_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF users_events
AS
$$

DELETE
FROM users_events_buffer;

INSERT INTO users_events_buffer
SELECT g.id,
       g.user_id,
       g._time,
       g.key_,
       g.value
FROM generate_user_event (user_id_arg,req_epoch_arg,key__arg) g
  JOIN users_core c ON g.user_id = c.id;

MERGE INTO users_events_buffer eb
USING users_events e ON eb.user_id = e.user_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_events
SELECT *
FROM users_events_buffer;

SELECT *
FROM users_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_artist (artist_id_arg TEXT, user_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF artists_core
AS
$$

DELETE
FROM artists_core_buffer;

DELETE
FROM artists_events_buffer;

INSERT INTO artists_core_buffer
SELECT g.id,
       g.user_id,
       g.creation_time
FROM generate_artist (artist_id_arg,user_id_arg,req_epoch_arg) g
  JOIN users_core c ON g.user_id = c.id;

INSERT INTO artists_events_buffer
SELECT *
FROM generate_artist_event (artist_id_arg,req_epoch_arg,'create');

MERGE INTO artists_core_buffer cb
USING artists_core c ON cb.user_id = c.user_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO artists_events_buffer eb
USING artists_events e ON eb.artist_id = e.artist_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO artists_core
SELECT *
FROM artists_core_buffer;

INSERT INTO artists_events
SELECT eb.id,
       eb.artist_id,
       eb._time,
       eb.key_,
       eb.value
FROM artists_events_buffer eb
  JOIN artists_core_buffer cb ON eb.artist_id = cb.id;

SELECT *
FROM artists_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_artist_event (artist_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT)  RETURNS SETOF artists_events
AS
$$

DELETE
FROM artists_events_buffer;

INSERT INTO artists_events_buffer
SELECT g.id,
       g.artist_id,
       g._time,
       g.key_,
       g.value
FROM generate_artist_event (artist_id_arg,req_epoch_arg,key__arg) g
  JOIN artists_core c ON g.artist_id = c.id;

MERGE INTO artists_events_buffer eb
USING artists_events e ON eb.artist_id = e.artist_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO artists_events
SELECT *
FROM artists_events_buffer;

SELECT *
FROM artists_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_work (work_id_arg TEXT, artist_id_arg TEXT, req_epoch_arg TEXT, work_name_arg TEXT) RETURNS SETOF works_core
AS
$$

DELETE
FROM works_core_buffer;

DELETE
FROM works_events_buffer;

INSERT INTO works_core_buffer
SELECT g.id,
       g.artist_id,
       g.creation_time,
       g.work_name
FROM generate_work (work_id_arg,artist_id_arg,req_epoch_arg,work_name_arg) g
  JOIN artists_core c ON c.id = g.artist_id;

INSERT INTO works_events_buffer
SELECT *
FROM generate_work_event (work_id_arg ,req_epoch_arg,'submit');

MERGE INTO works_core_buffer cb
USING works_core c ON cb.artist_id = c.artist_id AND cb.work_name = c.work_name
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO works_events_buffer eb
USING works_events e ON eb.work_id = e.work_id AND eb.key_ = e.key_ AND e.key_ = 'submit'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO works_core
SELECT *
FROM works_core_buffer;

INSERT INTO works_events
SELECT eb.id,
       eb.work_id,
       eb._time,
       eb.key_,
       eb.value
FROM works_events_buffer eb
  JOIN works_core_buffer cb ON eb.work_id = cb.id;

SELECT *
FROM works_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_work_event (work_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF works_events
AS
$$

DELETE
FROM works_events_buffer;

INSERT INTO works_events_buffer
SELECT g.id,
       g.work_id,
       g._time,
       g.key_,
       g.value
FROM generate_work_event (work_id_arg,req_epoch_arg,key__arg) g
  JOIN works_core c ON g.work_id = c.id;

MERGE INTO works_events_buffer eb
USING works_events e ON eb.work_id = e.work_id AND eb.key_ = e.key_ AND e.key_ = 'submit' AND eb.value = 1
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO works_events
SELECT *
FROM works_events_buffer;

SELECT *
FROM works_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_artist (user_artist_id_arg TEXT, user_id_arg TEXT, artist_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_artists_core
AS
$$

DELETE
FROM users_artists_core_buffer;

DELETE
FROM users_artists_events_buffer;

INSERT INTO users_artists_core_buffer
SELECT g.id,
       g.user_id,
       g.artist_id,
       g.creation_time
FROM generate_user_artist (user_artist_id_arg,user_id_arg,artist_id_arg,req_epoch_arg) g
  JOIN users_core uc ON uc.id = g.user_id
  JOIN artists_core ac ON ac.id = g.artist_id;

INSERT INTO users_artists_events_buffer
SELECT *
FROM generate_user_artist_event (user_artist_id_arg,req_epoch_arg,'create');

MERGE INTO users_artists_core_buffer cb
USING users_artists_core c ON cb.user_id = c.user_id AND cb.artist_id = c.artist_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_artists_events_buffer eb
USING users_artists_events e ON eb.user_artist_id = e.user_artist_id AND eb.key_ = e.key_ AND eb.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_artists_core
SELECT *
FROM users_artists_core_buffer;

INSERT INTO users_artists_events
SELECT eb.id,
       eb.user_artist_id,
       eb._time,
       eb.key_,
       eb.value
FROM users_artists_events_buffer eb
  JOIN users_artists_core_buffer cb ON eb.user_artist_id = cb.id;

SELECT *
FROM users_artists_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_artist_event (user_artist_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF users_artists_events
AS
$$

DELETE
FROM users_artists_events_buffer;

INSERT INTO users_artists_events_buffer
SELECT g.id,
       g.user_artist_id,
       g._time,
       g.key_,
       g.value
FROM generate_user_artist_event (user_artist_id_arg,req_epoch_arg,key__arg) g
  JOIN users_artists_core c ON g.user_artist_id = c.id;

MERGE INTO users_artists_events_buffer eb
USING users_artists_events e ON eb.user_artist_id = e.user_artist_id AND eb.key_ = e.key_ AND eb.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_artists_events
SELECT *
FROM users_artists_events_buffer;

SELECT *
FROM users_artists_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_work (user_work_id_arg TEXT, user_id_arg TEXT, work_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_works_core
AS
$$

DELETE
FROM users_works_core_buffer;

DELETE
FROM users_works_events_buffer;

INSERT INTO users_works_core_buffer
SELECT g.id,
       g.user_id,
       g.work_id,
       g.creation_time
FROM generate_user_work (user_work_id_arg,user_id_arg,work_id_arg,req_epoch_arg) g
  JOIN users_core uc ON uc.id = g.user_id
  JOIN works_core wc ON wc.id = g.work_id;

INSERT INTO users_works_events_buffer
SELECT *
FROM generate_user_work_event (user_work_id_arg,req_epoch_arg,'create');

MERGE INTO users_works_core_buffer cb
USING users_works_core c ON cb.user_id = c.user_id AND cb.work_id = c.work_id
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

MERGE INTO users_works_events_buffer eb
USING users_works_events e ON eb.user_work_id = e.user_work_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_works_core
SELECT *
FROM users_works_core_buffer;

INSERT INTO users_works_events
SELECT eb.id,
       eb.user_work_id,
       eb._time,
       eb.key_,
       eb.value
FROM users_works_events_buffer eb
  JOIN users_works_core_buffer cb ON eb.user_work_id = cb.id;

SELECT *
FROM users_works_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_work_event (user_work_id_arg TEXT, req_epoch_arg TEXT, key__arg TEXT) RETURNS SETOF users_works_events
AS
$$

DELETE
FROM users_works_events_buffer;

INSERT INTO users_works_events_buffer
SELECT g.id,
       g.user_work_id,
       g._time,
       g.key_,
       g.value
FROM generate_user_work_event (user_work_id_arg,req_epoch_arg,key__arg) g
  JOIN users_works_core c ON g.user_work_id = c.id;

MERGE INTO users_works_events_buffer eb
USING users_works_events e ON eb.user_work_id = e.user_work_id AND eb.key_ = e.key_ AND eb.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_works_events
SELECT *
FROM users_works_events_buffer;

SELECT *
FROM users_works_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION check_signin (user_name_arg TEXT, pwd_arg TEXT) RETURNS SETOF checkable_signins_
AS
$$

SELECT user_id,
       artist_id,
       user_name
FROM checkable_signins
WHERE user_name = user_name_arg
AND   pwd = pwd_arg;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION check_signup (user_id_arg TEXT, req_epoch_arg TEXT, user_name_arg TEXT, pwd_arg TEXT, confirmed_pwd_arg TEXT) RETURNS SETOF checkable_signups_
AS
$$

SELECT * FROM insert_user(user_id_arg, req_epoch_arg, user_name_arg, pwd_arg);

SELECT user_id,
       user_name
FROM checkable_signups
WHERE user_id = user_id_arg;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_watchers (artist_id_arg TEXT) RETURNS SETOF seeable_watchers_
AS
$$

SELECT user_,
       ban
FROM seeable_watchers
WHERE artist_id = artist_id_arg
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_works (artist_id_arg TEXT) RETURNS SETOF seeable_works_ 
AS
$$

SELECT work_,
       withdraw
FROM seeable_works
WHERE artist_id = artist_id_arg
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_watched_artists (user_id_arg TEXT) RETURNS SETOF seeable_artists_
AS
$$

SELECT artist,
       unwatch
FROM seeable_artists
WHERE user_id = user_id_arg
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_liked_works (user_id_arg TEXT) RETURNS SETOF likable_works_
AS
$$

SELECT work_,
       unlike
FROM likable_works
WHERE user_id = user_id_arg
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION submit_first_work (work_id_arg TEXT,  artist_id_arg TEXT, user_id_arg TEXT, req_epoch_arg TEXT, work_name_arg TEXT) RETURNS SETOF works_core
AS
$$

SELECT *
FROM insert_artist (artist_id_arg ,user_id_arg ,req_epoch_arg );

SELECT *
FROM insert_work (work_id_arg,artist_id_arg,req_epoch_arg,work_name_arg );

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION submit_work (work_id_arg TEXT, artist_id_arg TEXT, req_epoch_arg TEXT, work_name_arg TEXT) RETURNS SETOF works_core
AS
$$

SELECT *
FROM insert_work (work_id_arg,artist_id_arg,req_epoch_arg,work_name_arg );

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION withdraw_work (work_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF works_events
AS
$$

SELECT *
FROM insert_work_event (work_id_arg,req_epoch_arg,'withdraw')

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION see_more_artists (user_id_arg TEXT) RETURNS SETOF more_artists_
AS
$$


SELECT include_ref('artist_id',artist_id,'user_name',user_name) AS artist
FROM (SELECT t0.artist_id,
             user_id,
             user_name,
             CASE
               WHEN t1.artist_id IS NULL THEN 1
               ELSE 0
             END AS more_
      FROM denormalized_artists t0
        LEFT JOIN (SELECT DISTINCT artist_id
                   FROM users_artists_keys_without_banned
                   WHERE user_id = user_id_arg) t1 USING (artist_id))
WHERE more_ = 1
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_works (user_id_arg TEXT) RETURNS SETOF more_works_
AS
$$

SELECT include_ref('work_id',work_id,'work_name',work_name) AS work_,
       include_ref('artist_id',artist_id,'user_name',user_name) AS artist
FROM (SELECT t0.work_id,
             artist_id,
             user_id,
             user_name,
             work_name,
             CASE
               WHEN t1.work_id IS NULL THEN 1
               ELSE 0
             END AS more_
      FROM denormalized_works t0
        LEFT JOIN (SELECT DISTINCT work_id
                   FROM users_works_keys_without_withdrawn
                   WHERE user_id = user_id_arg) t1 USING (work_id))
WHERE more_ = 1
ORDER BY RANDOM() LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION view_work (work_id_arg TEXT, artist_id_arg TEXT)  RETURNS SETOF seeable_works_
AS
$$

SELECT work_,
       withdraw
FROM seeable_works
WHERE TRIM('"' FROM CAST(work_['work_id'] AS VARCHAR(256))) = work_id_arg
AND   artist_id = artist_id_arg;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION ban_watcher (user_artist_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_artists_events
AS
$$

SELECT *
FROM insert_user_artist_event (user_artist_id_arg,req_epoch_arg,'ban')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION watch_artist (user_artist_id_arg TEXT, user_id_arg TEXT, artist_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_artists_core
AS
$$

DELETE
FROM users_artists_core_buffer;

SELECT *
FROM insert_user_artist (user_artist_id_arg,user_id_arg,artist_id_arg,req_epoch_arg);

SELECT *
FROM insert_user_artist_event (user_artist_id_arg,req_epoch_arg,'watch');

SELECT *
FROM users_artists_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION rewatch_artist (user_artist_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF  users_artists_events
AS
$$

SELECT *
FROM insert_user_artist_event (user_artist_id_arg,req_epoch_arg,'watch')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION unwatch_artist (user_artist_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_artists_events
AS
$$

SELECT *
FROM insert_user_artist_event (user_artist_id_arg,req_epoch_arg,'unwatch')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION go_view_work (user_work_id_arg TEXT, user_id_arg TEXT, work_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_works_core
AS
$$

DELETE
FROM users_works_core_buffer;

SELECT *
FROM insert_user_work (user_work_id_arg,user_id_arg,work_id_arg,req_epoch_arg);

SELECT *
FROM insert_user_work_event (user_work_id_arg,req_epoch_arg,'view');

SELECT *
FROM users_works_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION go_review_work (user_work_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_works_events
AS
$$

SELECT *
FROM insert_user_work_event (user_work_id_arg,req_epoch_arg,'view');

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION like_work (user_work_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_works_events
AS
$$

SELECT *
FROM insert_work_event (user_work_id_arg,req_epoch_arg,'like')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION unlike_work (user_work_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_works_events
AS
$$

SELECT *
FROM insert_work_event (user_work_id_arg,req_epoch_arg,'unlike')

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION delete_ (user_id_arg TEXT, req_epoch_arg TEXT) RETURNS SETOF users_events
AS
$$

SELECT *
FROM insert_user_event (user_id_arg,req_epoch_arg,'delete')

$$ LANGUAGE SQL;

CREATE FUNCTION generate_requests_logs_event (time__arg TEXT,route_arg TEXT, methods_arg TEXT) RETURNS SETOF requests_logs
AS
$$
SELECT MD5(CONCAT (time__arg,route_arg)) AS id,
       TO_TIMESTAMP(CAST(time__arg AS NUMERIC)) AS time_,
       route_arg,
       methods_arg
$$ LANGUAGE SQL;

CREATE FUNCTION generate_responses_logs_event (request_time_arg TEXT,time__arg TEXT,route_arg TEXT, status_code_arg TEXT) RETURNS SETOF responses_logs
AS
$$
SELECT MD5(CONCAT (CONCAT (time__arg,route_arg),status_code_arg)) AS id,
       TO_TIMESTAMP(CAST(time__arg AS NUMERIC)) AS time_,
       MD5(CONCAT (request_time_arg,route_arg)) AS request_id,
       status_code_arg
$$ LANGUAGE SQL;

CREATE FUNCTION generate_errors_logs_event (request_time_arg TEXT,time__arg TEXT,route_arg TEXT, message_arg TEXT) RETURNS SETOF errors_logs
AS
$$
SELECT MD5(CONCAT (CONCAT (time__arg,route_arg),message_arg)) AS id,
       TO_TIMESTAMP(CAST(time__arg AS NUMERIC)) AS time_,
       MD5(CONCAT (request_time_arg,route_arg)) AS request_id,
       message_arg
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_into_requests_logs (time__arg TEXT,route_arg TEXT, methods_arg TEXT) RETURNS SETOF requests_logs
AS
$$

INSERT INTO requests_logs
(
SELECT *
FROM generate_requests_logs_event (time__arg,route_arg,methods_arg)
);

SELECT *
FROM generate_requests_logs_event (time__arg, route_arg, methods_arg);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_into_responses_logs (request_time_arg TEXT,time__arg TEXT,route_arg TEXT, status_code_arg TEXT) RETURNS SETOF responses_logs
AS
$$

INSERT INTO responses_logs
(
SELECT *
FROM generate_responses_logs_event (request_time_arg,time__arg,route_arg,status_code_arg)
);

SELECT *
FROM generate_responses_logs_event (request_time_arg, time__arg, route_arg, status_code_arg);

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION insert_into_errors_logs (request_time_arg TEXT,time__arg TEXT,route_arg TEXT, message_arg TEXT) RETURNS SETOF errors_logs
AS
$$

INSERT INTO errors_logs
(
SELECT *
FROM generate_errors_logs_event (request_time_arg,time__arg,route_arg,message_arg)
);

SELECT *
FROM generate_errors_logs_event (request_time_arg, time__arg, route_arg, message_arg);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION select_full_logs () RETURNS SETOF full_logs
AS
$$

SELECT *
FROM full_logs ORDER BY time_ DESC LIMIT 100;

$$ LANGUAGE SQL;






