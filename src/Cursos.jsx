import useScrollAnimation from "./pages/hooks/useScrollAnimation";

const NIVEIS = [
  { id: 'a1', label: 'A1 . Iniciante', duracao: '8 semanas', preco: '15.000 Kz' },
  { id: 'a2', label: 'A2 . Elementar', duracao: '8 semanas', preco: '15.000 Kz' },
  { id: 'b1', label: 'B1 . Intermédio', duracao: '10 semanas', preco: '18.000 Kz' },
  { id: 'b2', label: 'B2 . Intermédio Alto', duracao: '10 semanas', preco: '18.000 Kz' },
  { id: 'c1', label: 'C1 . Avançado', duracao: '12 semanas', preco: '20.000 Kz' },
  { id: 'c2', label: 'C2 . Proficiente', duracao: '12 semanas', preco: '20.000 Kz' },
];

export default function Cursos() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section ref={ref} id="cursos" className={`courses ${isVisible ? 'fade-in-visible' : 'fade-in-hidden'}`}>
      <h2>Cursos disponíveis</h2>
      <div className="course-grid">
        {NIVEIS.map((nivel) => (
          <div key={nivel.id} className="course-card">
            <h3>{nivel.label}</h3>
            <p className="course-duracao">{nivel.duracao}</p>
            <p className="course-preco">{nivel.preco}</p>
            <a href="#contacto" className="course-btn">Inscrever-me</a>
          </div>
        ))}
      </div>
    </section>
  );
}