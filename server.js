import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import alunosRouter from './api/alunos.js';
import { login, verificarToken } from './api/auth.js';
import { loginAluno, definirPasswordAluno, meuPerfil, verificarTokenAluno } from './api/alunoAuth.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/login', login);
app.post('/api/aluno/login', loginAluno);
app.put('/api/alunos/:id/password', verificarToken, definirPasswordAluno);
app.get('/api/alunos/me', verificarTokenAluno, meuPerfil);
app.use('/api/alunos', verificarToken, alunosRouter);


app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});