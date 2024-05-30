import { DBProcedure, FlowingConcept} from "../types";

const procedures:Record<DBProcedure,Array<FlowingConcept>> = {generate_user_from_req:['userId','time','userName','pwd'],
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
check_signin_from_req : ['userName','pwd'],
see_my_watched_artists_from_req:['userId'],
see_more_artists_from_req:['userId'],
insert_into_requests_logs:['time','path','methods'],
insert_into_responses_logs:['time','path','methods','error'],
insert_into_errors_logs:['time','path','methods','error'],
select_full_logs:[]}

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

export {procedures,proceduresArgs };