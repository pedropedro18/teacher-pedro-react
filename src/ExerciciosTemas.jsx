import { useState } from "react";

const TEMAS = {
  "Comida": [
    { q: "Como se diz 'maçã'?", opcoes: ["Apple", "Bread", "Milk"], certa: "Apple" },
    { q: "Como se diz 'pão'?", opcoes: ["Cheese", "Bread", "Rice"], certa: "Bread" },
  ],
  "Família": [
    { q: "Como se diz 'avó'?", opcoes: ["Aunt", "Mother", "Grandmother"], certa: "Grandmother" },
    { q: "Como se diz 'irmão'?", opcoes: ["Brother", "Uncle", "Son"], certa: "Brother" },
  ],
  "Viagens": [
    { q: "Como se diz 'aeroporto'?", opcoes: ["Station", "Airport", "Harbor"], certa: "Airport" },
  ],
};

export default function ExerciciosTemas() {
  const [tema, setTema] = useState(null);
  const [i, setI] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [resp, setResp] = useState(null);

  const escolher = (t) => { setTema(t); setI(0); setPontos(0); setResp(null); };

  if (!tema) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Exercícios por tema</h2>
        {Object.keys(TEMAS).map((t) => (
          <button key={t} onClick={() => escolher(t)} style={{ display: "block", margin: "8px 0" }}>{t}</button>
        ))}
      </div>
    );
  }

  const lista = TEMAS[tema];
  if (i >= lista.length) {
    return (
      <div style={{ padding: 20 }}>
        <h2>{tema}: {pontos}/{lista.length}</h2>
        <button onClick={() => setTema(null)}>Escolher outro tema</button>
      </div>
    );
  }

  const p = lista[i];
  const responder = (o) => {
    if (resp) return;
    setResp(o);
    if (o === p.certa) setPontos(pontos + 1);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>{tema} ({i + 1}/{lista.length})</h3>
      <p>{p.q}</p>
      {p.opcoes.map((o) => (
        <button key={o} onClick={() => responder(o)} style={{
          display: "block", margin: "6px 0",
          background: resp ? (o === p.certa ? "#8f8" : o === resp ? "#f88" : "") : ""
        }}>{o}</button>
      ))}
      {resp && <button onClick={() => { setI(i + 1); setResp(null); }}>Seguinte</button>}
    </div>
  );
}