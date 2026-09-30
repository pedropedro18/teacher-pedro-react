import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, garantirLogin } from "./firebase";

const ORDEM = ["A1", "A2", "B1", "B2", "C1", "C2"];

const AULAS = {
  A1: [
    { titulo: "Aula 1 - Apresentação", texto: "My name is Ana. I live in Lisbon.", audio: "/audio/a1-aula1.mp3" },
    { titulo: "Aula 2 - Família", texto: "I have a brother. He is ten years old." },
    { titulo: "Aula 3 - Cores e objetos", texto: "This is a red book. That is a blue pen." },
    { titulo: "Aula 4 - Rotina diária", texto: "I wake up at seven. I eat breakfast and go to school." },
    { titulo: "Aula 5 - Comida", texto: "I like rice and chicken. I do not like fish." },
  ],
  A2: [
    { titulo: "Aula 1 - Passado simples", texto: "Yesterday I went to the market and bought some fruit." },
    { titulo: "Aula 2 - Planos futuros", texto: "I am going to visit my grandmother next weekend." },
    { titulo: "Aula 3 - Comparações", texto: "My house is bigger than yours, but your garden is more beautiful." },
    { titulo: "Aula 4 - Direções", texto: "Turn left at the bank, then walk straight for two minutes." },
    { titulo: "Aula 5 - Compras", texto: "How much is this shirt? Can I try it on, please?" },
  ],
  B1: [
    { titulo: "Aula 1 - Present perfect continuous", texto: "I have been learning English for two years, and I think I am improving." },
    { titulo: "Aula 2 - Primeira condicional", texto: "If it rains tomorrow, we will stay at home." },
    { titulo: "Aula 3 - Segunda condicional", texto: "If I had more free time, I would travel around the world." },
    { titulo: "Aula 4 - Voz passiva", texto: "The bridge was built in 1998 and is visited by thousands of people every year." },
    { titulo: "Aula 5 - Discurso indireto", texto: "She said that she was tired and wanted to go home early." },
  ],
  B2: [
    { titulo: "Aula 1 - Contraste", texto: "Although the exam was difficult, I managed to finish it on time." },
    { titulo: "Aula 2 - Past perfect", texto: "By the time she arrived, we had already left." },
    { titulo: "Aula 3 - Terceira condicional", texto: "If I had studied harder, I would have passed the test." },
    { titulo: "Aula 4 - Phrasal verbs", texto: "We had to put off the meeting because the manager was held up in traffic." },
    { titulo: "Aula 5 - Opinião e argumento", texto: "In my view, remote work increases productivity, provided that clear goals are set." },
  ],
  C1: [
    { titulo: "Aula 1 - Condicional invertida", texto: "Had I known about the delay, I would have taken another route." },
    { titulo: "Aula 2 - Orações relativas", texto: "The project, which was long overdue, was finally approved." },
    { titulo: "Aula 3 - Estruturas causativas", texto: "She had her car repaired before the long journey." },
    { titulo: "Aula 4 - Expressões idiomáticas", texto: "It's a long shot, but it's worth a try; nothing ventured, nothing gained." },
    { titulo: "Aula 5 - Coesão textual", texto: "Nevertheless, the results, albeit preliminary, suggest a significant trend." },
  ],
  C2: [
    { titulo: "Aula 1 - Inversão enfática", texto: "Not only did she solve the problem, but she also anticipated its recurrence." },
    { titulo: "Aula 2 - Estilo formal", texto: "Seldom does one encounter such a nuanced argument." },
    { titulo: "Aula 3 - Subjuntivo", texto: "It is imperative that he be informed of the changes immediately." },
    { titulo: "Aula 4 - Nuances e ironia", texto: "One could hardly say the negotiations went smoothly, to put it mildly." },
    { titulo: "Aula 5 - Escrita académica", texto: "The findings, whilst compelling, warrant further scrutiny before any conclusions are drawn." },
  ],
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

  const niveis = ORDEM.filter((n) => (aluno.niveis || []).includes(n));

  return (
    <div style={{ padding: 20 }}>
      <h2>Olá, {aluno.aluno}!</h2>
      {niveis.length === 0 && <p>Ainda não tens níveis atribuídos.</p>}
      {niveis.map((n) => (
        <section key={n} style={{ marginBottom: 24 }}>
          <h3>Nível {n}</h3>
          {(AULAS[n] || []).map((a) => (
            <div key={a.titulo} style={{ marginBottom: 16 }}>
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