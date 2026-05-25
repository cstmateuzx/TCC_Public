const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dbPath: path.join(__dirname, '..', 'data', 'users.db'),
};
