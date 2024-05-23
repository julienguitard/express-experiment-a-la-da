
import { StringifyOptions } from 'querystring';
import { SessionData } from "./middlewares/handlers";


declare type EjsView = 
'Index'|
 'Header'|
 'Body'|
 'Footer'|
 'UserHome'|
 'ArtistHoe'|
 'SigninForm'|
 'SignupForm'|
 'Form'|
 'Table'|
 'Cell'|
 'TablePage'|
 'EntityPage'|
 'Error';
declare type IndexPage = {
    header: Header;
    body:
      | LandingPage
      | UserHomePage
      | ArtistHomePage
      | FormPage
      | TablePage
      | EntityPage
      | ErrorPage;
    footer: Footer;
};
  
declare type Header = {
    title: string;
};
  
declare type LandingPage = {
    landingPage: SigninForm | SignupForm;
};
  
declare type SigninForm = {
    signinForm: FormPage;
};
declare type SignupForm = {
    signupForm: FormPage;
};
  
declare type FormPage = {
    form: Form;
};
  
declare type Form = {
    inputs: Array<{ inputId: string; inputType: string ; inputLabel: string }>;
    url: string;
};
  
declare type UserHomePage = {
    myWatchedArtists: Table;
    myLikedWorks: Table;
};
  
declare type Table = {
    fields: Array<string>;
    rows: Array<Array<Cell>>;
};
  
declare type Cell = {
      value: number|string,
      url? : string
  }
declare type ArtistHomePage = {
    myWatchers: Table;
    myWorks : Table;
    myBannedUser: Table;
    myWatchedArtists: Table;
    myLikedWorks: Table;
};
  
declare type TablePage = {
    table: Table;
    moreUrl: string;
};
  
declare type EntityPage = {
    entity: Entity;
};
  
declare type Entity = Record<string, any>;
  
declare type ErrorPage = {
    error: string;
};
  
declare type Footer = {
    startTime: Date;
    loggedAs: string;
};

declare type Concept = 
'userName'|
'pwd'|
'userId'|
'artistId'|
'workId'|
'workName'|
'userArtistId'|
'userWorkId'|
'time'|
'key';

declare type Source = 
'unit'|
'route'|
'session'|
'params';

declare type  DBProcedure = 'generate_user_from_req'|
'generate_user_event_from_req'|
'generate_artist_from_req'|
'generate_artist_event_from_req'|
'generate_work_from_req'|
'generate_work_event_from_req'|
'generate_user_artist_from_req'|
'generate_user_artist_event_from_req'|
'generate_user_work_from_req'|
'generate_user_work_event_from_req'|
'insert_user_event_from_req'|
'insert_artist_from_req'|
'insert_artist_event_from_req'|
'insert_work_from_req'|
'insert_work_event_from_req'|
'insert_user_artist_from_req'|
'insert_user_artist_event_from_req'|
'insert_user_work_from_req'|
'insert_user_work_event_from_req'|
'check_login_from_req'|
'see_my_watched_artists_from_req'|
'see_more_artists_from_req';

export type {IndexPage, Header, LandingPage, SigninForm, SignupForm, FormPage, Form,UserHomePage, Table ,ArtistHomePage,TablePage,EntityPage ,Entity,ErrorPage,Footer} ;
