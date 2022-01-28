var STATE = (function () {
  // consts
  const STAGE_BUTTON     = "butStage";
  const INVENTORY_BUTTON = "butInventory";
  const CHARACTER_BUTTON = "butCharacter"
  const MAP_BUTTON       = "butMap";

  // main
  var state = {};
  // game states
  state.STATE_STAGE = 1;
  state.STATE_INVENTORY = 2;
  state.STATE_CHARACTER = 3;
  state.STATE_MAP = 4;
  state.STATE_DIALOG = 5;
  state.STATE_DEATH = 9;

  state.m_iCurrentState = 1;

  state.GetState = function() { return state.m_iCurrentState; };
  state.SetState = function(iState, bUpdateScreen = true)
  {
    state.m_iCurrentState = iState;
    if (iState != state.STATE_CHARACTER) { CHARACTER.Exit(); }
    state.UpdateMenu();
    if (bUpdateScreen) { Update(); }
  };

  // ----------------
  // Update
  //     Updates the appropriate state based on what the current state is
  // ----------------
  state.Update = function()
  {
    switch (state.m_iCurrentState)
    {
      case state.STATE_STAGE:     { RENDERER.Draw(); break; }
      case state.STATE_INVENTORY: { INVENTORY.Update(); INVENTORY.Draw(); break; }
      case state.STATE_CHARACTER: { CHARACTER.Update(); CHARACTER.Draw(); break; }
      case state.STATE_MAP:       { MINIMAP.Draw();                       break; }
      case STATE.STATE_DIALOG:
      case STATE.STATE_DEATH:     { DIALOG.Draw();                        break; }
      default: break;
    } // end of switch
  };

  // ----------------
  // UpdateMenu
  //     Updates the UI buttons
  // ----------------
  state.UpdateMenu = function()
  {
    var bTurnOffButtons = (state.GetState() == state.STATE_DIALOG || state.GetState() == state.STATE_DEATH);
    document.getElementById(STAGE_BUTTON).disabled     = (bTurnOffButtons || state.m_iCurrentState  == state.STATE_STAGE);
    document.getElementById(INVENTORY_BUTTON).disabled = (bTurnOffButtons || state.m_iCurrentState  == state.STATE_INVENTORY);
    document.getElementById(CHARACTER_BUTTON).disabled = (bTurnOffButtons || state.m_iCurrentState  == state.STATE_CHARACTER);
    document.getElementById(MAP_BUTTON).disabled       = (bTurnOffButtons || state.m_iCurrentState  == state.STATE_MAP);
  };

  return state;
}());
