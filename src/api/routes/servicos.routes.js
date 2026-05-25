const express = require('express');
const db = require('../config/database');
const { verificarTokenAdm } = require('../middleware/auth');

const router = express.Router();

router.post('/servicos/novo', verificarTokenAdm, (req, res) => {
  const { tamanho, complexidade, cores, preco } = req.body;

  if (!tamanho || !complexidade || !cores || !preco) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  db.run(
    'INSERT INTO servico (tamanho, complexidade, cores, preco) VALUES (?, ?, ?, ?)',
    [tamanho, complexidade, cores, preco],
    function (err) {
      if (err) return res.status(500).json({ message: 'Erro ao cadastrar serviço.' });
      return res.status(201).json({
        message: 'Serviço cadastrado com sucesso!',
        id_servico: this.lastID,
      });
    }
  );
});

router.get('/servicos', (req, res) => {
  db.all('SELECT id_servico, tamanho, complexidade, cores, preco FROM servico', [], (err, rows) => {
    if (err) {
      console.error('Erro ao obter serviços:', err.message);
      return res.status(500).json({ message: 'Erro ao carregar serviços.' });
    }
    res.status(200).json({ result: { servicos: rows || [] } });
  });
});

router.get('/preco-servico', (req, res) => {
  const { tamanho, complexidade, cores } = req.query;
  const tamanhoNumero = parseInt(tamanho, 10);

  let tamanhoCategoria = '';
  if (tamanhoNumero >= 0 && tamanhoNumero <= 5) {
    tamanhoCategoria = 'pequeno';
  } else if (tamanhoNumero > 5 && tamanhoNumero <= 15) {
    tamanhoCategoria = 'medio';
  } else if (tamanhoNumero > 15) {
    tamanhoCategoria = 'grande';
  } else {
    return res.status(400).json({ message: 'Tamanho inválido.' });
  }

  db.get(
    'SELECT preco FROM servico WHERE tamanho = ? AND complexidade = ? AND cores = ?',
    [tamanhoCategoria, complexidade, cores],
    (err, row) => {
      if (err) {
        console.error('Erro ao buscar preço:', err.message);
        return res.status(500).json({ message: 'Erro ao buscar preço do serviço.' });
      }
      if (row) {
        return res.status(200).json({ result: { preco: row.preco } });
      }
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }
  );
});

router.put('/servicos/:id_servico', verificarTokenAdm, (req, res) => {
  const { id_servico } = req.params;
  const { preco } = req.body;

  db.run('UPDATE servico SET preco = ? WHERE id_servico = ?', [preco, id_servico], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao atualizar serviço.' });
    res.json({ message: 'Serviço atualizado com sucesso!' });
  });
});

router.delete('/servicos/:id_servico', verificarTokenAdm, (req, res) => {
  const { id_servico } = req.params;
  db.run('DELETE FROM servico WHERE id_servico = ?', [id_servico], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir serviço.' });
    res.json({ message: 'Serviço excluído com sucesso!' });
  });
});

module.exports = router;
