const express = require('express');
const store = require('../store');
const auth = require('../auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = username && store.getUserByUsername(username);
  if (!user || !auth.checkPassword(user, password || '')) {
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  }
  const token = auth.issueToken(user);
  res.cookie(auth.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000,
  });
  res.json({ id: user.id, username: user.username, role: user.role });
});

router.post('/logout', (req, res) => {
  res.clearCookie(auth.COOKIE_NAME);
  res.json({ ok: true });
});

router.get('/me', auth.requireAuth, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
});

module.exports = router;
