var CONTROLLER = (function () {
  // consts
  const MOVE_TIME = 1; // moving takes one second
  // main
  var controller = {};

  // ----------------
  // MoveHero
  //     Moves the player in a specified direction
  // ----------------
  controller.MoveHero = function(iDirection)
  { GetHero().Move(iDirection, GetFloor()); Update(MOVE_TIME); };

  // ----------------
  // HeroPickup
  //     Has the hero pawn try to pick up whatever is on their current tile
  // ----------------
  controller.HeroPickup = function()
  {
    var cHero = GetHero();
    var cCurrentTile = cHero.GetTile();
    var arrItems = cCurrentTile.GetEntities();
    var iLength = arrItems.length;
    var idx;
    var cItem;
    var strItems = "";
    var strSingleItem;

    for (idx = 0; idx < iLength; ++idx)
    {
      cItem = arrItems[idx];
      if (cItem != null && cItem.iPawnType == CONST.PAWN_ITEM)
      {
        if (cCurrentTile.RemoveEntity(cItem))
        {
          cHero.AddToInventory(cItem);
          strSingleItem = (cItem.iQuantity > 0) ? cItem.iQuantity.toString() + " " + cItem.strName : cItem.strName;
          strItems += (strItems != "") ? (", " + strSingleItem) : strSingleItem;
        }
      }
    }

    if (strItems != "")
    {
      MBOX.AddInfo("Picked up " + strItems);
    }
    else
    {
      MBOX.AddInfo("Nothing to pick up");
    }

    var iTimeElapsed = iLength; // self is an item technically
    Update(iTimeElapsed);
  };

  return controller;
}());
