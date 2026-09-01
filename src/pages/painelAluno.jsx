import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { conteudosPorNivel } from '../data/conteudos';

const FRASES_TO_BE = [
  'I _ a student.',
  'She _ my sister.',
  'They _ from Angola.',
  'We _ happy.',
  'He _ a teacher.',
  'You _ my friend.',
  'It _ a book.',
  'The children _ at school.',
  'I _ 20 years old.',
  'My parents _ at home.'
];

function ExercicioToBe({ token, onEnviado }) {
  const [respostas, setRespostas] = useState(Array(FRASES_TO_BE.length).fill(''));
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const atualizarResposta = (index, valor) => {
    const novas = [...respostas];
    novas[index] = valor;
    setRespostas(novas);
  };

  const handleEnviar = async () => {
    if (respostas.some((r) => !r.trim())) {
      setMensagem('Preenche todas as respostas antes de enviar.');
      return;
    }

    setEnviando(true);
    setMensagem('');

    const respostaFormatada = respostas
      .map((r, i) => `${i + 1}.${r.trim()}`)
      .join(' ');

    try {
      const res = await fetch('/api/submissoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo_exercicio: 'Verbo To Be (presente)',
          resposta: respostaFormatada
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.erro || 'Erro ao enviar resposta');
      } else {
        setMensagem('Resposta enviada com sucesso!');
        setRespostas(Array(FRASES_TO_BE.length).fill(''));
        if (onEnviado) onEnviado();
      }
    } catch (err) {
      setMensagem('Erro no servidor ao enviar resposta');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="exercicio-to-be">
      <p>Completa as frases com am, is ou are:</p>
      {FRASES_TO_BE.map((frase, index) => {
        const partes = frase.split('_');
        return (
          <div key={index} className="exercicio-linha">
            <span>{index + 1}. {partes[0]}</span>
            <input
              type="text"
              value={respostas[index]}
              onChange={(e) => atualizarResposta(index, e.target.value)}
              maxLength={4}
              className="exercicio-input"
            />
            <span>{partes[1]}</span>
          </div>
        );
      })}
      <button onClick={handleEnviar} disabled={enviando}>
        {enviando ? 'A enviar...' : 'Enviar respostas'}
      </button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

function PainelAluno() {
  const [aluno, setAluno] = useState(null);
  const [aberto, setAberto] = useState(null);
  const [abertoExercicio, setAbertoExercicio] = useState(null);
  const [minhasSubmissoes, setMinhasSubmissoes] = useState([]);
  const [baixando, setBaixando] = useState(false);
  const navigate = useNavigate();

  const carregarSubmissoes = async () => {
    const token = localStorage.getItem('tokenAluno');
    try {
      const res = await fetch('/api/submissoes/minhas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMinhasSubmissoes(data);
    } catch (err) {
      console.error('Erro ao carregar submissões:', err);
    }
  };

  async function baixarCertificado(nivel) {
    if (baixando) return;
    setBaixando(true);
    const token = localStorage.getItem('tokenAluno');
    try {
      const res = await fetch(`/api/certificado/${nivel}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const erro = await res.json();
        alert(erro.error || 'Erro ao gerar certificado');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificado-${nivel}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao baixar certificado');
      console.error(err);
    } finally {
      setBaixando(false);
    }
  }

  useEffect(() => {
    const alunoGuardado = localStorage.getItem('aluno');
    if (!alunoGuardado) {
      navigate('/aluno/login');
      return;
    }
    setAluno(JSON.parse(alunoGuardado));
    carregarSubmissoes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('aluno');
    localStorage.removeItem('tokenAluno');
    navigate('/aluno/login');
  };

  if (!aluno) return <p>A carregar...</p>;

  const nivel = aluno.nivel_cefr || 'A1';
  const todosConteudos = conteudosPorNivel[nivel] || [];
  const token = localStorage.getItem('tokenAluno');

  // Separa os conteúdos "normais" dos exercícios
  const conteudos = todosConteudos.filter((item) => item.tipo !== 'exercicio-toBe');
  const exercicios = todosConteudos.filter((item) => item.tipo === 'exercicio-toBe');

  return (
    <div className="painel-aluno">
      <p>Email: {aluno.email}</p>
      <p>Nível CEFR: {nivel}</p>
      <button onClick={() => baixarCertificado(nivel)} disabled={baixando}>
        {baixando ? 'A verificar...' : 'Baixar Certificado'}
      </button>
      <button onClick={handleLogout}>Sair</button>

      <h2>Conteúdos do teu nível ({nivel})</h2>

      {conteudos.length === 0 ? (
        <p>Ainda não há conteúdos disponíveis para o teu nível.</p>
      ) : (
        <ul className="lista-conteudos">
          {conteudos.map((item, index) => (
            <li key={index} className="conteudo-item">
              <span className="conteudo-tipo">
                {item.tipo === 'vídeo' ? '🎬' : item.tipo === 'texto' ? '📝' : '📄'}
              </span>{' '}
              {item.tipo === 'texto' ? (
                <>
                  <button
                    className="conteudo-titulo-btn"
                    onClick={() => setAberto(aberto === index ? null : index)}
                  >
                    {item.titulo}
                  </button>
                  {aberto === index && (
                    <pre className="conteudo-texto">{item.conteudo}</pre>
                  )}
                </>
              ) : (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.titulo}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {exercicios.length > 0 && (
        <>
          <h2>Exercícios</h2>
          <ul className="lista-exercicios">
            {exercicios.map((item, index) => (
              <li key={index} className="conteudo-item">
                <span className="conteudo-tipo">✏️</span>{' '}
                <button
                  className="conteudo-titulo-btn"
                  onClick={() =>
                    setAbertoExercicio(abertoExercicio === index ? null : index)
                  }
                >
                  {item.titulo}
                </button>
                {abertoExercicio === index && (
                  <ExercicioToBe token={token} onEnviado={carregarSubmissoes} />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>As tuas submissões</h2>
      {minhasSubmissoes.length === 0 ? (
        <p>Ainda não enviaste nenhuma resposta.</p>
      ) : (
        <ul className="lista-submissoes">
          {minhasSubmissoes.map((s) => (
            <li key={s.id}>
              <strong>{s.titulo_exercicio}</strong> —{' '}
              {s.corrigido
                ? `Nota: ${s.nota ?? '—'} | Feedback: ${s.feedback ?? 'sem comentário'}`
                : 'Aguarda correção'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PainelAluno;