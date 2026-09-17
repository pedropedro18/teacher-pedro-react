import fs from "fs";

// corrigirIA.js verifica process.env.GEMINI_API_KEY logo no import
// (tem um console.log no topo do ficheiro), por isso definimos a
// variável ANTES de importar, com import dinâmico.
process.env.GEMINI_API_KEY = "chave-de-teste-123456";

const { corrigirComIA } = await import("../api/corrigirIA.js");

beforeEach(() => {
  jest.restoreAllMocks();
  // Evita escrever mesmo o ficheiro resposta-debug.json durante os testes
  jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  // A função espera (2s, 4s, 8s...) antes de repetir em caso de erro 503.
  // Fazemos o setTimeout correr o callback de imediato, sem esperar mesmo,
  // para os testes não demorarem segundos a correr.
  jest.spyOn(global, "setTimeout").mockImplementation((cb) => cb());
});

function respostaComSucesso(nota, feedback) {
  return {
    json: async () => ({
      candidates: [
        { content: { parts: [{ text: JSON.stringify({ nota, feedback }) }] } },
      ],
    }),
  };
}

function respostaComErro(codigo) {
  return { json: async () => ({ error: { code: codigo } }) };
}

describe("corrigirComIA", () => {
  test("devolve nota e feedback quando a IA responde com sucesso à primeira", async () => {
    global.fetch = jest.fn().mockResolvedValue(respostaComSucesso(16, "Bom trabalho."));

    const resultado = await corrigirComIA("Texto do aluno", "B1");

    expect(resultado).toEqual({ nota: 16, feedback: "Bom trabalho." });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test("devolve null quando a API falha com um erro que não é 503 (não repete)", async () => {
    global.fetch = jest.fn().mockResolvedValue(respostaComErro(400));

    const resultado = await corrigirComIA("Texto do aluno", "B1");

    expect(resultado).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("repete em caso de 503 e devolve sucesso na 2ª tentativa", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(respostaComErro(503))
      .mockResolvedValueOnce(respostaComSucesso(12, "Ok, mas revê a gramática."));

    const resultado = await corrigirComIA("Texto do aluno", "A2");

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(resultado).toEqual({ nota: 12, feedback: "Ok, mas revê a gramática." });
  });

  test("devolve null se todas as 3 tentativas falharem com 503", async () => {
    global.fetch = jest.fn().mockResolvedValue(respostaComErro(503));

    const resultado = await corrigirComIA("Texto do aluno", "A2");

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(resultado).toBeNull();
  });

  test("devolve null se a IA responder com texto que não é JSON válido", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "isto não é JSON válido" }] } }],
      }),
    });

    const resultado = await corrigirComIA("Texto do aluno", "B1");

    expect(resultado).toBeNull();
  });
});