var SIDEPANEL = (function () {
  // consts
  const HIGHLIGHT_NONE = 0;
  const HIGHLIGHT_NODE = 1;
  const HIGHLIGHT_PAWN = 2;
  // main
  var sidepanel = {};

  var m_arrTabs = [];
  var m_arrButtons = [];

  var ui_mainTab = new TAB(0, "Build");
  m_arrTabs.push(ui_mainTab);
  var ui_testTab2 = new TAB(1, "Look");
  m_arrTabs.push(ui_testTab2);
  var ui_pawnTab = new TAB(2, "Pawn");
  m_arrTabs.push(ui_pawnTab);

  var ui_pawnButton = new BUTTON("fuzz");
  var ui_rockButton = new BUTTON("Get Rocks");

  sidepanel.iState = -1;
  sidepanel.objData = null;

  sidepanel.GetObjData = function() { return sidepanel.objData; };
  sidepanel.GetButtons = function() { return m_arrButtons; };

  sidepanel.ClearButtons = function()
  {
    var uiButton;
    var domElement;
    var idx;
    var iButtonsLength = m_arrButtons.length;
    for (idx = 0; idx < iButtonsLength; ++idx)
    {
      uiButton = m_arrButtons[idx];
      if (uiButton != null)
      {
        domElement = document.getElementById(uiButton.GetDomID());
        domElement.remove();
      }
    } // end for loop
    m_arrButtons = []; // clear out the array
  };

  sidepanel.HighlightPawn = function(cPawn)
  {
    sidepanel.objData =
    {
      cPawn       :cPawn,
      iTaskType   :CONST.TASK_HARVEST_RESOURCE,
      objTaskData :CONST.RESOURCE_STONE
    };

    ui_pawnButton.fnAction = cPawn.AddTaskByCommand;
    sidepanel.Update(HIGHLIGHT_PAWN);
  };

  sidepanel.SetCurrentTab = function(iTabID)
  {
    if (iTabID != null)
    {
      sidepanel.Update(iTabID);
    }
  };

  sidepanel.Update = function(iState = HIGHLIGHT_NONE)
  {
    if (sidepanel.iState == iState) { return; }
    var idx;
    var domElement;

    var divButtonAnchor = document.getElementById("divButtonAnchor");
    var divTabAnchor = document.getElementById("divTabAnchor");
    sidepanel.iState = iState;

    // tabs
    var uiTab;
    var iTabID;
    var strDomID;
    var iTabsLength = m_arrTabs.length;
    for (idx = 0; idx < iTabsLength; ++idx)
    {
      uiTab = m_arrTabs[idx];
      if (uiTab != null)
      {
        iTabID = uiTab.GetTabID();
        strDomID = uiTab.GetDomID();
        domElement = document.getElementById(strDomID);
        if (domElement == null)
        {
          domElement = document.createElement("BUTTON");
          domElement.id = strDomID;
          domElement.iTab = iTabID;
          domElement.innerHTML = uiTab.strLabel;
          domElement.onclick = uiTab.ChangeTab;
          divTabAnchor.appendChild(domElement);
        }

        domElement.className = (this.iState == iTabID) ? "tab_active" : "tab_inactive";
      }
    } // end for loop

    // buttons
    sidepanel.ClearButtons();
    switch (sidepanel.iState)
    {
      case HIGHLIGHT_PAWN:
      {
        m_arrButtons.push(ui_rockButton);
        break;
      }
      case HIGHLIGHT_NONE:
      default:
      {
        m_arrButtons.push(ui_pawnButton);
        break;
      }
    } // end switch

    var uiButton;
    var iButtonsLength = m_arrButtons.length;
    for (idx = 0; idx < iButtonsLength; ++idx)
    {
      uiButton = m_arrButtons[idx];
      if (uiButton != null)
      {
        domElement = document.createElement("BUTTON");
        domElement.id = uiButton.GetDomID();
        domElement.className = "panel";
        domElement.innerHTML = uiButton.strLabel;
        domElement.onclick = uiButton.Action;
        divButtonAnchor.appendChild(domElement);
      }
    } // end for loop
  };

  return sidepanel;
}());
