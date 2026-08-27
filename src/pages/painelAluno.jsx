import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PainelAluno() {
  const [aluno, setAluno] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem('tokenAluno');
  if (!token) {
    navigate('/login-aluno');
    return;
  }

  fetch('/api/alunos/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Token inválido');
      return res.json();
    })
    .then(data => setAluno(data))
    .catch(() => {
      localStorage.removeItem('tokenAluno');
      localStorage.removeItem('aluno');
      navigate('/login-aluno');
    });
}, [navigate]);

  function handleLogout() {
    localStorage.removeItem('tokenAluno');
    localStorage.removeItem('aluno');
    navigate('/login-aluno');
  }

  if (!aluno) return null;

  return (
    <div className="painel-aluno">
      <h1>Bem-vindo, {aluno.nome}!</h1>
      <p>Email: {aluno.email}</p>
      <p>Nível CEFR: {aluno.nivel_cefr}</p>

      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default PainelAluno;