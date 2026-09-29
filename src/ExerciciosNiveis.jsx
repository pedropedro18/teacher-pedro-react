import { useState } from "react";

// Escolha múltipla: [pergunta, [opções], resposta certa]
const MC = {
  A1: [
    ["She _ a student.", ["am", "is", "are"], "is"],
    ["I _ from Portugal.", ["am", "is", "are"], "am"],
    ["They _ two dogs.", ["has", "have", "haves"], "have"],
    ["_ is your name?", ["What", "Where", "Who"], "What"],
    ["There _ a book on the table.", ["is", "are", "be"], "is"],
    ["I _ a cat.", ["have", "has", "is"], "have"],
    ["He _ football every day.", ["play", "plays", "playing"], "plays"],
    ["This is _ apple.", ["a", "an", "the"], "an"],
    ["We _ happy.", ["am", "is", "are"], "are"],
    ["_ you like pizza?", ["Do", "Does", "Are"], "Do"],
  ],
  A2: [
    ["Yesterday I _ to the cinema.", ["go", "went", "gone"], "went"],
    ["She is _ than her sister.", ["tall", "taller", "tallest"], "taller"],
    ["I _ TV when you called.", ["watched", "was watching", "watch"], "was watching"],
    ["We _ visit Spain next summer.", ["are going to", "did", "have"], "are going to"],
    ["There isn't _ milk.", ["some", "any", "a"], "any"],
    ["How _ apples do you want?", ["much", "many", "lot"], "many"],
    ["She _ her homework yesterday.", ["did", "do", "does"], "did"],
    ["He can't come _ he is ill.", ["because", "but", "so"], "because"],
    ["I'm interested _ music.", ["on", "in", "at"], "in"],
    ["She usually _ up at seven.", ["get", "gets", "getting"], "gets"],
  ],
  B1: [
    ["If it rains, we _ at home.", ["stay", "will stay", "stayed"], "will stay"],
    ["I have lived here _ 2015.", ["for", "since", "from"], "since"],
    ["The book _ by millions of people.", ["is read", "reads", "read"], "is read"],
    ["She asked me where I _.", ["live", "lived", "living"], "lived"],
    ["You _ smoke here. It's forbidden.", ["mustn't", "don't have to", "needn't"], "mustn't"],
    ["I'm looking forward _ you.", ["to see", "to seeing", "seeing"], "to seeing"],
    ["She has _ finished her work.", ["yet", "already", "still"], "already"],
    ["If I _ you, I would apologise.", ["am", "were", "be"], "were"],
    ["The man _ lives next door is a doctor.", ["who", "whose", "which"], "who"],
    ["He didn't go out _ it was raining.", ["because", "so", "although"], "because"],
  ],
  B2: [
    ["If I _ more time, I would learn Italian.", ["have", "had", "would have"], "had"],
    ["By the time we arrived, the film _.", ["started", "had already started", "has started"], "had already started"],
    ["I wish I _ speak French.", ["can", "could", "would"], "could"],
    ["He suggested _ a taxi.", ["to take", "taking", "take"], "taking"],
    ["She's used _ up early.", ["to get", "to getting", "get"], "to getting"],
    ["She denied _ the money.", ["to take", "taking", "take"], "taking"],
    ["I'd rather _ at home tonight.", ["to stay", "stay", "staying"], "stay"],
    ["The house _ next year.", ["will paint", "will be painted", "is painting"], "will be painted"],
    ["He must _ left already; his car is gone.", ["has", "have", "had"], "have"],
    ["I regret _ you that the flight is cancelled.", ["telling", "to tell", "tell"], "to tell"],
  ],
  C1: [
    ["Hardly _ the door when the phone rang.", ["had he opened", "he had opened", "he opened"], "had he opened"],
    ["I'd rather you _ tell anyone.", ["didn't", "don't", "won't"], "didn't"],
    ["The project, _ was delayed, is now finished.", ["which", "what", "who"], "which"],
    ["_ the weather, we went for a walk.", ["Despite", "Although", "However"], "Despite"],
    ["Not only _ late, but he also forgot the documents.", ["he was", "was he", "did he"], "was he"],
    ["Had I known, I _ differently.", ["would act", "would have acted", "had acted"], "would have acted"],
    ["It's high time we _ a decision.", ["make", "made", "will make"], "made"],
    ["She insisted _ paying for dinner.", ["on", "in", "to"], "on"],
    ["The report is thought _ inaccurate.", ["be", "to be", "being"], "to be"],
    ["No sooner had she left _ it started to rain.", ["when", "than", "that"], "than"],
  ],
  C2: [
    ["The negotiations reached a _, with neither side willing to yield.", ["stalemate", "stalemark", "stalement"], "stalemate"],
    ["Were it not for your help, I _ failed.", ["would have", "will have", "had"], "would have"],
    ["The CEO's decision was met with _ criticism.", ["scathing", "scattered", "scaling"], "scathing"],
    ["She has a _ for languages.", ["flair", "flare", "flaw"], "flair"],
    ["Little did they _ what awaited them.", ["know", "knew", "known"], "know"],
    ["He was chilled _ the bone after the storm.", ["to", "in", "at"], "to"],
    ["The findings _ a fundamental rethink.", ["warrant", "warrants", "warranting"], "warrant"],
    ["She is, _ any measure, a talented pianist.", ["by", "on", "at"], "by"],
    ["His speech was full of _ remarks.", ["disparaging", "dispersing", "disputing"], "disparaging"],
    ["The company is teetering _ the verge of bankruptcy.", ["on", "in", "over"], "on"],
  ],
};

