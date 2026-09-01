import { Navigate } from 'react-router-dom';

function RotaProtegidaAluno({ children }) {
  const token = localStorage.getItem('tokenAluno');

  if (!token) {
    return <Navigate to="/login-aluno" replace />;
  }

  return children;
}

export default RotaProtegidaAluno;