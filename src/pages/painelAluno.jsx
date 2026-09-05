import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exercicios } from '../utils/exercicio';

function PainelAluno() {
  const [submissoes, setSubmissoes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [respostas, setRespostas] = useState({}); // guarda o texto de cada textarea por material
  const [enviando, setEnviando] = useState(null); // id do material a ser enviado
  const [mensagem, setMensagem] = useState('');
  const topicos = Object.keys(exercicios);

  const carregarSubmissoes = async (token) => {
    const resSubmissoes = await fetch('/api/submissoes/minhas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dadosSubmissoes = await resSubmissoes.json();
    setSubmissoes(dadosSubmissoes);
  };

  useEffect(() => {
    const carregar = async () => {
      const token = localStorage.getItem('tokenAluno');
      if (!token) return;

      await carregarSubmissoes(token);

      const resMateriais = await fetch('/api/materiais', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dadosMateriais = await resMateriais.json();
      setMateriais(dadosMateriais);
    };
    carregar();
  }, []);

  const handleRespostaChange = (materialId, valor) => {
    setRespostas((prev) => ({ ...prev, [materialId]: valor }));
  };

  const enviarResposta = async (material) => {
    const resposta = respostas[material.id]?.trim();
    if (!resposta) {
      setMensagem('Escreve uma resposta antes de enviar.');
      return;
    }

    const token = localStorage.getItem('tokenAluno');
    if (!token) return;

    setEnviando(material.id);
    setMensagem('');

    try {
      const res = await fetch('/api/submissoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nivel: material.nivel,
          titulo_exercicio: material.titulo,
          resposta,
        }),
      });

      const dados = await res.json();

      if (!res.ok) {
        setMensagem(dados.erro || 'Erro ao enviar resposta.');
        return;
      }

      setMensagem('Resposta enviada com sucesso!');
      setRespostas((prev) => ({ ...prev, [material.id]: '' }));
      await carregarSubmissoes(token); // atualiza a lista de submissões
    } catch (erro) {
      console.error('Erro ao enviar resposta:', erro);
      setMensagem('Erro no servidor ao enviar resposta.');
    } finally {
      setEnviando(null);
    }
  };

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
      {mensagem && <p style={{ color: '#7CFC00' }}>{mensagem}</p>}

      {materiais.length === 0 ? (
        <p>Ainda não há materiais disponíveis.</p>
      ) : (
        <ul>
          {materiais.map((m) => (
            <li key={m.id} style={{ marginBottom: '2rem' }}>
              <strong>{m.titulo}</strong>
              {m.nivel && <span> ({m.nivel})</span>}
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

              {/* Formulário de submissão */}
              <div style={{ marginTop: '0.8rem' }}>
                <textarea
                  placeholder="Escreve aqui a tua resposta..."
                  value={respostas[m.id] || ''}
                  onChange={(e) => handleRespostaChange(m.id, e.target.value)}
                  rows={4}
                  style={{ width: '100%', maxWidth: '640px' }}
                />
                <br />
                <button
                  onClick={() => enviarResposta(m)}
                  disabled={enviando === m.id}
                  style={{ marginTop: '0.5rem' }}
                >
                  {enviando === m.id ? 'A enviar...' : 'Submeter resposta'}
                </button>
              </div>
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