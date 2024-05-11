const sqlite3 = require('sqlite3');
const mkdirp = require('mkdirp');
const crypto = require('crypto');
const queries = require('./queries')

mkdirp.sync('./data/db');
const db = new sqlite3.Database('./var/db/artists.db');

db.serialize(()=>{queries.map(db.run)});

module.exports.db
