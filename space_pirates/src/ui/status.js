var STATUS = (function () {
    // consts

    // private vars
    var m_objStatus;
    var m_fnServerCallback;

    // main
    var status = {};

    // ----------------
    // RequestStatusData
    // ----------------
    status.RequestStatusData = function(fnCallback=null)
    {
      m_fnServerCallback = fnCallback;
      SERVER.ServerSend({ 'set_state':STATE.STATE_STATUS, 'get_status':true });
    };

    // ----------------
    // ReceiveStatusData
    // ----------------
    status.ReceiveStatusData = function(objData)
    {
      m_objStatus = objData;
      /*
      if (m_objDialog['strText'] != null)
      {
        m_strText = m_objDialog['strText'] ;
      }

      // lets not clear the portrait icon for now
      if (m_objDialog['strPortraitIcon'] != null && m_objDialog['strPortraitIcon'] != "")
      {
        m_cRando = new SPRITE(m_objDialog['strPortraitIcon']);
      }

      if (m_objDialog['arrChoices'] != null && m_objDialog['arrChoices'].length > 0)
      {
        m_arrChoices = m_objDialog['arrChoices'];
      }
      else
      {
        m_arrChoices = [];
      }
      */

      if (m_fnServerCallback != null)
      {
        m_fnServerCallback();
      }

      m_fnServerCallback = null;
    };

    // ----------------
    // Draw
    //     Draws the Status state
    // ----------------
    status.Draw = function()
    {
      ClearScreen();
      console.log("Did we get data? ---> ", m_objStatus);

    };
  
    return status;
  }());
  