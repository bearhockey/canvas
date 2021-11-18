var INVENTORY = (function () {
  var inventory = {};

  // consts
  // member vars
  inventory.cSelectedItem = null;
  inventory.arrContainers = [];
  //
  inventory.cHelmet   = new ICONTAINER(360, 10,  100, 120, "Helmet", CONST.ITEM_HELMET);

  inventory.cCloak    = new ICONTAINER(240, 140, 100, 120, "Cloak",  CONST.ITEM_CLOAK);
  inventory.cArmor    = new ICONTAINER(360, 140, 100, 120, "Armor",  CONST.ITEM_ARMOR);

  inventory.cShield   = new ICONTAINER(120, 270, 100, 120, "Shield", CONST.ITEM_SHIELD);
  inventory.cWeapon   = new ICONTAINER(240, 270, 100, 120, "Weapon", CONST.ITEM_WEAPON);
  inventory.cFreeHand = new ICONTAINER(360, 270, 100, 120, "Free Hand");

  inventory.cBelt     = new ICONTAINER(240, 400, 100, 120, "Belt", CONST.ITEM_BELT);
  inventory.cBoots    = new ICONTAINER(360, 400, 100, 120, "Boots", CONST.ITEM_BOOTS);

  inventory.cAccessory1 = new ICONTAINER(120, 530, 100, 120, "Acc. 1", CONST.ITEM_ACCESSORY);
  inventory.cAccessory2 = new ICONTAINER(240, 530, 100, 120, "Acc. 2", CONST.ITEM_ACCESSORY);
  inventory.cAccessory3 = new ICONTAINER(360, 530, 100, 120, "Acc. 3", CONST.ITEM_ACCESSORY);
  //
  inventory.cGround = new ICONTAINER(480, 10,  460, 320, "Ground");
  inventory.cPack   = new ICONTAINER(480, 340, 460, 320, "Pack");
  inventory.cPurse  = new ICONTAINER(480, 670, 460, 120, "Purse", CONST.ITEM_MONEY);
  // ----------------
  // Init
  //     Inits the inventory renderer
  // ----------------
  inventory.Init = function()
  {
    inventory.arrContainers.push(inventory.cHelmet);
    inventory.arrContainers.push(inventory.cCloak);
    inventory.arrContainers.push(inventory.cArmor);
    inventory.arrContainers.push(inventory.cShield);
    inventory.arrContainers.push(inventory.cWeapon);
    inventory.arrContainers.push(inventory.cFreeHand);
    inventory.arrContainers.push(inventory.cBelt);
    inventory.arrContainers.push(inventory.cBoots);

    inventory.arrContainers.push(inventory.cAccessory1);
    inventory.arrContainers.push(inventory.cAccessory2);
    inventory.arrContainers.push(inventory.cAccessory3);

    inventory.arrContainers.push(inventory.cGround);
    inventory.arrContainers.push(inventory.cPack);
    inventory.arrContainers.push(inventory.cPurse);
  };

  // ----------------
  // Update
  //     Updates the inventory for drawing later
  // ----------------
  inventory.Update = function()
  {
    var cHero = GetHero();
    var idx;
    var cItem;
    var iItemType;
    var iLength;

    // empty out containers first
    iLength = inventory.arrContainers.length;
    for (idx = 0; idx < iLength; ++idx)
    { inventory.arrContainers[idx].Empty(); }

    var cCurrentTile = cHero.GetTile();
    var arrFloorItems = cCurrentTile.GetEntities();
    iLength = arrFloorItems.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      cItem = arrFloorItems[idx];
      if (cItem != null && cItem.GetItemType() != CONST.ITEM_NONE)
      {
        inventory.cGround.AddItem(cItem);
      }
    }

    var arrPlayerItems = cHero.GetInventory();
    iLength = arrPlayerItems.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      cItem = arrPlayerItems[idx];
      if (cItem != null)
      {
        iItemType = cItem.GetItemType();
        if (iItemType == CONST.ITEM_MONEY)
        {
          inventory.cPurse.AddItem(cItem);
        }
        else if (cHero.IsItemEquipped(cItem))
        {
          if (iItemType == CONST.ITEM_WEAPON) { inventory.cWeapon.AddItem(cItem); }
        }
        else if (iItemType != CONST.ITEM_NONE)
        {
          inventory.cPack.AddItem(cItem);
        }
      }
    }
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
        cContainer.Draw(ctx, inventory.cSelectedItem);
      }
    }
  };

  return inventory;
}());
