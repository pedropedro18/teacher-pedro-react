import express from 'express';
import db from './db.js';
import { verificarTokenAluno } from './alunoAuth.js';

const router = express.Router();

router.post('/resultado', verificarTokenAluno, async (req, res) => {
  const { topico, acertos, total } = req.body;

  if (!topico || acertos === undefined || total === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios em falta' });
  }

  try {
    await db.query(
      `INSERT INTO resultados (aluno_id, topico, acertos, total)
       VALUES (?, ?, ?, ?)`,
      [req.aluno.id, topico, acertos, total]
    );
    res.status(201).json({ mensagem: 'Resultado guardado com sucesso' });
  } catch (erro) {
    console.error('Erro ao guardar resultado:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao guardar resultado' });
  }
});

router.get('/resultados', verificarTokenAluno, async (req, res) => {
  try {
    const [linhas] = await db.query(
      `SELECT topico, acertos, total, data_criacao
       FROM resultados
       WHERE aluno_id = ?
       ORDER BY data_criacao DESC`,
      [req.aluno.id]
    );
    res.json(linhas);
  } catch (erro) {
    console.error('Erro ao listar resultados:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao listar resultados' });
  }
});

export default router;