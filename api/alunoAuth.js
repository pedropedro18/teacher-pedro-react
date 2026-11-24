import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';

const SECRET = process.env.JWT_SECRET;

// Login do aluno
export async function loginAluno(req, res) {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM alunos WHERE email = ?', [email]);
    const aluno = rows[0];

    if (!aluno || !aluno.password_hash) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const valido = await bcrypt.compare(password, aluno.password_hash);
    if (!valido) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: aluno.id, email: aluno.email, tipo: 'aluno' },
      SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      aluno: { id: aluno.id, nome: aluno.nome, email: aluno.email, nivel_cefr: aluno.nivel_cefr }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}

// Define/altera a password de um aluno
export async function definirPasswordAluno(req, res) {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password inválida' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('UPDATE alunos SET password_hash = ? WHERE id = ?', [hash, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao definir password' });
  }
  }
  export async function meuPerfil(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, nome, email, nivel_cefr, telefone FROM alunos WHERE id = ?',
      [req.aluno.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}

// Middleware: verifica o token do aluno
export function verificarTokenAluno(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Sem token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const dados = jwt.verify(token, SECRET);
    if (dados.tipo !== 'aluno') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    req.aluno = dados;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

    