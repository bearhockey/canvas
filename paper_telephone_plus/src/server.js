var SERVER = (function () {
  // consts
  const WS_URL = "ws://127.0.0.1:5678/";
  // private vars
  var m_wsConnection;
  var m_fnLoginCallback;
  var m_iConnectionKey = -1;
  // main
  var server = {};

  // ----------------
  // Connect
  //     Connects to the server
  // ----------------
  server.Connect = function(fnCallback)
  {
    m_fnLoginCallback = fnCallback;
    m_wsConnection = new WebSocket(WS_URL);
    m_wsConnection.onopen = function()
    {
      m_wsConnection.send(JSON.stringify({login: true}));
    };

    m_wsConnection.onmessage = function(event)
    {
      server.ServerResponse(event);
    };
  };

  // ----------------
  // ServerResponse
  // ----------------
  server.ServerResponse = function(event)
  {
    var data = JSON.parse(event.data);
    if (data.hasOwnProperty('login'))
    {
        m_iConnectionKey = parseInt(data['user_id']);
        console.log("Connection key: ", m_iConnectionKey);
        m_fnLoginCallback();
        return; // login is single option
    }

    // ignore anything that isn't for this user
    if (data.hasOwnProperty('iKey') && parseInt(data['iKey']) != m_iConnectionKey)
    {
      return;
    }

    if (data.hasOwnProperty('player_count'))
    {
      PROMPT.LoadPrompt("Connected Players: " + data['player_count']);
    }

    if (data.hasOwnProperty('message'))
    {
      console.log("Got a message: " + data['message']);
    }

    if (data.hasOwnProperty('new_turn'))
    {
      STATE.SetWaitState(false);
    }
    else if (data.hasOwnProperty('submit')) // these are mutually exclusive
    {
      STATE.SetWaitState(true);
      DrawText("Waiting for others...");
    }

    if (data.hasOwnProperty('state'))
    {
      STATE.ChangeState(data['state']);
    }

    if (data.hasOwnProperty('objPrompt'))
    {
      var objPrompt = data['objPrompt'];
      if (objPrompt['type'] == "image")
      {
        LoadImage(objPrompt['data']);
      }
      else if (objPrompt['type'] == "text")
      {
        PROMPT.LoadPrompt(objPrompt['data']);
      }
    }
  };

  // ----------------
  // ServerSend
  //     Sends operations to server
  // ----------------
  server.ServerSend = function(objMessage)
  {
    objMessage['private_key'] = m_iConnectionKey;
    m_wsConnection.send(JSON.stringify(objMessage));
  };

  return server;
}());
