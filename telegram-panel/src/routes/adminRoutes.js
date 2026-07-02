const express = require('express');
const store = require('../store');
const auth = require('../auth');
const { getTelegramService } = require('../telegramService');
const { broadcastQueueEvent } = require('../ws');

const router = express.Router();
router.use(auth.requireAuth, auth.requireAdmin);

router.get('/operators', (req, res) => {
  const operators = store.listOperators().map((u) => ({
    id: u.id,
    username: u.username,
    createdAt: u.createdAt,
    assignments: store.getAssignmentsForUser(u.id),
  }));
  res.json(operators);
});

router.post('/operators', express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: 'Укажите имя пользователя и пароль (мин. 6 символов)' });
  }
  try {
    const user = store.createOperator(username, password);
    res.json({ id: user.id, username: user.username });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/operators/:id', (req, res) => {
  store.deleteOperator(Number(req.params.id));
  res.json({ ok: true });
});

router.post('/operators/:id/assignments', express.json(), (req, res) => {
  const { chatId, displayName, canSend, canDelete } = req.body || {};
  if (!chatId || !displayName) {
    return res.status(400).json({ error: 'Укажите chatId и отображаемое имя чата' });
  }
  const assignment = store.upsertAssignment({
    userId: Number(req.params.id),
    chatId,
    displayName,
    canSend: !!canSend,
    canDelete: !!canDelete,
  });
  res.json(assignment);
});

router.delete('/operators/:id/assignments/:chatId', (req, res) => {
  store.removeAssignment(Number(req.params.id), req.params.chatId);
  res.json({ ok: true });
});

router.delete('/chats/:chatId', async (req, res) => {
  const tg = getTelegramService();
  await tg.deleteChat(req.params.chatId);
  res.json({ ok: true });
});

// --- Шаблоны ответов ---

router.post('/templates', express.json(), (req, res) => {
  const { title, text } = req.body || {};
  if (!title || !text) return res.status(400).json({ error: 'Укажите название и текст шаблона' });
  res.json(store.createTemplate(title, text));
});

router.put('/templates/:id', express.json(), (req, res) => {
  try {
    res.json(store.updateTemplate(Number(req.params.id), req.body || {}));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/templates/:id', (req, res) => {
  store.deleteTemplate(Number(req.params.id));
  res.json({ ok: true });
});

// --- Очередь свободных чатов ---

router.post('/queue', express.json(), (req, res) => {
  const { chatId, displayName, canSend, canDelete } = req.body || {};
  if (!chatId || !displayName) {
    return res.status(400).json({ error: 'Укажите chatId и алиас' });
  }
  const item = store.addToQueue({ chatId, displayName, canSend: !!canSend, canDelete: !!canDelete });
  broadcastQueueEvent({ type: 'queue:new', item });
  res.json(item);
});

router.delete('/queue/:id', (req, res) => {
  store.removeFromQueue(Number(req.params.id));
  broadcastQueueEvent({ type: 'queue:removed', id: Number(req.params.id) });
  res.json({ ok: true });
});

// --- Статистика по операторам ---

router.get('/stats', (req, res) => {
  res.json(store.getOperatorStats());
});

module.exports = router;
