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
   </Routes>
   <Analytics />
    </>
  );
  }
  export default App;


