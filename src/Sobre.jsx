export default function Sobre() {
  return (
    <section id="sobre" className="about">
      <div className="about-topo">
        <img src="/imagens/IMG_20250529_070439_367.jpg" alt="Teacher Pedro" />
        <div>
          <p className="about-nome">Teacher Pedro</p>
          <p>
            Professor de inglês há 5 anos, formado pelo programa educador Maplebear.
            Ensino todos os níveis do CEFR (A1 a C2), além de Excel e programação.
          </p>
        </div>
      </div>

      <div className="about-bloco">
        <h3>Missão</h3>
        <p>
          Tornar o inglês acessível e prático para qualquer pessoa em Angola,
          com aulas claras, personalizadas e focadas em resultados reais.
        </p>
      </div>

      <div className="about-bloco">
        <h3>Visão</h3>
        <p>
          Ser a referência em ensino de línguas e tecnologia para quem quer
          crescer profissionalmente e abrir novas oportunidades.
        </p>
      </div>

      <div className="about-bloco">
        <h3>Valores</h3>
        <ul>
          <li>Compromisso com o progresso de cada aluno</li>
          <li>Ensino prático, sem enrolação</li>
          <li>Respeito ao ritmo individual de aprendizagem</li>
        </ul>
      </div>

      <div className="about-bloco">
        <h3>Formação</h3>
        <p>
          Certificação em educação pelo programa Maple Bear, com formação em
          centros de aprendizagem e ensino por inquérito (inquiry-based learning).
        </p>
      </div>

      <a href="https://wa.me/244923030010" target="_blank" rel="noopener noreferrer" className="cta-botao">
        Falar comigo
      </a>
    </section>
  );
}