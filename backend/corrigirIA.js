import 'dotenv/config';

const MODELO = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

console.log('Chave carregada:', process.env.GEMINI_API_KEY ? 'SIM' : 'NÃO CARREGOU');

async function corrigirComIA(textoAluno, nivelCEFR) {
  const chave = process.env.GEMINI_API_KEY?.trim();

  if (!chave) {
    console.error('GEMINI_API_KEY não está definida no .env');
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': chave
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Você é um professor de inglês. Corrija o texto abaixo, escrito por um aluno de nível ${nivelCEFR}.
Responda apenas em JSON, com esta estrutura:
{
  "textoCorrigido": "texto corrigido",
  "erros": [{ "original": "...", "correcao": "...", "explicacao": "..." }],
  "comentario": "feedback curto para o aluno"
}

Texto do aluno:
${textoAluno}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.candidates?.length) {
      console.error('Erro da API Gemini:', response.status, data);
      return null;
    }

    const conteudo = data.candidates[0].content.parts[0].text;
    return JSON.parse(conteudo);
  } catch (erro) {
    console.error('Erro na correção IA:', erro);
    return null;
  }
}

export { corrigirComIA };