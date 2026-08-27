import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginAluno() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {

    
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('/api/aluno/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || 'Erro ao entrar');
        return;
      }

      localStorage.setItem('tokenAluno', data.token);
      localStorage.setItem('aluno', JSON.stringify(data.aluno));
      navigate('/aluno/painel');
    } catch (err) {
      setErro('Erro de ligação ao servidor');
    }
  }

  return (
    <div className="login-container">
      <h1>Área do Aluno</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {erro && <p className="login-erro">{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginAluno;