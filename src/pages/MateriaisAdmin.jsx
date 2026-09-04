import { useEffect, useState } from 'react';

const FORM_VAZIO = {
  titulo: '',
  descricao: '',
  link_pdf: '',
  link_video: '',
  nivel: '',
};

function MateriaisAdmin() {
  const [materiais, setMateriais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');

  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);

  const carregar = async () => {
    setErro(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setErro('Não tens sessão de admin ativa. Faz login novamente.');
      setMateriais([]);
      setCarregando(false);
      return;
    }

    try {
      const res = await fetch('/api/materiais', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          setErro('Sessão expirada. Faz login novamente.');
        } else {
          setErro(`Erro ao carregar materiais (status ${res.status}).`);
        }
        setMateriais([]);
        return;
      }

      const dados = await res.json();
      setMateriais(Array.isArray(dados) ? dados : []);
    } catch (e) {
      console.error('Erro ao carregar materiais:', e);
      setErro('Erro de rede ao carregar materiais.');
      setMateriais([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleChange = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  const iniciarEdicao = (material) => {
    setEditandoId(material.id);
    setForm({
      titulo: material.titulo || '',
      descricao: material.descricao || '',
      link_pdf: material.link_pdf || '',
      link_video: material.link_video || '',
      nivel: material.nivel || '',
    });
    setSucesso('');
    setErro(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErro(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso('');

    if (!form.titulo.trim()) {
      setErro('O título é obrigatório.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Não tens sessão de admin ativa. Faz login novamente.');
      return;
    }

    setEnviando(true);

    const aEditar = editandoId !== null;
    const url = aEditar ? `/api/materiais/${editandoId}` : '/api/materiais';
    const method = aEditar ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const dados = await res.json().catch(() => ({}));
        setErro(dados.erro || `Erro ao ${aEditar ? 'editar' : 'adicionar'} material (status ${res.status}).`);
        return;
      }

      setSucesso(aEditar ? 'Material atualizado com sucesso!' : 'Material adicionado com sucesso!');
      setForm(FORM_VAZIO);
      setEditandoId(null);
      await carregar();
    } catch (e) {
      console.error('Erro ao guardar material:', e);
      setErro('Erro de rede ao guardar material.');
    } finally {
      setEnviando(false);
    }
  };

  const remover = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Não tens sessão de admin ativa. Faz login novamente.');
      return;
    }

    if (!window.confirm('Tens a certeza que queres remover este material?')) return;

    try {
      const res = await fetch(`/api/materiais/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setErro(`Erro ao remover material (status ${res.status}).`);
        return;
      }

      if (editandoId === id) {
        cancelarEdicao();
      }

      await carregar();
    } catch (e) {
      console.error('Erro ao remover material:', e);
      setErro('Erro de rede ao remover material.');
    }
  };

  const aEditar = editandoId !== null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem' }}>
      <h2>Gerir Materiais</h2>

      <form onSubmit={handleSubmit} style={{ border: aEditar ? '2px solid #2563eb' : '1px solid #ccc', borderRadius: 8, padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>{aEditar ? `A editar: ${form.titulo || '...'}` : 'Adicionar novo material'}</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label>Título *</label><br />
          <input
            type="text"
            value={form.titulo}
            onChange={handleChange('titulo')}
            placeholder="Ex: Verb to Be - PDF (A1)"
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Descrição</label><br />
          <textarea
            value={form.descricao}
            onChange={handleChange('descricao')}
            placeholder="Ex: Resumo e exercícios"
            rows={3}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Link do PDF</label><br />
          <input
            type="url"
            value={form.link_pdf}
            onChange={handleChange('link_pdf')}
            placeholder="https://..."
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Link do vídeo/áudio</label><br />
          <input
            type="url"
            value={form.link_video}
            onChange={handleChange('link_video')}
            placeholder="https://..."
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Nível</label><br />
          <select
            value={form.nivel}
            onChange={handleChange('nivel')}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">-- Seleciona --</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
        </div>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" disabled={enviando}>
            {enviando ? 'A guardar...' : aEditar ? 'Guardar alterações' : 'Adicionar material'}
          </button>
          {aEditar && (
            <button type="button" onClick={cancelarEdicao} disabled={enviando}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <h3>Materiais existentes</h3>

      {carregando ? (
        <p>A carregar materiais...</p>
      ) : materiais.length === 0 ? (
        <p>Nenhum material encontrado.</p>
      ) : (
        materiais.map((m) => (
          <div
            key={m.id}
            style={{
              border: editandoId === m.id ? '2px solid #2563eb' : '1px solid #ddd',
              borderRadius: 6,
              padding: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            <p><strong>{m.titulo}</strong> {m.nivel && `(${m.nivel})`}</p>
            {m.descricao && <p style={{ color: '#555' }}>{m.descricao}</p>}
            {m.link_pdf && (
              <p><a href={m.link_pdf} target="_blank" rel="noopener noreferrer">Abrir PDF</a></p>
            )}
            {m.link_video && (
              <p><a href={m.link_video} target="_blank" rel="noopener noreferrer">Abrir vídeo/áudio</a></p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => iniciarEdicao(m)}>
                Editar
              </button>
              <button onClick={() => remover(m.id)} style={{ color: 'red' }}>
                Remover
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MateriaisAdmin;