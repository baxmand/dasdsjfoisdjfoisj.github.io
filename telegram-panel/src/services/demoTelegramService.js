const { EventEmitter } = require('events');

const REPLIES = [
  'Спасибо, жду ответа.',
  'А можно уточнить сроки?',
  'Хорошо, договорились.',
  'Уточните, пожалуйста, цену.',
];

class DemoTelegramService extends EventEmitter {
  constructor() {
    super();
    this.dialogs = [
      { id: '1001', title: 'Иван Петров' },
      { id: '1002', title: 'Мария Смирнова' },
      { id: '1003', title: 'Отдел продаж (группа)' },
    ];
    this.messages = {
      1001: [
        { id: 1, date: Date.now() - 60000, text: 'Здравствуйте! Подскажите по заказу.', out: false },
        { id: 2, date: Date.now() - 50000, text: 'Добрый день! Конечно, слушаю вас.', out: true },
      ],
      1002: [{ id: 1, date: Date.now() - 120000, text: 'Когда доставка?', out: false }],
      1003: [{ id: 1, date: Date.now() - 30000, text: 'Всем привет в группе', out: false }],
    };
    this.nextId = { 1001: 3, 1002: 2, 1003: 2 };
    this._timer = null;
  }

  async start() {
    this._timer = setInterval(() => this._simulateIncoming(), 25000);
    this._timer.unref?.();
    return true;
  }

  async listDialogs() {
    return this.dialogs.map((d) => ({ ...d }));
  }

  async getMessages(chatId, limit = 50) {
    return (this.messages[chatId] || []).slice(-limit).map((m) => ({ ...m }));
  }

  async sendMessage(chatId, text) {
    if (!this.messages[chatId]) this.messages[chatId] = [];
    if (this.nextId[chatId] === undefined) this.nextId[chatId] = 1;
    const msg = { id: this.nextId[chatId]++, date: Date.now(), text, out: true };
    this.messages[chatId].push(msg);
    return { ...msg };
  }

  async deleteMessages(chatId, ids) {
    if (!this.messages[chatId]) return;
    this.messages[chatId] = this.messages[chatId].filter((m) => !ids.includes(m.id));
  }

  async deleteChat(chatId) {
    delete this.messages[chatId];
    delete this.nextId[chatId];
    this.dialogs = this.dialogs.filter((d) => d.id !== String(chatId));
  }

  _simulateIncoming() {
    const chatIds = Object.keys(this.messages);
    if (chatIds.length === 0) return;
    const chatId = chatIds[Math.floor(Math.random() * chatIds.length)];
    const text = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    if (this.nextId[chatId] === undefined) this.nextId[chatId] = 1;
    const msg = { id: this.nextId[chatId]++, date: Date.now(), text, out: false };
    this.messages[chatId].push(msg);
    this.emit('message', { chatId: String(chatId), message: msg });
  }
}

module.exports = DemoTelegramService;
