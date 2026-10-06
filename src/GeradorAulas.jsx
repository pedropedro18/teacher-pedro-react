import { useState } from "react";

const NIVEIS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const AULAS = {
  A1: {
    "Greetings and introductions": {
      vocab: [["Hello", "Olá"], ["Goodbye", "Adeus"], ["Good morning", "Bom dia"], ["Nice to meet you", "Prazer em conhecer-te"], ["name", "nome"], ["from", "de (origem)"]],
      explicacao: "Usamos o verbo to be para nos apresentar: I am (eu sou), you are (tu és), he/she is (ele/ela é), we/they are (nós/eles somos/são). Também dizemos: My name is... (O meu nome é...).",
      exemplos: ["My name is Ana.", "I am from Angola.", "Nice to meet you."],
      dialogo: ["A: Hello! What's your name?", "B: Hi! My name is Pedro. What's your name?", "A: I'm Ana. Nice to meet you.", "B: Nice to meet you too."],
      exercicios: [["My name _ Pedro.", "is"], ["I _ from Angola.", "am"], ["She _ my teacher.", "is"], ["You _ my friend.", "are"], ["We _ students.", "are"]],
      fala: "Apresenta-te a um colega: nome, país e uma coisa de que gostas.",
    },
    "Daily routine": {
      vocab: [["wake up", "acordar"], ["have breakfast", "tomar o pequeno-almoço"], ["go to school", "ir à escola"], ["study", "estudar"], ["have dinner", "jantar"], ["go to bed", "ir dormir"]],
      explicacao: "No Present Simple, com I, you, we e they usamos o verbo normal. Com he, she e it acrescentamos -s (ou -es): he studies, she goes.",
      exemplos: ["I wake up at six.", "She goes to school at seven.", "They study in the afternoon."],
      dialogo: ["A: What time do you wake up?", "B: I wake up at six. And you?", "A: I wake up at five thirty.", "B: Wow! That's early."],
      exercicios: [["I _ (wake up) at 6.", "wake up"], ["She _ (go) to school.", "goes"], ["He _ (study) English.", "studies"], ["We _ (have) dinner at 8.", "have"], ["My mother _ (work) in a bank.", "works"]],
      fala: "Descreve o teu dia a um colega, da manhã até à noite.",
    },
  },
  A2: {
    "Past simple": {
      vocab: [["yesterday", "ontem"], ["last week", "semana passada"], ["visit", "visitar"], ["watch", "ver"], ["buy", "comprar"], ["travel", "viajar"]],
      explicacao: "O Past Simple fala de acções terminadas. Verbos regulares: + -ed (visit - visited). Irregulares: go - went, buy - bought, see - saw. Negativa: didn't + verbo base (I didn't go).",
      exemplos: ["I visited my aunt yesterday.", "She went to Luanda last week.", "They didn't play football."],
      dialogo: ["A: What did you do last weekend?", "B: I visited my grandmother.", "A: Did you have lunch there?", "B: Yes, we ate rice and chicken."],
      exercicios: [["I _ (visit) my aunt yesterday.", "visited"], ["She _ (go) to Luanda last week.", "went"], ["We _ (watch) a film.", "watched"], ["He _ (buy) a new phone.", "bought"], ["They _ (not/play) football.", "didn't play"]],
      fala: "Conta ao teu colega o que fizeste no fim de semana passado.",
    },
    "Shopping and prices": {
      vocab: [["How much is it?", "Quanto custa?"], ["cheap", "barato"], ["expensive", "caro"], ["size", "tamanho"], ["cash", "dinheiro vivo"], ["change", "troco"]],
      explicacao: "Para perguntar preços: How much is this? (singular) / How much are these? (plural). Para pedir: I'd like... (Queria...). This/that = singular; these/those = plural.",
      exemplos: ["How much is this shirt?", "I'd like a bottle of water, please.", "These shoes are expensive."],
      dialogo: ["A: Good morning. Can I help you?", "B: Yes, how much is this bag?", "A: It's 5,000 kwanzas.", "B: That's expensive. Do you have a cheaper one?"],
      exercicios: [["_ much is this shirt?", "How"], ["I'd _ a bottle of water, please.", "like"], ["_ shoes are expensive. (plural, perto)", "These"], ["That bag is too _. (oposto de cheap)", "expensive"], ["Here is your _. (troco)", "change"]],
      fala: "Faz um role-play: um aluno é o cliente, o outro é o vendedor.",
    },
  },
  B1: {
    "Present perfect": {
      vocab: [["ever", "alguma vez"], ["never", "nunca"], ["already", "já"], ["yet", "ainda (em perguntas/negativas)"], ["just", "acabou de"], ["since", "desde"]],
      explicacao: "Present Perfect = have/has + particípio passado. Usamos para experiências (I have visited Brazil), notícias recentes e situações que continuam (for/since).",
      exemplos: ["I have visited Portugal twice.", "Have you ever eaten sushi?", "He has lived here since 2015."],
      dialogo: ["A: Have you ever travelled abroad?", "B: Yes, I have. I've been to Portugal.", "A: Have you visited Brazil yet?", "B: No, not yet, but I'd love to."],
      exercicios: [["I _ (visit) Portugal twice.", "have visited"], ["She has _ (finish) her homework.", "finished"], ["Have you ever _ (eat) sushi?", "eaten"], ["We haven't seen him _ Monday.", "since"], ["He _ (live) here for ten years.", "has lived"]],
      fala: "Pergunta a três colegas: Have you ever...? e anota as respostas.",
    },
    "First conditional": {
      vocab: [["if", "se"], ["unless", "a menos que"], ["probably", "provavelmente"], ["maybe", "talvez"], ["plan", "plano"], ["result", "resultado"]],
      explicacao: "First Conditional fala de situações possíveis no futuro: If + Present Simple, will + verbo base. Unless = if not.",
      exemplos: ["If it rains, we will stay at home.", "If you study, you will pass the exam.", "She will be late unless she hurries."],
      dialogo: ["A: What will you do if it rains tomorrow?", "B: I'll stay at home and read.", "A: And if it's sunny?", "B: I'll go to the beach."],
      exercicios: [["If it rains, we _ (stay) at home.", "will stay"], ["If you study, you _ (pass) the exam.", "will pass"], ["She will be late _ she hurries.", "unless"], ["If I _ (have) time, I'll call you.", "have"], ["If he _ (not/come), we will leave.", "doesn't come"]],
      fala: "Em cadeia: um aluno diz If..., o seguinte completa com will...",
    },
  },
  B2: {
    "Passive voice": {
      vocab: [["be built", "ser construído"], ["be made", "ser feito"], ["be written", "ser escrito"], ["be discovered", "ser descoberto"], ["produce", "produzir"], ["export", "exportar"]],
      explicacao: "Passiva = be + particípio passado. O objecto passa a sujeito e o agente (by...) é opcional. Usamos quando a acção é mais importante do que quem a faz.",
      exemplos: ["English is spoken in many countries.", "The bridge was built in 1998.", "The report will be finished by Friday."],
      dialogo: ["A: Where is this coffee grown?", "B: It's grown in the north of Angola.", "A: And where is it exported?", "B: It was exported to Europe last year."],
      exercicios: [["English _ (speak) in many countries.", "is spoken"], ["The bridge _ (build) in 1998.", "was built"], ["The report _ (finish) by Friday.", "will be finished"], ["Coffee _ (grow) in Angola.", "is grown"], ["These cars _ (make) in Japan.", "are made"]],
      fala: "Descreve como um produto é feito (pão, café, um telemóvel) usando a passiva.",
    },
    "Reported speech": {
      vocab: [["say", "dizer"], ["tell", "dizer (a alguém)"], ["ask", "perguntar"], ["explain", "explicar"], ["mention", "mencionar"], ["announce", "anunciar"]],
      explicacao: "No discurso indirecto os tempos recuam: present - past, will - would, can - could, present perfect - past perfect.",
      exemplos: ["He said (that) he was tired.", "She said she would call me.", "They said they had finished."],
      dialogo: ["A: What did the manager say?", "B: He said the meeting would start at ten.", "A: Did he mention the new project?", "B: Yes, he said we had to finish it by May."],
      exercicios: [["He said, \"I am tired.\" - He said he _ tired.", "was"], ["She said, \"I will call you.\" - She said she _ call me.", "would"], ["\"I can swim.\" - He said he _ swim.", "could"], ["\"I live in Luanda.\" - She said she _ in Luanda.", "lived"], ["\"We have finished.\" - They said they _ finished.", "had"]],
      fala: "Conta a um colega o que um professor ou amigo te disse hoje.",
    },
  },
  C1: {
    "Inversion for emphasis": {
      vocab: [["rarely", "raramente"], ["seldom", "raramente (formal)"], ["hardly... when", "mal... quando"], ["not only... but also", "não só... mas também"], ["under no circumstances", "em circunstância alguma"], ["no sooner... than", "mal... quando"]],
      explicacao: "Quando começamos a frase com um advérbio negativo ou restritivo (never, rarely, hardly, not only), o auxiliar vai antes do sujeito: Never have I seen...",
      exemplos: ["Never have I seen such a view.", "Rarely does she arrive on time.", "Under no circumstances should you open this door."],
      dialogo: ["A: Did the presentation go well?", "B: Not only did it go well, but we also won the contract.", "A: Hardly had you finished when they applauded!", "B: Never have I felt so proud."],
      exercicios: [["Never _ I seen such a view.", "have"], ["Rarely _ she arrive on time.", "does"], ["Not only _ he late, but he also forgot the files.", "was"], ["Hardly had we arrived _ it started to rain.", "when"], ["Under no circumstances _ you open this door.", "should"]],
      fala: "Reescreve 5 frases normais usando inversão e lê-as em voz alta.",
    },
    "Idioms and collocations": {
      vocab: [["make a decision", "tomar uma decisão"], ["take a risk", "arriscar"], ["break the ice", "quebrar o gelo"], ["a blessing in disguise", "um mal que vem por bem"], ["once in a blue moon", "muito raramente"], ["hit the nail on the head", "acertar em cheio"]],
      explicacao: "Collocations são combinações naturais de palavras (make a decision, não do a decision). Idioms têm sentido figurado e devem ser aprendidos como blocos.",
      exemplos: ["We need to make a decision today.", "Losing that job was a blessing in disguise.", "I only see him once in a blue moon."],
      dialogo: ["A: How was the meeting?", "B: At first it was tense, so I told a joke to break the ice.", "A: Smart. Did they take the risk?", "B: Yes. You hit the nail on the head when you said it would work."],
      exercicios: [["We need to _ a decision today.", "make"], ["Let's play a game to break the _.", "ice"], ["Losing that job was a blessing in _.", "disguise"], ["I only see him once in a blue _.", "moon"], ["You hit the nail on the _.", "head"]],
      fala: "Escolhe 3 expressões e usa cada uma numa história curta de 1 minuto.",
    },
  },
  C2: {
    "Advanced discourse markers": {
      vocab: [["notwithstanding", "não obstante"], ["albeit", "embora"], ["whereas", "ao passo que"], ["hence", "portanto"], ["nevertheless", "ainda assim"], ["in light of", "à luz de"]],
      explicacao: "Os discourse markers organizam o argumento: contraste (whereas, nevertheless), concessão (albeit, notwithstanding) e consequência (hence). São típicos de textos formais e académicos.",
      exemplos: ["The plan was risky, albeit successful.", "She loves city life, whereas her brother prefers the countryside.", "Notwithstanding the delays, the event went well."],
      dialogo: ["A: Is the proposal viable?", "B: The costs are high; nevertheless, the benefits are clear.", "A: In light of this, should we proceed?", "B: Yes, albeit with a revised budget."],
      exercicios: [["The plan was risky, _ successful.", "albeit"], ["She loves city life, _ her brother prefers the countryside.", "whereas"], ["The data is limited; _, the trend is clear.", "nevertheless"], ["_ the delays, the event went well.", "Notwithstanding"], ["Costs rose; _, prices must increase.", "hence"]],
      fala: "Defende uma opinião durante 2 minutos usando pelo menos 4 conectores.",
    },
    "Nuance and register": {
      vocab: [["kindly", "gentilmente"], ["would you mind", "importava-se"], ["regret to inform", "lamento informar"], ["reckon", "achar (informal)"], ["furthermore", "além disso (formal)"], ["grateful", "grato"]],
      explicacao: "O registo muda com o contexto. Informal: Can you help me? I reckon... Formal: Would you mind helping me? I believe... Escolher o registo certo é parte do domínio C2.",
      exemplos: ["Would you mind helping me with this report?", "I believe the proposal needs revision.", "I am very grateful for your support."],
      dialogo: ["A: Hey, can you send me the file?", "B: Sure! (Formal version: Would you mind sending me the file?)", "A: Thanks a lot!", "B: (Formal: I am very grateful for your help.)"],
      exercicios: [["Formal: _ you mind helping me? (Informal: Can you help me?)", "Would"], ["Formal: I _ that... (Informal: I reckon that...)", "believe"], ["Formal word for 'but':", "however"], ["Formal: I am very _. (Informal: Thanks a lot.)", "grateful"], ["Formal connector for 'also':", "furthermore"]],
      fala: "Reescreve a mesma mensagem em registo informal e formal e compara.",
    },
  },
};

