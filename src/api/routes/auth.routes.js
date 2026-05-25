const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { jwtSecret, nodeEnv } = require('../config');
const { verificarToken, verificarTokenAdm } = require('../middleware/auth');
const { verificarCredenciaisUsuario, verificarCredenciaisADM } = require('../services/credentials');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: nodeEnv === 'production',
  sameSite: 'Strict',
  maxAge: 3600000,
};

router.post('/api/login', (req, res) => {
  const { userOrEmail, senha } = req.body;

  verificarCredenciaisADM(userOrEmail, senha, (err, adm) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    if (adm) {
      const token = jwt.sign({ id: adm.id_adm, role: 'admin' }, jwtSecret, { expiresIn: '1h' });
      res.cookie('token', token, cookieOptions);
      return res.status(200).json({
        message: 'Login bem-sucedido como administrador!',
        token,
        role: 'admin',
      });
    }

    verificarCredenciaisUsuario(userOrEmail, senha, (userErr, usuario) => {
      if (userErr) return res.status(500).json({ message: 'Erro interno do servidor.' });
      if (usuario) {
        const token = jwt.sign({ id: usuario.id_usuario, role: 'user' }, jwtSecret, { expiresIn: '1h' });
        res.cookie('token', token, cookieOptions);
        return res.status(200).json({
          message: 'Login bem-sucedido como usuário!',
          token,
          role: 'user',
        });
      }

      return res.status(401).json({ message: 'Credenciais inválidas.' });
    });
  });
});

router.post('/api/logout', (_req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logout bem-sucedido.' });
});

router.get('/api/usuarios/me', verificarToken, (req, res) => {
  db.get('SELECT * FROM usuario WHERE id_usuario = ?', [req.userId], (err, usuario) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    res.json(usuario);
  });
});

router.get('/api/adms/me', verificarTokenAdm, (req, res) => {
  db.get('SELECT * FROM adm WHERE id_adm = ?', [req.userId], (err, adm) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    if (!adm) return res.status(404).json({ message: 'Administrador não encontrado.' });
    res.json(adm);
  });
});

module.exports = router;
