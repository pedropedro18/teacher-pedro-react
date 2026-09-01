import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { exercicios } from './utils/exercicio.js';

export default function Exercicio() {
  const { topicoId } = useParams();
  const navigate = useNavigate();
  const perguntas = exercicios[topicoId] || [];

  const [respostas, setRespostas] = useState(Array(perguntas.length).fill(''));
  const [enviado, setEnviado] = useState(false);

  const handleChange = (i, valor) => {
    const novas = [...respostas];
    novas[i] = valor;
    setRespostas(novas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('tokenAluno');

    await fetch('/api/submissoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topicoId, respostas }),
    });

    setEnviado(true);
  };

  if (!perguntas.length) return <p>Exercício não encontrado.</p>;

  return (
    <div
      className="exercicio-container"
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <h2>Exercício: {topicoId.replace(/-/g, ' ')}</h2>

      {enviado ? (
        <p>Resposta enviada! Vais receber a nota e feedback no teu painel.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {perguntas.map((p, i) => (
            <div key={i} className="exercicio-pergunta">
              <label>{p.pergunta}</label>
              <input
                type="text"
                value={respostas[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="submit" className="btn-primary">Enviar respostas</button>
        </form>
      )}

      <button onClick={() => navigate('/aluno/painel')} className="btn-secondary">
        Voltar ao painel
      </button>
    </div>
  );
}