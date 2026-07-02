const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('./config');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function load() {
  if (!fs.existsSync(DB_PATH)) {
    return {
      nextUserId: 1,
      nextAssignmentId: 1,
      nextTemplateId: 1,
      nextQueueId: 1,
      users: [],
      assignments: [],
      templates: [],
      queue: [],
      messageLog: [],
    };
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  db.templates = db.templates || [];
  db.queue = db.queue || [];
  db.messageLog = db.messageLog || [];
  db.nextTemplateId = db.nextTemplateId || 1;
  db.nextQueueId = db.nextQueueId || 1;
  return db;
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function init() {
  const db = load();
  if (!db.users.find((u) => u.role === 'admin')) {
    db.users.push({
      id: db.nextUserId++,
      username: config.adminUsername,
      passwordHash: bcrypt.hashSync(config.adminPassword, 10),
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    save(db);
    console.log(`[setup] Создан admin-пользователь панели: ${config.adminUsername}`);
  }
}

function getUserByUsername(username) {
  return load().users.find((u) => u.username === username) || null;
}

function getUserById(id) {
  return load().users.find((u) => u.id === id) || null;
}

function listOperators() {
  return load().users.filter((u) => u.role === 'operator');
}

function createOperator(username, password) {
  const db = load();
  if (db.users.find((u) => u.username === username)) {
    throw new Error('Пользователь с таким именем уже существует');
  }
  const user = {
    id: db.nextUserId++,
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'operator',
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  save(db);
  return user;
}

function deleteOperator(id) {
  const db = load();
  db.users = db.users.filter((u) => !(u.id === id && u.role === 'operator'));
  db.assignments = db.assignments.filter((a) => a.userId !== id);
  save(db);
}

function getAssignmentsForUser(userId) {
  return load().assignments.filter((a) => a.userId === userId);
}

function getAssignment(userId, chatId) {
  return (
    load().assignments.find((a) => a.userId === userId && a.chatId === String(chatId)) || null
  );
}

function upsertAssignment({ userId, chatId, displayName, canSend, canDelete }) {
  const db = load();
  chatId = String(chatId);
  let assignment = db.assignments.find((a) => a.userId === userId && a.chatId === chatId);
  if (assignment) {
    assignment.displayName = displayName;
    assignment.canSend = canSend;
    assignment.canDelete = canDelete;
  } else {
    assignment = {
      id: db.nextAssignmentId++,
      userId,
      chatId,
      displayName,
      canSend,
      canDelete,
      createdAt: new Date().toISOString(),
    };
    db.assignments.push(assignment);
  }
  save(db);
  return assignment;
}

function removeAssignment(userId, chatId) {
  const db = load();
  db.assignments = db.assignments.filter((a) => !(a.userId === userId && a.chatId === String(chatId)));
  save(db);
}

// --- Шаблоны ответов ---

function listTemplates() {
  return load().templates;
}

function createTemplate(title, text) {
  const db = load();
  const t = { id: db.nextTemplateId++, title, text, createdAt: new Date().toISOString() };
  db.templates.push(t);
  save(db);
  return t;
}

function updateTemplate(id, { title, text }) {
  const db = load();
  const t = db.templates.find((x) => x.id === id);
  if (!t) throw new Error('Шаблон не найден');
  if (title !== undefined) t.title = title;
  if (text !== undefined) t.text = text;
  save(db);
  return t;
}

function deleteTemplate(id) {
  const db = load();
  db.templates = db.templates.filter((t) => t.id !== id);
  save(db);
}

// --- Очередь чатов (свободные чаты, которые операторы могут взять себе) ---

function listQueue() {
  return load().queue;
}

function addToQueue({ chatId, displayName, canSend, canDelete }) {
  const db = load();
  const item = {
    id: db.nextQueueId++,
    chatId: String(chatId),
    displayName,
    canSend,
    canDelete,
    createdAt: new Date().toISOString(),
  };
  db.queue.push(item);
  save(db);
  return item;
}

function removeFromQueue(id) {
  const db = load();
  db.queue = db.queue.filter((q) => q.id !== id);
  save(db);
}

// Синхронная функция (без await внутри) — безопасна от гонки между
// несколькими операторами, пытающимися забрать один и тот же чат одновременно.
function claimQueueItem(id, userId) {
  const db = load();
  const idx = db.queue.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  const [item] = db.queue.splice(idx, 1);
  let assignment = db.assignments.find((a) => a.userId === userId && a.chatId === item.chatId);
  if (assignment) {
    assignment.displayName = item.displayName;
    assignment.canSend = item.canSend;
    assignment.canDelete = item.canDelete;
  } else {
    assignment = {
      id: db.nextAssignmentId++,
      userId,
      chatId: item.chatId,
      displayName: item.displayName,
      canSend: item.canSend,
      canDelete: item.canDelete,
      createdAt: new Date().toISOString(),
    };
    db.assignments.push(assignment);
  }
  save(db);
  return assignment;
}

// --- Статистика по операторам ---

function logSentMessage(userId, chatId) {
  const db = load();
  db.messageLog.push({ userId, chatId: String(chatId), date: Date.now() });
  if (db.messageLog.length > 5000) db.messageLog = db.messageLog.slice(-5000);
  save(db);
}

function getOperatorStats() {
  const db = load();
  const dayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  return db.users
    .filter((u) => u.role === 'operator')
    .map((u) => {
      const logs = db.messageLog.filter((l) => l.userId === u.id);
      return {
        id: u.id,
        username: u.username,
        messagesTotal: logs.length,
        messagesToday: logs.filter((l) => now - l.date < dayMs).length,
        assignedChats: db.assignments.filter((a) => a.userId === u.id).length,
      };
    });
}

module.exports = {
  init,
  getUserByUsername,
  getUserById,
  listOperators,
  createOperator,
  deleteOperator,
  getAssignmentsForUser,
  getAssignment,
  upsertAssignment,
  removeAssignment,
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  listQueue,
  addToQueue,
  removeFromQueue,
  claimQueueItem,
  logSentMessage,
  getOperatorStats,
};
