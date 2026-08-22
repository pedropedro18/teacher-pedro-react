export default function Diferenciais() {
  const itens = [
    { titulo: "Metodologia Maple Bear", texto: "Formação certificada em ensino por inquérito e centros de aprendizagem." },
    { titulo: "Todos os níveis A1-C2", texto: "Aulas adaptadas ao seu nível, do iniciante ao avançado, com progresso claro." },
    { titulo: "Excel e Programação", texto: "Além de inglês, aprenda Excel e desenvolvimento web com quem já ensina há anos." },
    { titulo: "Aulas Individuais", texto: "Atenção personalizada, ritmo ajustado a si, sem turmas cheias." },
  ];

  return (
    <section className="diferenciais">
      <h2>Porque escolher o Teacher Pedro</h2>
      <div className="diferenciais-grid">
        {itens.map((item, i) => (
          <div className="diferencial-card" key={i}>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}