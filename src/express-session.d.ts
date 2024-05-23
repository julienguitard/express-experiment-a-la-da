import express from 'express';
import session, { Session, SessionData } from 'express-session';

declare module 'express-session' {

  interface Session {
    
  }

  interface SessionData {
    userId: string;
    artistId: string,
    startTime: string,
    views: number
  }
}  


export module 'express-session'; 
export type {Session, SessionData};