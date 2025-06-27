const mongoose = require('mongoose');

const callHistorySchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'busy', 'no-answer', 'canceled'],
    default: 'completed'
  }
});

module.exports = mongoose.model('CallHistory', callHistorySchema);