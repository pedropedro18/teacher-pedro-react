import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export async function login(req, res) {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: '7d' });
  res.json({ token });
}