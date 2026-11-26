import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD_HASH = (process.env.ADMIN_PASSWORD_HASH || '').trim();

export async function login(req, res) {
  const { email, password } = req.body || {};
  const emailLimpo = (email || '').trim().toLowerCase();

  // DEBUG (apagar depois)
  console.log('ADMIN_EMAIL definido?', !!ADMIN_EMAIL);
  console.log('email igual?', emailLimpo === ADMIN_EMAIL);
  console.log('tamanho do hash:', ADMIN_PASSWORD_HASH.length);
  console.log('JWT_SECRET definido?', !!SECRET);

  if (!ADMIN_EMAIL || emailLimpo !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const valid = await bcrypt.compare(password || '', ADMIN_PASSWORD_HASH);
  console.log('password válida?', valid); // DEBUG
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