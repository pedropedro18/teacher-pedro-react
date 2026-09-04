import express from 'express';
import db from './db.js';
import { verificarToken } from './auth.js';

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, titulo, descricao, link_pdf, link_video, nivel, data_criacao FROM materiais ORDER BY data_criacao DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar materiais' });
  }
});

router.post('/', verificarToken, async (req, res) => {
  const { titulo, descricao, link_pdf, link_video, nivel } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: 'Título é obrigatório' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO materiais (titulo, descricao, link_pdf, link_video, nivel, data_criacao) VALUES (?, ?, ?, ?, ?, NOW())',
      [titulo, descricao || null, link_pdf || null, link_video || null, nivel || null]
    );
    res.status(201).json({ id: result.insertId, titulo, descricao, link_pdf, link_video, nivel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao adicionar material' });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, link_pdf, link_video, nivel } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: 'Título é obrigatório' });
  }

  try {
    const [result] = await db.query(
      'UPDATE materiais SET titulo = ?, descricao = ?, link_pdf = ?, link_video = ?, nivel = ? WHERE id = ?',
      [titulo, descricao || null, link_pdf || null, link_video || null, nivel || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Material não encontrado' });
    }

    res.json({ id: Number(id), titulo, descricao, link_pdf, link_video, nivel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao editar material' });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM materiais WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Material não encontrado' });
    }

    res.json({ mensagem: 'Material removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover material' });
  }
});

export default router;