import { useState } from 'react';

export default function Contacto() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const assunto = encodeURIComponent(`Contacto de ${form.nome}`);
    const corpo = encodeURIComponent(
      `Nome: ${form.nome}\nEmail: ${form.email}\n\nMensagem:\n${form.mensagem}`
    );
    window.location.href = `mailto:pedro.tomas@maplebear.edu.ao?subject=${assunto}&body=${corpo}`;
  }

  return (
    <section id="contacto" className="contact">
      <h2>Contacto</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            type="text"
            name="nome"
            placeholder="O seu nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="exemplo@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mensagem
          <textarea
            name="mensagem"
            placeholder="Conte-me sobre o que precisa..."
            rows="5"
            value={form.mensagem}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="btn-enviar">Enviar Mensagem</button>

        <p className="contact-nota">
        </p>
      </form>

      <a
        href="https://wa.me/244923030010"
        className="btn-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        Falar no WhatsApp
      </a>
    </section>
  );
}