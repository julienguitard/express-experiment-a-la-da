const queries = [
  "CREATE TABLE IF NOT EXISTS users (\
    id, STRING PRIMARY KEY,\
    username, STRING UNIQUE\
  )",
"INSERT INTO users (id,username) VALUES ('abc','jules') "]

module.exports = queries