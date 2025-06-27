require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    apiKey: process.env.TWILIO_API_KEY,
    apiSecret: process.env.TWILIO_API_SECRET,
    appSid: process.env.TWILIO_APP_SID
  }
};