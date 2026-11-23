import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'contacto', label: 'Contacto' },
];

const RESOURCES = [
  { to: '/exercicios-ingles', label: 'Exercícios' },
  { to: '/exercicios-temas', label: 'Temas' },
  { to: '/fichas', label: 'Fichas' },
  { to: '/aulas', label: 'Aulas' },
];

export default function Header() {
  const [active, setActive] = useState('inicio');
  const [open, setOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const resRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const closeAll = () => {
    setOpen(false);
    setResOpen(false);
  };

  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    closeAll();

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

  // Fecha o submenu ao clicar fora
  useEffect(() => {
    const onClick = (e) => {
      if (resRef.current && !resRef.current.contains(e.target)) {
        setResOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

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

  // Observer: só na home; volta a correr sempre que a rota muda
  useEffect(() => {
    if (location.pathname !== '/') {
      setActive('');
      return;
    }

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

  const resourceActive = RESOURCES.some((r) =>
    location.pathname.startsWith(r.to)
  );

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <Link to="/" className="logo" onClick={closeAll}>
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
            <Link to="/blog" onClick={closeAll}>
              Blog
            </Link>
          </li>

          <li className={`dropdown ${resOpen ? 'open' : ''}`} ref={resRef}>
            <button
              type="button"
              className={`dropdown-toggle ${resourceActive ? 'active' : ''}`}
              onClick={() => setResOpen(!resOpen)}
              aria-haspopup="true"
              aria-expanded={resOpen}
            >
              Recursos <span className="caret">▾</span>
            </button>
            <ul className="dropdown-menu">
              {RESOURCES.map((r) => (
                <li key={r.to}>
                  <Link to={r.to} onClick={closeAll}>
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <Link to="/Aluno" className="btn-aluno" onClick={closeAll}>
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