const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('./config');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function load() {
  if (!fs.existsSync(DB_PATH)) {
    return { nextUserId: 1, nextAssignmentId: 1, users: [], assignments: [] };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
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
};
