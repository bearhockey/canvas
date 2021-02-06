var SERVER = (function () {
  // private vars
  var m_wsConnection;
  var m_fnLoginCallback;
  var m_iConnectionKey = -1;
  // main
  var server = {};

  server.Connect = function(fnCallback)
  {
    m_fnLoginCallback = fnCallback;
    m_wsConnection = new WebSocket("ws://127.0.0.1:5678/");
    m_wsConnection.onopen = function()
    {
      m_wsConnection.send(JSON.stringify({login: true}));
    };
    m_wsConnection.onmessage = function(event)
    {
      server.ServerResponse(event);
    };
  };

  server.ServerResponse = function(event)
  {
    var data = JSON.parse(event.data);
    if (data.hasOwnProperty('login'))
    {
        m_iConnectionKey = parseInt(data['user_id']);
        m_fnLoginCallback();
        return; // login is single option
    }

    // ignore anything that isn't for this user
    if (data.hasOwnProperty('iKey') && parseInt(data['iKey']) != m_iConnectionKey)
    {
      return;
    }

    if (data.hasOwnProperty('level_init')) { LEVEL.Init(); }
    if (data.hasOwnProperty('arrTiles'))
    {
       LEVEL.Update(data['arrTiles']);
    }
    if (data.hasOwnProperty('arrPlayers') || data.hasOwnProperty("iCurrentPlayer"))
    {
      PLAYER.Update(data);
    }
    if (data.hasOwnProperty('draw'))       { myGameArea.Draw(); }
  };

  server.ServerSend = function(objMessage)
  {
    m_wsConnection.send(JSON.stringify(objMessage));
  };

  return server;
}());
