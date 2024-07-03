--Basic views

CREATE OR REPLACE VIEW users_keys AS (
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

CREATE OR REPLACE VIEW artists_keys AS (
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

CREATE OR REPLACE VIEW works_keys AS (
SELECT MD5(work_id||key_) AS id,
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

CREATE OR REPLACE VIEW users_artists_keys AS (
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

CREATE OR REPLACE VIEW users_works_keys AS (
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

CREATE OR REPLACE VIEW non_deleted_users AS (
SELECT user_id
FROM (SELECT t0.user_id,
             CAST(t1.user_id IS NULL AS INT) AS non_deleted
      FROM (SELECT DISTINCT user_id FROM users_keys) t0
        LEFT JOIN (SELECT DISTINCT user_id
                   FROM users_keys
                   WHERE key_ = 'delete'
                   AND   value = 1) t1 USING (user_id))
WHERE non_deleted = 1
);

CREATE OR REPLACE VIEW users_keys_without_deleted AS(
SELECT *
FROM users_keys
  JOIN non_deleted_users USING (user_id)
);

CREATE OR REPLACE VIEW artists_keys_without_deleted AS
(
SELECT *
FROM artists_keys
  JOIN non_deleted_users USING (user_id)
);

CREATE OR REPLACE VIEW non_deleted_artists AS
(
SELECT DISTINCT artist_id
FROM artists_keys_without_deleted
);

CREATE OR REPLACE VIEW works_keys_without_deleted AS
(SELECT *
FROM works_keys
  JOIN non_deleted_artists USING (artist_id)
);

CREATE OR REPLACE VIEW non_deleted_works AS
(
SELECT DISTINCT work_id
FROM works_keys_without_deleted
);

CREATE OR REPLACE VIEW users_artists_keys_without_deleted AS
(
SELECT *
FROM (SELECT *
      FROM users_artists_keys
        JOIN non_deleted_users USING (user_id))
  JOIN non_deleted_artists USING (artist_id)
);

CREATE OR REPLACE VIEW users_works_keys_without_deleted AS
(
SELECT *
FROM (SELECT *
      FROM users_works_keys
        JOIN non_deleted_users USING (user_id))
  JOIN non_deleted_works USING (work_id)
);

CREATE OR REPLACE VIEW non_withdrawn_works AS (
SELECT work_id
FROM (SELECT t0.work_id,
             CAST(t1.work_id IS NULL AS INT) AS non_withdrawn
      FROM (SELECT DISTINCT work_id FROM works_keys_without_deleted) t0
        LEFT JOIN (SELECT DISTINCT work_id
                   FROM works_keys_without_deleted
                   WHERE key_ = 'submit'
                   AND   value = 0) t1 USING (work_id))
WHERE non_withdrawn = 1
);

CREATE OR REPLACE VIEW works_keys_without_withdrawn AS
(
SELECT *
FROM works_keys_without_deleted
  JOIN non_withdrawn_works USING (work_id)
);


CREATE OR REPLACE VIEW users_works_keys_without_withdrawn AS
(
SELECT *
FROM users_works_keys_without_deleted
  JOIN non_withdrawn_works USING (work_id)
);

CREATE OR REPLACE VIEW non_banned_users_artists AS (
SELECT user_artist_id, 
       user_id,
       artist_id
FROM (SELECT t0.user_artist_id,
             t0.user_id,
             t0.artist_id,
             CAST(t1.user_artist_id IS NULL AS INT) AS non_banned
      FROM (SELECT DISTINCT user_artist_id, user_id, artist_id FROM users_artists_keys_without_deleted) t0
        LEFT JOIN (SELECT DISTINCT user_artist_id
                   FROM users_artists_keys_without_deleted
                   WHERE key_ = 'ban'
                   AND   value = 1) t1 USING (user_artist_id))
WHERE non_banned = 1
);

CREATE OR REPLACE VIEW users_artists_keys_without_banned AS
(
SELECT *
FROM users_artists_keys_without_deleted
  JOIN non_banned_users_artists USING (user_artist_id, artist_id, user_id)
);

CREATE OR REPLACE VIEW users_works_keys_without_banned AS
(
SELECT id,
       user_work_id,
       user_id,
       work_id,
       creation_time,
       key_,
       value
FROM (SELECT t0.id,
             t0.user_work_id,
             t0.user_id,
             t0.work_id,
             t0.creation_time,
             t0.key_,
             t0.value,
             CASE
               WHEN t1.user_id IS NOT NULL THEN 1
               ELSE 0
             END AS ban
      FROM (SELECT t0.id,
                   t0.user_work_id,
                   t0.user_id,
                   t0.work_id,
                   t0.creation_time,
                   t0.key_,
                   t0.value,
                   t1.artist_id
            FROM users_works_keys_without_withdrawn t0
              JOIN (SELECT DISTINCT work_id,
                           artist_id
                    FROM works_keys_without_withdrawn) t1 USING (work_id)) t0
        LEFT JOIN (SELECT DISTINCT user_id,
                          artist_id
                   FROM users_artists_keys
                   WHERE key_ = 'ban') t1
               ON t0.user_id = t1.user_id
              AND t0.artist_id = t1.artist_id)
WHERE ban = 0
);

-- Some denormalized utils

CREATE OR REPLACE VIEW denormalized_users_with_pwd AS
(
SELECT user_id,
       artist_id,
       user_name,
       pwd
FROM (SELECT DISTINCT user_id,
             user_name,
             pwd
      FROM users_keys_without_deleted) t0
  LEFT JOIN (SELECT DISTINCT artist_id,
                    user_id
             FROM artists_keys_without_deleted) t1 USING (user_id)

);

CREATE OR REPLACE VIEW denormalized_users AS
(
SELECT user_id,
       artist_id,
       user_name
FROM denormalized_users_with_pwd
);

CREATE OR REPLACE VIEW denormalized_artists AS
(
SELECT user_id,
       artist_id,
       user_name
FROM denormalized_users
WHERE artist_id IS NOT NULL
);

CREATE OR REPLACE VIEW denormalized_works 
AS
(
SELECT user_id,
       artist_id,
       work_id,
       user_name,
       work_name
FROM denormalized_artists
  JOIN (SELECT DISTINCT work_id,
               artist_id,
               work_name
        FROM works_keys_without_withdrawn) USING (artist_id)
);


-- Views for procedures

CREATE OR REPLACE VIEW checkable_signins AS 
(
SELECT user_id,
       artist_id,
       user_name,
       pwd
FROM denormalized_users_with_pwd
--WHERE user_name=$1 AND pwd=$2
);


CREATE OR REPLACE VIEW checkable_signins_ AS (
SELECT user_id,
       artist_id,
       user_name
FROM checkable_signins
--WHERE user_name=$1 AND pwd=$2
);

CREATE OR REPLACE VIEW checkable_signups AS (
SELECT DISTINCT user_id,
       user_name
FROM users_keys_without_deleted
--WHERE user_name=$1 
);


CREATE OR REPLACE VIEW checkable_signups_ AS (
SELECT * FROM checkable_signups
--WHERE user_name=$1 
);

CREATE OR REPLACE VIEW seeable_watchers AS (
SELECT JSONB_BUILD_OBJECT('user_name',user_name,'user_id',user_id) AS user_,
       JSONB_BUILD_OBJECT('artist_id',artist_id,'user_artist_id',user_artist_id) AS ban,
       artist_id
FROM (SELECT user_artist_id,
             user_id,
             artist_id,
             user_name
      FROM (SELECT  DISTINCT user_artist_id,
                   artist_id,
                   user_id
            FROM users_artists_keys_without_banned
            WHERE key_ = 'watch'
            AND   value = 1) t0
        JOIN (SELECT DISTINCT user_id,
                     user_name
              FROM users_keys_without_deleted) t1 USING (user_id))
--WHERE artist_id=$1 
);

CREATE OR REPLACE VIEW seeable_watchers_ AS (
SELECT user_,
       ban
FROM seeable_watchers 
--WHERE artist_id=$1 
);

CREATE OR REPLACE VIEW seeable_works AS (
SELECT JSONB_BUILD_OBJECT('work_name',work_name,'work_id',work_id) AS work_,
       JSONB_BUILD_OBJECT('artist_id',artist_id,'work_id',work_id) AS withdraw,
       artist_id
FROM (SELECT DISTINCT work_id,
             artist_id,
             work_name
      FROM works_keys_without_withdrawn)
--WHERE artist_id=$1 
);
CREATE OR REPLACE VIEW seeable_works_ AS (
SELECT work_,
       withdraw
FROM seeable_works
--WHERE artist_id=$1 
);

CREATE OR REPLACE VIEW seeable_artists AS (
SELECT JSONB_BUILD_OBJECT('user_name',user_name,'artist_id',artist_id) AS artist,
       JSONB_BUILD_OBJECT('user_id',user_id,'user_artist_id',user_artist_id) AS unwatch,
       user_id
FROM (SELECT user_artist_id,
             user_id,
             artist_id,
             user_name
      FROM (SELECT DISTINCT user_artist_id,
                   user_id,
                   artist_id           
            FROM users_artists_keys_without_banned
            WHERE key_ = 'watch'
            AND   value = 1) t0
        JOIN (SELECT artist_id,
                     user_name
              FROM denormalized_users) t1 USING (artist_id))
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW seeable_artists_ AS (
SELECT artist,
       unwatch
FROM seeable_artists
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW likable_works AS (
SELECT JSONB_BUILD_OBJECT('work_name',work_name,'work_id',work_id) AS work_,
       JSONB_BUILD_OBJECT('user_id',user_id,'user_work_id',user_work_id)AS unlike,
       user_id
FROM (SELECT user_work_id,
             user_id,
             work_id,
             work_name
      FROM (SELECT DISTINCT user_work_id,
                   work_id,
                   user_id
            FROM users_works_keys_without_banned
            WHERE key_ = 'like'
            AND   value = 1) t0
        JOIN (SELECT DISTINCT work_id, work_name FROM works_keys_without_withdrawn) t1 USING (work_id))
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW likable_works_ AS (
SELECT work_,
       unlike
FROM likable_works
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW more_artists AS (
SELECT JSONB_BUILD_OBJECT('artist_id',artist_id,'user_name',user_name) AS artist
FROM (SELECT artist_id,
             user_id,
             user_name
      FROM denormalized_artists)
);

CREATE OR REPLACE VIEW more_artists_ AS (
SELECT artist
FROM more_artists
);

CREATE OR REPLACE VIEW more_works AS (
SELECT JSONB_BUILD_OBJECT('work_id',work_id,'work_name',work_name) AS work_,
       JSONB_BUILD_OBJECT('artist_id',artist_id,'user_name',user_name) AS artist
FROM (SELECT work_id,
             artist_id,
             user_id,
             user_name,
             work_name
      FROM denormalized_works)
);

CREATE OR REPLACE VIEW more_works_ AS (
SELECT work_,
       artist
FROM more_works
);

CREATE OR REPLACE VIEW viewable_users AS
(
SELECT JSONB_BUILD_OBJECT('user_name',user_name,'user_id',user_id) AS user_,
       user_artist_id AS ban,
       artist_id
FROM (SELECT user_id,
             user_name,
             user_artist_id,
             artist_id
      FROM (SELECT DISTINCT user_id, user_name FROM users_keys_without_deleted)
        LEFT JOIN (SELECT DISTINCT user_artist_id,
                          user_id,
                          artist_id
                   FROM users_artists_keys_without_banned) USING (user_id))
--WHERE artist_id=$1
);

CREATE OR REPLACE VIEW viewable_users_ AS
(
SELECT user_
       ban
FROM viewable_users
--WHERE artist_id=$1
);

CREATE OR REPLACE VIEW viewable_artists AS (
SELECT JSONB_BUILD_OBJECT('artist_id',artist_id,'user_name',user_name) AS artist,
       JSONB_BUILD_OBJECT('first_id',first_id,'second_id',second_id,'key_',INITCAP(key_)) AS action_,
       user_id_
FROM (SELECT user_id,
             artist_id,
             user_name,
             first_id,
             second_id,
             CASE
               WHEN key_ = 'watch' AND value = 1 THEN 'unwatch'
               WHEN key_ = 'watch' AND value = 0 THEN 'watch'
               WHEN key_ IS NULL THEN 'watch'
               ELSE key_
             END AS key_,
             user_id_
      FROM (SELECT t0.user_id,
                   t0.artist_id,
                   t0.user_name,
                   t1.user_id AS first_id,
                   t1.user_artist_id AS second_id,
                   t2.key_,
                   t2.value,
                   t1.user_id AS user_id_
            FROM denormalized_artists t0
              LEFT JOIN (SELECT DISTINCT user_artist_id,
                                user_id,
                                artist_id
                         FROM users_artists_keys_without_banned) t1 ON t0.artist_id = t1.artist_id
              LEFT JOIN (SELECT *
                         FROM users_artists_keys_without_banned
                         WHERE NOT (key_ IN ('create'))) t2 ON t0.artist_id = t2.artist_id))
);


CREATE OR REPLACE VIEW viewable_artists_ AS
(
SELECT artist,
       action_
FROM viewable_artists
--WHERE artist_id = $1 user_id_ = $2
);


CREATE OR REPLACE VIEW viewable_works AS 
(
SELECT JSONB_BUILD_OBJECT('work_id',work_id,'work_name',work_name) AS work_,
       JSONB_BUILD_OBJECT('artist_id',artist_id,'user_name',user_name) AS artist,
       JSONB_BUILD_OBJECT('first_id',first_id,'second_id',second_id,'key_',INITCAP(key_)) AS action_,
       user_id_
FROM (SELECT user_id,
             artist_id,
             work_id,
             user_name,
             work_name,
             first_id,
             second_id,
             CASE
               WHEN key_ = 'submit' THEN 'withdraw'
               WHEN key_ = 'like' AND value = 1 THEN 'unlike'
               WHEN key_ = 'like' AND value = 0 THEN 'like'
               WHEN key_ IS NULL THEN 'like'
               ELSE key_
             END AS key_,
             user_id_
      FROM (SELECT t0.user_id,
                   t0.artist_id,
                   t0.work_id,
                   t0.user_name,
                   t0.work_name,
                   t0.artist_id AS first_id,
                   t0.work_id AS second_id,
                   t1.key_,
                   t1.value,
                   t0.user_id AS user_id_
            FROM denormalized_works t0
              JOIN works_keys_without_withdrawn t1 USING (work_id)
            UNION ALL
            SELECT t0.user_id,
                   t0.artist_id,
                   t0.work_id,
                   t0.user_name,
                   t0.work_name,
                   t1.user_id AS first_id,
                   t1.user_work_id AS second_id,
                   t2.key_,
                   t2.value,
                   t1.user_id AS user_id_
            FROM denormalized_works t0
              LEFT JOIN (SELECT DISTINCT user_work_id,
                                user_id,
                                work_id
                         FROM users_works_keys_without_withdrawn) t1 ON t0.work_id = t1.work_id
              LEFT JOIN (SELECT *
                         FROM users_works_keys_without_withdrawn
                         WHERE NOT (key_ IN ('create','view'))) t2 ON t0.work_id = t2.work_id))
);

CREATE OR REPLACE VIEW viewable_works_ AS 
(
SELECT work_,
       artist,
       action_
FROM viewable_works
--WHERE work_id = $1 user_id_ = $2
);