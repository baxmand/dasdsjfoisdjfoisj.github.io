const express = require('express');
const store = require('../store');
const auth = require('../auth');
const { getTelegramService } = require('../telegramService');

const router = express.Router();
router.use(auth.requireAuth);

function resolveAccess(req, chatId) {
  if (req.user.role === 'admin') return { allowed: true, canSend: true, canDelete: true };
  const a = store.getAssignment(req.user.id, chatId);
  if (!a) return { allowed: false };
  return { allowed: true, canSend: !!a.canSend, canDelete: !!a.canDelete };
}

// Список чатов, доступных текущему пользователю.
// Админ видит реальные названия диалогов Telegram; оператор — только
// назначенные ему чаты под алиасом, заданным админом (никаких username/id собеседника).
router.get('/', async (req, res) => {
  const tg = getTelegramService();
  if (req.user.role === 'admin') {
    const dialogs = await tg.listDialogs();
    return res.json(dialogs.map((d) => ({ chatId: d.id, title: d.title, canSend: true, canDelete: true })));
  }
  const assignments = store.getAssignmentsForUser(req.user.id);
  res.json(
    assignments.map((a) => ({
      chatId: a.chatId,
      title: a.displayName,
      canSend: !!a.canSend,
      canDelete: !!a.canDelete,
    })),
  );
});

// История чата: отдаём только текст/дату/направление ("я" / "собеседник").
// Поля с сущностью собеседника (username, phone, numeric id) сюда никогда не попадают.
router.get('/:chatId/messages', async (req, res) => {
  const access = resolveAccess(req, req.params.chatId);
  if (!access.allowed) return res.status(403).json({ error: 'Нет доступа к этому чату' });
  const tg = getTelegramService();
  const messages = await tg.getMessages(req.params.chatId, 100);
  res.json(messages.map((m) => ({ id: m.id, date: m.date, text: m.text, out: m.out })));
});

router.post('/:chatId/messages', express.json(), async (req, res) => {
  const access = resolveAccess(req, req.params.chatId);
  if (!access.allowed) return res.status(403).json({ error: 'Нет доступа к этому чату' });
  if (!access.canSend) return res.status(403).json({ error: 'Отправка сообщений запрещена для вашей роли' });
  const text = ((req.body && req.body.text) || '').trim();
  if (!text) return res.status(400).json({ error: 'Пустое сообщение' });
  const tg = getTelegramService();
  const msg = await tg.sendMessage(req.params.chatId, text);
  res.json({ id: msg.id, date: msg.date, text: msg.text, out: msg.out });
});

router.delete('/:chatId/messages/:msgId', async (req, res) => {
  const access = resolveAccess(req, req.params.chatId);
  if (!access.allowed) return res.status(403).json({ error: 'Нет доступа к этому чату' });
  if (!access.canDelete) return res.status(403).json({ error: 'Удаление запрещено для вашей роли' });
  const tg = getTelegramService();
  await tg.deleteMessages(req.params.chatId, [Number(req.params.msgId)]);
  res.json({ ok: true });
});

module.exports = router;
