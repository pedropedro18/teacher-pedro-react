import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exercicios } from '../utils/exercicio';

const NIVEIS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function PainelAluno() {
  const [submissoes, setSubmissoes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [nivelAtivo, setNivelAtivo] = useState('Todos');
  const topicos = Object.keys(exercicios);

  useEffect(() => {
    const carregar = async () => {
      const token = localStorage.getItem('tokenAluno');
      if (!token) return;

      const resSubmissoes = await fetch('/api/submissoes/minhas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dadosSubmissoes = await resSubmissoes.json();
      setSubmissoes(dadosSubmissoes);

      const resMateriais = await fetch('/api/materiais', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dadosMateriais = await resMateriais.json();
      setMateriais(dadosMateriais);
    };
    carregar();
  }, []);

  const materiaisFiltrados =
    nivelAtivo === 'Todos'
      ? materiais
      : materiais.filter((m) => m.nivel === nivelAtivo);

  return (
    <div>
      <h2>Exercícios disponíveis</h2>
      <ul>
        {topicos.map((topico) => (
          <li key={topico}>
            <Link to={`/aluno/exercicio/${topico}`}>{topico}</Link>
          </li>
        ))}
      </ul>

      <h2>Materiais de Estudo</h2>

      {/* Filtro por nível */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          marginBottom: '1rem',
          paddingBottom: '4px',
        }}
      >
        {['Todos', ...NIVEIS].map((nivel) => (
          <button
            key={nivel}
            onClick={() => setNivelAtivo(nivel)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #444',
              cursor: 'pointer',
              background: nivel === nivelAtivo ? '#378ADD' : 'transparent',
              color: nivel === nivelAtivo ? '#fff' : '#ccc',
              fontWeight: nivel === nivelAtivo ? 600 : 400,
            }}
          >
            {nivel}
          </button>
        ))}
      </div>

      {materiaisFiltrados.length === 0 ? (
        <p>
          {materiais.length === 0
            ? 'Ainda não há materiais disponíveis.'
            : 'Nenhum material encontrado para este nível.'}
        </p>
      ) : (
        <ul>
          {materiaisFiltrados.map((m) => (
            <li key={m.id} style={{ marginBottom: '1.5rem' }}>
              <strong>{m.titulo}</strong>
              {m.nivel && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.8rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: '#1d4ed8',
                    color: '#fff',
                  }}
                >
                  {m.nivel}
                </span>
              )}
              {m.descricao && <p style={{ margin: '0.2rem 0' }}>{m.descricao}</p>}

              {m.link_pdf && (
                <p>
                  <a href={m.link_pdf} target="_blank" rel="noopener noreferrer">
                    Abrir PDF
                  </a>
                </p>
              )}

              {m.link_video && (
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    marginTop: '0.5rem',
                    maxWidth: '640px',
                  }}
                >
                  <iframe
                    src={m.link_video}
                    title={m.titulo}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>As tuas submissões</h2>
      {submissoes.length === 0 ? (
        <p>Ainda não enviaste nenhum exercício.</p>
      ) : (
        <ul>
          {submissoes.map((s) => (
            <li key={s.id} style={{ marginBottom: '1rem' }}>
              <strong>{s.titulo_exercicio}</strong> —{' '}
              {s.corrigido ? (
                <span>
                  Nota: {s.nota ?? 'N/A'} | Feedback: {s.feedback || 'Sem comentário'}
                </span>
              ) : (
                <span>Aguardando correção</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PainelAluno;