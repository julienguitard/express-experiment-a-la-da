const insert_into_requests_logs = 'INSERT INTO requests_logs (SELECT * FROM generate_requests_logs_event($1,$2,$3))';
const insert_into_errors_logs = 'INSERT INTO errors_logs (SELECT * FROM generate_errors_logs_event($1,$2,$3,$4))';
const insert_into_responses_logs = 'INSERT INTO responses_logs (SELECT * FROM generate_responses_logs_event($1,$2,$3,$4))';
const select_full_logs = 'SELECT * FROM full_logs LIMIT 50;SELECT * FROM full_logs LIMIT 50;';
const select_artists = 'SELECT * FROM users_artists WHERE user_id = $1 AND watched = 1 LIMIT 50';//TODO
const select_works = 'SELECT * FROM users_works WHERE user_id = $1 AND liked = 1 LIMIT 50';//TODO
const select_my_works = 'SELECT * FROM works WHERE artist_id = $1 LIMIT 50';//TODO
const select_more_artists = 'SELECT DISTINCT artist_id FROM users_artists WHERE user_id = $1 AND watched = 0 ORDER BY RANDOM() LIMIT 50'
const select_more_works = 'SELECT DISTINCT work_id FROM works_artists WHERE user_id = $1 AND liked = 0 ORDER BY RANDOM() LIMIT 50'


export {insert_into_requests_logs,insert_into_errors_logs,insert_into_responses_logs,select_full_logs };