export default function GeradorAulas() {
  const [nivel, setNivel] = useState("A1");
  const [tema, setTema] = useState(Object.keys(AULAS.A1)[0]);
  const [solucoes, setSolucoes] = useState(true);
  const [aula, setAula] = useState(null);

  const mudarNivel = (n) => {
    setNivel(n);
    setTema(Object.keys(AULAS[n])[0]);
  };

  const gerar = () => setAula({ nivel, tema, ...AULAS[nivel][tema] });

  const campo = { padding: "10px 12px", borderRadius: 10, border: "none", fontSize: 16, width: "100%", boxSizing: "border-box" };
  const botao = { background: "#f9c93a", color: "#222", fontWeight: 700, padding: "12px 20px", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer" };
  const titulo = { borderBottom: "2px solid #1e4f9c", paddingBottom: 4, marginTop: 22 };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 16, color: "#fff" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #aula, #aula * { visibility: visible; }
          #aula { position: absolute; left: 0; top: 0; width: 100%; color: #000 !important; background: #fff !important; }
          .quebra { page-break-before: always; }
        }
      `}</style>

      <h1>Gerador de aulas</h1>
      <p>Cria aulas completas de inglês em PDF: vocabulário, explicação, diálogo e exercícios, com soluções para o professor.</p>

      <div style={{ display: "grid", gap: 12, background: "rgba(255,255,255,.12)", padding: 16, borderRadius: 14 }}>
        <label>Nível
          <select style={campo} value={nivel} onChange={(e) => mudarNivel(e.target.value)}>
            {NIVEIS.map((n) => <option key={n}>{n}</option>)}
          </select>
        </label>
        <label>Tema
          <select style={campo} value={tema} onChange={(e) => setTema(e.target.value)}>
            {Object.keys(AULAS[nivel]).map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={solucoes} onChange={(e) => setSolucoes(e.target.checked)} />
          Incluir soluções para o professor
        </label>
        <button onClick={gerar} style={botao}>Gerar aula</button>
      </div>

      {aula && (
        <>
          <div id="aula" style={{ background: "#fff", color: "#111", marginTop: 20, padding: 20, borderRadius: 14, lineHeight: 1.5 }}>
            <h2 style={{ marginTop: 0 }}>{aula.tema} ({aula.nivel})</h2>

            <h3 style={titulo}>1. Vocabulary</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {aula.vocab.map(([en, pt]) => (
                  <tr key={en}>
                    <td style={{ padding: "4px 8px", borderBottom: "1px solid #ddd", fontWeight: 600 }}>{en}</td>
                    <td style={{ padding: "4px 8px", borderBottom: "1px solid #ddd" }}>{pt}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={titulo}>2. Explicação</h3>
            <p>{aula.explicacao}</p>
            <ul>{aula.exemplos.map((e) => <li key={e}>{e}</li>)}</ul>

            <h3 style={titulo}>3. Dialogue</h3>
            {aula.dialogo.map((l) => <div key={l}>{l}</div>)}

            <h3 style={titulo}>4. Exercises</h3>
            <p><i>Completa as frases.</i></p>
            <ol>
              {aula.exercicios.map(([frase]) => <li key={frase} style={{ margin: "8px 0" }}>{frase}</li>)}
            </ol>

            <h3 style={titulo}>5. Speaking</h3>
            <p>{aula.fala}</p>

            {solucoes && (
              <div className="quebra">
                <h3 style={titulo}>Soluções (professor)</h3>
                <ol>
                  {aula.exercicios.map(([frase, resp]) => <li key={frase}><b>{resp}</b></li>)}
                </ol>
              </div>
            )}
          </div>
          <button onClick={() => window.print()} style={{ ...botao, marginTop: 12 }}>Descarregar PDF</button>
        </>
      )}
    </div>
  );
}