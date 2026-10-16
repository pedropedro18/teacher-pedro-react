const SISTEMA = `És o assistente virtual do "Teacher Pedro", professor de inglês em Angola.
Respondes em português, de forma curta, simpática e clara.

Cursos de inglês (níveis CEFR), preços a partir de:
- A1 Iniciante: 8 semanas, Kz 15.000/mês
- A2 Elementar: 8 semanas, Kz 15.000/mês
- B1 Intermédio (o mais procurado): 10 semanas, Kz 18.000/mês
- B2 Intermédio Alto: 10 semanas, Kz 18.000/mês
- C1 Avançado: 12 semanas, preço no WhatsApp
- C2 Proficiente: 12 semanas, preço no WhatsApp

Também há cursos de Excel e programação/web.
Para se inscrever, a pessoa clica em "Inscrever-me" na página de cursos ou fala no WhatsApp.
Se não souberes algo, não inventes: sugere falar com o professor no WhatsApp.

Regras de formato:
- Responde em texto simples, sem markdown: não uses asteriscos, cardinais nem negrito.
- Para listas, usa uma linha por item começando com "- ".
- Responde sempre em no máximo 4 frases curtas ou uma lista breve.`;

// Podes forçar um modelo com a variável GEMINI_MODEL no Vercel.
const MODELOS = [
  process.env.GEMINI_MODEL,
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
].filter(Boolean);

const TIMEOUT_MS = 15000;

// Códigos em que vale a pena tentar outro modelo
const TENTAR_OUTRO = [404, 429, 500, 502, 503, 504];

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function chamarGemini(modelo, chave, msgs, comThinking) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const generationConfig = { maxOutputTokens: 800 };
  if (comThinking) generationConfig.thinkingConfig = { thinkingBudget: 0 };

  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": chave,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SISTEMA }] },
          contents: msgs,
          generationConfig,
        }),
      }
    );
  } finally {
    clearTimeout(timer);
  }
}

// Tenta um modelo; se der 400 repete sem thinkingConfig
async function tentarModelo(modelo, chave, msgs) {
  let r = await chamarGemini(modelo, chave, msgs, true);
  if (r.status === 400) {
    console.error(`400 com thinkingConfig em ${modelo}, a repetir sem ele`);
    r = await chamarGemini(modelo, chave, msgs, false);
  }
  return r;
}

function limparTexto(t) {
  return t
    .replace(/\\/g, "")
    .replace(/__/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[*•]\s+/gm, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const chave = process.env.GEMINI_API_KEY;
  if (!chave) {
    console.error("GEMINI_API_KEY não definida");
    return res.status(500).json({ erro: "Servidor mal configurado" });
  }

  try {
    const { mensagens } = req.body || {};

    if (!Array.isArray(mensagens) || mensagens.length === 0) {
      return res.status(400).json({ erro: "Sem mensagens" });
    }

    const msgs = mensagens
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .slice(-10)
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content.slice(0, 500) }],
      }));

    // A primeira mensagem tem de ser do utilizador
    while (msgs.length && msgs[0].role !== "user") msgs.shift();

    if (msgs.length === 0) {
      return res.status(400).json({ erro: "Histórico inválido" });
    }

    let r = null;
    let modeloUsado = null;
    let timeouts = 0;
    const inicio = Date.now();

    for (const modelo of MODELOS) {
      modeloUsado = modelo;

      // até 2 tentativas por modelo
      for (let tentativa = 1; tentativa <= 2; tentativa++) {
        try {
          r = await tentarModelo(modelo, chave, msgs);
        } catch (e) {
          if (e.name === "AbortError") {
            console.error(`Timeout em ${modelo}`);
            timeouts++;
            r = null;
            break; // passa ao próximo modelo
          }
          throw e;
        }

        if (r.ok) break;

        console.error(`Erro ${r.status} em ${modelo} (tentativa ${tentativa})`);

        // 503/429/500: espera um pouco e repete o mesmo modelo
        if ([429, 500, 502, 503, 504].includes(r.status) && tentativa === 1) {
          await espera(700);
          continue;
        }
        break;
      }

      if (r && r.ok) break;
      if (r && !TENTAR_OUTRO.includes(r.status)) break; // erro que outro modelo não resolve
    }

    if (!r) {
      return res.status(504).json({ erro: "Tempo esgotado", timeouts });
    }

    if (!r.ok) {
      const detalhe = await r.text();
      console.error("Erro da API:", r.status, modeloUsado, detalhe);
      return res.status(502).json({
        erro: "Falha na API",
        status: r.status,
        modelo: modeloUsado,
      });
    }

    const dados = await r.json();
    const bruto = (dados.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("");
    const texto = limparTexto(bruto);

    if (!texto) {
      console.error("Resposta vazia:", JSON.stringify(dados).slice(0, 300));
      return res.status(502).json({ erro: "Resposta vazia" });
    }

    console.log(`OK ${modeloUsado} em ${Date.now() - inicio}ms`);
    return res.status(200).json({ texto });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Erro interno" });
  }
}