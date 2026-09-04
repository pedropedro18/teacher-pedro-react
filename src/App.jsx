import './App.css';
import { Routes, Route } from 'react-router-dom';
import SubmissoesAdmin from './pages/SubmissoesAdmin';
import Header from './header';
import Home from './pages/Home';
import Cursos from './Cursos';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import Login from './pages/Login';
import LoginAluno from './pages/LoginAluno';
import PainelAluno from './pages/painelAluno';
import ExerciciosAluno from './pages/ExerciciosAluno';
import Exercicio from './Exercicio';
import RotaProtegida from './RotaProtegida';

import RotaProtegidaAluno from './RotaProtegidaAluno';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin/Submissoes" element={<RotaProtegida><SubmissoesAdmin /></RotaProtegida>} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<RotaProtegida><Admin /></RotaProtegida>} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-aluno" element={<LoginAluno />} />
        <Route path="/aluno/painel" element={<RotaProtegidaAluno><PainelAluno /></RotaProtegidaAluno>} />
        <Route path="/aluno/exercicios" element={<RotaProtegidaAluno><ExerciciosAluno /></RotaProtegidaAluno>} />
        <Route path="/aluno/exercicio/:topicoId" element={<RotaProtegidaAluno><Exercicio /></RotaProtegidaAluno>} />
      </Routes>
    </>
  );
}

export default App;
