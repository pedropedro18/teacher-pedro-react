import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './header';
import Home from './pages/Home';
import Cursos from './Cursos';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ExerciciosNiveis from "./ExerciciosNiveis";
import ExerciciosTemas from './ExerciciosTemas';
import Aluno from './Aluno';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/exercicios-ingles" element={<ExerciciosNiveis />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/exercicios-temas" element={<ExerciciosTemas />} />
        <Route path="/Aluno" element={<Aluno />} />
      </Routes>
    </>
  );
}

export default App;
