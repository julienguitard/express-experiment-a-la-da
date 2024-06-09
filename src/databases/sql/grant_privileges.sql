GRANT INSERT
  ON requests_logs
  TO express_000;

GRANT INSERT
  ON errors_logs
  TO express_000;

GRANT INSERT
  ON responses_logs
  TO express_000;

GRANT INSERT
  ON users_core
  TO express_000;

GRANT INSERT
  ON users_events
  TO express_000;

GRANT INSERT
  ON artists_core
  TO express_000;

GRANT INSERT
  ON artists_events
  TO express_000;

GRANT INSERT
  ON works_events
  TO express_000;

GRANT INSERT
  ON users_artists_core
  TO express_000;

GRANT INSERT
  ON users_artists_events
  TO express_000;

GRANT INSERT
  ON users_works_core
  TO express_000;

GRANT INSERT
  ON users_works_events
  TO express_000;

GRANT ALL
  ON users_works_events_buffer
  TO express_000;

GRANT ALL
  ON users_works_core_buffer
  TO express_000;

GRANT ALL
  ON users_artists_events_buffer
  TO express_000;

GRANT ALL
  ON users_artists_core_buffer
  TO express_000;

GRANT ALL
  ON works_events_buffer
  TO express_000;

GRANT ALL
  ON works_core_buffer
  TO express_000;

GRANT ALL
  ON artists_events_buffer
  TO express_000;

GRANT ALL
  ON artists_core_buffer
  TO express_000;

GRANT ALL
  ON users_events_buffer
  TO express_000;

GRANT ALL
  ON users_core_buffer
  TO express_000;

GRANT SELECT
  ON responses_logs
  TO express_000;

GRANT SELECT
  ON errors_logs
  TO express_000;

GRANT SELECT
  ON requests_logs
  TO express_000;

GRANT SELECT
  ON simulation_002
  TO express_000;

GRANT SELECT
  ON simulation_000
  TO express_000;

GRANT SELECT
  ON simulation_001
  TO express_000;

GRANT SELECT
  ON simulation_003
  TO express_000;

GRANT SELECT
  ON simulation_004
  TO express_000;

GRANT SELECT
  ON users_core
  TO express_000;

GRANT SELECT
  ON users_events
  TO express_000;

GRANT SELECT
  ON artists_core
  TO express_000;

GRANT SELECT
  ON simulation_005
  TO express_000;

GRANT SELECT
  ON simulation_006
  TO express_000;

GRANT SELECT
  ON artists_events
  TO express_000;

GRANT SELECT
  ON works_core
  TO express_000;

GRANT SELECT
  ON works_events
  TO express_000;

GRANT SELECT
  ON users_artists_core
  TO express_000;

GRANT SELECT
  ON users_works_events_buffer
  TO express_000;

GRANT SELECT
  ON users_artists_events
  TO express_000;

GRANT SELECT
  ON users_works_core
  TO express_000;

GRANT SELECT
  ON users_works_events
  TO express_000;

GRANT SELECT
  ON users_works_core_buffer
  TO express_000;

GRANT SELECT
  ON users_artists_events_buffer
  TO express_000;

GRANT SELECT
  ON users_artists_core_buffer
  TO express_000;

GRANT SELECT
  ON works_events_buffer
  TO express_000;

GRANT SELECT
  ON works_core_buffer
  TO express_000;

GRANT SELECT
  ON artists_events_buffer
  TO express_000;

GRANT SELECT
  ON artists_core_buffer
  TO express_000;

GRANT SELECT
  ON users_events_buffer
  TO express_000;

GRANT SELECT
  ON users_core_buffer
  TO express_000;

GRANT SELECT
  ON full_logs
  TO express_000;

GRANT SELECT
  ON users_works_without_withdrawn
  TO express_000;

GRANT SELECT
  ON non_banned_users_artists_ids
  TO express_000;

GRANT SELECT
  ON users_artists_without_banned
  TO express_000;

GRANT SELECT
  ON users_works_without_banned
  TO express_000;

GRANT SELECT
  ON checkable_signins
  TO express_000;

GRANT SELECT
  ON checkable_signins_
  TO express_000;

GRANT SELECT
  ON checkable_signups
  TO express_000;

GRANT SELECT
  ON seeable_watchers
  TO express_000;

GRANT SELECT
  ON more_seeable_watchers
  TO express_000;

GRANT SELECT
  ON my_seeable_works
  TO express_000;

GRANT SELECT
  ON more_seeable_artists
  TO express_000;

GRANT SELECT
  ON seeable_works
  TO express_000;

GRANT SELECT
  ON more_seeable_works
  TO express_000;

GRANT SELECT
  ON viewable_users
  TO express_000;

GRANT SELECT
  ON users
  TO express_000;

GRANT SELECT
  ON artists
  TO express_000;

GRANT SELECT
  ON works
  TO express_000;

GRANT SELECT
  ON users_artists
  TO express_000;

GRANT SELECT
  ON users_works
  TO express_000;

GRANT SELECT
  ON non_deleted_users_ids
  TO express_000;

GRANT SELECT
  ON users_without_deleted
  TO express_000;

GRANT SELECT
  ON artists_without_deleted
  TO express_000;

GRANT SELECT
  ON non_deleted_artists_ids
  TO express_000;

GRANT SELECT
  ON works_without_deleted
  TO express_000;

GRANT SELECT
  ON non_deleted_works_ids
  TO express_000;

GRANT SELECT
  ON users_artists_without_deleted
  TO express_000;

GRANT SELECT
  ON users_works_without_deleted
  TO express_000;