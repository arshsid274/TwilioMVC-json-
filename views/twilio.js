module.exports = `
<!DOCTYPE html>
<html>
  <head>
    <title>Twilio Voice JavaScript SDK Quickstart</title>
    <link rel="stylesheet" href="/css/site.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <header>
      <h1>Twilio Voice JavaScript SDK Quickstart</h1>
      <button id="startup-button">Start up the Device</button>
    </header>
    <main id="controls">
      <section class="left-column" id="info">
        <h2>Your Device Info</h2>
        <div id="client-name"></div>
      </section>
      <section class="center-column">
        <h2 class="instructions">Make a Call</h2>
        <div id="call-controls" class="hide">
          <form>
            <label for="phone-number">Enter a phone number or client name</label>
            <input id="phone-number" type="text" placeholder="+15552221234" />
            <button id="button-call" type="submit">Call</button>
          </form>
          <button id="button-hangup-outgoing" class="hide">Hang Up</button>
          
          <div id="recent-calls" class="call-history">
            <h3>Recent Calls</h3>
            <ul id="recent-calls-list"></ul>
          </div>
          
          <div id="incoming-call" class="hide">
            <h2>Incoming Call Controls</h2>
            <p class="instructions">
              Incoming Call from <span id="incoming-number"></span>
            </p>
            <button id="button-accept-incoming">Accept</button>
            <button id="button-reject-incoming">Reject</button>
            <button id="button-hangup-incoming" class="hide">Hangup</button>
          </div>
        </div>
      </section>
      <section class="right-column">
        <h2>Event Log</h2>
        <div class="hide" id="log"></div>
      </section>
    </main>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://sdk.twilio.com/js/client/releases/1.10.1/twilio.js"></script>
    <script src="/js/twilio-client.js"></script>
  </body>
</html>
`;