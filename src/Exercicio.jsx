import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { exercicios } from './utils/exercicio';

function Exercicio() {
  const { topicoId } = useParams();
  const lista = exercicios[topicoId] || [];
  const [respostas, setRespostas] = useState({});
  const [corrigido, setCorrigido] = useState(false);

  const handleChange = (index, valor) => {
    setRespostas({ ...respostas, [index]: valor });
  };

  const normalizar = (texto) => texto.trim().toLowerCase();

  const acertos = lista.filter(
    (item, index) => normalizar(respostas[index] || '') === normalizar(item.resposta)
  ).length;

  const corrigir = async () => {
    setCorrigido(true);

    const token = localStorage.getItem('tokenAluno');
    if (!token) return;

    try {
      await fetch('/api/aluno/resultado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topico: topicoId,
          acertos,
          total: lista.length,
        }),
      });
    } catch (erro) {
      console.error('Erro ao guardar resultado:', erro);
    }
  };

  if (lista.length === 0) {
    return <p>Exercício não encontrado.</p>;
  }

  return (
    <div>
      <h2>Exercícios: {topicoId}</h2>

      {lista.map((item, index) => {
        const respostaAluno = respostas[index] || '';
        const estaCorreto = normalizar(respostaAluno) === normalizar(item.resposta);

        return (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <p>{item.pergunta}</p>
            <input
              type="text"
              value={respostaAluno}
              onChange={(e) => handleChange(index, e.target.value)}
              style={{
                borderColor: corrigido ? (estaCorreto ? 'green' : 'red') : undefined,
              }}
            />
            {corrigido && (
              <span style={{ marginLeft: '0.5rem', color: estaCorreto ? 'green' : 'red' }}>
                {estaCorreto ? '✔️ Correto' : `✘ Errado (resposta: ${item.resposta})`}
              </span>
            )}
          </div>
        );
      })}

      <button onClick={corrigir}>Corrigir</button>

      {corrigido && (
        <p>
          Acertaste {acertos} de {lista.length} perguntas.
        </p>
      )}
    </div>
  );
}

export default Exercicio;