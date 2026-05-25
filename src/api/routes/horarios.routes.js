const express = require('express');
const db = require('../config/database');
const { verificarToken, verificarTokenAdm } = require('../middleware/auth');
const { normalizeDatetime } = require('../utils/datetime');

const router = express.Router();

const SQL_DATA = "date(h.datetime)";
const SQL_HORA = "strftime('%H:%M', h.datetime)";

router.post('/horario/novo', verificarTokenAdm, (req, res) => {
  const datetime = normalizeDatetime(req.body.datetime);

  if (!datetime) {
    return res.status(400).json({ message: 'Data e hora inválidas. Use o formato do seletor.' });
  }

  db.get('SELECT id_horario FROM horario WHERE datetime = ?', [datetime], (err, row) => {
    if (err) return res.status(500).json({ message: 'Erro ao verificar a disponibilidade do horário.' });
    if (row) return res.status(409).json({ message: 'Já existe um horário cadastrado neste momento.' });

    db.run(
      'INSERT INTO horario (datetime, usuario_sk) VALUES (?, ?)',
      [datetime, null],
      function (insertErr) {
        if (insertErr) return res.status(500).json({ message: 'Erro ao cadastrar horário.' });
        res.status(201).json({
          message: 'Horário cadastrado com sucesso!',
          id_horario: this.lastID,
          datetime,
        });
      }
    );
  });
});

/** Lista todos os horários (admin): disponíveis e ocupados. */
router.get('/horarios', verificarTokenAdm, (req, res) => {
  db.all(
    `
    SELECT
      h.id_horario,
      h.datetime,
      ${SQL_DATA} AS data,
      ${SQL_HORA} AS hora,
      h.usuario_sk,
      CASE WHEN h.usuario_sk IS NULL THEN 'disponivel' ELSE 'ocupado' END AS status
    FROM horario h
    ORDER BY h.datetime ASC
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error('Erro ao obter horários:', err.message);
        return res.status(500).json({ message: 'Erro ao carregar horários.' });
      }
      res.status(200).json({ result: { horarios: rows || [] } });
    }
  );
});

router.get('/horarios/:data', verificarToken, (req, res) => {
  const dataSelecionada = req.params.data;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataSelecionada)) {
    return res.status(400).json({ message: 'Data inválida. Use o formato AAAA-MM-DD.' });
  }

  db.all(
    `
    SELECT
      h.id_horario,
      ${SQL_HORA} AS hora
    FROM horario h
    WHERE h.usuario_sk IS NULL
      AND ${SQL_DATA} = date(?)
    ORDER BY h.datetime ASC
    `,
    [dataSelecionada],
    (err, rows) => {
      if (err) {
        console.error('Erro ao obter horários:', err.message);
        return res.status(500).json({ message: 'Erro ao carregar horários.' });
      }
      res.status(200).json({ result: { horarios: rows || [] } });
    }
  );
});

router.put('/horarios/:id', verificarToken, (req, res) => {
  const idHorario = req.params.id;
  const usuarioId = req.userId;

  if (!idHorario || Number.isNaN(Number(idHorario))) {
    return res.status(400).json({ message: 'ID de horário inválido.' });
  }

  db.get(
    'SELECT usuario_sk FROM horario WHERE id_horario = ? AND usuario_sk IS NULL',
    [idHorario],
    (err, row) => {
      if (err) {
        console.error('Erro ao buscar horário:', err.message);
        return res.status(500).json({ message: 'Erro ao verificar horário.' });
      }
      if (!row) {
        return res.status(409).json({ message: 'Horário não encontrado ou já está ocupado.' });
      }

      db.run(
        'UPDATE horario SET usuario_sk = ? WHERE id_horario = ? AND usuario_sk IS NULL',
        [usuarioId, idHorario],
        function (updateErr) {
          if (updateErr) {
            console.error('Erro ao atualizar horário:', updateErr.message);
            return res.status(500).json({ message: 'Erro ao reservar horário.' });
          }
          if (this.changes === 0) {
            return res.status(409).json({ message: 'Horário não disponível. Escolha outro.' });
          }
          res.status(200).json({ message: 'Agendamento confirmado com sucesso.' });
        }
      );
    }
  );
});

router.delete('/horarios/:id', verificarTokenAdm, (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT usuario_sk FROM horario WHERE id_horario = ?',
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar horário.' });
      if (!row) return res.status(404).json({ message: 'Horário não encontrado.' });
      if (row.usuario_sk != null) {
        return res.status(409).json({
          message: 'Não é possível excluir: horário já reservado por um cliente.',
        });
      }

      db.run('DELETE FROM horario WHERE id_horario = ?', [id], function (delErr) {
        if (delErr) return res.status(500).json({ message: 'Erro ao excluir horário.' });
        if (this.changes > 0) {
          return res.status(200).json({ message: 'Horário excluído com sucesso.' });
        }
        return res.status(404).json({ message: 'Horário não encontrado.' });
      });
    }
  );
});

module.exports = router;
