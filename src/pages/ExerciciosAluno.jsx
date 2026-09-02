import { Link } from 'react-router-dom';
import { exercicios } from '../utils/exercicio';

export default function ExerciciosAluno() {
  const topicos = Object.keys(exercicios);

  return (
    <div>
      <h2>Exercícios disponíveis</h2>
      {topicos.length === 0 ? (
        <p>Ainda não há exercícios disponíveis.</p>
      ) : (
        <ul>
          {topicos.map((topico) => (
            <li key={topico}>
              <Link to={`/aluno/exercicio/${topico}`}>{topico}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}