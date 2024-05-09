# express_sandbox
An express sandbox

## Persona
There are 3 personas:
- User
- Artist
- Admin

## List of database events

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

## List of views

### Stateless

There are 3 stateless views:
- Home
- Logout
- Login

### Session-stateful

There are 2 session-stateful views:
- Personal home
- Logout

### Stateful

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

## Views events
 
 [TO DO]

 ## Views components

### Body

 There are components:
 - Cell
 - Clickable cell
 - Row
 - Table header
 - Table
 - Paginated content
 - Singleton page

 ### Footer
 There are 2 components:
 - Session infos
 - Login status