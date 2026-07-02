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

document.querySelectorAll('[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-chats').classList.toggle('d-none', btn.dataset.tab !== 'chats');
    document.getElementById('tab-operators').classList.toggle('d-none', btn.dataset.tab !== 'operators');
    if (btn.dataset.tab === 'operators') loadOperators();
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

function connectWs() {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${window.location.host}/ws`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message' && data.chatId === currentChatId) {
      appendMessage(data.message);
      const box = document.getElementById('messages');
      box.scrollTop = box.scrollHeight;
    }
  };
  ws.onclose = () => setTimeout(connectWs, 3000);
}

(async () => {
  await loadMe();
  await loadChats();
  connectWs();
})();
