const twilioView = require('../views/twilio');
const twilio = require('twilio');

// Generate a Twilio token for the client
exports.getToken = (req, res) => {
  try {
    // Get environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_TWIML_APP_SID;
    const identity = `user-${Math.random().toString(36).substring(2, 8)}`;
    
    console.log('Creating token with:', { accountSid, apiKey, appSid });
    
    // Create an access token
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    
    // Create a Voice grant for this token
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true
    });
    
    // Create an access token which we will sign and return to the client
    const token = new AccessToken(accountSid, apiKey, apiSecret, {identity: identity});
    token.addGrant(voiceGrant);
    
    const tokenString = token.toJwt();
    console.log(`Token generated: ${tokenString.substring(0, 20)}...`);
    
    // Return token info as JSON
    res.json({
      token: tokenString,
      identity: identity
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};

// Handle outgoing calls
exports.handleOutgoingCall = (req, res) => {
  try {
    console.log('Webhook received at:', new Date().toISOString());
    console.log('Request body:', req.body);
    console.log('Request query:', req.query);
    console.log('Request path:', req.path);
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Get the phone number from the request (could be in body or query)
    const to = req.body.To || req.query.To;
    const callerId = process.env.TWILIO_CALLER_ID;
    
    console.log('Call parameters:', { to, callerId });
    
    if (to) {
      // Simple TwiML response - just dial the number
      const dial = twiml.dial({
        callerId: callerId
      });
      
      dial.number(to);
      
      console.log('Dialing number:', to);
    } else {
      twiml.say('Thanks for calling!');
      console.log('No number to dial, playing message');
    }
    
    const twimlString = twiml.toString();
    console.log('Generated TwiML:', twimlString);
    
    // Set content type and send TwiML response
    res.type('text/xml');
    res.send(twimlString);
    
    console.log('TwiML response sent successfully');
  } catch (error) {
    console.error('Error in handleOutgoingCall:', error);
    
    // Send a simple TwiML response in case of error
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('An error occurred with your call. Please try again.');
    
    res.type('text/xml');
    res.send(twiml.toString());
  }
};

// Render the Twilio voice interface
exports.getTwilioInterface = (req, res) => {
  res.send(twilioView);
};