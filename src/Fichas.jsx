const LINK = "https://O-TEU-LINK.streamlit.app";

export default function Fichas() {
  return (
    <section className="fichas" id="fichas">
      <h2>Gerador de fichas de trabalho</h2>
      <p>Cria fichas em PDF de matemática e inglês, com soluções para o professor.</p>

      <a className="fichas-btn" href={LINK} target="_blank" rel="noreferrer">
        Abrir gerador
      </a>

      <iframe
        className="fichas-frame"
        src={`${LINK}/?embed=true`}
        title="Gerador de fichas de trabalho"
        loading="lazy"
      />
    </section>
  );
}