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
                href={`#${link.id}`}
                className={active === link.id ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>
    </header>
  );
}

