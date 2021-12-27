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
    state.UpdateMenu();
    if (bUpdateScreen) { Update(); }
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
