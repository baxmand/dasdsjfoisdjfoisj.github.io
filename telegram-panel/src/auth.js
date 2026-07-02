const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');
const store = require('./store');

const COOKIE_NAME = 'panel_token';

function issueToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, config.jwtSecret, {
    expiresIn: '12h',
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}

function checkPassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash);
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  const payload = token && verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Не авторизован' });
  const user = store.getUserById(payload.id);
  if (!user) return res.status(401).json({ error: 'Не авторизован' });
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Доступ запрещён' });
  next();
}

module.exports = { COOKIE_NAME, issueToken, verifyToken, checkPassword, requireAuth, requireAdmin };
