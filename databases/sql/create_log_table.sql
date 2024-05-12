CREATE TABLE IF NOT EXISTS requests_logs 
(
  id        VARCHAR(256) PRIMARY KEY,
  time_     TIMESTAMP,
  route     VARCHAR(256),
  methods   VARCHAR(16)
);

CREATE FUNCTION generate_requests_logs_event (TEXT,TEXT,TEXT) RETURNS requests_logs
AS
$$
SELECT MD5(CONCAT (time_,route)) AS id,
       TO_TIMESTAMP(CAST(time_ AS NUMERIC)) AS time_,
       route,
       methods
FROM (SELECT $1 AS time_, $2 AS route, $3 AS methods) $$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS errors_logs 
(
  id           VARCHAR(256) PRIMARY KEY,
  time_        TIMESTAMP,
  request_id   VARCHAR(256) REFERENCES requests_logs (id),
  message      VARCHAR(256)
);

CREATE FUNCTION generate_errors_logs_event (TEXT,TEXT,TEXT) RETURNS errors_logs
AS
$$
SELECT MD5(CONCAT (CONCAT (time_,route),message)) AS id,
       TO_TIMESTAMP(CAST(time_ AS NUMERIC)) AS time_,
       MD5(CONCAT (time_,route)) AS request_id,
       message
FROM (SELECT $1 AS time_, $2 AS route, $3 AS message) $$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS responses_logs 
(
  id           VARCHAR(256) PRIMARY KEY,
  time_        TIMESTAMP,
  request_id   VARCHAR(256) REFERENCES requests_logs (id),
  status_code       VARCHAR(256)
);

CREATE FUNCTION generate_responses_logs_event (TEXT,TEXT,TEXT) RETURNS responses_logs
AS
$$
SELECT MD5(CONCAT (CONCAT (time_,route),status_code)) AS id,
       TO_TIMESTAMP(CAST(time_ AS NUMERIC)) AS time_,
       MD5(CONCAT (time_,route)) AS request_id,
       status_code
FROM (SELECT $1 AS time_, $2 AS route, $3 AS status_code) $$ LANGUAGE SQL;

CREATE VIEW full_logs 
AS

(
  SELECT req.id,
  req.time_,
  req.route,
  req.methods,
  err.id AS error_id,
  err.time_ AS error_time,
  err.message,
  res.id AS reponse_id,
  res.time_ AS response_time,
  res.status_code FROM requests_logs req LEFT JOIN errors_logs  err ON req.id = err.request_id LEFT JOIN responses_logs res ON req.id = res.request_id
);
