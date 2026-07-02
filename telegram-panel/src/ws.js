const { WebSocketServer } = require('ws');
const auth = require('./auth');
const store = require('./store');
const { getTelegramService } = require('./telegramService');

function parseCookies(header) {
  const result = {};
  (header || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    if (key) result[key] = val;
  });
  return result;
}

let wssInstance = null;

function attachWebsocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  wssInstance = wss;
  const tg = getTelegramService();

  wss.on('connection', (ws, req) => {
    const cookies = parseCookies(req.headers.cookie);
    const payload = cookies[auth.COOKIE_NAME] && auth.verifyToken(cookies[auth.COOKIE_NAME]);
    const user = payload && store.getUserById(payload.id);
    if (!user) {
      ws.close(4001, 'unauthorized');
      return;
    }
    ws.user = user;
  });

  tg.on('message', ({ chatId, message }) => {
    wss.clients.forEach((ws) => {
      if (ws.readyState !== ws.OPEN || !ws.user) return;
      const allowed = ws.user.role === 'admin' || !!store.getAssignment(ws.user.id, chatId);
      if (!allowed) return;
      ws.send(
        JSON.stringify({
          type: 'message',
          chatId,
          message: { id: message.id, date: message.date, text: message.text, out: message.out },
        }),
      );
    });
  });

  return wss;
}

// Рассылка событий очереди всем подключённым (и админу, и операторам),
// чтобы список свободных чатов обновлялся в реальном времени у всех.
function broadcastQueueEvent(event) {
  if (!wssInstance) return;
  wssInstance.clients.forEach((ws) => {
    if (ws.readyState !== ws.OPEN || !ws.user) return;
    ws.send(JSON.stringify(event));
  });
}

module.exports = { attachWebsocket, broadcastQueueEvent };
