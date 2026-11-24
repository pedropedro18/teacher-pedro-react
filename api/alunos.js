import express from 'express';
const router = express.Router();
import db from './db.js';
import { loginAluno, definirPasswordAluno, verificarTokenAluno } from './alunoAuth.js';

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alunos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar um aluno por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alunos WHERE id = ?', [req.params.id]);
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
    const [result] = await db.query(
      'INSERT INTO alunos (nome, email, nivel_cefr, telefone) VALUES (?, ?, ?, ?)',
      [nome, email, nivel_cefr, telefone]
    );
    res.status(201).json({ id: result.insertId, nome, email, nivel_cefr, telefone });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar aluno
router.put('/:id', async (req, res) => {
  const { nome, email, nivel_cefr, telefone } = req.body;
  try {
    await db.query(
      'UPDATE alunos SET nome=?, email=?, nivel_cefr=?, telefone=? WHERE id=?',
      [nome, email, nivel_cefr, telefone, req.params.id]
    );
    res.json({ mensagem: 'Aluno atualizado' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Apagar aluno
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM alunos WHERE id=?', [req.params.id]);
    res.json({ mensagem: 'Aluno removido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
// Login do aluno
router.post('/login', loginAluno);

// Definir/alterar password do aluno
router.put('/:id/password', definirPasswordAluno);
export default router;