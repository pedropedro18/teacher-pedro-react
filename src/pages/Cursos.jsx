import React from "react";
import "./Cursos.css";
import { useScrollAnimation } from "../useScrollAnimation";

const modalidades = [
  {
    nivel: "A1",
    titulo: "Iniciação",
    texto:
      "Vocabulário básico e primeiras estruturas gramaticais para comunicar o básico.",
  },
  {
    nivel: "A2",
    titulo: "Elementar",
    texto:
      "Conversas simples sobre rotina, família e trabalho, com consolidação da gramática básica e vocabulário mais amplo.",
  },
  {
    nivel: "B1",
    titulo: "Intermédio",
    texto:
      "Autonomia para lidar com a maioria das situações em viagem, expressar opiniões e descrever experiências e planos.",
  },
  {
    nivel: "B2",
    titulo: "Intermédio alto",
    texto:
      "Interação fluente e espontânea com falantes nativos, incluindo temas técnicos e discursos mais complexos.",
  },
  {
    nivel: "C1",
    titulo: "Avançado",
    texto:
      "Domínio da língua em contextos académicos e profissionais, com precisão e naturalidade.",
  },
  {
    nivel: "C2",
    titulo: "Proficiência",
    texto: "Nível quase nativo, com fluência total em qualquer contexto.",
  },
];

const aulas = [
  {
    titulo: "Avaliação inicial",
    texto:
      "Diagnóstico do nível actual e definição de objectivos claros e mensuráveis.",
  },
  {
    titulo: "Plano de estudos personalizado",
    texto: "Percurso estruturado por nível CEFR, ajustado ao ritmo de cada aluno.",
  },
  {
    titulo: "Aulas regulares",
    texto:
      "Sessões práticas com foco em compreensão, expressão oral e escrita.",
  },
  {
    titulo: "Acompanhamento contínuo",
    texto:
      "Revisão periódica do progresso e ajuste do plano conforme a evolução.",
  },
  {
    titulo: "Aulas por níveis CEFR",
    texto: "Ensino personalizado do A1 ao C2, adaptado ao teu ritmo e objectivos.",
  },
];

const competencias = [
  {
    titulo: "Ensino canadiano",
    texto:
      "Metodologia da escola internacional Cepi Maplebear, com foco em inquiry-based learning.",
  },
  {
    titulo: "Tradução de documentos",
    texto:
      "Tradução de todo tipo de documentos entre português e inglês, desde documentos escolares até de carácter profissional.",
  },
  {
    titulo: "Formação de professores",
    texto:
      "Formador de inglês para outros educadores, com foco em prática pedagógica.",
  },
  {
    titulo: "Informática e programação",
    texto:
      "Apoio em conteúdo técnico de base de dados e programação para o ensino secundário.",
  },
  {
    titulo: "Materiais didáticos digitais",
    texto: "Criação de ebooks e recursos de estudo personalizados para cada aluno.",
  },
  {
    titulo: "Aulas de Excel",
    texto:
      "Aulas do básico ao avançado. Desde a interface até a criação de gráficos dinâmicos e dashboards.",
  },
];

function CardGrid({ items, keyPrefix }) {
  return (
    <div className="cursos-grid">
      {items.map((item, i) => (
        <div className="cursos-card" key={`${keyPrefix}-${i}`}>
          {item.nivel && <span className="cursos-card-tag">{item.nivel}</span>}
          <h3>{item.titulo}</h3>
          <p>{item.texto}</p>
        </div>
      ))}
    </div>
  );
}

export default function Cursos() {
  const [refModalidades, visibleModalidades] = useScrollAnimation();
  const [refAulas, visibleAulas] = useScrollAnimation();
  const [refCompetencias, visibleCompetencias] = useScrollAnimation();

  return (
    <main className="cursos-page">
      <section
        ref={refModalidades}
        id="modalidades"
        className={`cursos-section ${visibleModalidades ? "fade-in-visible" : "fade-in-hidden"}`}
      >
        <h2>Modalidades</h2>
        <p className="cursos-intro">
          Aulas adaptadas ao teu nível e aos teus objectivos, com percursos
          próprios para cada etapa.
        </p>
        <CardGrid items={modalidades} keyPrefix="modalidade" />
      </section>

      <section
        ref={refAulas}
        id="aulas"
        className={`cursos-section ${visibleAulas ? "fade-in-visible" : "fade-in-hidden"}`}
      >
        <h2>Aulas</h2>
        <p className="cursos-intro">
          Como funciona o percurso, do primeiro contacto à consolidação do
          nível:
        </p>
        <CardGrid items={aulas} keyPrefix="aula" />
      </section>

      <section
        ref={refCompetencias}
        id="competencias"
        className={`cursos-section ${visibleCompetencias ? "fade-in-visible" : "fade-in-hidden"}`}
      >
        <h2>Competências</h2>
        <p className="cursos-intro">
          Áreas de especialização além do ensino em sala de aula.
        </p>
        <CardGrid items={competencias} keyPrefix="competencia" />
      </section>
    </main>
  );
}