let allChats = [];
let currentChatId = null;
let ws;

async function loadMe() {
  const res = await fetch('/api/me');
  if (!res.ok) {
    window.location.href = 'login.html';
    return;
  }
  const me = await res.json();
  if (me.role !== 'admin') {
    window.location.href = 'operator.html';
    return;
  }
  document.getElementById('whoami').textContent = me.username;
}

const TABS = ['chats', 'operators', 'templates', 'queue', 'stats'];

document.querySelectorAll('[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    TABS.forEach((tab) => {
      document.getElementById(`tab-${tab}`).classList.toggle('d-none', btn.dataset.tab !== tab);
    });
    if (btn.dataset.tab === 'operators') loadOperators();
    if (btn.dataset.tab === 'templates') loadTemplatesList();
    if (btn.dataset.tab === 'queue') loadQueueAdmin();
    if (btn.dataset.tab === 'stats') loadStats();
  });
});

async function loadChats() {
  const res = await fetch('/api/chats');
  allChats = await res.json();
  const list = document.getElementById('chatList');
  list.innerHTML = '';
  allChats.forEach((chat) => {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action chat-item';
    li.style.cursor = 'pointer';
    li.textContent = chat.title;
    li.dataset.chatId = chat.chatId;
    li.addEventListener('click', () => openChat(chat));
    list.appendChild(li);
  });

  const queueSelect = document.getElementById('queueChatSelect');
  if (queueSelect) {
    queueSelect.innerHTML = '';
    allChats.forEach((chat) => {
      const opt = document.createElement('option');
      opt.value = chat.chatId;
      opt.textContent = chat.title;
      queueSelect.appendChild(opt);
    });
  }
}

async function openChat(chat) {
  currentChatId = chat.chatId;
  document
    .querySelectorAll('.chat-item')
    .forEach((el) => el.classList.toggle('active', el.dataset.chatId === chat.chatId));
  document.getElementById('chatHeader').querySelector('span').textContent = chat.title;
  document.getElementById('deleteChatBtn').classList.remove('d-none');
  document.getElementById('composerForm').classList.remove('d-none');
  await loadMessages();
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

document.getElementById('deleteChatBtn').addEventListener('click', async () => {
  if (!currentChatId) return;
  if (!confirm('Удалить историю этого чата в Telegram? Это действие необратимо.')) return;
  await fetch(`/api/admin/chats/${encodeURIComponent(currentChatId)}`, { method: 'DELETE' });
  currentChatId = null;
  document.getElementById('messages').innerHTML = '';
  document.getElementById('chatHeader').querySelector('span').textContent = 'Выберите чат слева';
  document.getElementById('deleteChatBtn').classList.add('d-none');
  document.getElementById('composerForm').classList.add('d-none');
  loadChats();
});

// --- Операторы ---

document.getElementById('newOperatorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('newOpUsername').value.trim();
  const password = document.getElementById('newOpPassword').value;
  const errorEl = document.getElementById('newOpError');
  errorEl.textContent = '';
  const res = await fetch('/api/admin/operators', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    errorEl.textContent = data.error;
    return;
  }
  document.getElementById('newOperatorForm').reset();
  loadOperators();
});

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

async function loadOperators() {
  const res = await fetch('/api/admin/operators');
  const operators = await res.json();
  const container = document.getElementById('operatorsList');
  container.innerHTML = '';
  operators.forEach((op) => {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-2">${escapeHtml(op.username)}</h6>
          <button class="btn btn-sm btn-outline-danger delete-op">Удалить оператора</button>
        </div>
        <div class="assignment-list mb-2"></div>
        <div class="d-flex gap-2 align-items-end assign-row flex-wrap">
          <div>
            <label class="form-label small mb-0">Чат</label>
            <select class="form-select form-select-sm chat-select"></select>
          </div>
          <div>
            <label class="form-label small mb-0">Имя для оператора (алиас)</label>
            <input class="form-control form-control-sm alias-input" placeholder="напр. Клиент №1">
          </div>
          <div class="form-check">
            <input class="form-check-input can-send" type="checkbox" checked>
            <label class="form-check-label small">Отправка</label>
          </div>
          <div class="form-check">
            <input class="form-check-input can-delete" type="checkbox">
            <label class="form-check-label small">Удаление</label>
          </div>
          <button class="btn btn-sm btn-primary assign-btn">Назначить</button>
        </div>
      </div>
    `;
    const assignmentList = card.querySelector('.assignment-list');
    if (op.assignments.length === 0) {
      assignmentList.innerHTML = '<div class="text-muted small">Пока нет назначенных чатов</div>';
    }
    op.assignments.forEach((a) => {
      const row = document.createElement('div');
      row.className = 'small d-flex justify-content-between border-bottom py-1';
      row.innerHTML = `<span>${escapeHtml(a.displayName)} <span class="text-muted">(${
        a.canSend ? 'отправка' : 'без отправки'
      }${a.canDelete ? ', удаление' : ''})</span></span>`;
      const revoke = document.createElement('button');
      revoke.className = 'btn btn-sm btn-link text-danger p-0';
      revoke.textContent = 'Отозвать';
      revoke.addEventListener('click', async () => {
        await fetch(`/api/admin/operators/${op.id}/assignments/${encodeURIComponent(a.chatId)}`, {
          method: 'DELETE',
        });
        loadOperators();
      });
      row.appendChild(revoke);
      assignmentList.appendChild(row);
    });

    const select = card.querySelector('.chat-select');
    allChats.forEach((chat) => {
      const opt = document.createElement('option');
      opt.value = chat.chatId;
      opt.textContent = chat.title;
      select.appendChild(opt);
    });

    card.querySelector('.assign-btn').addEventListener('click', async () => {
      const chatId = select.value;
      const alias = card.querySelector('.alias-input').value.trim();
      if (!chatId || !alias) {
        alert('Выберите чат и укажите алиас');
        return;
      }
      await fetch(`/api/admin/operators/${op.id}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          displayName: alias,
          canSend: card.querySelector('.can-send').checked,
          canDelete: card.querySelector('.can-delete').checked,
        }),
      });
      loadOperators();
    });

    card.querySelector('.delete-op').addEventListener('click', async () => {
      if (!confirm(`Удалить оператора ${op.username}?`)) return;
      await fetch(`/api/admin/operators/${op.id}`, { method: 'DELETE' });
      loadOperators();
    });

    container.appendChild(card);
  });
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = 'login.html';
});

