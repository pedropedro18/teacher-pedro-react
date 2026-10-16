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
Responde sempre em no máximo 4 frases curtas ou uma lista breve.`;

// Podes forçar um modelo com a variável GEMINI_MODEL no Vercel.
const MODELOS = [
  process.env.GEMINI_MODEL,
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
].filter(Boolean);

async function chamarGemini(modelo, chave, msgs) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": chave,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SISTEMA }] },
        contents: msgs,
        generationConfig: {
          maxOutputTokens: 600,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  );
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

    for (const modelo of MODELOS) {
      r = await chamarGemini(modelo, chave, msgs);
      modeloUsado = modelo;
      if (r.status !== 404) break; // só tenta o próximo se o modelo não existir
      console.error(`Modelo não encontrado: ${modelo}`);
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
    const texto = (dados.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("")
      .trim();

    if (!texto) {
      console.error("Resposta vazia:", JSON.stringify(dados).slice(0, 300));
      return res.status(502).json({ erro: "Resposta vazia" });
    }

    return res.status(200).json({ texto });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Erro interno" });
  }
}