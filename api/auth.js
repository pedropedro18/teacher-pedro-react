import request from "supertest";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// auth.js lê ADMIN_EMAIL / ADMIN_PASSWORD_HASH / JWT_SECRET do
// process.env logo no topo do ficheiro (fora de qualquer função).
// Por isso definimos as env vars ANTES de importar o módulo,
// usando import dinâmico.
const PASSWORD_VALIDA = "password123";
const HASH_VALIDO = bcrypt.hashSync(PASSWORD_VALIDA, 10);

process.env.JWT_SECRET = "segredo-de-teste";
process.env.ADMIN_EMAIL = "admin@teste.com";
process.env.ADMIN_PASSWORD_HASH = HASH_VALIDO;

const { login, verificarToken } = await import("../api/auth.js");

const app = express();
app.use(express.json());
app.post("/api/auth/login", login);
app.get("/api/protegido", verificarToken, (req, res) => res.json({ ok: true }));

describe("POST /api/auth/login", () => {
  test("login válido devolve um token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@teste.com", password: PASSWORD_VALIDA });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.email).toBe("admin@teste.com");
  });

  test("email diferente do admin é recusado", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "outro@teste.com", password: PASSWORD_VALIDA });

    expect(res.statusCode).toBe(401);
  });

  test("password errada é recusada", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@teste.com", password: "password-errada" });

    expect(res.statusCode).toBe(401);
  });
});

describe("verificarToken (middleware)", () => {
  test("bloqueia pedido sem header Authorization", async () => {
    const res = await request(app).get("/api/protegido");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Sem token");
  });

  test("bloqueia token inválido/adulterado", async () => {
    const res = await request(app)
      .get("/api/protegido")
      .set("Authorization", "Bearer token-invalido");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Token inválido");
  });

  test("permite acesso com token válido", async () => {
    const token = jwt.sign({ email: "admin@teste.com" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/api/protegido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test("bloqueia token expirado", async () => {
    const tokenExpirado = jwt.sign({ email: "admin@teste.com" }, process.env.JWT_SECRET, {
      expiresIn: "-1s", // já expirado
    });

    const res = await request(app)
      .get("/api/protegido")
      .set("Authorization", `Bearer ${tokenExpirado}`);

    expect(res.statusCode).toBe(401);
  });
});

// -------------------------------------------------------------------
// NOTA (achado real ao ler o código): a função login não valida se
// email/password vêm preenchidos no body antes de chamar
// bcrypt.compare(password, hash). Se password vier undefined,
// bcrypt.compare pode rejeitar/lançar erro, e como login é async
// sem try/catch, o Express não apanha essa exceção automaticamente —
// o pedido pode ficar "pendurado" sem resposta em vez de devolver 400.
//
// Por isso não incluímos aqui um teste automático para esse caso
// (poderia fazer o test suite ficar à espera indefinidamente).
// Recomendação de correção no auth.js:
//
//   export async function login(req, res) {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email e password são obrigatórios' });
//     }
//     ...
//   }
//
// Depois de adicionares isto, podes reativar um teste como:
//
//   test("recusa login sem password", async () => {
//     const res = await request(app)
//       .post("/api/auth/login")
//       .send({ email: "admin@teste.com" });
//     expect(res.statusCode).toBe(400);
//   });
// -