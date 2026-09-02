import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { exercicios } from './utils/exercicio';

function Exercicio() {
  const { topicoId } = useParams();
  const navigate = useNavigate();
  const lista = exercicios[topicoId] || [];
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (index, valor) => {
    setRespostas({ ...respostas, [index]: valor });
  };

  const enviar = async () => {
    const token = localStorage.getItem('tokenAluno');
    if (!token) return;

    const respostaTexto = lista
      .map((item, index) => `${item.pergunta}\nResposta: ${respostas[index] || '(em branco)'}`)
      .join('\n\n');

    try {
      const res = await fetch('/api/submissoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nivel: topicoId,
          titulo_exercicio: topicoId,
          resposta: respostaTexto,
        }),
      });

      if (!res.ok) throw new Error('Falha ao enviar');

      setEnviado(true);
    } catch (e) {
      setErro('Erro ao enviar a resposta. Tenta novamente.');
    }
  };

  if (lista.length === 0) {
    return <p>Exercício não encontrado.</p>;
  }

  if (enviado) {
    return (
      <div>
        <h2>Resposta enviada!</h2>
        <p>O professor vai corrigir e dar-te feedback em breve.</p>
        <button onClick={() => navigate('/aluno/painel')}>Voltar ao painel</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Exercícios: {topicoId}</h2>

      {lista.map((item, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <p>{item.pergunta}</p>
          <input
            type="text"
            value={respostas[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button onClick={enviar}>Enviar respostas</button>
    </div>
  );
}

export default Exercicio;