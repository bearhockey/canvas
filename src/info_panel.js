var INFO_PANEL = (function () {
  const ACTIVE_BUTTON_COLOR = "#CCEEEE";
  const INACTIVE_BUTTON_COLOR = "#888888";
  var info = {};
  info.ROOM = 0;
  info.CHARACTER = 1;
  info.INVENTORY = 2;
  info.iMode = info.ROOM;

  var strRoomName = "START";
  var strRoomDesc = "GREAT";

  // ----------------
  // Init
  //     Finds the buttons and saves them off
  // ----------------
  info.Init = function()
  {
    info.btnRoom = document.getElementById("buttonRoom");
    info.btnCharacter = document.getElementById("buttonChar");
    info.btnInventory = document.getElementById("buttonInv");

    info.txtInfoHeader = document.getElementById("txtInfoHeader");
    info.txtLocation   = document.getElementById("txtLocation");

    info.divSubInfo    = document.getElementById("divSubInfo");

    info.UpdateInfoPanel(info.ROOM);
  };

  info.Update = function(idx, iFloor)
  {
    var objCurrentTile = LEVEL.GetTile(idx, iFloor);
    strRoomName = info.txtLocation.innerHTML = objCurrentTile.label;
    strRoomDesc = objCurrentTile.desc;
    info.UpdateInfoBody();
  };

  info.UpdateInfoPanel = function(iMode)
  {
    info.iMode = iMode;
    info.btnRoom.style.backgroundColor = (iMode == info.ROOM) ? ACTIVE_BUTTON_COLOR : INACTIVE_BUTTON_COLOR;
    info.btnCharacter.style.backgroundColor = (iMode == info.CHARACTER) ? ACTIVE_BUTTON_COLOR : INACTIVE_BUTTON_COLOR;
    info.btnInventory.style.backgroundColor = (iMode == info.INVENTORY) ? ACTIVE_BUTTON_COLOR : INACTIVE_BUTTON_COLOR;

    info.UpdateInfoBody();
  };

  info.UpdateInfoBody = function()
  {
    info.divSubInfo.textContent = '';
    switch (info.iMode)
    {
      case info.ROOM:
      {
        info.txtInfoHeader.innerHTML = strRoomName;
        var pDesc = document.createElement("p");
        var pNode = document.createTextNode(strRoomDesc);
        pDesc.appendChild(pNode);
        info.divSubInfo.appendChild(pNode);
        break;
      }
      case info.CHARACTER:
      {
        info.txtInfoHeader.innerHTML = "strCharName";
        break;
      }
      case info.INVENTORY:
      {
        info.txtInfoHeader.innerHTML = "Inventory";
        break;
      }
      default: break;
    } // end switch
  };

  return info;
}());
