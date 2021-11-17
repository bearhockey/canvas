var INVENTORY = (function () {
  var inventory = {};

  // consts
  // member vars
  inventory.arrContainers = [];
  // ----------------
  // Init
  //     Inits the inventory renderer
  // ----------------
  inventory.Init = function()
  {
    inventory.arrContainers.push(new ICONTAINER({ x:360, y:10,  width:100, height:120 }, "Helmet"));
    inventory.arrContainers.push(new ICONTAINER({ x:480, y:10,  width:460, height:320 }, "Ground"));
    inventory.arrContainers.push(new ICONTAINER({ x:480, y:340, width:460, height:320 }, "Pack"));
    inventory.arrContainers.push(new ICONTAINER({ x:480, y:670, width:460, height:120 }, "Purse", CONST.ITEM_MONEY));
  };

  // ----------------
  // Update
  //     Updates the inventory for drawing later
  // ----------------
  inventory.Update = function()
  {

  };

  // ----------------
  // Draw
  //     Draws the inventory screen
  // ----------------
  inventory.Draw = function(ctx)
  {
    var idx;
    var cContainer;
    var iLength = inventory.arrContainers.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      cContainer = inventory.arrContainers[idx];
      if (cContainer != null && typeof cContainer.Draw === 'function')
      {
        cContainer.Draw(ctx);
      }
    }
  };

  return inventory;
}());
