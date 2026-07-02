let allChats = [];
let currentChatId = null;
let ws;

// --- Представление ---

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] || '').join('').toUpperCase() || '?';
}

const AVATAR_COLORS = [
  '#e17076', '#e07b1a', '#4fad2d', '#3390ec', '#8e5db8',
  '#d84f9e', '#0f9b9b', '#c2410c', '#5a53d6', '#0d7490',
];

function avatarColor(key) {
  let hash = 0;
  const s = String(key);
  for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function avatarEl(name, key) {
  const el = document.createElement('span');
  el.className = 'chat-avatar';
  el.style.background = avatarColor(key || name);
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
  if (me.role !== 'admin') {
    window.location.href = 'operator.html';
    return;
  }
  document.getElementById('whoami').textContent = me.username;
  document.getElementById('drawerAvatar').textContent = initials(me.username);
}

// --- Меню (☰) и экран управления ---

const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('drawerBackdrop');
function toggleDrawer(show) {
  drawer.classList.toggle('d-none', !show);
  backdrop.classList.toggle('d-none', !show);
}
document.getElementById('menuBtn').addEventListener('click', () => toggleDrawer(true));
backdrop.addEventListener('click', () => toggleDrawer(false));

const adminModal = document.getElementById('adminModal');
const ADMIN_TABS = ['operators', 'templates', 'queue', 'stats'];

function openAdminTab(name) {
  document.querySelectorAll('.admin-modal__tabs .tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.atab === name);
  });
  ADMIN_TABS.forEach((tab) => {
    document.getElementById(`tab-${tab}`).classList.toggle('d-none', tab !== name);
  });
  if (name === 'operators') loadOperators();
  if (name === 'templates') loadTemplatesList();
  if (name === 'queue') loadQueueAdmin();
  if (name === 'stats') loadStats();
}

document.querySelectorAll('.drawer__item[data-admin]').forEach((item) => {
  item.addEventListener('click', () => {
    toggleDrawer(false);
    adminModal.classList.remove('d-none');
    openAdminTab(item.dataset.admin);
  });
});
document.querySelectorAll('.admin-modal__tabs .tab').forEach((tab) => {
  tab.addEventListener('click', () => openAdminTab(tab.dataset.atab));
});
document.getElementById('adminClose').addEventListener('click', () => {
  adminModal.classList.add('d-none');
});

// --- Список чатов ---

async function loadChats() {
  const res = await fetch('/api/chats');
  allChats = await res.json();
  const list = document.getElementById('chatList');
  list.innerHTML = '';
  if (allChats.length === 0) {
    list.innerHTML = '<li class="chat-list__empty">Диалогов пока нет</li>';
  }
  allChats.forEach((chat) => {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.dataset.chatId = chat.chatId;
    li.dataset.title = chat.title.toLowerCase();
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

document.getElementById('chatSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('#chatList .chat-item').forEach((el) => {
    el.style.display = !q || (el.dataset.title || '').includes(q) ? '' : 'none';
  });
});

