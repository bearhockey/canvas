var STATE = (function () {
  // const
  const STATE_NONE = 0; // title screen more or less
  const STATE_DRAW = 1;
  const STATE_TEXT = 2;

  const SUBMIT_BUTTON = "submitButton";

  // member vars
  var m_iCurrentState = 0;
  var m_bWaitingForServer = false;

  // function
  var state = {};

  // expose states
  state.STATE_DRAW = STATE_DRAW;
  state.STATE_TEXT = STATE_TEXT;

  state.GetState = function()       { return m_iCurrentState; };
  state.ChangeState = function(iState)
  {
    m_iCurrentState = iState;
    if (m_iCurrentState == STATE_DRAW)
    {
      TOOL.ShowTools();
      PROMPT.HideInput();
    }
    else if (m_iCurrentState == STATE_TEXT)
    {
      TOOL.HideTools();
      PROMPT.ShowInput();
      PROMPT.LoadPrompt("What is it?");
    }
    else
    {
      TOOL.HideTools();
      PROMPT.HideInput();
    }

    ClearScreen();
  };

  state.GetWaitState = function()         { return m_bWaitingForServer; };
  state.SetWaitState = function(bWaiting)
  {
    m_bWaitingForServer = bWaiting;
    var butSubmit  = document.getElementById(SUBMIT_BUTTON);
    butSubmit.disabled = m_bWaitingForServer;
  };

  // ----------------
  // CanDraw
  //     Returns true if the player can draw on the screen
  // ----------------
  state.CanDraw = function()
  {
    return (m_iCurrentState == STATE_DRAW && m_bWaitingForServer == false);
  };

  return state;
}());
