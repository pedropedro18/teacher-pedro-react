import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './header';
import Home from './pages/Home';
import Cursos from './Cursos';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import Login from './pages/Login';
import RotaProtegida from './RotaProtegida';
import MateriaisAdmin from './pages/MateriaisAdmin';
import ExerciciosNiveis from "./ExerciciosNiveis";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/materiais" element={<RotaProtegida><MateriaisAdmin /></RotaProtegida>} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/exercicios-ingles" element={<ExerciciosNiveis />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<RotaProtegida><Admin /></RotaProtegida>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
