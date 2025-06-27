const callHistoryService = require('../services/callHistoryService');

// Save a new call record
exports.saveCall = async (req, res) => {
  try {
    const { phoneNumber, direction, status, duration } = req.body;
    const call = await callHistoryService.saveCall(phoneNumber, direction, status, duration);
    res.status(201).json(call);
  } catch (error) {
    console.error('Error in saveCall controller:', error);
    res.status(500).json({ error: 'Failed to save call history' });
  }
};

// Get recent calls
exports.getRecentCalls = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const calls = await callHistoryService.getRecentCalls(limit);
    res.json(calls);
  } catch (error) {
    console.error('Error in getRecentCalls controller:', error);
    res.status(500).json({ error: 'Failed to fetch recent calls' });
  }
};