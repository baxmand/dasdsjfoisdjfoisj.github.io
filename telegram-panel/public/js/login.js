document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error');
  errorEl.textContent = '';
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      errorEl.textContent = data.error || 'Ошибка входа';
      return;
    }
    window.location.href = data.role === 'admin' ? 'admin.html' : 'operator.html';
  } catch {
    errorEl.textContent = 'Не удалось связаться с сервером';
  }
});
