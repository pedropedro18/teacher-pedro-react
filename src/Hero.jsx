import { useState, useEffect } from 'react';

function useTypewriterLoop(text, typeSpeed = 50, deleteSpeed = 30, pauseTime = 1500) {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!isDeleting && displayed === text) {
      // terminou de escrever → espera e depois começa a apagar
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayed === '') {
      // terminou de apagar → recomeça a escrever
      timeout = setTimeout(() => setIsDeleting(false), 400);
    } else {
      const speed = isDeleting ? deleteSpeed : typeSpeed;
      timeout = setTimeout(() => {
        setDisplayed(prev =>
          isDeleting ? prev.slice(0, -1) : text.slice(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, text, typeSpeed, deleteSpeed, pauseTime]);

  return displayed;
}

export default function Hero() {
  const fullText = "Aprenda inglês com o teacher Pedro";
  const displayed = useTypewriterLoop(fullText, 50, 30, 1500);

  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <span className="hero-badge">✓ Ensino certificado Maple Bear</span>

        <h1 className="hero-title">
          <span className="sr-only">{fullText}</span>
          <span aria-hidden="true">
            {displayed}
            <span className="typewriter-cursor blink">|</span>
          </span>
        </h1>

        <p className="hero-subtitle">Aulas para todos os níveis, do A1 ao C2</p>

        <div className="hero-buttons">
          <a href="#contacto" className="btn-primary">Marcar aula</a>
          <a href="#cursos" className="btn-secondary">Ver cursos</a>
        </div>
      </div>

      <div className="hero-card">
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