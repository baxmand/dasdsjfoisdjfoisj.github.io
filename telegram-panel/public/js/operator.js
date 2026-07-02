let currentChatId = null;
let currentChat = null;
let ws;

// --- Вспомогательные функции представления ---

function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] || '').join('').toUpperCase() || '?';
}

const AVATAR_COLORS = [
  '#e5484d', '#e07b1a', '#0a9d58', '#2f5be0', '#8e4ec6',
  '#d6409f', '#0f9b9b', '#c2410c', '#4f46e5', '#0d7490',
];

function avatarColor(key) {
  let hash = 0;
  const s = String(key);
  for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function avatarEl(name, chatId) {
  const el = document.createElement('span');
  el.className = 'chat-avatar';
  el.style.background = avatarColor(chatId || name);
  el.textContent = initials(name);
  return el;
}

async function loadMe() {
  const res = await fetch('/api/me');
  if (!res.ok) {
    window.location.href = 'login.html';
    return;
  }
  const me = await res.json();
  if (me.role !== 'operator') {
    window.location.href = me.role === 'admin' ? 'admin.html' : 'login.html';
    return;
  }
  document.getElementById('whoami').textContent = me.username;
}

async function loadChats() {
  const res = await fetch('/api/chats');
  const chats = await res.json();
  const list = document.getElementById('chatList');
  list.innerHTML = '';
  if (chats.length === 0) {
    list.innerHTML = '<li class="chat-list__empty">Вам пока не назначили ни одного чата</li>';
    return;
  }
  chats.forEach((chat) => {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.dataset.chatId = chat.chatId;
    const body = document.createElement('span');
    body.className = 'chat-item__body';
    const title = document.createElement('span');
    title.className = 'chat-item__title';
    title.textContent = chat.title;
    body.appendChild(title);
    li.appendChild(avatarEl(chat.title, chat.chatId));
    li.appendChild(body);
    li.addEventListener('click', () => openChat(chat));
    list.appendChild(li);
  });
}

async function openChat(chat) {
  currentChatId = chat.chatId;
  currentChat = chat;
  document
    .querySelectorAll('.chat-item')
    .forEach((el) => el.classList.toggle('active', el.dataset.chatId === chat.chatId));

  const header = document.getElementById('chatHeader');
  header.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'chat-header__title';
  wrap.appendChild(avatarEl(chat.title, chat.chatId));
  const t = document.createElement('span');
  t.textContent = chat.title;
  wrap.appendChild(t);
  header.appendChild(wrap);

  document.getElementById('composerForm').classList.toggle('d-none', !chat.canSend);
  await loadMessages();
}

// --- Вкладки ---

document.querySelectorAll('[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-chats').classList.toggle('d-none', btn.dataset.tab !== 'chats');
    document.getElementById('tab-queue').classList.toggle('d-none', btn.dataset.tab !== 'queue');
    if (btn.dataset.tab === 'queue') loadQueue();
  });
});

// --- Шаблоны ответов ---

const tplDropdown = document.getElementById('tplDropdown');
document.getElementById('tplToggle').addEventListener('click', (e) => {
  e.stopPropagation();
  tplDropdown.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!tplDropdown.contains(e.target)) tplDropdown.classList.remove('open');
});

async function loadTemplates() {
  const res = await fetch('/api/templates');
  const templates = await res.json();
  const menu = document.getElementById('templatesMenu');
  menu.innerHTML = '';
  if (templates.length === 0) {
    menu.innerHTML = '<li><span class="dropdown-item-text">Шаблонов пока нет</span></li>';
    return;
  }
  templates.forEach((t) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'dropdown-item';
    a.href = '#';
    a.textContent = t.title;
    a.title = t.text;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.getElementById('composerInput');
      input.value = input.value ? `${input.value} ${t.text}` : t.text;
      tplDropdown.classList.remove('open');
      input.focus();
    });
    li.appendChild(a);
    menu.appendChild(li);
  });
}

// --- Очередь свободных чатов ---

