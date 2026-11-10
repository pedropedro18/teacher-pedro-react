export default function Aulas() {
  return (
    <section style={{ padding: "16px" }}>
      <h1>Gerador de Aulas</h1>
      <iframe
        src="https://gerador-aulas-3ydweq8pcdc5sufsg3kyjs.streamlit.app//?embed=true"
        title="Gerador de Aulas"
        style={{ width: "100%", height: "85vh", border: "none" }}
      />
    </section>
  );
}