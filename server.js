import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import alunosRouter from './api/alunos.js';
import submissoesRouter from './api/submissoes.js';
import { login, verificarToken } from './api/auth.js';
import { loginAluno, definirPasswordAluno, meuPerfil, verificarTokenAluno } from './api/alunoAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.post('/api/login', login);
app.post('/api/aluno/login', loginAluno);
app.put('/api/alunos/:id/password', verificarToken, definirPasswordAluno);
app.use('/api/submissoes', submissoesRouter);
app.get('/api/alunos/me', verificarTokenAluno, meuPerfil);
app.use('/api/alunos', verificarToken, alunosRouter);

// Serve os arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, 'dist')));

// Qualquer rota que não seja da API cai no index.html (React Router assume)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});