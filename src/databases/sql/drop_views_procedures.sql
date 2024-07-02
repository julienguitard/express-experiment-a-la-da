DROP VIEW IF EXISTS artists_keys_without_deleted CASCADE;

DROP VIEW IF EXISTS works_keys CASCADE;

DROP VIEW IF EXISTS users_artists_keys CASCADE;

DROP VIEW IF EXISTS non_deleted_artists CASCADE;

DROP VIEW IF EXISTS works_keys_without_deleted CASCADE;

DROP VIEW IF EXISTS non_deleted_works CASCADE;

DROP VIEW IF EXISTS non_deleted_users CASCADE;

DROP VIEW IF EXISTS users_artists_keys_without_deleted CASCADE;

DROP VIEW IF EXISTS users_works_keys_without_deleted CASCADE;

DROP VIEW IF EXISTS non_withdrawn_works CASCADE;

DROP VIEW IF EXISTS users_works_keys_without_withdrawn CASCADE;

DROP VIEW IF EXISTS non_banned_users_artists CASCADE;

DROP VIEW IF EXISTS users_artists_keys_without_banned CASCADE;

DROP VIEW IF EXISTS denormalized_users_with_pwd CASCADE;

DROP VIEW IF EXISTS denormalized_users CASCADE;

DROP VIEW IF EXISTS denormalized_artists CASCADE;

DROP VIEW IF EXISTS checkable_signins CASCADE;

DROP VIEW IF EXISTS checkable_signins_ CASCADE;

DROP VIEW IF EXISTS checkable_signups CASCADE;

DROP VIEW IF EXISTS checkable_signups_ CASCADE;

DROP VIEW IF EXISTS seeable_watchers_ CASCADE;

DROP VIEW IF EXISTS seeable_works CASCADE;

DROP VIEW IF EXISTS seeable_works_ CASCADE;

DROP VIEW IF EXISTS seeable_artists_ CASCADE;

DROP VIEW IF EXISTS likable_works CASCADE;

DROP VIEW IF EXISTS likable_works_ CASCADE;

DROP VIEW IF EXISTS more_artists_ CASCADE;

DROP VIEW IF EXISTS more_works CASCADE;

DROP VIEW IF EXISTS more_works_ CASCADE;

DROP VIEW IF EXISTS viewable_users_ CASCADE;

DROP VIEW IF EXISTS viewable_artists CASCADE;

DROP VIEW IF EXISTS users_keys CASCADE;

DROP VIEW IF EXISTS viewable_artists_ CASCADE;

DROP VIEW IF EXISTS viewable_works_of_artist CASCADE;

DROP VIEW IF EXISTS viewable_works_of_artist_ CASCADE;

DROP VIEW IF EXISTS viewable_works CASCADE;

DROP VIEW IF EXISTS viewable_works_ CASCADE;

DROP VIEW IF EXISTS artists_keys CASCADE;

DROP VIEW IF EXISTS users_works_keys CASCADE;

DROP VIEW IF EXISTS users_keys_without_deleted CASCADE;

DROP VIEW IF EXISTS works_keys_without_withdrawn CASCADE;

DROP VIEW IF EXISTS users_works_keys_without_banned CASCADE;

DROP VIEW IF EXISTS denormalized_works CASCADE;

DROP VIEW IF EXISTS seeable_watchers CASCADE;

DROP VIEW IF EXISTS seeable_artists CASCADE;

DROP VIEW IF EXISTS more_artists CASCADE;

DROP VIEW IF EXISTS viewable_users CASCADE;

DROP FUNCTION IF EXISTS ban_watcher CASCADE;

DROP FUNCTION IF EXISTS check_signin CASCADE;

DROP FUNCTION IF EXISTS check_signup CASCADE;

DROP FUNCTION IF EXISTS delete_ CASCADE;

DROP FUNCTION IF EXISTS generate_artist CASCADE;

DROP FUNCTION IF EXISTS generate_artist_event CASCADE;

DROP FUNCTION IF EXISTS generate_errors_logs_event CASCADE;

DROP FUNCTION IF EXISTS generate_requests_logs_event CASCADE;

DROP FUNCTION IF EXISTS generate_responses_logs_event CASCADE;

DROP FUNCTION IF EXISTS generate_user CASCADE;

DROP FUNCTION IF EXISTS generate_user_artist CASCADE;

DROP FUNCTION IF EXISTS generate_user_artist_event CASCADE;

DROP FUNCTION IF EXISTS generate_user_event CASCADE;

DROP FUNCTION IF EXISTS generate_user_work CASCADE;

DROP FUNCTION IF EXISTS generate_user_work_event CASCADE;

DROP FUNCTION IF EXISTS generate_work CASCADE;

DROP FUNCTION IF EXISTS generate_work_event CASCADE;

DROP FUNCTION IF EXISTS go_review_work CASCADE;

DROP FUNCTION IF EXISTS go_view_work CASCADE;

DROP FUNCTION IF EXISTS insert_artist CASCADE;

DROP FUNCTION IF EXISTS insert_artist_event CASCADE;

DROP FUNCTION IF EXISTS insert_into_errors_logs CASCADE;

DROP FUNCTION IF EXISTS insert_into_requests_logs CASCADE;

DROP FUNCTION IF EXISTS insert_into_responses_logs CASCADE;

DROP FUNCTION IF EXISTS insert_requests_logs_event CASCADE;

DROP FUNCTION IF EXISTS insert_user CASCADE;

DROP FUNCTION IF EXISTS insert_user_artist CASCADE;

DROP FUNCTION IF EXISTS insert_user_artist_event CASCADE;

DROP FUNCTION IF EXISTS insert_user_event CASCADE;

DROP FUNCTION IF EXISTS insert_user_work CASCADE;

DROP FUNCTION IF EXISTS insert_user_work_event CASCADE;

DROP FUNCTION IF EXISTS insert_work CASCADE;

DROP FUNCTION IF EXISTS insert_work_event CASCADE;

DROP FUNCTION IF EXISTS like_work CASCADE;

DROP FUNCTION IF EXISTS rewatch_artist CASCADE;

DROP FUNCTION IF EXISTS see_liked_works CASCADE;

DROP FUNCTION IF EXISTS see_more_artists CASCADE;

DROP FUNCTION IF EXISTS see_more_works CASCADE;

DROP FUNCTION IF EXISTS see_watched_artists CASCADE;

DROP FUNCTION IF EXISTS see_watchers CASCADE;

DROP FUNCTION IF EXISTS see_works CASCADE;

DROP FUNCTION IF EXISTS select_full_logs CASCADE;

DROP FUNCTION IF EXISTS submit_first_work CASCADE;

DROP FUNCTION IF EXISTS submit_work CASCADE;

DROP FUNCTION IF EXISTS unlike_work CASCADE;

DROP FUNCTION IF EXISTS unwatch_artist CASCADE;

DROP FUNCTION IF EXISTS view_work CASCADE;

DROP FUNCTION IF EXISTS watch_artist CASCADE;

DROP FUNCTION IF EXISTS withdraw_work CASCADE;