async function openChat(chat) {
  currentChatId = chat.chatId;
  document
    .querySelectorAll('.chat-item')
    .forEach((el) => el.classList.toggle('active', el.dataset.chatId === chat.chatId));

  const titleWrap = document.querySelector('#chatHeader .chat-header__title');
  titleWrap.innerHTML = '';
  titleWrap.appendChild(avatarEl(chat.title, chat.chatId));
  const span = document.createElement('span');
  span.textContent = chat.title;
  titleWrap.appendChild(span);

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
  if (messages.length === 0) {
    box.innerHTML = '<div class="messages__empty"><div class="icon">&#128235;</div>В этом чате пока нет сообщений.</div>';
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

document.getElementById('deleteChatBtn').addEventListener('click', async () => {
  if (!currentChatId) return;
  if (!confirm('Удалить историю этого чата в Telegram? Это действие необратимо.')) return;
  await fetch(`/api/admin/chats/${encodeURIComponent(currentChatId)}`, { method: 'DELETE' });
  currentChatId = null;
  document.getElementById('messages').innerHTML =
    '<div class="messages__empty"><div class="icon">&#128172;</div>Выберите чат, чтобы просмотреть переписку.</div>';
  document.querySelector('#chatHeader .chat-header__title').innerHTML = '<span class="placeholder">Выберите чат</span>';
  document.getElementById('deleteChatBtn').classList.add('d-none');
  document.getElementById('composerForm').classList.add('d-none');
  loadChats();
});

// --- Шаблоны: выпадающее меню в композере ---

const tplDropdown = document.getElementById('tplDropdown');
document.getElementById('tplToggle').addEventListener('click', (e) => {
  e.stopPropagation();
  tplDropdown.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!tplDropdown.contains(e.target)) tplDropdown.classList.remove('open');
});

async function loadTemplatesMenu() {
  const res = await fetch('/api/templates');
  const templates = await res.json();
  const menu = document.getElementById('templatesMenu');
  if (!menu) return;
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

// --- Пользователи ---

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

async function loadOperators() {
  const res = await fetch('/api/admin/operators');
  const operators = await res.json();
  const container = document.getElementById('operatorsList');
  container.innerHTML = '';
  if (operators.length === 0) {
    container.innerHTML = '<div class="empty">Пользователей пока нет — создайте первого слева.</div>';
    return;
  }
  operators.forEach((op) => {
    const card = document.createElement('div');
    card.className = 'card op-card';
    card.innerHTML = `
      <div class="card-body">
        <div class="op-card__head">
          <div class="op-card__name"></div>
          <button class="btn btn-sm btn-outline-danger delete-op">Удалить</button>
        </div>
        <div class="assignment-list"></div>
        <div class="assign-row">
          <div class="grow">
            <label class="form-label">Чат</label>
            <select class="form-select form-select-sm chat-select"></select>
          </div>
          <div class="grow">
            <label class="form-label">Алиас для пользователя</label>
            <input class="form-control form-control-sm alias-input" placeholder="напр. Клиент №1">
          </div>
          <label class="form-check"><input class="form-check-input can-send" type="checkbox" checked><span class="form-check-label">Отправка</span></label>
          <label class="form-check"><input class="form-check-input can-delete" type="checkbox"><span class="form-check-label">Удаление</span></label>
          <button class="btn btn-sm btn-primary assign-btn">Назначить</button>
        </div>
      </div>
    `;

    const nameEl = card.querySelector('.op-card__name');
    nameEl.appendChild(avatarEl(op.username, `op${op.id}`));
    const nameText = document.createElement('span');
    nameText.textContent = op.username;
    nameEl.appendChild(nameText);

    const assignmentList = card.querySelector('.assignment-list');
    if (op.assignments.length === 0) {
      assignmentList.innerHTML = '<div class="empty">Пока нет назначенных чатов</div>';
    }
    op.assignments.forEach((a) => {
      const row = document.createElement('div');
      row.className = 'list-group-item d-flex justify-content-between align-items-center py-1';
      const left = document.createElement('span');
      left.className = 'd-flex align-items-center gap-2';
      const alias = document.createElement('span');
      alias.className = 'fw-bold';
      alias.textContent = a.displayName;
      left.appendChild(alias);
      const perm = document.createElement('span');
      perm.className = `pill ${a.canSend ? 'pill--on' : ''}`;
      perm.textContent = a.canSend ? 'отправка' : 'только чтение';
      left.appendChild(perm);
      if (a.canDelete) {
        const perm2 = document.createElement('span');
        perm2.className = 'pill pill--on';
        perm2.textContent = 'удаление';
        left.appendChild(perm2);
      }
      const revoke = document.createElement('button');
      revoke.className = 'btn btn-link text-danger';
      revoke.textContent = 'Отозвать';
      revoke.addEventListener('click', async () => {
        await fetch(`/api/admin/operators/${op.id}/assignments/${encodeURIComponent(a.chatId)}`, {
          method: 'DELETE',
        });
        loadOperators();
      });
      row.appendChild(left);
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
      if (!confirm(`Удалить пользователя ${op.username}?`)) return;
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

// --- Шаблоны: библиотека ---

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
    container.innerHTML = '<div class="empty">Пока нет шаблонов</div>';
    return;
  }
  templates.forEach((t) => {
    const row = document.createElement('div');
    row.className = 'card mb-2';
    const body = document.createElement('div');
    body.className = 'card-body py-2 d-flex justify-content-between align-items-start gap-2';
    const info = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'fw-bold';
    title.textContent = t.title;
    const sub = document.createElement('div');
    sub.className = 'small text-muted';
    sub.textContent = t.text;
    info.appendChild(title);
    info.appendChild(sub);
    const del = document.createElement('button');
    del.className = 'btn btn-sm btn-outline-danger';
    del.textContent = 'Удалить';
    del.addEventListener('click', async () => {
      await fetch(`/api/admin/templates/${t.id}`, { method: 'DELETE' });
      loadTemplatesList();
      loadTemplatesMenu();
    });
    body.appendChild(info);
    body.appendChild(del);
    row.appendChild(body);
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
    container.innerHTML = '<div class="empty">Очередь пуста</div>';
    return;
  }
  queue.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'card mb-2';
    const body = document.createElement('div');
    body.className = 'card-body py-2 d-flex justify-content-between align-items-center';
    const left = document.createElement('div');
    left.className = 'd-flex align-items-center gap-2';
    left.appendChild(avatarEl(item.displayName, item.chatId));
    const label = document.createElement('span');
    label.className = 'fw-bold';
    label.textContent = item.displayName;
    left.appendChild(label);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-sm btn-outline-danger';
    removeBtn.textContent = 'Убрать';
    removeBtn.addEventListener('click', async () => {
      await fetch(`/api/admin/queue/${item.id}`, { method: 'DELETE' });
      loadQueueAdmin();
    });
    body.appendChild(left);
    body.appendChild(removeBtn);
    row.appendChild(body);
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
    body.innerHTML = '<tr><td colspan="4" class="text-muted">Пользователей пока нет</td></tr>';
    return;
  }
  stats.forEach((s) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(s.username)}</td>
      <td class="num">${s.messagesToday}</td>
      <td class="num">${s.messagesTotal}</td>
      <td class="num">${s.assignedChats}</td>
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
      if (!document.getElementById('tab-queue').classList.contains('d-none')
          && !adminModal.classList.contains('d-none')) {
        loadQueueAdmin();
      }
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
