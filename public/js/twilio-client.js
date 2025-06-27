$(function () {
  const logDiv = document.getElementById("log");
  const startupButton = document.getElementById("startup-button");
  const callButton = document.getElementById("button-call");
  const phoneNumberInput = document.getElementById("phone-number");
  const outgoingCallHangupButton = document.getElementById("button-hangup-outgoing");
  const callControlsDiv = document.getElementById("call-controls");
  const recentCallsList = document.getElementById("recent-calls-list");

  // Make log visible immediately
  logDiv.classList.remove("hide");
  log("Twilio client initializing...");

  // Load recent calls when page loads
  loadRecentCalls();

  // Event listeners
  startupButton.addEventListener("click", startupClient);

  // Request token and initialize device
  function startupClient() {
    log("Requesting Access Token...");

    $.getJSON("/token")
      .done(function(data) {
        log("Token received!");
        setupDevice(data.token);
        document.getElementById("client-name").innerHTML = `Your client name: <strong>${data.identity}</strong>`;
      })
      .fail(function(err) {
        log("Could not get token: " + err.message);
        console.error("Token error:", err);
      });
  }

  // Set up the Twilio.Device
  function setupDevice(token) {
    log("Setting up device...");
    
    // Setup Twilio.Device with minimal options
    window.device = new Twilio.Device(token);

    // Device ready
    device.on("ready", function() {
      log("Device ready!");
      callControlsDiv.classList.remove("hide");
    });

    // Device error
    device.on("error", function(error) {
      log("Device Error: " + error.message);
      console.error("Device error:", error);
    });

    // Setup call button
    callButton.onclick = function(e) {
      e.preventDefault();
      makeCall();
    };
    
    // Listen for incoming calls
    device.on("incoming", handleIncomingCall);
  }

  // Make outgoing call
  function makeCall() {
    const number = phoneNumberInput.value;
    if (!number) {
      log("Please enter a phone number");
      return;
    }

    log("Calling " + number + "...");
    
    // Make the call with minimal parameters - no URL specified
    const call = device.connect({
      To: number
    });
    
    // Show hangup button immediately
    callButton.disabled = true;
    outgoingCallHangupButton.classList.remove("hide");
    
    // Setup hangup button
    outgoingCallHangupButton.onclick = function() {
      log("Hanging up...");
      call.disconnect();
    };
    
    // Call events
    call.on("accept", function() {
      log("Call connected!");
    });
    
    call.on("disconnect", function() {
      log("Call ended");
      callButton.disabled = false;
      outgoingCallHangupButton.classList.add("hide");
      
      // Save call to history
      saveCallToHistory(number, 'outbound', 'completed', 0);
      
      // Reload recent calls
      loadRecentCalls();
    });
    
    call.on("error", function(error) {
      log("Call error: " + error.message);
      callButton.disabled = false;
      outgoingCallHangupButton.classList.add("hide");
      
      // Save failed call to history
      saveCallToHistory(number, 'outbound', 'failed', 0);
      
      // Reload recent calls
      loadRecentCalls();
    });
  }
  
  // Handle incoming call
  function handleIncomingCall(call) {
    const incomingCallDiv = document.getElementById("incoming-call");
    const incomingPhoneNumberEl = document.getElementById("incoming-number");
    const incomingCallAcceptButton = document.getElementById("button-accept-incoming");
    const incomingCallRejectButton = document.getElementById("button-reject-incoming");
    const incomingCallHangupButton = document.getElementById("button-hangup-incoming");
    
    log("Incoming call from " + call.parameters.From);
    
    incomingCallDiv.classList.remove("hide");
    incomingPhoneNumberEl.innerHTML = call.parameters.From;
    
    incomingCallAcceptButton.onclick = function() {
      call.accept();
      log("Accepted incoming call");
      incomingCallAcceptButton.classList.add("hide");
      incomingCallRejectButton.classList.add("hide");
      incomingCallHangupButton.classList.remove("hide");
    };
    
    incomingCallRejectButton.onclick = function() {
      call.reject();
      log("Rejected incoming call");
      resetIncomingCallUI();
      
      // Save rejected call to history
      saveCallToHistory(call.parameters.From, 'inbound', 'rejected', 0);
      
      // Reload recent calls
      loadRecentCalls();
    };
    
    incomingCallHangupButton.onclick = function() {
      call.disconnect();
      log("Hanging up incoming call");
      resetIncomingCallUI();
    };
    
    call.on("cancel", function() {
      log("Incoming call canceled");
      resetIncomingCallUI();
      
      // Save canceled call to history
      saveCallToHistory(call.parameters.From, 'inbound', 'canceled', 0);
      
      // Reload recent calls
      loadRecentCalls();
    });
    
    call.on("disconnect", function() {
      log("Incoming call ended");
      resetIncomingCallUI();
      
      // Save completed call to history
      saveCallToHistory(call.parameters.From, 'inbound', 'completed', 0);
      
      // Reload recent calls
      loadRecentCalls();
    });
    
    function resetIncomingCallUI() {
      incomingPhoneNumberEl.innerHTML = "";
      incomingCallAcceptButton.classList.remove("hide");
      incomingCallRejectButton.classList.remove("hide");
      incomingCallHangupButton.classList.add("hide");
      incomingCallDiv.classList.add("hide");
    }
  }

  // Call History Functions
  function saveCallToHistory(phoneNumber, direction, status, duration) {
    $.ajax({
      url: '/api/calls',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        phoneNumber: phoneNumber,
        direction: direction,
        status: status,
        duration: duration
      }),
      success: function(response) {
        log(`Call history saved: ${direction} call to ${phoneNumber}`);
      },
      error: function(error) {
        console.error('Error saving call history:', error);
      }
    });
  }
  
  function loadRecentCalls() {
    $.ajax({
      url: '/api/calls',
      type: 'GET',
      success: function(calls) {
        displayRecentCalls(calls);
      },
      error: function(error) {
        console.error('Error loading recent calls:', error);
      }
    });
  }
  
  function displayRecentCalls(calls) {
    recentCallsList.innerHTML = '';
    
    if (!calls || calls.length === 0) {
      recentCallsList.innerHTML = '<li>No recent calls</li>';
      return;
    }
    
    calls.forEach(function(call) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <span class="call-number">${call.phoneNumber}</span>
          <span class="call-direction ${call.direction}">${call.direction}</span>
        </div>
        <span class="call-time">${formatDate(new Date(call.timestamp))}</span>
      `;
      
      // Add click event to populate the phone number input
      li.addEventListener('click', function() {
        phoneNumberInput.value = call.phoneNumber;
      });
      
      recentCallsList.appendChild(li);
    });
  }
  
  function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  // Log helper function
  function log(message) {
    logDiv.innerHTML += `<p class="log-entry">&gt;&nbsp; ${message}</p>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  }
});