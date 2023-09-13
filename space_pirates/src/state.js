var STATE = (function () {
  // const
  const STATE_NONE = 0; // title screen more or less
  const STATE_STATUS = 1;
  const STATE_DIALOG = 2;

  // member vars
  var m_iCurrentState = 0;
  var m_bWaitingForServer = false;

  // function
  var state = {};

  // expose states
  state.STATE_NONE = STATE_NONE;
  state.STATE_STATUS = STATE_STATUS;
  state.STATE_DIALOG = STATE_DIALOG;

  state.GetState = function()       { return m_iCurrentState; };
  state.ChangeState = function(iState, arrArgs=[])
  {
    var bIsValidState = false;

    if (iState == STATE_DIALOG)
    {
      if (arrArgs.length > 0 && arrArgs[0] >= 0)
      {
        DIALOG.GetDialog(0, DIALOG.Draw);
        bIsValidState = true;
      }
    }
    else if (iState == STATE_STATUS)
    {
      STATUS.RequestStatusData(STATUS.Draw);
      bIsValidState = true;
    }
    else if (iState == STATE_NONE)
    {
      bIsValidState = true;
    }
    else
    {
    }

    if (bIsValidState)
    {
      m_iCurrentState = iState;
    }
  };

  state.GetWaitState = function()         { return m_bWaitingForServer; };
  state.SetWaitState = function(bWaiting)
  {
    m_bWaitingForServer = bWaiting;
  };

  return state;
}());
