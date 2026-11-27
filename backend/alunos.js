import express from 'express';
import db from './db.js';
import {
  loginAluno,
  definirPasswordAluno,
  verificarTokenAluno,
  meuPerfil,
} from './alunoAuth.js';

const router = express.Router();

// Colunas seguras (nunca devolver password_hash)
const CAMPOS = 'id, nome, email, nivel_cefr, telefone, ativo, criado_em';

// Login do aluno
router.post('/login', loginAluno);

// Perfil do aluno autenticado (tem de vir antes de '/:id')
router.get('/me', verificarTokenAluno, meuPerfil);

// Listar alunos
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(SELECT `${CAMPOS} FROM alunos ORDER BY nome`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar um aluno por ID
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT ${CAMPOS} FROM alunos WHERE id = $1?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar novo aluno
router.post('/', async (req, res) => {
  const { nome, email, nivel_cefr, telefone } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO alunos (nome, email, nivel_cefr, telefone)
       VALUES ($1, $2, $3, $4)
       RETURNING ${CAMPOS}`,
      [nome, email ? email.trim() : email, nivel_cefr, telefone]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar aluno
router.put('/:id', async (req, res) => {
  const { nome, email, nivel_cefr, telefone } = req.body;
  try {
    const result = await db.query(
      'UPDATE alunos SET nome=$1, email=$2, nivel_cefr=$3, telefone=$4 WHERE id=$5',
      [nome, email ? email.trim() : email, nivel_cefr, telefone, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.json({ mensagem: 'Aluno atualizado' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Definir/alterar password do aluno
router.put('/:id/password', definirPasswordAluno);

// Apagar aluno
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM alunos WHERE id=$1', [req.params.id]);
    res.json({ mensagem: 'Aluno removido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;