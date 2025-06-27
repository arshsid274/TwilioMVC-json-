const CallHistory = require('../models/callHistoryModel');

// Save a new call record
exports.saveCall = async (phoneNumber, direction, status = 'completed', duration = 0) => {
  try {
    const newCall = new CallHistory({
      phoneNumber,
      direction,
      status,
      duration,
      timestamp: new Date()
    });
    
    await newCall.save();
    return newCall;
  } catch (error) {
    console.error('Error saving call history:', error);
    throw error;
  }
};

// Get recent calls
exports.getRecentCalls = async (limit = 10) => {
  try {
    return await CallHistory.find()
      .sort({ timestamp: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error fetching recent calls:', error);
    throw error;
  }
};