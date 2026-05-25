const express = require('express');
const db = require('../config/database');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

router.get('/agendamentos', verificarToken, (req, res) => {
  const usuarioId = req.userId;

  db.all(
    'SELECT id_agendamento, data, hora FROM agendamento WHERE usuario_sk = ?',
    [usuarioId],
    (err, rows) => {
      if (err) {
        console.error('Erro ao obter agendamentos:', err.message);
        return res.status(500).json({ message: 'Erro ao carregar agendamentos.' });
      }
      res.status(200).json({ result: { agendamentos: rows || [] } });
    }
  );
});

router.put('/agendamentos/cancelar/:id', verificarToken, (req, res) => {
  const idAgendamento = req.params.id;
  const usuarioId = req.userId;

  db.get(
    'SELECT usuario_sk FROM agendamento WHERE id_agendamento = ? AND usuario_sk = ?',
    [idAgendamento, usuarioId],
    (err, row) => {
      if (err) {
        console.error('Erro ao buscar agendamento:', err.message);
        return res.status(500).json({ message: 'Erro ao verificar agendamento.' });
      }
      if (!row) {
        return res.status(404).json({ message: 'Agendamento não encontrado ou não pertence ao usuário.' });
      }

      db.run(
        'UPDATE agendamento SET usuario_sk = NULL WHERE id_agendamento = ?',
        [idAgendamento],
        function (updateErr) {
          if (updateErr) {
            console.error('Erro ao cancelar agendamento:', updateErr.message);
            return res.status(500).json({ message: 'Erro ao cancelar agendamento.' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado para cancelar.' });
          }
          res.status(200).json({ message: 'Agendamento cancelado com sucesso.' });
        }
      );
    }
  );
});

module.exports = router;
