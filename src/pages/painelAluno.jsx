import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function PainelAluno() {
  const [resultados, setResultados] = useState([]);
  useEffect(() => {
    const carregarResultados = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDocs(collection(db, 'alunos', user.uid, 'resultados'));
      const dados = snap.docs.map((doc) => doc.data());
      setResultados(dados);
    };
    carregarResultados();
  }, []);
  return (
    <div>
      <h2>O teu progresso</h2>
      {resultados.length === 0 ? (
        <p>Ainda não fizeste nenhum exercício.</p>
      ) : (
        <ul>
          {resultados.map((r, i) => (
            <li key={i}>
              {r.topico}: {r.acertos}/{r.total} acertos
              <Link to="/aluno/exercicio/verbo-to-be">Verbo To Be</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PainelAluno;