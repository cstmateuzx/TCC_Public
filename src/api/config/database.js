const sqlite3 = require('sqlite3').verbose();
const { dbPath } = require('./index');

const db = new sqlite3.Database(dbPath);

module.exports = db;
