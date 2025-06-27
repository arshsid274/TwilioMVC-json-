const express = require('express');
const router = express.Router();
const twilioController = require('../controllers/twilioController');

router.get('/', twilioController.getTwilioInterface);
router.get('/twilio', twilioController.getTwilioInterface);
router.get('/token', twilioController.getToken);
router.post('/voice', twilioController.handleOutgoingCall);
router.post('/webhook', twilioController.handleOutgoingCall);
router.post('/twiml', twilioController.handleOutgoingCall);

module.exports = router;