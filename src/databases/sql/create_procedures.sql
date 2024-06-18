CREATE OR REPLACE FUNCTION generate_user (user_id TEXT, req_epoch TEXT, user_name TEXT, pwd TEXT) RETURNS users_core
AS
$$

SELECT user_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)), 
user_name, 
pwd; 

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_event (user_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS users_events
AS
$$

SELECT MD5(user_id||req_epoch||key_), 
user_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)), 
key_, 
1;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_artist (artist_id TEXT, user_id TEXT, req_epoch TEXT) RETURNS artists_core
AS
$$

SELECT artist_id, 
user_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)) 

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_artist_event (artist_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS artists_events
AS
$$

SELECT MD5(artist_id||req_epoch||key_), 
artist_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)), 
key_, 
1;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_work (work_id TEXT, artist_id TEXT, req_epoch TEXT, work_name TEXT) RETURNS works_core
AS
$$

SELECT work_id, 
artist_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)), 
work_name 

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_work_event (work_id TEXT, req_epoch TEXT, key_ TEXT)  RETURNS works_events
AS
$$

SELECT MD5(work_id||req_epoch||key_), 
work_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)),
CASE
WHEN key_ IN ('submit', 'view', 'like') THEN key_
WHEN key_ = 'withdraw' THEN 'submit'
WHEN key_ = 'unlike' THEN 'like'
ELSE CAST(NULL AS VARCHAR(256))
END, 
CASE
WHEN key_ IN ('submit', 'view', 'like') THEN 1
WHEN key_ = 'withdraw' THEN -1
WHEN key_ = 'unlike' THEN -1
ELSE 0
END;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_artist (user_artist_id TEXT, user_id TEXT, artist_id TEXT, req_epoch TEXT) RETURNS users_artists_core
AS
$$

SELECT user_artist_id, 
user_id, 
artist_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC));

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION generate_user_artist_event (user_artist_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS users_artists_events
AS
$$

SELECT MD5(user_artist_id||req_epoch||key_), 
user_artist_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)),
CASE
WHEN key_ IN ('create', 'watch', 'ban') THEN key_
WHEN key_ = 'unwatch' THEN 'watch'
ELSE CAST(NULL AS VARCHAR(256))
END, 
CASE
WHEN key_ IN ('create', 'watch', 'ban') THEN 1
WHEN key_ = 'unwatch' THEN -1
ELSE 0
END;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_work (user_work_id TEXT, user_id TEXT, artist_id TEXT, req_epoch TEXT) RETURNS users_works_core
AS
$$

