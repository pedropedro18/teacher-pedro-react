import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'contacto', label: 'Contacto' },
];

export default function Header() {
  const [active, setActive] = useState('inicio');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    setOpen(false);

    if (id === 'cursos') {
      navigate('/cursos');
      return;
    }

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll para a secção depois de navegar para a home
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (location.pathname === '/' && target) {
      const timer = setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.state]);

  // Observer: volta a correr sempre que a rota muda
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <Link to="/" className="logo" onClick={() => setOpen(false)}>
        Tp
      </Link>

      <nav>
        <ul>
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.id === 'cursos' ? '/cursos' : `/#${link.id}`}
                className={active === link.id ? 'active' : ''}
                onClick={handleNavClick(link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
          </li>
          <li>
            <Link to="/exercicios-ingles" onClick={() => setOpen(false)}>
              Exercícios
            </Link>
          </li>
          <li>
            <Link to="/exercicios-temas" onClick={() => setOpen(false)}>
              Temas
            </Link>
          </li>
          <li>
            <Link to="/fichas" onClick={() => setOpen(false)}>
              Fichas
            </Link>
          </li>
          <li>
            <Link to="/Aluno" onClick={() => setOpen(false)}>
              Área do Aluno
            </Link>
          </li>
        </ul>
      </nav>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
        aria-expanded={open}
      >
        ☰
      </button>
    </header>
  );
}