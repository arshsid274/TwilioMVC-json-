const express = require('express');
const router = express.Router();
const callHistoryController = require('../controllers/callHistoryController');

router.post('/calls', callHistoryController.saveCall);
router.get('/calls', callHistoryController.getRecentCalls);

module.exports = router;