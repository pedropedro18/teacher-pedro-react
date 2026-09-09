import 'dotenv/config';

console.log(
  'Chave carregada:',
  process.env.GEMINI_API_KEY ? 'SIM, começa com ' + process.env.GEMINI_API_KEY.slice(0, 6) : 'NÃO CARREGOU'
);

async function chamarGeminiComRetry(textoAluno, nivelCEFR, tentativas = 3, esperaMs = 2000) {
  for (let i = 0; i < tentativas; i++) {
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

    // Se veio candidates, sucesso — devolve já
    if (data.candidates) {
      return data;
    }

    // Se for erro 503 (sobrecarregado) e ainda temos tentativas, espera e repete
    const codigoErro = data?.error?.code;
    if (codigoErro === 503 && i < tentativas - 1) {
      console.log(`Tentativa ${i + 1} falhou (503 - modelo sobrecarregado), a tentar novamente em ${esperaMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, esperaMs));
      esperaMs *= 2; // duplica o tempo de espera a cada tentativa (2s, 4s, 8s...)
      continue;
    }

    // Outro tipo de erro, ou esgotaram-se as tentativas — regista e desiste
    console.error('Resposta da API sem candidates:', data);
    return null;
  }

  return null;
}

async function corrigirComIA(textoAluno, nivelCEFR) {
  try {
    const data = await chamarGeminiComRetry(textoAluno, nivelCEFR);

    if (!data) {
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