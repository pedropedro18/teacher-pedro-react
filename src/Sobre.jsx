export default function Sobre() {
  return (
    <section id="sobre" className="about">
      <div className="about-inner">

        {/* Bio */}
        <div className="about-bio">
          <img
            src="/imagens/logo.png"
            alt="Retrato de Teacher Pedro"
            className="about-avatar"
          />
          <div className="about-bio-text">
            <span className="about-kicker">Sobre mim</span>
            <h2 className="about-nome">Teacher Pedro</h2>
            <p>
              Professor de inglês há 5 anos, formado pelo programa educador
              Maplebear. Ensino todos os níveis do CEFR (A1 a C2), além de
              Excel e programação.
            </p>
            <a
              href="https://wa.me/244923030010"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-botao"
            >
              Falar comigo
            </a>
          </div>
        </div>

        {/* Missão / Visão / Formação */}
        <div className="about-grid">
          <div className="about-bloco">
            <h3>Missão</h3>
            <p>
              Tornar o inglês acessível e prático para qualquer pessoa em
              Angola, com aulas claras, personalizadas e focadas em
              resultados reais.
            </p>
          </div>

          <div className="about-bloco">
            <h3>Visão</h3>
            <p>
              Ser a referência em ensino de línguas e tecnologia para quem
              quer crescer profissionalmente e abrir novas oportunidades.
            </p>
          </div>

          <div className="about-bloco">
            <h3>Formação</h3>
            <p>
              Certificação em educação pelo programa Maple Bear, com
              formação em centros de aprendizagem e ensino por inquérito
              (inquiry-based learning).
            </p>
          </div>
        </div>

        {/* Valores — lista, não cartões, porque não é uma sequência */}
        <div className="about-valores">
          <h3>Valores</h3>
          <ul>
            <li>Compromisso com o progresso de cada aluno</li>
            <li>Ensino prático, sem enrolação</li>
            <li>Respeito ao ritmo individual de aprendizagem</li>
          </ul>
        </div>

      </div>
    </section>
  );
}