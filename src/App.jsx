import { Routes, Route } from 'react-router-dom';
import Header from './header';
import Home from './pages/Home';
import Blog from './pages/Blog';  
import BlogPost from './pages/BlogPost';
import './index.css'; 
import './App.css'; 

export default function App() {
  return(
    <>
    <Header />
<main>
  <Routes>
   <Route path="/" element={<Home />} />
   <Route path="/blog" element={<Blog />} />
   <Route path="/blog/:slug" element={<BlogPost />} />
   </Routes>
    </main>
    </>
  );
  }


