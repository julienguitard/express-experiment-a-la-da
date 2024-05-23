const insert_into_requests_logs:string = 'INSERT INTO requests_logs (SELECT * FROM generate_requests_logs_event($1,$2,$3))';
const insert_into_errors_logs:string = 'INSERT INTO errors_logs (SELECT * FROM generate_errors_logs_event($1,$2,$3,$4))';
const insert_into_responses_logs:string = 'INSERT INTO responses_logs (SELECT * FROM generate_responses_logs_event($1,$2,$3,$4))';
const select_full_logs:string = 'SELECT * FROM full_logs LIMIT 50;SELECT * FROM full_logs LIMIT 50;';


const procedures:Record<DBProcedure,Array<Concept>> = {generate_user_from_req:['userId','time','userName','pwd'],
generate_user_event_from_req:['userId','time','key'],
generate_artist_from_req:['artistId','time','userId'],
generate_artist_event_from_req:['artistId','time','key'],
generate_work_from_req:['workId','artistId','time','workName'],
generate_work_event_from_req:['workId','time','key'],
generate_user_artist_from_req:['userArtistId','userId','artistId','time'],
generate_user_artist_event_from_req:['userArtistId','time','key'],
generate_user_work_from_req:['userWorkId','userId','workId','time'],
generate_user_work_event_from_req:['userWorkId','time','key'],
insert_user_event_from_req:['userId','time','key'],
insert_artist_from_req:['artistId','time','userId'],
insert_artist_event_from_req:['artistId','time','key'],
insert_work_from_req:['workId','artistId','time','workName'],
insert_work_event_from_req:['workId','time','key'],
insert_user_artist_from_req:['userArtistId','userId','artistId','time'],
insert_user_artist_event_from_req:['userArtistId','time','key'],
insert_user_work_from_req:['userWorkId','userId','workId','time'],
insert_user_work_event_from_req:['userWorkId','time','key'],
check_login_from_req : ['userName','pwd'],
see_my_watched_artists_from_req:['userId'],
see_more_artists_from_req:['userId']}

const proceduresArgs:Record<Concept,Array<Source>> =  {
    userId:['session','params'],
    time:['unit'],
    userName:['params'],
    pwd:['params'],
    key:['route'],
    artistId:['session','params'],
    workId:['params'],
    workName:['params'],
    userArtistId:['params'],
    userWorkId:['params'],
}

export {insert_into_requests_logs,insert_into_errors_logs,insert_into_responses_logs,select_full_logs, procedures,proceduresArgs };