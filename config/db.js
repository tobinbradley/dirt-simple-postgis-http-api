const config = require('./index.js');
const initOptions = {
  // optional database connection args
};
const pgp = require('pg-promise')(initOptions);

const db = pgp(config.db.postgis);

module.exports = db;
