require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config');
const store = require('./store');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sharedRoutes = require('./routes/sharedRoutes');
const { getTelegramService } = require('./telegramService');
const { attachWebsocket } = require('./ws');

async function main() {
  store.init();

  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/api', authRoutes);
  app.use('/api', sharedRoutes);
  app.use('/api/chats', chatRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/', (req, res) => res.redirect('/login.html'));

  const tg = getTelegramService();
  await tg.start();

  const server = http.createServer(app);
  attachWebsocket(server);

  server.listen(config.port, () => {
    console.log(`[server] Панель запущена: http://localhost:${config.port}`);
    if (config.demoMode) {
      console.log(
        `[server] Демо-режим (без реального Telegram). Вход: ${config.adminUsername} / ${config.adminPassword}`,
      );
    }
  });
}

main().catch((err) => {
  console.error('Не удалось запустить сервер:', err);
  process.exit(1);
});
