import { useState } from "react";

const NIVEIS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const FOCOS = {
  A1: ["Greetings and introductions", "Numbers and colours", "Family members", "Daily routine", "Food and drinks"],
  A2: ["Past simple", "Shopping and prices", "Directions in town", "Future plans", "Describing people"],
  B1: ["Present perfect", "Travel and holidays", "First conditional", "Health and lifestyle", "Work and jobs"],
  B2: ["Second and third conditionals", "Passive voice", "Reported speech", "Media and technology", "Environment"],
  C1: ["Inversion for emphasis", "Mixed conditionals", "Debating abstract topics", "Academic writing", "Idioms and collocations"],
  C2: ["Nuance and register", "Advanced discourse markers", "Rhetoric and persuasion", "Literary texts", "Summarising complex arguments"],
};

const ETAPAS = [
  { nome: "Warm-up", pct: 0.1, obj: "Activar conhecimento prévio e criar ambiente de fala.",
    ativ: (t) => `Pergunte aos alunos o que já sabem sobre "${t}". Use 2-3 perguntas rápidas em pares. `},
  { nome: "Presentation", pct: 0.25, obj: "Apresentar a língua-alvo em contexto.",
    ativ: (t) => `Apresente "${t}" com exemplos no quadro e um texto ou diálogo curto. Peça aos alunos que sublinhem a língua-alvo. `},
  { nome: "Controlled practice", pct: 0.25, obj: "Praticar a forma com apoio do professor.",
    ativ: (t) => `Exercícios de completar, ordenar e corrigir frases sobre "${t}". Correcção colectiva no quadro. `},
  { nome: "Free practice", pct: 0.25, obj: "Usar a língua com mais autonomia.",
    ativ: (t) => `Actividade em pares ou grupos (role-play, entrevista ou jogo) usando "${t}". O professor circula e anota erros. `},
  { nome: "Wrap-up", pct: 0.15, obj: "Consolidar e verificar a aprendizagem.",
    ativ: (t) => `Feedback sobre os erros anotados. Cada aluno escreve uma frase nova com "${t}" (exit ticket). `},
];

const TPC = (t, nivel) =>
  `Escrever ${["A1", "A2"].includes(nivel) ? "5 frases" : "um parágrafo de 80-120 palavras"} usando "${t}".`;

export default function GeradorAulas() {
  const [nivel, setNivel] = useState("A1");
  const [tema, setTema] = useState("");
  const [duracao, setDuracao] = useState(60);
  const [alunos, setAlunos] = useState(10);
  const [aula, setAula] = useState(null);

  const gerar = () => {
    const t = tema.trim() || FOCOS[nivel][0];
    const etapas = ETAPAS.map((e) => ({
      nome: e.nome,
      min: Math.max(3, Math.round(duracao * e.pct)),
      obj: e.obj,
      ativ: e.ativ(t),
    }));
    setAula({
      nivel,
      tema: t,
      duracao,
      alunos,
      etapas,
      objetivo: `No final da aula, os alunos (${nivel}) conseguem usar "${t}" em frases e em conversa curta.`,
      materiais: "Quadro, marcadores, folha de trabalho impressa, cartões de palavras.",
      tpc: TPC(t, nivel),
    });
  };

  const campo = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    fontSize: 16,
    width: "100%",
    boxSizing: "border-box",
  };

  const botao = {
    background: "#f9c93a",
    color: "#222",
    fontWeight: 700,
    padding: "12px 20px",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 16, color: "#fff" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #plano, #plano * { visibility: visible; }
          #plano { position: absolute; left: 0; top: 0; width: 100%; color: #000 !important; background: #fff !important; }
        }
      `}</style>

      <h1>Gerador de aulas</h1>
      <p>Cria planos de aula de inglês (A1–C2) em PDF, com notas para o professor.</p>

      <div style={{ display: "grid", gap: 12, background: "rgba(255,255,255,.12)", padding: 16, borderRadius: 14 }}>
        <label>
          Nível
          <select
            style={campo}
            value={nivel}
            onChange={(e) => {
              setNivel(e.target.value);
              setTema("");
            }}
          >
            {NIVEIS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>

        <label>
          Tema
          <input
            style={campo}
            list="focos"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder={FOCOS[nivel][0]}
          />
          <datalist id="focos">
            {FOCOS[nivel].map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </label>

        <label>
          Duração (minutos)
          <select style={campo} value={duracao} onChange={(e) => setDuracao(Number(e.target.value))}>
            {[30, 45, 60, 90, 120].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label>
          Número de alunos
          <input
            style={campo}
            type="number"
            min="1"
            max="60"
            value={alunos}
            onChange={(e) => setAlunos(Number(e.target.value))}
          />
        </label>

        <button onClick={gerar} style={botao}>
          Gerar aula
        </button>
      </div>

      {aula && (
        <>
          <div id="plano" style={{ background: "#fff", color: "#111", marginTop: 20, padding: 20, borderRadius: 14 }}>
            <h2 style={{ marginTop: 0 }}>Plano de aula: {aula.tema}</h2>
            <p>
              <b>Nível:</b> {aula.nivel} | <b>Duração:</b> {aula.duracao} min | <b>Alunos:</b> {aula.alunos}
            </p>
            <p>
              <b>Objectivo:</b> {aula.objetivo}
            </p>
            <p>
              <b>Materiais:</b> {aula.materiais}
            </p>
            {aula.etapas.map((e, i) => (
              <div key={e.nome} style={{ borderLeft: "4px solid #1e4f9c", paddingLeft: 12, margin: "14px 0" }}>
                <b>
                  {i + 1}. {e.nome} ({e.min} min)
                </b>
                <div>
                  <i>{e.obj}</i>
                </div>
                <div>{e.ativ}</div>
              </div>
            ))}
            <p>
              <b>Trabalho de casa:</b> {aula.tpc}
            </p>
          </div>

          <button onClick={() => window.print()} style={{ ...botao, marginTop: 12 }}>
            Descarregar PDF
          </button>
        </>
      )}
    </div>
  );
}