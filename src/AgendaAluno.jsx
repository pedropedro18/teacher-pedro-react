import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const DURACAO_MIN = 60;
const AVISO_MIN = 60;

const formatar = (d) =>
  d.toLocaleString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AgendaAluno({ nomeAluno }) {
  const [aulas, setAulas] = useState([]);
  const [agora, setAgora] = useState(Date.now());
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "aulas"), where("aluno", "==", nomeAluno.trim().toLowerCase()))
        );
        const lista = snap.docs
          .map((d) => ({ id: d.id, ...d.data(), data: d.data().data.toDate() }))
          .sort((a, b) => a.data - b.data);
        if (ativo) setAulas(lista);
      } catch (e) {
        console.error(e);
        if (ativo) setErro("Não foi possível carregar a agenda.");
      }
    })();
    const relogio = setInterval(() => setAgora(Date.now()), 30000);
    return () => {
      ativo = false;
      clearInterval(relogio);
    };
  }, [nomeAluno]);

  const proximas = aulas.filter((a) => a.data.getTime() + DURACAO_MIN * 60000 > agora);

  const aviso = (a) => {
    const falta = Math.ceil((a.data.getTime() - agora) / 60000);
    if (falta <= 0) return "🟢 Aula a decorrer";
    if (falta <= AVISO_MIN) return `🔔 Começa em ${falta} min`;
    return null;
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <h3>📅 As minhas aulas</h3>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {!erro && proximas.length === 0 && <p>Ainda não tens aulas marcadas.</p>}
      {proximas.map((a) => (
        <div
          key={a.id}
          style={{
            marginBottom: 10,
            padding: 12,
            borderRadius: 8,
            background: "rgba(255,255,255,0.1)",
            display: "block",
          }}
        >
          {aviso(a) && <p style={{ margin: "0 0 6px", fontWeight: "bold" }}>{aviso(a)}</p>}
          <div>
            <strong>{formatar(a.data)}</strong> · Nível {a.nivel}
          </div>
          <div>{a.tema}</div>
          {a.link && (
            <a href={a.link} target="_blank" rel="noreferrer">
              Entrar na aula
            </a>
          )}
        </div>
      ))}
    </section>
  );
}