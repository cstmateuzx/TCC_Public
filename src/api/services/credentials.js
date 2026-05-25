const bcrypt = require('bcryptjs');
const db = require('../config/database');

const verificarCredenciaisUsuario = (email, senha, callback) => {
  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);

    bcrypt.compare(senha, row.senha, (compareErr, isMatch) => {
      if (compareErr) return callback(compareErr);
      callback(null, isMatch ? row : null);
    });
  });
};

const verificarCredenciaisADM = (user, senha, callback) => {
  db.get('SELECT * FROM adm WHERE user = ?', [user], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);

    bcrypt.compare(senha, row.senha, (compareErr, isPasswordMatch) => {
      if (compareErr) return callback(compareErr);
      callback(null, isPasswordMatch ? row : null);
    });
  });
};

module.exports = { verificarCredenciaisUsuario, verificarCredenciaisADM };
