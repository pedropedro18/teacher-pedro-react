import Header from './header';
import Hero from './Hero';
import Sobre from './Sobre';  
import Cursos from './Cursos';  
import Contacto from './Contacto'; 

import './index.css';   
export default function App() {
  return(
    <>
    <Header />
<main>
  <Hero />
   <Sobre />
   <Cursos />
  <Contacto/>
    </main>
    </>
  );
  }
