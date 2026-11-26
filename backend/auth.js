import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD_HASH = (process.env.ADMIN_PASSWORD_HASH || '').trim();

export async function login(req, res) {
  const { email, password } = req.body || {};
  const emailLimpo = (email || '').trim().toLowerCase();

  if (!ADMIN_EMAIL || emailLimpo !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const valid = await bcrypt.compare(password || '', ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ email: emailLimpo }, SECRET, { expiresIn: '7d' });
  res.json({ token });
}

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}