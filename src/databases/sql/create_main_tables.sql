--Main tables and views by granularity users, artists, works, users_artists, users_works
CREATE TABLE IF NOT EXISTS users_core
(
id              VARCHAR(256) PRIMARY KEY,
creation_time   TIMESTAMP,
user_name       VARCHAR(256) NULL,
pwd             VARCHAR(256) NULL
);

CREATE TABLE IF NOT EXISTS users_events
(
id        VARCHAR(256) PRIMARY KEY,
user_id   VARCHAR(256) REFERENCES users_core (id),
_time     TIMESTAMP,
key_      VARCHAR(256),
value     INT
);

CREATE TABLE IF NOT EXISTS artists_core
(
id              VARCHAR(256) PRIMARY KEY,
user_id         VARCHAR(256) REFERENCES users_core (id),
creation_time   TIMESTAMP,
UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS artists_events
(
id          VARCHAR(256) PRIMARY KEY,
artist_id   VARCHAR(256) REFERENCES artists_core (id),
_time       TIMESTAMP,
key_        VARCHAR(256),
value       INT
);

CREATE TABLE IF NOT EXISTS works_core
(
id              VARCHAR(256) PRIMARY KEY,
artist_id       VARCHAR(256) REFERENCES artists_core (id),
creation_time   TIMESTAMP,
work_name       VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS works_events
(
id        VARCHAR(256),
work_id   VARCHAR(256) REFERENCES works_core (id),
_time     TIMESTAMP,
key_      VARCHAR(256),
value     INT
);

CREATE TABLE IF NOT EXISTS users_artists_core
(
id              VARCHAR(256) PRIMARY KEY,
user_id         VARCHAR(256) REFERENCES users_core (id),
artist_id       VARCHAR(256) REFERENCES artists_core (id),
creation_time   TIMESTAMP,
UNIQUE(user_id, artist_id)
);

CREATE TABLE IF NOT EXISTS users_artists_events
(
id               VARCHAR(256) PRIMARY KEY,
user_artist_id   VARCHAR(256) REFERENCES users_artists_core (id) NULL,
_time            TIMESTAMP,
key_             VARCHAR(256),
value            INT
);

CREATE TABLE IF NOT EXISTS users_works_core
(
id              VARCHAR(256) PRIMARY KEY,
user_id         VARCHAR(256) REFERENCES users_core (id),
work_id         VARCHAR(256) REFERENCES works_core (id),
creation_time   TIMESTAMP,
UNIQUE(user_id, work_id)
);

CREATE TABLE IF NOT EXISTS users_works_events
(
id             VARCHAR(256) PRIMARY KEY,
user_work_id   VARCHAR(256) REFERENCES users_works_core (id) NULL,
_time          TIMESTAMP,
key_           VARCHAR(256),
value          INT
);

--Buffers for insert procedure

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