// Escrita: [frase em português, [respostas aceites em inglês]]
const WRITE = {
  A1: [
    ["Eu tenho dez anos.", ["I am ten years old", "I'm ten years old", "I am 10 years old", "I'm 10 years old"]],
    ["O meu nome é Ana.", ["My name is Ana"]],
    ["Ela gosta de gatos.", ["She likes cats"]],
  ],
  A2: [
    ["Ontem eu fui à escola.", ["Yesterday I went to school", "I went to school yesterday"]],
    ["Vou viajar amanhã.", ["I am going to travel tomorrow", "I'm going to travel tomorrow", "Tomorrow I am going to travel"]],
    ["Ele é mais alto do que eu.", ["He is taller than me", "He's taller than me", "He is taller than I am", "He's taller than I am"]],
  ],
  B1: [
    ["Vivo aqui desde 2015.", ["I have lived here since 2015", "I've lived here since 2015"]],
    ["Se chover, ficamos em casa.", ["If it rains, we will stay at home", "If it rains, we'll stay at home", "If it rains we will stay at home", "If it rains we'll stay at home"]],
    ["Ela perguntou onde eu morava.", ["She asked me where I lived", "She asked where I lived"]],
  ],
  B2: [
    ["Se eu tivesse mais tempo, aprenderia italiano.", ["If I had more time, I would learn Italian", "If I had more time, I'd learn Italian"]],
    ["Gostava de saber falar francês.", ["I wish I could speak French"]],
    ["Ele sugeriu apanhar um táxi.", ["He suggested taking a taxi", "He suggested catching a taxi"]],
  ],
  C1: [
    ["Mal abriu a porta, o telefone tocou.", ["Hardly had he opened the door when the phone rang", "Scarcely had he opened the door when the phone rang", "No sooner had he opened the door than the phone rang"]],
    ["Preferia que não dissesses a ninguém.", ["I'd rather you didn't tell anyone", "I would rather you didn't tell anyone"]],
    ["Apesar do tempo, fomos passear.", ["Despite the weather, we went for a walk", "In spite of the weather, we went for a walk"]],
  ],
  C2: [
    ["Não fosse a tua ajuda, teria falhado.", ["Were it not for your help, I would have failed", "Had it not been for your help, I would have failed"]],
    ["Eles não faziam ideia do que os esperava.", ["Little did they know what awaited them", "They had no idea what awaited them", "They had no idea what was waiting for them"]],
    ["Ela tem jeito para línguas.", ["She has a flair for languages", "She has a gift for languages", "She has a talent for languages"]],
  ],
};

