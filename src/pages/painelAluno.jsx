import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exercicios } from '../utils/exercicio';

function PainelAluno() {
  const [submissoes, setSubmissoes] = useState([]);
  const [materiais, setMateriais] = useState([]);
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
      {materiais.length === 0 ? (
        <p>Ainda não há materiais disponíveis.</p>
      ) : (
        <ul>
          {materiais.map((m) => (
            <li key={m.id} style={{ marginBottom: '1rem' }}>
              <strong>{m.titulo}</strong>
              {m.nivel && <span> ({m.nivel})</span>}
              {m.descricao && <p style={{ margin: '0.2rem 0' }}>{m.descricao}</p>}
              <a href={m.link_pdf} target="_blank" rel="noopener noreferrer">
                Abrir PDF
              </a>
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