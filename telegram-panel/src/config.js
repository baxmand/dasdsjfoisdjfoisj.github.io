require('dotenv').config();

const tgApiId = process.env.TG_API_ID ? Number(process.env.TG_API_ID) : null;
const tgApiHash = process.env.TG_API_HASH || null;
const tgSession = process.env.TG_SESSION || null;

module.exports = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  tg: {
    apiId: tgApiId,
    apiHash: tgApiHash,
    session: tgSession,
  },
  demoMode: !(tgApiId && tgApiHash && tgSession),
};
