import './Chat.css';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './header';
import Chat from './Chat';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Cursos from './Cursos';
import Aulas from './Aulas';
import ExerciciosNiveis from './ExerciciosNiveis';
import ExerciciosTemas from './ExerciciosTemas';
import Fichas from './Fichas';
import Aluno from './Aluno';
import Login from './pages/Login';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Suporte from './pages/Contacto'; // renomeia o ficheiro depois
import { Analytics } from "@vercel/analytics/react";


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/aulas" element={<Aulas />} />
        <Route path="/exercicios" element={<ExerciciosNiveis />} />
        <Route path="/temas" element={<ExerciciosTemas />} />
        <Route path="/fichas" element={<Fichas />} />
        <Route path="/aluno" element={<Aluno />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        {/* Redirecionamentos das rotas antigas */}
        <Route path="/exercicios-ingles" element={<Navigate to="/exercicios" replace />} />
        <Route path="/exercicios-temas" element={<Navigate to="/temas" replace />} />
        <Route path="/contacto" element={<Navigate to="/suporte" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chat />
    </>
  );
}

export default App;