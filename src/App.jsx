import { Routes, Route } from 'react-router-dom';
import Header from './header';
import Home from './pages/Home';
import Blog from './pages/Blog';  
import Cursos from './pages/Cursos';
import Contacto from './Contacto';
import BlogPost from './pages/BlogPost';
import './index.css'; 
import './App.css'; 
import { Analytics } from "@vercel/analytics/react";
import Admin from './pages/Admin';
import LoginAluno from './pages/LoginAluno';
import PainelAluno from './pages/painelAluno';
import Login from './pages/Login';
import RotaProtegida from './RotaProtegida';


function App() {
  return(
    <>
<Header />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path='/cursos' element={<Cursos />} />
    <Route path='/contacto' element={<Contacto />} />
   <Route path="/blog" element={<Blog />} />
   <Route path="/blog/:slug" element={<BlogPost />} />
   <Route path="/admin" element={<RotaProtegida><Admin /></RotaProtegida>} />
   <Route path="/login" element={<Login />} />
   <Route path="/login-aluno" element={<LoginAluno />} />
   <Route path="/aluno/painel" element={<PainelAluno />} />
   </Routes>
   <Analytics />
    </>
  );
  }
  export default App;


