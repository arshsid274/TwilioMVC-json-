require('dotenv').config();
const app = require('./app');
const config = require('./config/config');

// Check if we're in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  // Local development - listen on port
  app.listen(config.port, () => {
    console.log(`🚀 Server running at http://localhost:${config.port}`);
    console.log(`📡 Voice endpoint: http://localhost:${config.port}/voice`);
    console.log(`💻 Twilio interface: http://localhost:${config.port}/twilio`);
  });
} else {
  // Serverless environment (Vercel) - export the app
  module.exports = app;
}