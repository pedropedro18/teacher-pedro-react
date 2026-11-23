import './Chat.css';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './header';
import Chat from './Chat';

import Home from './pages/Home';
import Cursos from './Cursos';
import Aulas from './Aulas';
import ExerciciosNiveis from './ExerciciosNiveis';
import ExerciciosTemas from './ExerciciosTemas';
import Fichas from './Fichas';
import Aluno from './Aluno';
import Professor from './Professor';
import PainelMatriculas from './PainelMatriculas';
import Suporte from './pages/Contacto'; // renomeia o ficheiro depois

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/aulas" element={<Aulas />} />
        <Route path="/exercicios" element={<ExerciciosNiveis />} />
        <Route path="/temas" element={<ExerciciosTemas />} />
        <Route path="/fichas" element={<Fichas />} />
        <Route path="/aluno" element={<Aluno />} />
        <Route path="/suporte" element={<Suporte />} />

        {/* Área de gestão */}
        <Route path="/professor" element={<Professor />} />
        <Route path="/matriculas" element={<PainelMatriculas />} />

        {/* Redirecionamentos das rotas antigas */}
        <Route path="/exercicios-ingles" element={<Navigate to="/exercicios" replace />} />
        <Route path="/exercicios-temas" element={<Navigate to="/temas" replace />} />
        <Route path="/contacto" element={<Navigate to="/suporte" replace />} />
        <Route path="/blog" element={<Navigate to="/" replace />} />
        <Route path="/blog/:slug" element={<Navigate to="/" replace />} />
        <Route path="/sobre" element={<Navigate to="/" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chat />
    </>
  );
}

export default App;