const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { dbPath } = require('./index');

const dataDirectory = path.dirname(dbPath);
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
    throw err;
  }

  db.exec(schemaSql, (execErr) => {
    if (execErr) {
      console.error('Erro ao aplicar schema do banco de dados:', execErr.message);
      throw execErr;
    }
  });
});

module.exports = db;
