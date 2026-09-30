import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, garantirLogin } from "./firebase";

const AULAS = {
  A1: [{ titulo: "Aula 1", texto: "My name is Ana. I live in Lisbon.", audio: "/audio/a1-aula1.mp3" }],
  A2: [],
};

const ouvir = (texto) => {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "en-GB";
  speechSynthesis.speak(u);
};

export default function Aluno() {
  const [chave, setChave] = useState("");
  const [aluno, setAluno] = useState(null);
  const [erro, setErro] = useState("");

  const entrar = async () => {
    setErro("");
    try {
      await garantirLogin();
      const snap = await getDoc(doc(db, "chaves", chave.trim()));
      if (!snap.exists()) {
        setErro("Chave inválida ou expirada.");
        return;
      }
      setAluno(snap.data());
    } catch (e) {
      console.error(e);
      setErro("Erro ao entrar: " + (e.code || e.message));
    }
  };

  if (!aluno) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Área do aluno</h2>
        <input value={chave} onChange={(e) => setChave(e.target.value)} placeholder="Chave de acesso" />
        <button onClick={entrar}>Entrar</button>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Olá, {aluno.aluno}!</h2>
      {(aluno.niveis || []).map((n) => (
        <section key={n}>
          <h3>Nível {n}</h3>
          {(AULAS[n] || []).map((a) => (
            <div key={a.titulo}>
              <h4>{a.titulo}</h4>
              <p>{a.texto}</p>
              <button onClick={() => ouvir(a.texto)}>🔊 Ouvir leitura</button>
              {a.audio && <audio controls src={a.audio} style={{ display: "block", marginTop: 8 }} />}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}