// --- Шаблоны ответов ---

async function loadTemplatesMenu() {
  const res = await fetch('/api/templates');
  const templates = await res.json();
  const menu = document.getElementById('templatesMenu');
  if (!menu) return;
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

document.getElementById('newTemplateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('newTplTitle').value.trim();
  const text = document.getElementById('newTplText').value.trim();
  const errorEl = document.getElementById('newTplError');
  errorEl.textContent = '';
  const res = await fetch('/api/admin/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, text }),
  });
  const data = await res.json();
  if (!res.ok) {
    errorEl.textContent = data.error;
    return;
  }
  document.getElementById('newTemplateForm').reset();
  loadTemplatesList();
  loadTemplatesMenu();
});

async function loadTemplatesList() {
  const res = await fetch('/api/templates');
  const templates = await res.json();
  const container = document.getElementById('templatesList');
  container.innerHTML = '';
  if (templates.length === 0) {
    container.innerHTML = '<div class="text-muted small">Пока нет шаблонов</div>';
    return;
  }
  templates.forEach((t) => {
    const row = document.createElement('div');
    row.className = 'card mb-2';
    row.innerHTML = `
      <div class="card-body py-2">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="fw-bold">${escapeHtml(t.title)}</div>
            <div class="small text-muted">${escapeHtml(t.text)}</div>
          </div>
          <button class="btn btn-sm btn-outline-danger del-tpl">Удалить</button>
        </div>
      </div>
    `;
    row.querySelector('.del-tpl').addEventListener('click', async () => {
      await fetch(`/api/admin/templates/${t.id}`, { method: 'DELETE' });
      loadTemplatesList();
      loadTemplatesMenu();
    });
    container.appendChild(row);
  });
}

// --- Очередь свободных чатов ---

document.getElementById('pushQueueBtn').addEventListener('click', async () => {
  const chatId = document.getElementById('queueChatSelect').value;
  const displayName = document.getElementById('queueAlias').value.trim();
  if (!chatId || !displayName) {
    alert('Выберите чат и укажите алиас');
    return;
  }
  await fetch('/api/admin/queue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatId,
      displayName,
      canSend: document.getElementById('queueCanSend').checked,
      canDelete: document.getElementById('queueCanDelete').checked,
    }),
  });
  document.getElementById('queueAlias').value = '';
  loadQueueAdmin();
});

async function loadQueueAdmin() {
  const res = await fetch('/api/queue');
  const queue = await res.json();
  const container = document.getElementById('queueAdminList');
  container.innerHTML = '';
  if (queue.length === 0) {
    container.innerHTML = '<div class="text-muted small">Очередь пуста</div>';
    return;
  }
  queue.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between align-items-center border-bottom py-2';
    row.innerHTML = `<span>${escapeHtml(item.displayName)}</span>`;
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-sm btn-outline-danger';
    removeBtn.textContent = 'Убрать из очереди';
    removeBtn.addEventListener('click', async () => {
      await fetch(`/api/admin/queue/${item.id}`, { method: 'DELETE' });
      loadQueueAdmin();
    });
    row.appendChild(removeBtn);
    container.appendChild(row);
  });
}

// --- Статистика ---

async function loadStats() {
  const res = await fetch('/api/admin/stats');
  const stats = await res.json();
  const body = document.getElementById('statsBody');
  body.innerHTML = '';
  if (stats.length === 0) {
    body.innerHTML = '<tr><td colspan="4" class="text-muted">Операторов пока нет</td></tr>';
    return;
  }
  stats.forEach((s) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(s.username)}</td>
      <td>${s.messagesToday}</td>
      <td>${s.messagesTotal}</td>
      <td>${s.assignedChats}</td>
    `;
    body.appendChild(tr);
  });
}

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
      if (!document.getElementById('tab-queue').classList.contains('d-none')) loadQueueAdmin();
    }
  };
  ws.onclose = () => setTimeout(connectWs, 3000);
}

(async () => {
  await loadMe();
  await loadChats();
  await loadTemplatesMenu();
  connectWs();
})();
