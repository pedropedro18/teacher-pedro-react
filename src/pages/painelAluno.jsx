import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { conteudosPorNivel } from '../data/conteudos';

function PainelAluno() {
  const [aluno, setAluno] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const alunoGuardado = localStorage.getItem('aluno');
    if (!alunoGuardado) {
      navigate('/aluno/login');
      return;
    }
    setAluno(JSON.parse(alunoGuardado));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('aluno');
    localStorage.removeItem('tokenAluno');
    navigate('/aluno/login');
  };

  if (!aluno) return <p>A carregar...</p>;

  const nivel = aluno.nivel_cefr || 'A1';
  const conteudos = conteudosPorNivel[nivel] || [];

  return (
    <div className="painel-aluno">
      <p>Email: {aluno.email}</p>
      <p>Nível CEFR: {nivel}</p>
      <button onClick={handleLogout}>Sair</button>

      <h2>Conteúdos do teu nível ({nivel})</h2>

      {conteudos.length === 0 ? (
        <p>Ainda não há conteúdos disponíveis para o teu nível.</p>
      ) : (
        <ul className="lista-conteudos">
          {conteudos.map((item, index) => (
            <li key={index} className="conteudo-item">
              <span className="conteudo-tipo">
                {item.tipo === 'vídeo' ? '🎬' : '📄'}
              </span>{' '}
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.titulo}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PainelAluno;