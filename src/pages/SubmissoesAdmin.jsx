import { useEffect, useState } from 'react';

function SubmissoesAdmin() {
  const [submissoes, setSubmissoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [notas, setNotas] = useState({});       // valor da nota por submissão (enquanto edita)
  const [feedbacks, setFeedbacks] = useState({}); // valor do feedback por submissão (enquanto edita)
  const [salvando, setSalvando] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const carregarSubmissoes = async () => {
    const token = localStorage.getItem('tokenAdmin'); // ajusta ao nome real usado no login admin
    if (!token) return;

    setCarregando(true);
    try {
      const res = await fetch('/api/submissoes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await res.json();
      setSubmissoes(dados);

      // pré-preenche os campos de edição com valores já existentes
      const notasIniciais = {};
      const feedbacksIniciais = {};
      dados.forEach((s) => {
        notasIniciais[s.id] = s.nota ?? '';
        feedbacksIniciais[s.id] = s.feedback ?? '';
      });
      setNotas(notasIniciais);
      setFeedbacks(feedbacksIniciais);
    } catch (erro) {
      console.error('Erro ao carregar submissões:', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarSubmissoes();
  }, []);

  const corrigirSubmissao = async (id) => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) return;

    setSalvando(id);
    setMensagem('');

    try {
      const res = await fetch(`/api/submissoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nota: notas[id] === '' ? null : Number(notas[id]),
          feedback: feedbacks[id],
        }),
      });

      const dados = await res.json();

      if (!res.ok) {
        setMensagem(dados.erro || 'Erro ao corrigir submissão.');
        return;
      }

      setMensagem('Correção guardada com sucesso!');
      await carregarSubmissoes(); // atualiza a lista com os dados guardados
    } catch (erro) {
      console.error('Erro ao corrigir submissão:', erro);
      setMensagem('Erro no servidor ao corrigir submissão.');
    } finally {
      setSalvando(null);
    }
  };

  if (carregando) return <p>A carregar submissões...</p>;

  return (
    <div>
      <h2>Submissões dos alunos ({submissoes.length})</h2>
      {mensagem && <p style={{ color: '#7CFC00' }}>{mensagem}</p>}

      {submissoes.length === 0 ? (
        <p>Ainda não há submissões.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {submissoes.map((s) => (
            <li
              key={s.id}
              style={{
                border: '1px solid #444',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <p>
                <strong>{s.aluno_nome}</strong> — {s.titulo_exercicio}{' '}
                {s.nivel && <span>({s.nivel})</span>}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>
                Enviado em: {new Date(s.data_envio).toLocaleString('pt-PT')}
              </p>

              <p>
                <strong>Resposta do aluno:</strong>
              </p>
              <p style={{ whiteSpace: 'pre-wrap', background: '#222', padding: '0.5rem', borderRadius: '4px' }}>
                {s.resposta}
              </p>

              <div style={{ marginTop: '0.8rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <label>
                    Nota:{' '}
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={notas[s.id] ?? ''}
                      onChange={(e) =>
                        setNotas((prev) => ({ ...prev, [s.id]: e.target.value }))
                      }
                      style={{ width: '60px' }}
                    />
                  </label>
                </div>

                <div style={{ flex: 1, minWidth: '250px' }}>
                  <label>
                    Feedback:{' '}
                    <input
                      type="text"
                      value={feedbacks[s.id] ?? ''}
                      onChange={(e) =>
                        setFeedbacks((prev) => ({ ...prev, [s.id]: e.target.value }))
                      }
                      style={{ width: '100%' }}
                    />
                  </label>
                </div>
              </div>

              <button
                onClick={() => corrigirSubmissao(s.id)}
                disabled={salvando === s.id}
                style={{ marginTop: '0.6rem' }}
              >
                {salvando === s.id ? 'A guardar...' : s.corrigido ? 'Atualizar correção' : 'Corrigir'}
              </button>

              {s.corrigido && (
                <span style={{ marginLeft: '0.8rem', color: '#7CFC00' }}>✓ Já corrigido</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubmissoesAdmin;