import useScrollAnimation from "./pages/hooks/useScrollAnimation";

const NIVEIS = [
  { id: 'a1', label: 'A1', nome: 'Iniciante', duracao: '8 semanas', preco: '15.000' },
  { id: 'a2', label: 'A2', nome: 'Elementar', duracao: '8 semanas', preco: '15.000' },
  { id: 'b1', label: 'B1', nome: 'Intermédio', duracao: '10 semanas', preco: '18.000', destaque: true },
  { id: 'b2', label: 'B2', nome: 'Intermédio Alto', duracao: '10 semanas', preco: '18.000' },
  { id: 'c1', label: 'C1', nome: 'Avançado', duracao: '12 semanas', preco: '22.000' },
  { id: 'c2', label: 'C2', nome: 'Proficiente', duracao: '12 semanas', preco: '22.000' },
];

export default function Cursos() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section
      ref={ref}
      id="cursos"
      className={`courses ${isVisible ? 'fade-in-visible' : 'fade-in-hidden'}`}
    >
      <h2>Cursos disponíveis</h2>
      <p className="courses-subtitle">
        Escolhe o teu nível segundo o CEFR e começa a aprender inglês de forma prática.
      </p>
      <div className="course-grid">
        {NIVEIS.map((nivel) => (
          <div
            key={nivel.id}
            className={course-card `${nivel.destaque ? 'course-card--destaque' : ''}`}
          >
            {nivel.destaque && <span className="course-badge">Mais procurado</span>}
            <span className="course-nivel">{nivel.label}</span>
            <h3>{nivel.nome}</h3>
            <span className="course-duracao">{nivel.duracao}</span>
            <span className="course-preco">
              A partir de <strong>Kz {nivel.preco}</strong>/mês
            </span>
            <a href="#contacto" className="course-btn">Inscrever-me</a>
          </div>
        ))}
      </div>
    </section>
  );
}