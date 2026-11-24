import express from 'express';
// AJUSTE esta linha ao que o seu api/db.js exporta (ex.: pool, sql ou default)
import pool from './db.js';

const router = express.Router();

// GET /api/aulas?aluno=nome
router.get('/', async (req, res) => {
  try {
    const aluno = String(req.query.aluno || '').trim().toLowerCase();
    if (!aluno) return res.json([]);

    const { rows } = await pool.query(
      'SELECT id, data, nivel, tema, link FROM aulas WHERE aluno = $1 ORDER BY data',
      [aluno]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao carregar aulas' });
  }
});

export default router;