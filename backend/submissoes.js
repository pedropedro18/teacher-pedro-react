// backend/submissoes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import db from './db.js';
import { verificarToken } from './auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Middleware: verifica token do ALUNO ---
function verificarTokenAluno(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }
    req.alunoId = decoded.id;
    next();
  });
}

// POST /api/submissoes — aluno envia resposta
router.post('/', verificarTokenAluno, async (req, res) => {
  const { nivel, titulo_exercicio, resposta } = req.body;

  if (!nivel || !titulo_exercicio || !resposta) {
    return res.status(400).json({ erro: 'Campos obrigatórios em falta' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO submissoes (aluno_id, nivel, titulo_exercicio, resposta)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.alunoId, nivel, titulo_exercicio, resposta]
    );

    res.status(201).json({
      mensagem: 'Resposta enviada com sucesso',
      id: rows[0].id
    });
  } catch (erro) {
    console.error('Erro ao guardar submissão:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao enviar resposta' });
  }
});

// GET /api/submissoes — admin vê todas
router.get('/', verificarToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT s.id, s.nivel, s.titulo_exercicio, s.resposta, s.data_envio,
              s.corrigido, s.nota, s.feedback,
              a.nome AS aluno_nome, a.id AS aluno_id
       FROM submissoes s
       JOIN alunos a ON a.id = s.aluno_id
       ORDER BY s.data_envio DESC`
    );
    res.json(rows);
  } catch (erro) {
    console.error('Erro ao listar submissões:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao listar submissões' });
  }
});

// GET /api/submissoes/minhas — aluno vê as suas
router.get('/minhas', verificarTokenAluno, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, nivel, titulo_exercicio, resposta, data_envio, corrigido, nota, feedback
       FROM submissoes
       WHERE aluno_id = $1
       ORDER BY data_envio DESC`,
      [req.alunoId]
    );
    res.json(rows);
  } catch (erro) {
    console.error('Erro ao listar as minhas submissões:', erro);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// PUT /api/submissoes/:id — admin corrige
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nota, feedback } = req.body;

  try {
    const resultado = await db.query(
      `UPDATE submissoes
       SET nota = $1, feedback = $2, corrigido = TRUE
       WHERE id = $3`,
      [nota || null, feedback || null, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Submissão não encontrada' });
    }

    res.json({ mensagem: 'Submissão corrigida com sucesso' });
  } catch (erro) {
    console.error('Erro ao corrigir submissão:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao corrigir submissão' });
  }
});

// DELETE /api/submissoes/:id — admin apaga
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query(
      `DELETE FROM submissoes WHERE id = $1`,
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Submissão não encontrada' });
    }

    res.json({ mensagem: 'Submissão apagada com sucesso' });
  } catch (erro) {
    console.error('Erro ao apagar submissão:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao apagar submissão' });
  }
});

export default router;