export default function Depoimentos() {
  const depoimentos = [
    { nome: "Aluno A1", texto: "Comecei do zero e hoje já consigo manter uma conversa simples em inglês." },
    { nome: "Aluno B2", texto: "As aulas ajudaram-me a preparar para uma entrevista de emprego internacional." },
    { nome: "Aluno Excel", texto: "Aprendi Excel do zero e hoje uso no meu trabalho diariamente." },
  ];

  return (
    <section className="depoimentos">
      <h2>O que dizem os alunos</h2>
      <div className="depoimentos-grid">
        {depoimentos.map((d, i) => (
          <div className="depoimento-card" key={i}>
            <p>"{d.texto}"</p>
            <span>- {d.nome}</span>
          </div>
        ))}
      </div>
    </section>
  );
}