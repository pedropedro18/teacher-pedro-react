import Hero from '../Hero';
import Diferenciais from '../Diferenciais';
import Sobre from '../Sobre';
import Cursos from '../Cursos';
import Depoimentos from '../Depoimentos';
import CTA from '../CTA';
import Contacto from './Contacto';

export default function Home() {
  return (
    <>
      <Hero />
      <Diferenciais />
      <Sobre />
      <Cursos />
      <Depoimentos />
      <CTA />
      <Contacto />
    </>
  );
}