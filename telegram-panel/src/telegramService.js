const config = require('./config');
const DemoTelegramService = require('./services/demoTelegramService');

let instance = null;

function getTelegramService() {
  if (instance) return instance;
  if (config.demoMode) {
    console.log(
      '[telegram] TG_API_ID/TG_API_HASH/TG_SESSION не заданы — включён демо-режим с тестовыми чатами.',
    );
    instance = new DemoTelegramService();
  } else {
    // eslint-disable-next-line global-require
    const RealTelegramService = require('./services/realTelegramService');
    instance = new RealTelegramService();
  }
  return instance;
}

module.exports = { getTelegramService };
