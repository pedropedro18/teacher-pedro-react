// api/submissoes.js
import expres from 'express';
import jwt from 'jsonwebtoken';
import db from './db.js';
import { verificarToken } from './auth.js';

const router = expres.Router();
const JWT_SECRET = process.env.JWT_SECRET; // mesmo segredo usado no login do aluno

// --- Middleware: verifica token do ALUNO ---
function verificarTokenAluno(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }
    req.alunoId = decoded.id; // ajusta conforme o campo usado no teu login-aluno
    next();
  });
}

// --- Middleware: verifica token do ADMIN ---
// Se já tens um middleware de admin usado no Admin.jsx / alunos.js, importa-o
// e substitui este por esse, para não duplicar lógica.

// --- POST /api/submissoes ---
// Aluno envia uma resposta a um exercício
router.post('/', verificarTokenAluno, async (req, res) => {
  const { nivel, titulo_exercicio, resposta } = req.body;

  if (!nivel || !titulo_exercicio || !resposta) {
    return res.status(400).json({ erro: 'Campos obrigatórios em falta' });
  }

  try {
    const [resultado] = await db.query(
      `INSERT INTO submissoes (aluno_id, nivel, titulo_exercicio, resposta)
       VALUES (?, ?, ?, ?)`,
      [req.alunoId, nivel, titulo_exercicio, resposta]
    );

    res.status(201).json({
      mensagem: 'Resposta enviada com sucesso',
      id: resultado.insertId
    });
  } catch (erro) {
    console.error('Erro ao guardar submissão:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao enviar resposta' });
  }
});

// --- GET /api/submissoes ---
// Admin vê todas as submissões, com nome do aluno
router.get('/', verificarToken, async (req, res) => {
  try {
    const [linhas] = await db.query(
      `SELECT s.id, s.nivel, s.titulo_exercicio, s.resposta, s.data_envio,
              s.corrigido, s.nota, s.feedback,
              a.nome AS aluno_nome, a.id AS aluno_id
       FROM submissoes s
       JOIN alunos a ON a.id = s.aluno_id
       ORDER BY s.data_envio DESC`
    );
    res.json(linhas);
  } catch (erro) {
    console.error('Erro ao listar submissões:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao listar submissões' });
  }
});

// --- GET /api/submissoes/minhas ---
// Aluno vê as suas próprias submissões e o respetivo feedback
router.get('/minhas', verificarTokenAluno, async (req, res) => {
  try {
    const [linhas] = await db.query(
      `SELECT id, nivel, titulo_exercicio, resposta, data_envio, corrigido, nota, feedback
       FROM submissoes
       WHERE aluno_id = ?
       ORDER BY data_envio DESC`,
      [req.alunoId]
    );
    res.json(linhas);
  } catch (erro) {
    console.error('Erro ao listar as minhas submissões:', erro);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// --- PUT /api/submissoes/:id ---
// Admin corrige: define nota, feedback, e marca como corrigido
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nota, feedback } = req.body;

  try {
    const [resultado] = await db.query(
      `UPDATE submissoes
       SET nota = ?, feedback = ?, corrigido = TRUE
       WHERE id = ?`,
      [nota || null, feedback || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Submissão não encontrada' });
    }

    res.json({ mensagem: 'Submissão corrigida com sucesso' });
  } catch (erro) {
    console.error('Erro ao corrigir submissão:', erro);
    res.status(500).json({ erro: 'Erro no servidor ao corrigir submissão' });
  }
});

export default router;