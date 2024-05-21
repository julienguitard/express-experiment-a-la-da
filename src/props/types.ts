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
  inputs: Array<{ inputId: string; inputType: string }>;
  url: string;
};

type UserHomePage = {
  myWatchedArtists: Table;
  myLikeWorks: Table;
};

type Table = {
  fields: Array<string>;
  rows: Array<Array<any>>;
};

type ArtistHomePage = {
  myWatcher: Table;
  myBannedUser: Table;
  myWatchedArtists: Table;
  myLikeWorks: Table;
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
