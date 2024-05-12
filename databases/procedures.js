insert_into_requests_logs = 'INSERT INTO requests_logs (SELECT * FROM generate_requests_logs_event($1,$2,$3))';
insert_into_errors_logs = 'INSERT INTO errors_logs (SELECT * FROM generate_errors_logs_event($1,$2,$3,$4))';
insert_into_responses_logs = 'INSERT INTO responses_logs (SELECT * FROM generate_responses_logs_event($1,$2,$3,$4))';

module.exports = {insert_into_requests_logs,insert_into_errors_logs,insert_into_responses_logs};