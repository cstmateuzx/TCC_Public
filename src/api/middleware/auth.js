const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { jwtSecret } = require('../config');

const verificarToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    req.userId = decoded.id;
    next();
  });
};

const verificarTokenAdm = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado. Token não encontrado.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    db.get('SELECT * FROM adm WHERE id_adm = ?', [decoded.id], (dbErr, adm) => {
      if (dbErr) return res.status(500).json({ message: 'Erro interno do servidor.' });
      if (!adm) {
        return res.status(403).json({ message: 'Não autorizado. Acesso restrito a administradores.' });
      }

      req.userId = decoded.id;
      next();
    });
  });
};

module.exports = { verificarToken, verificarTokenAdm };
