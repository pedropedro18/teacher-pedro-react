import Hero from '../Hero';
import Diferenciais from '../Diferenciais';
import Cursos from '../Cursos';
import Depoimentos from '../Depoimentos';
import CTA from '../CTA';
import Contacto from './Contacto';

export default function Home() {
  return (
    <>
      <Hero />
      <Diferenciais />
      <Cursos />
      <Depoimentos />
      <CTA />
      <Contacto />
    </>
  );
}