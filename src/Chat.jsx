import { useState, useRef, useEffect } from "react";
import "./Chat.css";

// Troca pelo teu número, com indicativo e sem + (ex.: 244923000000)
const WHATSAPP = "244923030010";

const SUGESTOES = ["Quais são os preços?", "Que níveis existem?", "Como me inscrevo?"];

const ERRO =
  "Não consegui responder agora. Fala diretamente com o professor no WhatsApp.";

const SAUDACAO = {
  de: "bot",
  texto: "Olá! Em que posso ajudar? Pergunta sobre cursos, níveis, preços ou inscrições.",
};

export default function Chat() {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [aEscrever, setAEscrever] = useState(false);
  const [mensagens, setMensagens] = useState([SAUDACAO]);
  const fimRef = useRef(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, aberto, aEscrever]);

  async function enviar(msg) {
    const limpo = msg.trim();
    if (!limpo || aEscrever) return;

    const novas = [...mensagens, { de: "user", texto: limpo }];
    setMensagens(novas);
    setTexto("");
    setAEscrever(true);

    // Formato da API, sem a saudação inicial
    const historico = novas
      .slice(1)
      .slice(-10)
      .map((m) => ({
        role: m.de === "user" ? "user" : "assistant",
        content: m.texto,
      }));

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: historico }),
      });
      if (!r.ok) throw new Error("falhou: " + r.status);
      const dados = await r.json();
      setMensagens((m) => [...m, { de: "bot", texto: dados.texto || ERRO }]);
    } catch (e) {
      console.error(e);
      setMensagens((m) => [...m, { de: "bot", texto: ERRO }]);
    } finally {
      setAEscrever(false);
    }
  }

  const linkWhats = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "Olá, Teacher Pedro! Quero saber mais sobre os cursos."
  )}`;

  return (
    <>
      <button
        className="chat-botao"
        onClick={() => setAberto(!aberto)}
        aria-label={aberto ? "Fechar chat" : "Abrir chat"}
      >
        {aberto ? "✕" : "💬"}
      </button>

      {aberto && (
        <div className="chat-janela" role="dialog" aria-label="Chat Teacher Pedro">
          <div className="chat-topo">Teacher Pedro</div>

          <div className="chat-mensagens">
            {mensagens.map((m, i) => (
              <div key={i} className={`chat-msg ${m.de}`}>
                {m.texto}
              </div>
            ))}
            {aEscrever && <div className="chat-msg bot">A escrever...</div>}
            <div ref={fimRef} />
          </div>

          <div className="chat-sugestoes">
            {SUGESTOES.map((s) => (
              <button key={s} onClick={() => enviar(s)}>
                {s}
              </button>
            ))}
          </div>

          <a className="chat-whats" href={linkWhats} target="_blank" rel="noreferrer">
            Falar no WhatsApp
          </a>

          <div className="chat-entrada">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviar(texto)}
              placeholder="Escreve a tua pergunta..."
              maxLength={300}
            />
            <button onClick={() => enviar(texto)} disabled={aEscrever}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}