# Overview
An express sandbox

# Use case
[TO DO]

## Personas
There are 3 personas:
- User
- Artist
- Admin


## Events
[TO DO]

### Read
There are 15 events types and 9 events substypes:
- Read all users
- Read some users
- Read a given user
- Read self user
- Read all artists
- Read some artists
- Read a given artists
- Read self artists
- Read all artists
- Read some artists
- Read a given artist
- Read self artist
- Read all works
- Read some works
    - Read works of a some artists
    - Read works of a given artist
    - Read works of a self artist
    - Read works viewed by some users
    - Read works viewed by a given user
    - Read works viewed by self user
    - Read works liked by some users
    - Read works liked by a given user
    - Read works liked by self user
- Read a given work

### Write
There are 14 write events:
- Create a user
- Create self user
- Archive a user
- Archive self user
- Delete a user
- Delete self user
- Ban a user
- Watch an artist
- Unwatch an artist
- Submit a work
- Archive a work
- Delete a work
- Like a work
- Unlike a work

# Ontology
[TO DO]

# Architecture
[TO DO]

## UX
[TO DO]

### List of views
[TO DO]

#### Stateless
There are 3 stateless views:
- Home
- Logout
- Login

#### Session-stateful
There are 2 session-stateful views:
- Personal home
- Logout

#### Stateful
[TO DO]
There are 9 statefull views
- User search form
- Artist search form
- Work search form
- User list
- Artist list
- Work list
- User profile
- Artist profile
- Work profile

## App
[TO DO]

## Overview
[TO DO]

## Routes
[TO DO]

## Middleware
[TO DO]

## Database connectors
[TO DO]

## Other
[TO DO]

## Persistent layer
Our perstistent layer consist of a Postgre database connected with app with a minimal interface build with Node PG module executing a minimal query encapsulating procedures written a singleton types in the app and SQL function in PostgreSQL.

### Overview
The persistent objects are:
- Tables for the core logic;
- Views:
    - Views encapsulating what would be update/merge/delete in a crude database
    - Views that will be used by the procedures called by the app
- Procedures or function:
    - Pure procedures generating rows of the table types;
    - Insert procedures for these tables using this pure procedures and the first types of views above;
    - View procedures uses by the app, possibly calling inserting procedures above

### Tables
[TO DO]

### Views
[TO DO]

### Procedures
[TO DO]

# Implementation
[TO DO]

## Build
[TO DO]

## Run
[TO DO]


