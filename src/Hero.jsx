import { useState, useEffect } from 'react';

function useTypewriter(text, speed = 50, startDelay = 300) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval;
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i === text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function Hero() {
  const { displayed, done } = useTypewriter("Aprenda inglês com o teacher Pedro", 50, 300);

  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <span className="hero-badge hero-title">✓ Ensino certificado Maple Bear</span>
        <h1 className="hero-title">
          {displayed}
          <span className={`typewriter-cursor ${done ? 'blink' : ''}`}>|</span>
        </h1>
        <p className="hero-subtitle">Aulas para todos os níveis, do A1 ao C2</p>
        <div className="hero-buttons hero-cta">
          <a href="#contacto" className="btn-primary">Marcar aula</a>
          <a href="#cursos" className="btn-secondary">Ver cursos</a>
        </div>
      </div>

      <div className="hero-card hero-cta">
        <div className="hero-stat">
          <span className="hero-stat-number">A1 → C2</span>
          <span className="hero-stat-label">Percurso completo</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-number">8-12 semanas</span>
          <span className="hero-stat-label">Por nível</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-number">100%</span>
          <span className="hero-stat-label">Aulas personalizadas</span>
        </div>
      </div>
    </section>
  );
}