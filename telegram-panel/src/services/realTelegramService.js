const { EventEmitter } = require('events');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const { Api } = require('telegram/tl');
const config = require('../config');

class RealTelegramService extends EventEmitter {
  constructor() {
    super();
    this.client = new TelegramClient(
      new StringSession(config.tg.session),
      config.tg.apiId,
      config.tg.apiHash,
      { connectionRetries: 5 },
    );
  }

  async start() {
    await this.client.connect();
    this.client.addEventHandler(async (event) => {
      const m = event.message;
      if (!m) return;
      const chatId = String(m.chatId ?? (m.peerId && m.peerId.userId) ?? m.peerId);
      this.emit('message', { chatId, message: this._serialize(m) });
    }, new NewMessage({}));
    return true;
  }

  _serialize(m) {
    return {
      id: m.id,
      date: (m.date || 0) * 1000,
      text: m.message || '',
      out: !!m.out,
    };
  }

  async listDialogs(limit = 200) {
    const dialogs = await this.client.getDialogs({ limit });
    return dialogs.map((d) => ({
      id: String(d.id),
      title: d.title || d.name || 'Без названия',
    }));
  }

  async getMessages(chatId, limit = 50) {
    const messages = await this.client.getMessages(chatId, { limit });
    return messages.reverse().map((m) => this._serialize(m));
  }

  async sendMessage(chatId, text) {
    const m = await this.client.sendMessage(chatId, { message: text });
    return this._serialize(m);
  }

  async deleteMessages(chatId, ids) {
    await this.client.deleteMessages(chatId, ids, { revoke: true });
  }

  async deleteChat(chatId) {
    await this.client.invoke(
      new Api.messages.DeleteHistory({
        peer: chatId,
        maxId: 0,
        revoke: true,
      }),
    );
  }
}

module.exports = RealTelegramService;
