CREATE TABLE IF NOT EXISTS requests_logs 
(
  id        VARCHAR(256) PRIMARY KEY,
  time_     TIMESTAMP,
  route     VARCHAR(256),
  methods   VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS responses_logs 
(
  id           VARCHAR(256) PRIMARY KEY,
  time_        TIMESTAMP,
  request_id   VARCHAR(256) REFERENCES requests_logs (id),
  status_code       VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS errors_logs 
(
  id           VARCHAR(256) PRIMARY KEY,
  time_        TIMESTAMP,
  request_id   VARCHAR(256) REFERENCES requests_logs (id),
  message      VARCHAR(256)
);

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
