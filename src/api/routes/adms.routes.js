const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { verificarTokenAdm } = require('../middleware/auth');

const router = express.Router();

router.post('/adm/novo', verificarTokenAdm, (req, res) => {
  const { nome, user, senha, conf_senha } = req.body;

  if (senha !== conf_senha) {
    return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  db.get('SELECT user FROM adm WHERE user = ?', [user], (err, row) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    if (row) return res.status(409).json({ message: 'Usuário já existe.' });

    bcrypt.hash(senha, 10, (hashErr, hashedPassword) => {
      if (hashErr) return res.status(500).json({ message: 'Erro ao criptografar a senha.' });

      db.run(
        'INSERT INTO adm (nome, user, senha) VALUES (?, ?, ?)',
        [nome, user, hashedPassword],
        function (insertErr) {
          if (insertErr) return res.status(500).json({ message: 'Erro ao cadastrar administrador.' });
          return res.status(201).json({
            message: 'Administrador cadastrado com sucesso!',
            id_adm: this.lastID,
          });
        }
      );
    });
  });
});

router.get('/adms', verificarTokenAdm, (req, res) => {
  db.all('SELECT id_adm, nome, user FROM adm', [], (err, rows) => {
    if (err) {
      console.error('Erro ao obter administradores:', err.message);
      return res.status(500).json({ message: 'Erro ao carregar administradores.' });
    }
    res.status(200).json({ result: { adms: rows || [] } });
  });
});

router.put('/adms/:id_adm', verificarTokenAdm, (req, res) => {
  const { id_adm } = req.params;
  const { nome, user } = req.body;

  db.run('UPDATE adm SET nome = ?, user = ? WHERE id_adm = ?', [nome, user, id_adm], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao atualizar adm.' });
    res.json({ message: 'Adm atualizado com sucesso!' });
  });
});

router.delete('/adms/:id_adm', (req, res) => {
  const { id_adm } = req.params;
  db.run('DELETE FROM adm WHERE id_adm = ?', [id_adm], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir adm.' });
    res.json({ message: 'Adms excluído com sucesso!' });
  });
});

module.exports = router;