SELECT user_work_id, 
user_id, 
artist_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC));

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION generate_user_work_event(user_work_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS users_works_events
AS
$$

SELECT MD5(user_work_id||req_epoch||key_), 
user_work_id, 
TO_TIMESTAMP(CAST(req_epoch AS NUMERIC)),
CASE
WHEN key_ IN ('create', 'view', 'like') THEN key_
WHEN key_ IN ('unview', 'unlike') THEN RIGHT(key_, LENGTH(key_ )-2)
ELSE CAST(NULL AS VARCHAR(256))
END, 
CASE
WHEN key_ IN ('create', 'view', 'like') THEN 1
WHEN key_ IN ('unview', 'unlike') THEN -1
ELSE 0
END; 

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user (user_id TEXT, req_epoch TEXT, user_name TEXT, pwd TEXT) RETURNS users_core
AS
$$

DELETE FROM users_core_buffer;

DELETE FROM users_events_buffer;

INSERT INTO users_core_buffer SELECT * FROM generate_user (user_id, req_epoch, user_name, pwd);

INSERT INTO users_events_buffer SELECT * FROM generate_user_event (user_id, req_epoch, 'create');

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

SELECT * FROM users_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_event (user_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS users_events
AS
$$

DELETE FROM users_events_buffer;

INSERT INTO users_events_buffer 
SELECT g.id, 
       g.user_id, 
       g._time, 
       g.key_, 
       g.value
FROM generate_user_event (user_id, req_epoch, key_) g
JOIN users_core c ON g.user_id = c.id;

MERGE INTO users_events_buffer  eb
USING users_events e
ON eb.user_id = e.user_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_events SELECT * FROM users_events_buffer;

SELECT * FROM users_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_artist (artist_id TEXT, user_id TEXT, req_epoch TEXT) RETURNS artists_core
AS
$$

DELETE FROM artists_core_buffer;

DELETE FROM artists_events_buffer;

INSERT INTO artists_core_buffer 
SELECT g.id, 
       g.user_id, 
       g.creation_time 
FROM generate_artist (artist_id, user_id, req_epoch) g
JOIN users_core c ON g.user_id = c.id;

INSERT INTO artists_events_buffer SELECT * FROM generate_artist_event (artist_id, req_epoch, 'create');

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

SELECT * FROM artists_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_artist_event (artist_id TEXT, req_epoch TEXT, key_ TEXT)  RETURNS artists_events
AS
$$

DELETE FROM artists_events_buffer;

INSERT INTO artists_events_buffer 
SELECT g.id, 
       g.artist_id, 
       g._time, 
       g.key_, 
       g.value
FROM generate_artist_event (artist_id, req_epoch, key_) g
JOIN artists_core c ON g.artist_id = c.id;

MERGE INTO artists_events_buffer  eb
USING artists_events e
ON eb.artist_id = e.artist_id AND eb.key_ = e.key_ AND e.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO artists_events SELECT * FROM artists_events_buffer;

SELECT * FROM artists_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_work (work_id TEXT, artist_id TEXT, req_epoch TEXT, work_name TEXT) RETURNS works_core
AS
$$

DELETE FROM works_core_buffer;

DELETE FROM works_events_buffer;

INSERT INTO works_core_buffer 
SELECT g.id, 
       g.artist_id, 
       g.creation_time, 
       g.work_name
FROM generate_work (work_id, artist_id, req_epoch, work_name) g
JOIN artists_core c ON c.id = g.artist_id;

INSERT INTO works_events_buffer SELECT * FROM generate_work_event ($1, $3, 'submit');

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

SELECT * FROM works_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_work_event (work_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS works_events
AS
$$

DELETE FROM works_events_buffer;

INSERT INTO works_events_buffer 
SELECT g.id, 
       g.work_id, 
       g._time, 
       g.key_, 
       g.value
FROM generate_work_event (work_id, req_epoch, key_) g
JOIN works_core c ON g.work_id = c.id;

MERGE INTO works_events_buffer  eb
USING works_events e
ON eb.work_id = e.work_id AND eb.key_ = e.key_ AND e.key_ = 'submit' AND eb.value=1
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO works_events SELECT * FROM works_events_buffer;

SELECT * FROM works_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_artist (user_artist_id TEXT, user_id TEXT, artist_id TEXT, req_epoch TEXT) RETURNS users_artists_core
AS
$$

DELETE FROM users_artists_core_buffer;

DELETE FROM users_artists_events_buffer;

INSERT INTO users_artists_core_buffer 
SELECT g.id, 
       g.user_id, 
       g.artist_id, 
       g.creation_time
FROM generate_user_artist (user_artist_id, user_id, artist_id, req_epoch) g
JOIN users_core uc ON uc.id = g.user_id
JOIN artists_core ac ON ac.id = g.artist_id;

INSERT INTO users_artists_events_buffer SELECT * FROM generate_user_artist_event (user_artist_id, req_epoch, 'create');

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

SELECT * FROM users_artists_core_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_artist_event (user_artist_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS users_artists_events
AS
$$

DELETE FROM users_artists_events_buffer;

INSERT INTO users_artists_events_buffer 
SELECT g.id, 
       g.user_artist_id, 
       g._time, 
       g.key_, 
       g.value
FROM generate_user_artist_event (user_artist_id, req_epoch, key_) g
JOIN users_artists_core c ON g.user_artist_id = c.id;

MERGE INTO users_artists_events_buffer  eb
USING users_artists_events e
ON eb.user_artist_id = e.user_artist_id AND eb.key_ = e.key_ AND eb.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_artists_events SELECT * FROM users_artists_events_buffer;

SELECT * FROM users_artists_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_user_work (user_work_id TEXT, user_id TEXT, work_id TEXT, req_epoch TEXT) RETURNS users_works_core
AS
$$

DELETE FROM users_works_core_buffer;

DELETE FROM users_works_events_buffer;

INSERT INTO users_works_core_buffer 
SELECT g.id, 
       g.user_id, 
       g.work_id, 
       g.creation_time
FROM generate_user_work (user_work_id, user_id, work_id, req_epoch) g
JOIN users_core uc ON uc.id = g.user_id
JOIN works_core wc ON wc.id = g.work_id;

INSERT INTO users_works_events_buffer SELECT * FROM generate_user_work_event (user_work_id, req_epoch, 'create');

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

CREATE OR REPLACE FUNCTION insert_user_work_event (user_work_id TEXT, req_epoch TEXT, key_ TEXT) RETURNS users_works_events
AS
$$

DELETE FROM users_works_events_buffer;

INSERT INTO users_works_events_buffer 
SELECT g.id, 
       g.user_work_id, 
       g._time, 
       g.key_, 
       g.value
FROM generate_user_work_event (user_work_id, req_epoch, key_) g
JOIN users_works_core c  ON g.user_work_id = c.id;

MERGE INTO users_works_events_buffer  eb
USING users_works_events e
ON eb.user_work_id = e.user_work_id AND eb.key_ = e.key_ AND eb.key_ = 'create'
WHEN MATCHED THEN DELETE
WHEN NOT MATCHED THEN DO NOTHING;

INSERT INTO users_works_events SELECT * FROM users_works_events_buffer;

SELECT * FROM users_works_events_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION check_signin (user_name TEXT, pwd TEXT) RETURNS checkable_signins_
AS
$$

SELECT user_id, 
       artist_id, 
       user_name  
FROM checkable_signins 
WHERE user_name=user_name and pwd=pwd;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION check_signup (user_id TEXT, req_epoch TEXT, user_name TEXT, pwd TEXT) RETURNS checkable_signups_
AS
$$

SELECT * FROM insert_user(user_id, req_epoch, user_name, pwd);

SELECT user_id, 
       user_name 
FROM checkable_signups 
WHERE user_id = user_id; 

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_watchers (artist_id TEXT) RETURNS seeable_watchers_
AS
$$

SELECT user_,
       ban
FROM seeable_watchers 
WHERE artist_id = artist_id
ORDER BY RANDOM()
LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_works (artist_id TEXT) RETURNS seeable_works_ 
AS
$$

SELECT work_,
       withdraw
FROM seeable_works 
WHERE artist_id = artist_id
ORDER BY RANDOM()
LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_watched_artists (user_id TEXT) RETURNS seeable_artists_
AS
$$

SELECT artist,
       unwatch
FROM seeable_artists
WHERE user_id = user_id
ORDER BY RANDOM()
LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_liked_works (user_id TEXT) RETURNS seeable_liked_works_
AS
$$

SELECT work_,
       unlike
FROM seeable_liked_works 
WHERE user_id = user_id
ORDER BY RANDOM()
LIMIT 10;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION submit_first_work (work_id TEXT,  artist_id TEXT, user_id TEXT, req_epoch TEXT, work_name TEXT) RETURNS works_core
AS
$$

SELECT * FROM insert_artist(artist_id, user_id, req_epoch);

SELECT * FROM insert_work(work_id, artist_id, req_epoch, work_name)

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION submit_work (work_id TEXT, artist_id TEXT, req_epoch TEXT, work_name TEXT) RETURNS works_core
AS
$$

SELECT * FROM insert_work(work_id, artist_id, req_epoch, work_name);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION withdraw_work (work_id TEXT, req_epoch TEXT) RETURNS works_events
AS
$$

SELECT * FROM insert_work_event(work_id, req_epoch, 'withdraw')

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION see_more_users (artist_id TEXT) RETURNS more_seeable_watchers_
AS
$$

SELECT user_
FROM more_seeable_watchers
WHERE artist_id = artist_id
ORDER BY RANDOM() 
LIMIT 10

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_works (artist_id TEXT) RETURNS artists_keys
AS
$$
SELECT artist_id
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION see_more_artists (user_id TEXT) RETURNS more_seeable_artists_
AS
$$

SELECT artist,
       unwatch
FROM more_seeable_watchers
WHERE user_id = user_id
ORDER BY RANDOM() 
LIMIT 10

$$ LANGUAGE SQL;



CREATE OR REPLACE FUNCTION see_more_liked_works (user_id TEXT) RETURNS artists
AS
$$
SELECT artist_id
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION view_user (user_id TEXT) RETURNS checkable_signups_
AS
$$

SELECT user_id, 
       user_name 
FROM checkable_signups 
WHERE user_id = user_id; 

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION view_artist (artist_id TEXT) RETURNS checkable_signins
AS
$$

SELECT user_id, 
       artist_id, 
       user_name  
FROM checkable_signins 
WHERE artist_id=artist_id;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION view_works_of_artist (TEXT) RETURNS works
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION view_work (TEXT) RETURNS works
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION ban_watcher (user_artist_id TEXT, req_epoch TEXT) RETURNS users_artists_events
AS
$$

SELECT * FROM insert_user_artist_event(user_artist_id, req_epoch, 'ban')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION watch_artist (user_artist_id TEXT, user_id TEXT, artist_id TEXT, req_epoch TEXT) RETURNS users_artists_core
AS
$$

DELETE users_artists_buffer;

INSERT INTO users_artists_buffer SELECT * FROM users_artists(user_artist_id, user_id, artist_id, req_epoch);

SELECT * FROM insert_user_artist_event(user_artist_id, req_epoch, 'watch');

SELECT * FROM users_artists_buffer;

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION rewatch_artist (user_artist_id TEXT, req_epoch TEXT) RETURNS  users_artists_events
AS
$$

SELECT * FROM insert_user_artist_event(user_artist_id, req_epoch, 'watch')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION unwatch_artist (user_artist_id TEXT, req_epoch TEXT) RETURNS users_artists_events
AS
$$

SELECT * FROM insert_user_artist_event(user_artist_id, req_epoch, 'unwatch')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION go_view_work (TEXT) RETURNS users_works
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION go_review_work (TEXT) RETURNS users_works
AS
$$
SELECT $1
ORDER BY RANDOM() LIMIT 10;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION like_work (user_work_id TEXT, req_epoch TEXT) RETURNS users_works_events
AS
$$

SELECT * FROM insert_work_event(user_work_id, req_epoch, 'like')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION unlike_work (user_work_id TEXT, req_epoch TEXT) RETURNS users_works_events
AS
$$

SELECT * FROM insert_work_event(user_work_id, req_epoch, 'unlike')

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION delete_ (user_id TEXT, req_epoch TEXT) RETURNS users_events
AS
$$

SELECT * FROM insert_user_event(user_id, req_epoch, 'delete')

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_into_requests_logs (time_ TEXT,route TEXT, methods TEXT) RETURNS requests_logs
AS
$$
INSERT INTO requests_logs
(
  SELECT*FROM generate_requests_logs_event(time_, route, methods)
);

SELECT *
FROM generate_requests_logs_event (time_, route, methods);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION insert_into_responses_logs (request_time TEXT,time_ TEXT,route TEXT, status_code TEXT) RETURNS responses_logs
AS
$$
INSERT INTO responses_logs
(
  SELECT*FROM generate_responses_logs_event(request_time, time_, route, status_code)
);

SELECT *
FROM generate_responses_logs_event (request_time, time_, route, status_code);

$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION insert_into_errors_logs (request_time TEXT,time_ TEXT,route TEXT, message TEXT) RETURNS errors_logs
AS
$$
INSERT INTO errors_logs
(
  SELECT*FROM generate_errors_logs_event(request_time, time_, route, message)
);

SELECT *
FROM generate_errors_logs_event (request_time, time_, route, message);

$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION select_full_logs () RETURNS full_logs
AS
$$


SELECT *
FROM full_logs ORDER BY time_ DESC LIMIT 100;

$$ LANGUAGE SQL;