const DESC = {
  A1: "Iniciante", A2: "Elementar", B1: "Intermédio",
  B2: "Intermédio-avançado", C1: "Avançado", C2: "Proficiência",
};

const norm = (t) =>
  t.toLowerCase().replace(/’/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function Result({ certas, total }) {
  const msg =
    certas === total
      ? "Excelente! Podes tentar o nível seguinte. 🎉"
      : certas >= total * 0.6
      ? "Bom trabalho! Revê os erros e tenta outra vez."
      : "Continua a praticar, vais conseguir! 💪";
  return (
    <div className="ing-result">
      <progress value={certas} max={total} />
      <h3>Resultado: {certas}/{total}</h3>
      <p>{msg}</p>
    </div>
  );
}

function Listen({ text }) {
  return (
    <button type="button" className="ing-listen" onClick={() => speak(text)}>
      🔊 Ouvir
    </button>
  );
}

function Multiple({ items }) {
  const [ans, setAns] = useState({});
  const [checked, setChecked] = useState(false);
  const [warn, setWarn] = useState(false);

  const check = (e) => {
    e.preventDefault();
    if (items.some((_, i) => !ans[i])) return setWarn(true);
    setWarn(false);
    setChecked(true);
  };

  return (
    <form onSubmit={check}>
      {items.map(([q, ops, r], i) => {
        const frase = q.replace("_", r);
        const ok = ans[i] === r;
        return (
          <fieldset key={i} className="ing-q" disabled={checked}>
            <legend>{i + 1}. {q}</legend>
            {ops.map((o) => (
              <label key={o}>
                <input
                  type="radio"
                  name={`mc-${i}`}
                  checked={ans[i] === o}
                  onChange={() => setAns({ ...ans, [i]: o })}
                />{" "}
                {o}
              </label>
            ))}
            {checked && (
              <div className={ok ? "ing-ok" : "ing-err"}>
                {ok ? `Correto! ${frase}` : <>Errado. Resposta certa: <b>{r}</b> → {frase}</>}
                <Listen text={frase} />
              </div>
            )}
          </fieldset>
        );
      })}
      {warn && <p className="ing-warn">Responde a todas as perguntas antes de verificar.</p>}
      {!checked && <button type="submit" className="ing-btn">✅ Verificar respostas</button>}
      {checked && (
        <Result certas={items.filter(([, , r], i) => ans[i] === r).length} total={items.length} />
      )}
    </form>
  );
}

function Writing({ items }) {
  const [txt, setTxt] = useState({});
  const [checked, setChecked] = useState(false);
  const [warn, setWarn] = useState(false);

  const check = (e) => {
    e.preventDefault();
    if (items.some((_, i) => !(txt[i] || "").trim())) return setWarn(true);
    setWarn(false);
    setChecked(true);
  };

  const acerta = (i) => items[i][1].map(norm).includes(norm(txt[i] || ""));

  return (
    <form onSubmit={check}>
      <p>Traduz as frases para inglês:</p>
      {items.map(([q, r], i) => (
        <div key={i} className="ing-q">
          <b>{i + 1}. {q}</b>
          <input
            type="text"
            value={txt[i] || ""}
            disabled={checked}
            onChange={(e) => setTxt({ ...txt, [i]: e.target.value })}
            aria-label={`Tradução da frase ${i + 1}`}
          />
          {checked && (
            <div className={acerta(i) ? "ing-ok" : "ing-err"}>
              {acerta(i) ? `Correto! ${r[0]}` : <>Quase! Exemplo correto: <b>{r[0]}</b></>}
              <Listen text={r[0]} />
            </div>
          )}
        </div>
      ))}
      {warn && <p className="ing-warn">Preenche todas as frases antes de verificar.</p>}
      {!checked && <button type="submit" className="ing-btn">✅ Verificar respostas</button>}
      {checked && <Result certas={items.filter((_, i) => acerta(i)).length} total={items.length} />}
    </form>
  );
}

export default function ExerciciosNiveis() {
  const [nivel, setNivel] = useState("A1");
  const [aba, setAba] = useState("mc");
  const [ronda, setRonda] = useState(0);
  const k = `${nivel}-${aba}-${ronda}`;

  return (
    <section className="ing">
      <style>{CSS}</style>
      <h2>📚 English Exercises</h2>
      <p>Exercícios de inglês por nível, de A1 a C2</p>

      <label>
        Escolhe o nível:{" "}
        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          {Object.keys(MC).map((n) => (
            <option key={n} value={n}>{n} – {DESC[n]}</option>
          ))}
        </select>
      </label>

      <div className="ing-tabs" role="tablist">
        <button role="tab" aria-selected={aba === "mc"} onClick={() => setAba("mc")}>✅ Escolha múltipla</button>
        <button role="tab" aria-selected={aba === "wr"} onClick={() => setAba("wr")}>✍️ Escrita</button>
      </div>

      {aba === "mc" ? <Multiple key={k} items={MC[nivel]} /> : <Writing key={k} items={WRITE[nivel]} />}

      <button type="button" className="ing-btn ing-reset" onClick={() => setRonda(ronda + 1)}>
        🔄 Recomeçar
      </button>
    </section>
  );
}

const CSS = `
.ing{display:block;max-width:680px;width:100%;margin:110px auto 40px;padding:24px;box-sizing:border-box;background:#fff;color:#0f172a;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.35);text-align:left}
.ing *{box-sizing:border-box}
.ing h2{margin:0 0 4px;font-size:1.8rem;color:#0f172a}
.ing h3{margin:12px 0 4px;color:#0f172a}
.ing p{color:#475569;margin:4px 0 16px}
.ing label{display:block;color:#0f172a;font-weight:600}
.ing select,.ing input[type=text]{display:block;width:100%;padding:10px 12px;margin-top:6px;font-size:16px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#0f172a}
.ing .ing-tabs{display:flex;gap:8px;margin:18px 0}
.ing .ing-tabs button{flex:1;width:auto;margin:0;padding:10px;border:1px solid #cbd5e1;border-radius:8px;background:#f1f5f9;color:#0f172a;cursor:pointer;font-size:15px}
.ing .ing-tabs button[aria-selected=true]{background:#1d4ed8;color:#fff;border-color:#1d4ed8}
.ing .ing-q{display:block;min-width:0;margin:0;padding:14px 0;border:0;border-bottom:1px solid #e2e8f0}
.ing .ing-q legend{float:none;width:auto;padding:0;margin-bottom:6px;font-weight:700;color:#0f172a}
.ing .ing-q label{display:flex;align-items:center;gap:8px;padding:6px 0;font-weight:400;cursor:pointer}
.ing .ing-q input[type=radio]{width:auto;margin:0}
.ing .ing-ok,.ing .ing-err{margin-top:8px;padding:10px 12px;border-radius:8px}
.ing .ing-ok{background:#dcfce7;color:#14532d}
.ing .ing-err{background:#fee2e2;color:#7f1d1d}
.ing .ing-warn{color:#b45309}
.ing .ing-btn{display:inline-block;width:auto;margin-top:14px;padding:12px 18px;border:0;border-radius:8px;background:#1d4ed8;color:#fff;font-size:16px;cursor:pointer}
.ing .ing-reset{display:block;background:#475569}
.ing .ing-listen{display:inline-block;width:auto;margin-left:10px;padding:2px 8px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;color:#0f172a;cursor:pointer;font-size:14px}
.ing progress{width:100%;height:14px}
`;