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

The main tables in the schema are:

- `users_core`: Stores core user information like ID, creation time, username, and password.
- `users_events`: Stores events related to users, such as user ID, time, event key, and value.
- `artists_core`: Stores core artist information like ID, user ID, and creation time.
- `artists_events`: Stores events related to artists, such as artist ID, time, event key, and value.
- `works_core`: Stores core work information like ID, artist ID, creation time, and work name.
- `works_events`: Stores events related to works, such as work ID, time, event key, and value.
- `users_artists_core`: Stores the relationship between users and artists, including user ID, artist ID, and creation time.
- `users_artists_events`: Stores events related to the user-artist relationship, such as user-artist ID, time, event key, and value.
- `users_works_core`: Stores the relationship between users and works, including user ID, work ID, and creation time.
- `users_works_events`: Stores events related to the user-work relationship, such as user-work ID, time, event key, and value.

### Views
The schema includes various views for encapsulating updates, merges, and deletes, as well as views to be used by the app's procedures. Some notable views are:

- `users`, `artists`, `works`, `users_artists`, `users_works`: Basic views combining core data and events for each entity.
- `non_deleted_users_ids`, `users_without_deleted`, `artists_without_deleted`, `works_without_deleted`, `users_artists_without_deleted`, `users_works_without_deleted`: Views filtering out deleted users, artists, works, and their relationships.
- `non_withdrawn_works_ids`, `works_without_withdrawn`, `users_works_without_withdrawn`: Views filtering out withdrawn works and related user-work relationships.
- `non_banned_users_artists_ids`, `users_artists_without_banned`, `users_works_without_banned`: Views filtering out banned user-artist relationships and related user-work relationships.
- `checkable_signins`, `checkable_signups`, `seeable_watchers`, `more_seeable_watchers`, `my_seeable_works`, `more_of_seeable_works`, `seeable_artists`, `more_seeable_artists`, `seeable_works`, `more_seeable_works`, `viewable_users`, `viewable_artists`, `viewable_works_of_artist`: Views for various read operations related to users, artists, and works.

### Procedures
The schema includes several procedures for generating and inserting data into the tables, as well as view procedures to be used by the app. Some notable procedures are:

- `generate_user`, `generate_user_event`, `generate_artist`, `generate_artist_event`, `generate_work`, `generate_work_event`, `generate_user_artist`, `generate_user_artist_event`, `generate_user_work`, `generate_user_work_event`: Pure procedures for generating rows of the respective table types.
- `insert_user`, `insert_user_event`, `insert_artist`, `insert_artist_event`, `insert_work`, `insert_work_event`, `insert_user_artist`, `insert_user_artist_event`, `insert_user_work`, `insert_user_work_event`: Insert procedures for the respective tables, using the pure procedures and views for handling updates, merges, and deletes.
- `check_login`, `see_watchers`, `see_more_users`, `see_works`, `see_more_liked_works`, `see_watched_artists`, `see_more_artists`, `see_liked_works`, `see_more_works`: View procedures for various read operations related to users, artists, and works.
- `insert_into_requests_logs`, `insert_into_responses_logs`, `insert_into_errors_logs`, `select_full_logs`: Procedures for logging requests, responses, errors, and retrieving full logs.


# Implementation
[TO DO]

## Build
[TO DO]

## Run
[TO DO]