async function loadQueue() {
  const res = await fetch('/api/queue');
  const queue = await res.json();
  const badge = document.getElementById('queueBadge');
  badge.textContent = String(queue.length);
  badge.classList.toggle('d-none', queue.length === 0);

  const list = document.getElementById('queueList');
  list.innerHTML = '';
  if (queue.length === 0) {
    list.innerHTML = '<div class="empty">Свободных чатов сейчас нет</div>';
    return;
  }
  queue.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'card';
    const body = document.createElement('div');
    body.className = 'card-body d-flex justify-content-between align-items-center';
    const left = document.createElement('div');
    left.className = 'd-flex align-items-center gap-2';
    left.appendChild(avatarEl(item.displayName, item.chatId));
    const label = document.createElement('span');
    label.className = 'fw-bold';
    label.textContent = item.displayName;
    left.appendChild(label);
    const takeBtn = document.createElement('button');
    takeBtn.className = 'btn btn-sm btn-primary';
    takeBtn.textContent = 'Взять в работу';
    takeBtn.addEventListener('click', async () => {
      takeBtn.disabled = true;
      const claimRes = await fetch(`/api/queue/${item.id}/claim`, { method: 'POST' });
      if (!claimRes.ok) {
        const data = await claimRes.json();
        alert(data.error || 'Не удалось забрать чат');
        takeBtn.disabled = false;
        return;
      }
      await loadQueue();
      await loadChats();
      document.querySelector('[data-tab="chats"]').click();
    });
    body.appendChild(left);
    body.appendChild(takeBtn);
    row.appendChild(body);
    list.appendChild(row);
  });
}

async function loadMessages() {
  if (!currentChatId) return;
  const res = await fetch(`/api/chats/${encodeURIComponent(currentChatId)}/messages`);
  const messages = await res.json();
  const box = document.getElementById('messages');
  box.innerHTML = '';
  if (messages.length === 0) {
    box.innerHTML = '<div class="messages__empty"><div class="icon">📭</div>В этом чате пока нет сообщений.</div>';
    return;
  }
  messages.forEach(appendMessage);
  box.scrollTop = box.scrollHeight;
}

function appendMessage(m) {
  const box = document.getElementById('messages');
  const emptyState = box.querySelector('.messages__empty');
  if (emptyState) emptyState.remove();

  const wrap = document.createElement('div');
  wrap.className = `msg ${m.out ? 'msg--out' : 'msg--in'}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg__bubble';
  const text = document.createElement('div');
  text.className = 'msg__text';
  text.textContent = m.text;
  const meta = document.createElement('div');
  meta.className = 'msg__meta';
  const time = document.createElement('span');
  time.className = 'msg__time';
  time.textContent = fmtTime(m.date);
  meta.appendChild(time);
  if (currentChat && currentChat.canDelete) {
    const del = document.createElement('button');
    del.className = 'msg__del';
    del.textContent = 'Удалить';
    del.addEventListener('click', async () => {
      await fetch(`/api/chats/${encodeURIComponent(currentChatId)}/messages/${m.id}`, {
        method: 'DELETE',
      });
      wrap.remove();
    });
    meta.appendChild(del);
  }
  bubble.appendChild(text);
  bubble.appendChild(meta);
  wrap.appendChild(bubble);
  box.appendChild(wrap);
}

document.getElementById('composerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('composerInput');
  const text = input.value.trim();
  if (!text || !currentChatId) return;
  input.value = '';
  const res = await fetch(`/api/chats/${encodeURIComponent(currentChatId)}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (res.ok) {
    appendMessage(await res.json());
    const box = document.getElementById('messages');
    box.scrollTop = box.scrollHeight;
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = 'login.html';
});

function connectWs() {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${window.location.host}/ws`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message' && data.chatId === currentChatId) {
      appendMessage(data.message);
      const box = document.getElementById('messages');
      box.scrollTop = box.scrollHeight;
    } else if (data.type === 'queue:new' || data.type === 'queue:removed') {
      loadQueue();
    }
  };
  ws.onclose = () => setTimeout(connectWs, 3000);
}

(async () => {
  await loadMe();
  await loadChats();
  await loadTemplates();
  await loadQueue();
  connectWs();
})();
