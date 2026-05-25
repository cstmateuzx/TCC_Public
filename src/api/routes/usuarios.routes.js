const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { verificarTokenAdm } = require('../middleware/auth');

const router = express.Router();

router.post('/usuarios/novo', (req, res) => {
  const { nome, email, idade, senha } = req.body;

  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ message: 'Erro ao verificar email.' });
    if (row) return res.status(400).json({ message: 'Email já cadastrado.' });

    bcrypt.hash(senha, 10, (hashErr, hashedPassword) => {
      if (hashErr) return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });

      db.run(
        'INSERT INTO usuario (nome, email, idade, senha) VALUES (?, ?, ?, ?)',
        [nome, email, idade, hashedPassword],
        function (insertErr) {
          if (insertErr) return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
          return res.status(201).json({ id: this.lastID, message: 'Usuário cadastrado com sucesso!' });
        }
      );
    });
  });
});

router.get('/usuarios', verificarTokenAdm, (req, res) => {
  db.all('SELECT id_usuario, nome, email, idade FROM usuario', [], (err, rows) => {
    if (err) {
      console.error('Erro ao obter usuários:', err.message);
      return res.status(500).json({ message: 'Erro ao carregar usuários.' });
    }
    res.status(200).json({ result: { usuarios: rows || [] } });
  });
});

router.put('/usuarios/:id_usuario', verificarTokenAdm, (req, res) => {
  const { id_usuario } = req.params;
  const { nome, email, idade, senha } = req.body;
  const usuarioAtualizado = { nome, email, idade };

  const atualizar = (fields, values) => {
    db.run(
      `UPDATE usuario SET ${fields} WHERE id_usuario = ?`,
      [...values, id_usuario],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: 'Erro ao atualizar usuário.' });
        res.json({ message: 'Usuário atualizado com sucesso!' });
      }
    );
  };

  if (senha) {
    bcrypt.hash(senha, 10, (hashErr, hashedPassword) => {
      if (hashErr) return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });
      atualizar('nome = ?, email = ?, idade = ?, senha = ?', [
        usuarioAtualizado.nome,
        usuarioAtualizado.email,
        usuarioAtualizado.idade,
        hashedPassword,
      ]);
    });
  } else {
    atualizar('nome = ?, email = ?, idade = ?', [
      usuarioAtualizado.nome,
      usuarioAtualizado.email,
      usuarioAtualizado.idade,
    ]);
  }
});

router.delete('/usuarios/:id_usuario', verificarTokenAdm, (req, res) => {
  const { id_usuario } = req.params;
  db.run('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir usuário.' });
    res.json({ message: 'Usuário excluído com sucesso!' });
  });
});

module.exports = router;
