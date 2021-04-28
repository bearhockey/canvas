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
  //     Finds the side panel elements and saves them off
  // ----------------
  info.Init = function()
  {
    info.imgRoomPreview = document.getElementById('room_preview');
    info.btnRoom        = document.getElementById("buttonRoom");
    info.btnCharacter   = document.getElementById("buttonChar");
    info.btnInventory   = document.getElementById("buttonInv");

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

  // ----------------
  // UpdateRoomImage
  //     Updates the preview image for the room with a string for the source image
  // @params - strImage:String - String of the source image to load
  // ----------------
  info.UpdateRoomImage = function(strImage)
  {
    if (strImage != null)
    {
      info.imgRoomPreview.src = strImage;
    }
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
        var cPlayer = GetCurrentPlayer();
        info.txtInfoHeader.innerHTML = cPlayer.GetName();
        var imgProfile = document.createElement("img");
        imgProfile.src = cPlayer.GetProfile();
        divSubInfo.appendChild(imgProfile);

        var divStats = document.createElement("div");
        divStats.className = "playerStats";
        var pSpeed = document.createElement("p");
        pSpeed.innerHTML = "Speed: " + cPlayer.iSpeed.toString();
        var pMight = document.createElement("p");
        pMight.innerHTML = "Might: " + cPlayer.iMight.toString();
        var pSanity = document.createElement("p");
        pSanity.innerHTML = "Sanity: " + cPlayer.iSanity.toString();
        var pKnowledge = document.createElement("p");
        pKnowledge.innerHTML = "Knowledge: " + cPlayer.iKnowledge.toString();
        divStats.appendChild(pSpeed);
        divStats.appendChild(pMight);
        divStats.appendChild(pSanity);
        divStats.appendChild(pKnowledge);

        divSubInfo.appendChild(divStats);

        break;
      }
      case info.INVENTORY:
      {
        info.txtInfoHeader.innerHTML = "Inventory";
        var arrInventory = GetCurrentPlayer().GetInventory();
        var divInventory = document.createElement("div");
        // var pInv = document.createElement("p");
        var divItem;
        var objItem;
        for (var i = 0; i < arrInventory.length; ++i)
        {
          objItem = arrInventory[i];
          divItem = document.createElement("div");
          divItem.className = "inventoryItem";
          divItem.innerHTML = objItem.strLabel;
          divItem.onclick = function() { InventoryClick(objItem); }
          divInventory.appendChild(divItem);
        }
        info.divSubInfo.appendChild(divInventory);
        break;
      }
      default: break;
    } // end switch
  };

  function InventoryClick(objItem)
  {
    SCENE.SetScene(objItem.strLabel, null, objItem.strDesc, SCENE.UseItemDiv(objItem));
  };

  return info;
}());
