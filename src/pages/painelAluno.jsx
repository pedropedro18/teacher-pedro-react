import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { conteudosPorNivel } from '../data/conteudos';

function PainelAluno() {
  const [aluno, setAluno] = useState(null);
  const [aberto, setAberto] = useState(null);
  const [tituloExercicio, setTituloExercicio] = useState('');
  const [resposta, setResposta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
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

  const handleEnviarResposta = async (e) => {
    e.preventDefault();
    if (!tituloExercicio || !resposta) return;

    setEnviando(true);
    setMensagem('');
    const token = localStorage.getItem('tokenAluno');

    try {
      const res = await fetch('/api/submissoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nivel, titulo_exercicio: tituloExercicio, resposta })
      });
      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.erro || 'Erro ao enviar resposta');
      } else {
        setMensagem('Resposta enviada com sucesso!');
        setTituloExercicio('');
        setResposta('');
        carregarSubmissoes();
      }
    } catch (err) {
      setMensagem('Erro no servidor ao enviar resposta');
    } finally {
      setEnviando(false);
    }
  };

  if (!aluno) return <p>A carregar...</p>;

  const nivel = aluno.nivel_cefr || 'A1';
  const conteudos = conteudosPorNivel[nivel] || [];

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

      <h2>Enviar resposta de exercício</h2>
      <form onSubmit={handleEnviarResposta} className="form-submissao">
        <input
          type="text"
          placeholder="Título do exercício"
          value={tituloExercicio}
          onChange={(e) => setTituloExercicio(e.target.value)}
        />
        <textarea
          placeholder="A tua resposta"
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
        />
        <button type="submit" disabled={enviando}>
          {enviando ? 'A enviar...' : 'Enviar resposta'}
        </button>
        {mensagem && <p>{mensagem}</p>}
      </form>

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