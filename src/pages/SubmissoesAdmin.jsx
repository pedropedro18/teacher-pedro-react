import { useEffect, useState } from 'react';

function SubmissoesAdmin() {
  const [submissoes, setSubmissoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [notas, setNotas] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [salvando, setSalvando] = useState(null);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    setErro(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setErro('Não tens sessão de admin ativa. Faz login novamente.');
      setSubmissoes([]);
      setCarregando(false);
      return;
    }

    try {
      const res = await fetch('/api/submissoes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error('Erro na API:', res.status);

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          setErro('Sessão expirada. Faz login novamente.');
        } else {
          setErro(`Erro ao carregar submissões (status ${res.status}).`);
        }

        setSubmissoes([]);
        return;
      }

      const dados = await res.json();
      setSubmissoes(Array.isArray(dados) ? dados : []);
    } catch (e) {
      console.error('Erro ao carregar submissões:', e);
      setErro('Erro de rede ao carregar submissões.');
      setSubmissoes([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const corrigir = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Não tens sessão de admin ativa. Faz login novamente.');
      return;
    }

    setSalvando(id);

    try {
      const res = await fetch(`/api/submissoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nota: notas[id] || null,
          feedback: feedbacks[id] || '',
        }),
      });

      if (!res.ok) {
        console.error('Erro ao corrigir:', res.status);
        setErro(`Erro ao guardar correção (status ${res.status}).`);
        return;
      }

      await carregar();
    } catch (e) {
      console.error('Erro ao corrigir:', e);
      setErro('Erro de rede ao guardar correção.');
    } finally {
      setSalvando(null);
    }
  };

  if (carregando) return <p>A carregar submissões...</p>;

  if (erro) {
    return (
      <div>
        <p style={{ color: 'red' }}>{erro}</p>
        <button onClick={carregar}>Tentar novamente</button>
      </div>
    );
  }

  const pendentes = submissoes.filter((s) => !s.corrigido);
  const corrigidas = submissoes.filter((s) => s.corrigido);

  return (
    <div>
      <h2>Submissões dos alunos</h2>

      <h3>Pendentes ({pendentes.length})</h3>
      {pendentes.length === 0 ? (
        <p>Nenhuma submissão pendente.</p>
      ) : (
        pendentes.map((s) => (
          <div key={s.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <p><strong>Aluno:</strong> {s.aluno_nome}</p>
            <p><strong>Tópico:</strong> {s.titulo_exercicio}</p>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '0.5rem' }}>
              {s.resposta}
            </pre>
            <div>
              <label>Nota: </label>
              <input
                type="number"
                min="0"
                max="20"
                value={notas[s.id] || ''}
                onChange={(e) => setNotas({ ...notas, [s.id]: e.target.value })}
              />
            </div>
            <div>
              <label>Feedback: </label>
              <textarea
                value={feedbacks[s.id] || ''}
                onChange={(e) => setFeedbacks({ ...feedbacks, [s.id]: e.target.value })}
                rows={3}
                style={{ width: '100%' }}
              />
            </div>
            <button onClick={() => corrigir(s.id)} disabled={salvando === s.id}>
              {salvando === s.id ? 'A guardar...' : 'Guardar correção'}
            </button>
          </div>
        ))
      )}

      <h3>Já corrigidas ({corrigidas.length})</h3>
      {corrigidas.map((s) => (
        <div key={s.id} style={{ marginBottom: '0.5rem' }}>
          <strong>{s.aluno_nome}</strong> — {s.titulo_exercicio} — Nota: {s.nota ?? 'N/A'}
        </div>
      ))}
    </div>
  );
}

export default SubmissoesAdmin;