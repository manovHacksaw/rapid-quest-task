require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp-processor',
  CORS_ORIGINS: [
    "http://localhost:3000",
    "https://whatsapp-web-clone-murex.vercel.app",
    "https://2xbrt7r7-3000.inc1.devtunnels.ms",
  ]
};