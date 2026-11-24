import 'dotenv/config';

console.log(
  'Chave carregada:',
  process.env.GEMINI_API_KEY ? 'SIM, começa com ' + process.env.GEMINI_API_KEY.slice(0, 6) : 'NÃO CARREGOU'
);

async function corrigirComIA(textoAluno, nivelCEFR) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Você é um professor de inglês corrigindo um texto de nível ${nivelCEFR}. Dê: ${textoAluno}`
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

    if (!data.candidates) {
      console.error('Resposta da API sem candidates:', data);
      return null;
    }

    const fs = await import('fs');
    fs.writeFileSync('resposta-debug.json', JSON.stringify(data, null, 2));

    const conteudo = data.candidates[0].content.parts[0].text;
    return JSON.parse(conteudo);
  } catch (erro) {
    console.error('Erro na correção IA:', erro);
    return null;
  }
}

export { corrigirComIA };