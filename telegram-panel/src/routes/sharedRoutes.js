const express = require('express');
const store = require('../store');
const auth = require('../auth');
const { broadcastQueueEvent } = require('../ws');

const router = express.Router();
router.use(auth.requireAuth);

// Шаблоны ответов — читать может любой авторизованный (админ и операторы),
// редактирует только админ (см. adminRoutes.js).
router.get('/templates', (req, res) => {
  res.json(store.listTemplates());
});

// Очередь свободных чатов — видят все, забрать чат себе может оператор.
router.get('/queue', (req, res) => {
  res.json(store.listQueue());
});

router.post('/queue/:id/claim', (req, res) => {
  if (req.user.role !== 'operator') {
    return res.status(400).json({ error: 'Забирать чаты из очереди может только оператор' });
  }
  const assignment = store.claimQueueItem(Number(req.params.id), req.user.id);
  if (!assignment) {
    return res.status(409).json({ error: 'Этот чат уже забрал другой оператор' });
  }
  broadcastQueueEvent({ type: 'queue:removed', id: Number(req.params.id) });
  res.json(assignment);
});

module.exports = router;
