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

CREATE OR REPLACE VIEW artists_key AS (
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
FROM artist_keys
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

CREATE OR REPLACE VIEW works_without_withdrawn AS
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
             t1.artist_id
      FROM users_works_keys_without_withdrawn t0
        JOIN (SELECT DISTINCT work_id,
                     artist_id
              FROM works_without_withdrawn) t1 USING (work_id))
  JOIN (SELECT DISTINCT user_id,
               artist_id
        FROM users_artists_keys_without_banned) USING (user_id,artist_id)
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
             FROM artists_without_deleted) t1 USING (user_id)

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
SELECT include_ref('user_name',user_name,'user_id',user_id) AS user_,
       user_artist_id AS ban,
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
SELECT include_ref('work_name',work_name,'work_id',work_id) AS work_,
       work_id AS withdraw,
       artist_id
FROM (SELECT DISTINCT work_id,
             artist_id,
             work_name
      FROM works_without_withdrawn)
--WHERE artist_id=$1 
);
CREATE OR REPLACE VIEW seeable_works_ AS (
SELECT work_,
       withdraw
FROM seeable_works
--WHERE artist_id=$1 
);

CREATE OR REPLACE VIEW seeable_artists AS (
SELECT include_ref('user_name',user_name,'artist_id',artist_id) AS artist,
       user_artist_id AS unwatch,
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
              FROM denormalized_users t1 USING (artist_id)))
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW seeable_artists_ AS (
SELECT artist,
       unwatch
FROM seeable_artists
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW seeable_liked_works AS (
SELECT include_ref('work_name',work_name,'work_id',work_id) AS work_,
       user_work_id AS unlike,
       user_id
FROM (SELECT user_work_id,
             user_id,
             work_id,
             work_name
      FROM (SELECT DISTINCT user_work_id,
                   work_id,
                   user_id
            FROM users_works_without_banned
            WHERE key_ = 'like'
            AND   value = 1) t0
        JOIN (SELECT DISTINCT work_id, work_name FROM works_without_withdrawn) t1 USING (work_id))
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW seeable_liked_works_ AS (
SELECT work_,
       unlike
FROM seeable_liked_works
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW more_seeable_watchers AS (
SELECT include_ref('user_name',user_name,'user_id',user_id) AS user_,
       artist_id
FROM (SELECT CASE
               WHEN t2.user_artist_id IS NULL THEN 1
               ELSE 0
             END AS non_watcher,
             t0.user_id,
             t0.user_name,
             t1.artist_id
      FROM (SELECT DISTINCT user_id,
                   user_name
            FROM users_keys_without_deleted) t0
        CROSS JOIN (SELECT DISTINCT artist_id FROM artists_without_deleted) t1
        LEFT JOIN (SELECT DISTINCT user_artist_id,
                          artist_id,
                          user_id
                   FROM users_artists_keys_without_banned
                   WHERE key_ = 'watch'
                   AND   value = 1) t2 USING (user_id,artist_id))
WHERE non_watcher = 1
--WHERE artist_id=$1 
);

CREATE OR REPLACE VIEW more_seeable_watchers_ AS (
SELECT user_
FROM more_seeable_watchers
--WHERE artist_id=$1 
);

CREATE OR REPLACE VIEW more_of_seeable_works AS (
SELECT include_ref('work_name',work_name,'work_id',work_id) AS work_,
       work_id AS withdraw,
       artist_id
FROM (SELECT DISTINCT work_id,
             artist_id,
             work_name
      FROM works_without_withdrawn)
--WHERE artist_id=$1 
);

CREATE OR REPLACE VIEW more_of_seeable_works_ AS (
SELECT work_,
       withdraw
FROM more_of_seeable_works
ORDER BY RANDOM()
--WHERE artist_id=$1 
);


CREATE OR REPLACE VIEW more_seeable_artists AS (
SELECT include_ref('user_name',user_name,'artist_id',artist_id) AS artist,
       user_artist_id AS watch,
       user_id
FROM (SELECT CASE
               WHEN t2.user_artist_id IS NULL THEN 1
               ELSE 0
             END AS not_watched,
             t3.user_artist_id,
             artist_id,
             user_name,
             user_id
      FROM (SELECT DISTINCT user_id FROM users_keys_without_deleted) t0
        CROSS JOIN (SELECT artist_id,
                           user_name
                    FROM (SELECT DISTINCT artist_id,
                                 user_id
                          FROM artists_without_deleted)
                      JOIN (SELECT DISTINCT user_id, user_name FROM users_keys_without_deleted) USING (user_id)) t1
        LEFT JOIN (SELECT DISTINCT user_artist_id,
                          user_id,
                          artist_id
                   FROM users_artists_keys_without_banned) t2 USING (user_id,artist_id)
         LEFT JOIN (SELECT DISTINCT user_artist_id,
                          user_id,
                          artist_id
                   FROM users_artists_keys_without_banned
                   WHERE key_ = 'watch'
                   AND   value = 1) t3 USING (user_id,artist_id))
WHERE not_watched = 1
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW more_seeable_artists_ AS (
SELECT artist,
       watch
FROM more_seeable_artists
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW more_seeable_liked_works AS (
SELECT include_ref('work_name',work_name,'work_id',work_id) AS work_,
       user_work_id AS unlike,
       user_id
FROM (SELECT CASE
               WHEN user_work_id IS NULL THEN 1
               ELSE 0
             END AS not_liked,
             user_work_id,
             work_id,
             work_name,
             user_id
      FROM (SELECT DISTINCT user_id FROM users_keys_without_deleted) t0
        CROSS JOIN (SELECT DISTINCT work_id,
                           work_name
                    FROM works_without_withdrawn) t1
        LEFT JOIN (SELECT DISTINCT user_work_id,
                          user_id,
                          work_id
                   FROM users_works_without_banned
                   WHERE key_ = 'like'
                   AND   value = 1) t2 USING (user_id,work_id))
WHERE not_liked = 1
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW more_seeable_liked_works_ AS (
SELECT work_,
       unlike
FROM more_seeable_liked_works
--WHERE user_id=$1 
);

CREATE OR REPLACE VIEW viewable_users AS
(
SELECT include_ref('user_name',user_name,'user_id',user_id) AS user_,
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

CREATE OR REPLACE VIEW viewable_artists AS
(
SELECT include_ref('user_name',user_name,'artist_id',artist_id) AS artist,
       user_artist_id AS watch,
       user_id
FROM (SELECT artist_id,
             user_name
      FROM denormalized_artists) --TO DO
  LEFT JOIN (SELECT DISTINCT user_artist_id,
                    user_id,
                    artist_id
             FROM users_artists_keys_without_banned) USING (artist_id)
--WHERE user_id=$1
);

CREATE OR REPLACE VIEW viewable_artists_ AS
(
SELECT artist,
       watch
FROM viewable_artists
--WHERE user_id=$1
);

CREATE OR REPLACE VIEW viewable_works_of_artist AS
(
SELECT include_ref('work_name',work_name,'work_id',work_id) AS work_,
       user_work_id AS like_,
       user_id
FROM (SELECT work_id,
             work_name,
             artist_id
           FROM (SELECT DISTINCT work_id,
                        artist_id,
                        work_name
                 FROM works_without_withdrawn)
        JOIN denormalized_users USING (artist_id))
  LEFT JOIN (SELECT DISTINCT user_work_id,
                    user_id,
                    work_id
             FROM users_works_without_banned) USING (work_id)
--WHERE user_id=$1
);

CREATE OR REPLACE VIEW viewable_works_of_artist_ AS
(
SELECT work_,
       like_,
FROM viewable_works_of_artist
--WHERE user_id=$1
); 