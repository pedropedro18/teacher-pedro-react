import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, getDocs, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "./firebase";

const NIVEIS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const VAZIO = { aluno: "", nivel: "A1", tema: "", quando: "", link: "" };

const formatar = (d) =>
  d.toLocaleString("pt-PT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Professor() {
  const auth = getAuth();
  const [utilizador, setUtilizador] = useState(null);
  const [pronto, setPronto] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [form, setForm] = useState(VAZIO);
  const [aulas, setAulas] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUtilizador(u && u.email ? u : null);
      setPronto(true);
    });
  }, [auth]);

  const carregar = async () => {
    try {
      const snap = await getDocs(collection(db, "aulas"));
      const limite = Date.now() - 24 * 3600 * 1000;
      setAulas(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data(), data: d.data().data.toDate() }))
          .filter((a) => a.data.getTime() > limite)
          .sort((a, b) => a.data - b.data)
      );
    } catch (e) {
      console.error(e);
      setMsg("Erro ao carregar: " + (e.code || e.message));
    }
  };

  useEffect(() => {
    if (utilizador) carregar();
  }, [utilizador]);

  const entrar = async () => {
    setMsg("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      setMsg("Não foi possível entrar: " + (e.code || e.message));
    }
  };

  const guardar = async () => {
    setMsg("");
    if (!form.aluno.trim() || !form.tema.trim() || !form.quando) {
      setMsg("Preenche aluno, tema e data/hora.");
      return;
    }
    try {
      await addDoc(collection(db, "aulas"), {
        aluno: form.aluno.trim().toLowerCase(),
        nivel: form.nivel,
        tema: form.tema.trim(),
        link: form.link.trim(),
        data: Timestamp.fromDate(new Date(form.quando)),
      });
      setForm(VAZIO);
      setMsg("Aula marcada!");
      carregar();
    } catch (e) {
      setMsg("Erro ao guardar: " + (e.code || e.message));
    }
  };

  const apagar = async (id) => {
    if (!window.confirm("Cancelar esta aula?")) return;
    try {
      await deleteDoc(doc(db, "aulas", id));
      carregar();
    } catch (e) {
      setMsg("Erro ao apagar: " + (e.code || e.message));
    }
  };

  const campo = { display: "block", marginBottom: 8, padding: 6, width: "100%", maxWidth: 360 };

  if (!pronto) return <div style={{ padding: 20 }}>A carregar...</div>;

  if (!utilizador) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Área do professor</h2>
        <input style={campo} type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input style={campo} type="password" placeholder="Palavra-passe" value={senha}
          onChange={(e) => setSenha(e.target.value)} />
        <button onClick={entrar}>Entrar</button>
        {msg && <p style={{ color: "red" }}>{msg}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Agenda de aulas</h2>
      <button onClick={() => signOut(auth)}>Sair</button>

      <h3>Marcar aula</h3>
      <input style={campo} placeholder="Aluno (ex.: ana)" value={form.aluno}
        onChange={(e) => setForm({ ...form, aluno: e.target.value })} />
      <select style={campo} value={form.nivel}
        onChange={(e) => setForm({ ...form, nivel: e.target.value })}>
        {NIVEIS.map((n) => <option key={n}>{n}</option>)}
      </select>
      <input style={campo} placeholder="Tema da aula" value={form.tema}
        onChange={(e) => setForm({ ...form, tema: e.target.value })} />
      <input style={campo} type="datetime-local" value={form.quando}
        onChange={(e) => setForm({ ...form, quando: e.target.value })} />
      <input style={campo} placeholder="Link da aula (opcional)" value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })} />
      <button onClick={guardar}>Guardar aula</button>
      {msg && <p>{msg}</p>}

      <h3>Próximas aulas</h3>
      {aulas.length === 0 && <p>Nenhuma aula marcada.</p>}
      {aulas.map((a) => (
        <div key={a.id} style={{ marginBottom: 8 }}>
          {formatar(a.data)} · {a.aluno} ({a.nivel}) · {a.tema}{" "}
          <button onClick={() => apagar(a.id)}>Cancelar</button>
        </div>
      ))}
    </div>
  );
}