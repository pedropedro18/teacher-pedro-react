import { Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'contacto', label: 'Contacto' },
];

export default function Header() {
  const [active, setActive] = useState('inicio');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNavClick = (id) => (e) => {
    if (id === 'cursos'){
    setOpen(false);
      navigate('/cursos');
      return;
      }
      e.preventDefault();
      setOpen(false);
      if (window.location.pathname !== '/') {
        navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
  }, []);

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <nav>
        <ul>
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.id === 'cursos' ? '/cursos' : `#${link.id}`}
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
  <Link to="/login-aluno" onClick={() => setOpen(false)}>
    Área do Aluno
  </Link>
</li>
</ul>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>
    </header>
  );
}
