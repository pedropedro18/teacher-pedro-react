import { useState } from "react";

const URL_PAINEL = "https://aulas-matriculas-3.onrender.com/admin";

export default function PainelMatriculas() {
  const [chave, setChave] = useState("");
  const [aberto, setAberto] = useState(false);

  if (!aberto) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Painel de matrículas</h2>
        <input
          type="password"
          placeholder="Chave do painel"
          value={chave}
          onChange={(e) => setChave(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <button onClick={() => setAberto(true)}>Abrir</button>
      </div>
    );
  }

  return (
    <iframe
      title="Painel de matrículas"
      src={`${URL_PAINEL}?chave=${encodeURIComponent(chave)}`}
      style={{ width: "100%", height: "90vh", border: 0 }}
    />
  );
}