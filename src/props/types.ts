import { type } from "os";

type IndexPage = {
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

type Header = {
  title: string;
};

type LandingPage = {
  landingPage: SigninForm | SignupForm;
};

type SigninForm = {
  signinForm: FormPage;
};
type SignupForm = {
  signupForm: FormPage;
};

type FormPage = {
  form: Form;
};

type Form = {
  inputs: Array<{ inputId: string; inputType: string ; inputLabel: string }>;
  url: string;
};

type UserHomePage = {
  myWatchedArtists: Table;
  myLikedWorks: Table;
};

type Table = {
  fields: Array<string>;
  rows: Array<Array<Cell>>;
};

type Cell = {
    value: number|string,
    url? : string
}
type ArtistHomePage = {
  myWatchers: Table;
  myWorks : Table;
  myBannedUser: Table;
  myWatchedArtists: Table;
  myLikedWorks: Table;
};

type TablePage = {
  table: Table;
  moreUrl: string;
};

type EntityPage = {
  entity: Entity;
};

type Entity = Record<string, any>;

type ErrorPage = {
  error: string;
};

type Footer = {
  startTime: Date;
  loggedAs: string;
};

export type {IndexPage, Header, LandingPage, SigninForm, SignupForm, FormPage, Form,UserHomePage, Table ,ArtistHomePage,TablePage,EntityPage ,Entity,ErrorPage,Footer} ;