import os
import psycopg2
import psycopg2.extras
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

def db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

class Aluno(BaseModel):
    nome: str
    chave: str

@app.get("/api/alunos")
def listar():
    with db() as c, c.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("SELECT id, nome, chave, ativo FROM alunos ORDER BY id")
        return cur.fetchall()

@app.post("/api/alunos")
def criar(a: Aluno):
    try:
        with db() as c, c.cursor() as cur:
            cur.execute("INSERT INTO alunos (nome, chave) VALUES (%s, %s)", (a.nome, a.chave))
    except psycopg2.errors.UniqueViolation:
        raise HTTPException(400, "Chave já existe")
    return {"ok": True}

@app.delete("/api/alunos/{id}")
def apagar(id: int):
    with db() as c, c.cursor() as cur:
        cur.execute("DELETE FROM alunos WHERE id = %s", (id,))
    return {"ok": True}

@app.post("/api/login")
def login(a: dict):
    with db() as c, c.cursor() as cur:
        cur.execute("SELECT nome FROM alunos WHERE chave = %s AND ativo", (a.get("chave"),))
        r = cur.fetchone()
    if not r:
        raise HTTPException(401, "Chave inválida")
    return {"nome": r[0]}