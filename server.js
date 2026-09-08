import 'dotenv/config';
import express from 'express';
import resultadoRouter from './api/resultado.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import alunosRouter from './api/alunos.js';
import submissoesRouter from './api/submissoes.js';
import { login, verificarToken } from './api/auth.js';
import { loginAluno, definirPasswordAluno, meuPerfil, verificarTokenAluno } from './api/alunoAuth.js';
import certificadoRouter from './api/certificado.js';
import materiaisRoutes from './api/materiais.js';
import { corrigirComIA } from './api/corrigirIA.js';

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
app.use('/api', certificadoRouter);
app.use('/api/aluno', resultadoRouter);
app.use('/api/materiais', materiaisRoutes);

app.post('/api/corrigir', async (req, res) => {
  const { texto, nivel } = req.body;

  if (!texto || !nivel) {
    return res.status(400).json({ erro: 'Texto e nível são obrigatórios' });
  }

  const resultado = await corrigirComIA(texto, nivel);

  if (!resultado) {
    return res.status(500).json({ erro: 'Erro ao corrigir o texto' });
  }

  res.json(resultado);
});



// Serve os arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, 'dist')));

// Qualquer rota que não seja da API cai no index.html (React Router assume)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});