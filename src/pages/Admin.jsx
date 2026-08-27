import React, { useEffect, useState } from 'react';
import "./Admin.css";
const API_URL = '/api/alunos';

const NIVEIS_CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const CAMPOS_VAZIOS = {
  nome: '',
  email: '',
  nivel_cefr: '',
  telefone: '',
};

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Admin() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState(CAMPOS_VAZIOS);
  const [editandoId, setEditandoId] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    buscarAlunos();
  }, []);

  async function buscarAlunos() {
    setCarregando(true);
    setErro('');
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Falha ao carregar alunos');
      const data = await res.json();
      setAlunos(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function iniciarEdicao(aluno) {
    setEditandoId(aluno.id);
    setForm({
      nome: aluno.nome || '',
      email: aluno.email || '',
      nivel_cefr: aluno.nivel_cefr || '',
      telefone: aluno.telefone || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(CAMPOS_VAZIOS);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) {
      setErro('Nome e email são obrigatórios');
      return;
    }

    setEnviando(true);
    setErro('');
    try {
      const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
      const method = editandoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.erro || 'Erro ao guardar aluno');
      }

      await buscarAlunos();
      cancelarEdicao();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function apagarAluno(id) {
    if (!window.confirm('Tens a certeza que queres apagar este aluno?')) return;

    setErro('');
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Erro ao apagar aluno');
      setAlunos((prev) => prev.filter((a) => a.id !== id));
      if (editandoId === id) cancelarEdicao();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function definirPassword(id) {
    const password = window.prompt('Nova password para este aluno:');
    if (!password) return;

    setErro('');
    try {
      const res = await fetch(`${API_URL}/${id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('Erro ao definir password');
      alert('Password definida com sucesso!');
    } catch (err) {
      setErro(err.message);
    }
  }

  const alunosFiltrados = alunos.filter((a) => {
    const termo = busca.toLowerCase();
    return (
      a.nome?.toLowerCase().includes(termo) ||
      a.email?.toLowerCase().includes(termo) ||
      a.nivel_cefr?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="admin-page">
      <h1>Painel de Administração — Alunos</h1>

      {erro && <div className="admin-erro">{erro}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editandoId ? 'Editar aluno' : 'Adicionar novo aluno'}</h2>

        <div className="admin-form-grid">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <select
            name="nivel_cefr"
            value={form.nivel_cefr}
            onChange={handleChange}
          >
            <option value="">Nível CEFR</option>
            {NIVEIS_CEFR.map((nivel) => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
          <input
            type="tel"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form-botoes">
          <button type="submit" disabled={enviando}>
            {enviando ? 'A guardar...' : editandoId ? 'Guardar alterações' : 'Adicionar aluno'}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} className="btn-cancelar">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="admin-lista-header">
        <h2>Alunos ({alunos.length})</h2>
        <input
          type="text"
          placeholder="Pesquisar por nome, email ou nível..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="admin-busca"
        />
      </div>

      {carregando ? (
        <p>A carregar alunos...</p>
      ) : alunosFiltrados.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <table className="admin-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Nível</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.nivel_cefr}</td>
                <td>{aluno.telefone}</td>
                <td className="admin-acoes">
                  <button onClick={() => iniciarEdicao(aluno)}>Editar</button>
                  <button onClick={() => definirPassword(aluno.id)}>Definir password</button>
                  <button onClick={() => apagarAluno(aluno.id)} className="btn-apagar">
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}