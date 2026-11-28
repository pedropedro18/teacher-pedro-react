import { useState, useEffect } from "react";

function useAgora() {
  const [agora, setAgora] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  return agora;
}

function BotaoAula({ aula }) {
  const agora = useAgora();
  const inicio = new Date(aula.data).getTime();
  const abre = inicio - 10 * 60 * 1000;   // 10 min antes
  const fecha = inicio + 90 * 60 * 1000;  // 90 min depois

  if (agora < abre) {
    return <span>Disponível 10 min antes da aula</span>;
  }
  if (agora > fecha) {
    return <span>Aula terminada</span>;
  }
  return (
    <a href={aula.link} target="_blank" rel="noreferrer">
      Entrar na aula
    </a>
  );
}

export default BotaoAula;