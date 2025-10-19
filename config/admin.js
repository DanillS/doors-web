// config/admin.js
export const adminConfig = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  sessionDuration: 24 * 60 * 60 * 1000
};