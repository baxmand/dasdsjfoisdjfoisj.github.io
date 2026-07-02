require('dotenv').config();
const input = require('input');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

(async () => {
  const apiId = Number(process.env.TG_API_ID || (await input.text('api_id (с my.telegram.org): ')));
  const apiHash = process.env.TG_API_HASH || (await input.text('api_hash (с my.telegram.org): '));

  const client = new TelegramClient(new StringSession(''), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => input.text('Номер телефона (с кодом страны, напр. +7...): '),
    password: async () => input.text('Пароль двухфакторной аутентификации (если включена, иначе Enter): '),
    phoneCode: async () => input.text('Код из Telegram: '),
    onError: (err) => console.log(err),
  });

  console.log('\nАвторизация успешна!\n');
  console.log('Добавьте (или замените) в telegram-panel/.env:\n');
  console.log(`TG_API_ID=${apiId}`);
  console.log(`TG_API_HASH=${apiHash}`);
  console.log(`TG_SESSION=${client.session.save()}`);
  console.log(
    '\nНикому не передавайте TG_SESSION — это полный доступ к аккаунту, эквивалентный паролю.',
  );

  await client.disconnect();
  process.exit(0);
})();
