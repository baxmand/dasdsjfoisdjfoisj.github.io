let currentChatId = null;
let currentChat = null;
let ws;

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
    list.innerHTML = '<li class="list-group-item text-muted">Вам пока не назначили ни одного чата</li>';
    return;
  }
  chats.forEach((chat) => {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action chat-item';
    li.style.cursor = 'pointer';
    li.textContent = chat.title;
    li.dataset.chatId = chat.chatId;
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
  document.getElementById('chatHeader').textContent = chat.title;
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

async function loadTemplates() {
  const res = await fetch('/api/templates');
  const templates = await res.json();
  const menu = document.getElementById('templatesMenu');
  menu.innerHTML = '';
  if (templates.length === 0) {
    menu.innerHTML = '<li><span class="dropdown-item-text text-muted">Шаблонов пока нет</span></li>';
    return;
  }
  templates.forEach((t) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'dropdown-item';
    a.href = '#';
    a.textContent = t.title;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.getElementById('composerInput');
      input.value = input.value ? `${input.value} ${t.text}` : t.text;
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
    list.innerHTML = '<div class="text-muted">Свободных чатов сейчас нет</div>';
    return;
  }
  queue.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'list-group-item d-flex justify-content-between align-items-center';
    const label = document.createElement('span');
    label.textContent = item.displayName;
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
    row.appendChild(label);
    row.appendChild(takeBtn);
    list.appendChild(row);
  });
}

async function loadMessages() {
  if (!currentChatId) return;
  const res = await fetch(`/api/chats/${encodeURIComponent(currentChatId)}/messages`);
  const messages = await res.json();
  const box = document.getElementById('messages');
  box.innerHTML = '';
  messages.forEach(appendMessage);
  box.scrollTop = box.scrollHeight;
}

function appendMessage(m) {
  const box = document.getElementById('messages');
  const wrap = document.createElement('div');
  wrap.className = `d-flex mb-2 ${m.out ? 'justify-content-end' : 'justify-content-start'}`;
  const bubble = document.createElement('div');
  bubble.className = `p-2 rounded ${m.out ? 'bg-primary text-white' : 'bg-white border'}`;
  bubble.style.maxWidth = '70%';
  const text = document.createElement('div');
  text.textContent = m.text;
  bubble.appendChild(text);
  if (currentChat && currentChat.canDelete) {
    const del = document.createElement('button');
    del.className = 'btn btn-sm btn-link text-danger p-0 mt-1';
    del.textContent = 'Удалить';
    del.addEventListener('click', async () => {
      await fetch(`/api/chats/${encodeURIComponent(currentChatId)}/messages/${m.id}`, {
        method: 'DELETE',
      });
      wrap.remove();
    });
    bubble.appendChild(del);
  }
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
