const crypto = require('crypto');

const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');

module.exports = hash;