var INVENTORY = (function () {
  var inventory = {};
  // consts
  // const ADD_ICON = new PAWN(CONST.PAWN_ITEM, "Add", "./res/add.gif", CONST.ITEM_ADD);
  // member vars
  inventory.cStore = null;
  inventory.cSelectedItem = null;
  inventory.arrContainers = [];
  //
  inventory.cHelmet   = new ICONTAINER(360, 160,  100, 120, "Helmet", CONST.ITEM_HELMET, 1);

  inventory.cCloak    = new ICONTAINER(240, 290, 100, 120, "Cloak",  CONST.ITEM_CLOAK, 1);
  inventory.cArmor    = new ICONTAINER(360, 290, 100, 120, "Armor",  CONST.ITEM_ARMOR, 1);

  inventory.cShield   = new ICONTAINER(120, 420, 100, 120, "Shield",    CONST.ITEM_SHIELD, 1);
  inventory.cWeapon   = new ICONTAINER(240, 420, 100, 120, "Weapon",    CONST.ITEM_WEAPON, 1);
  inventory.cFreeHand = new ICONTAINER(360, 420, 100, 120, "Free Hand", CONST.ITEM_ANY,    1);

  inventory.cBelt     = new ICONTAINER(240, 550, 100, 120, "Belt",  CONST.ITEM_BELT,  1);
  inventory.cBoots    = new ICONTAINER(360, 550, 100, 120, "Boots", CONST.ITEM_BOOTS, 1);

  inventory.cAccessory1 = new ICONTAINER(120, 680, 100, 120, "Acc. 1", CONST.ITEM_ACCESSORY, 1);
  inventory.cAccessory2 = new ICONTAINER(240, 680, 100, 120, "Acc. 2", CONST.ITEM_ACCESSORY, 1);
  inventory.cAccessory3 = new ICONTAINER(360, 680, 100, 120, "Acc. 3", CONST.ITEM_ACCESSORY, 1);
  //
  inventory.cMain   = new ICONTAINER(480, 160,  460, 320, "Ground");
  inventory.cPack   = new ICONTAINER(480, 490, 460, 320, "Pack");
  inventory.cPurse  = new ICONTAINER(480, 830, 460, 120, "Purse", CONST.ITEM_MONEY, 4);
  //
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

    inventory.arrContainers.push(inventory.cMain);
    inventory.arrContainers.push(inventory.cPack);
    inventory.arrContainers.push(inventory.cPurse);
  };

  // ----------------
  // BuyFromStore
  //     Wrapper logic for purchasing an item from the store
  // ----------------
  inventory.BuyFromStore = function(cHero)
  {
    var bAcquiredItem = false;
    var iPrice = inventory.cSelectedItem.iPrice;
    var bConfirm = confirm("I'll sell it for " + iPrice.toString() + " gold. Deal?"); // TODO - loc
    if (bConfirm)
    {
      if (cHero.GetGold() > iPrice)
      {
        cHero.DeductGold(iPrice);
        inventory.cStore.TransferItem(inventory.cSelectedItem, cHero);
        bAcquiredItem = true;
      }
      else
      {
        var iDiff = iPrice - cHero.GetGold();
        alert("You don't have the gold! You need " + iDiff.toString() + " more!"); // TODO - loc
      }
    }

    return bAcquiredItem;
  };

  // ----------------
  // HandleMouseClick
  //     Handles logic for when clicking / tapping the screen
  // ----------------
  inventory.HandleMouseClick = function(x, y)
  {
    var cItem = inventory.CheckRects(x, y);
    var cHero = GetHero();
    var cTile;
    var bNewItem = false;
    var iTimeInterval = 0;
    var iPrice;
    var bConfirm;

    if (cItem != null)
    {
      if (inventory.cSelectedItem != null && cItem.GetItemType() == CONST.ITEM_ADD && cContainer != inventory.cSelectedItem.GetParent())
      {
        var iSplit;
        if (inventory.cSelectedItem.iQuantity > 1)
        {
          iSplit = prompt("How much to move?", inventory.cSelectedItem.iQuantity);
          if (iSplit == null || iSplit == 0) // not moving anything, do nothing
          {
            inventory.cSelectedItem = null;
            Update(iTimeInterval);
            return;
          }
          else if (iSplit != inventory.cSelectedItem.iQuantity)
          {
            var iDiff = inventory.cSelectedItem.iQuantity - iSplit;
            inventory.cSelectedItem.iQuantity = iDiff;
            inventory.cSelectedItem = inventory.cSelectedItem.Copy();
            inventory.cSelectedItem.iQuantity = iSplit;
            bNewItem = true;
          }
        }
        var cContainer = cItem.GetParent();
        if (cContainer == inventory.cMain)
        {
          if (bNewItem)
          {
            cHero.GetTile().PlaceEntity(inventory.cSelectedItem);
          }
          else if (inventory.cStore != null)
          {
            iPrice = inventory.cSelectedItem.iPrice / 2; // TODO - get this value
            bConfirm = confirm("I'll give ya " + iPrice.toString() + " for it. Deal?");
            if (bConfirm)
            {
              cHero.TransferItem(inventory.cSelectedItem, inventory.cStore);
              cHero.AddToInventory(PAWNUTILS.MakeGoldPile(iPrice));
            }
          }
          else
          {
            cHero.DropItem(inventory.cSelectedItem);
          }
        }
        else
        {
          if (cContainer == inventory.cPack)
          {
            if (cHero.IsItemOwned(inventory.cSelectedItem))
            {
              cHero.UnequipItem(inventory.cSelectedItem);
            }
            else if (inventory.cSelectedItem.GetParent() == inventory.cMain && inventory.cStore != null)
            {
              inventory.BuyFromStore(cHero);
            }
            else
            {
              cHero.AddToInventory(inventory.cSelectedItem);
              inventory.cSelectedItem.RemoveTile();
            }
          }
          else
          {
            var bAcquiredItem = true;
            if (!cHero.IsItemOwned(inventory.cSelectedItem))
            {
              if (inventory.cSelectedItem.GetParent() == inventory.cMain && inventory.cStore != null)
              {
                bAcquiredItem = inventory.BuyFromStore(cHero);
              }
              else
              {
                cHero.AddToInventory(inventory.cSelectedItem);
              }
            }

            if (bAcquiredItem)
            {
              cHero.EquipItem(inventory.cSelectedItem);
            }
          }
        }

        inventory.cSelectedItem.SetParent(cContainer);
        inventory.cSelectedItem = null;
        iTimeInterval = 1;
      }
      else
      {
        inventory.cSelectedItem = cItem;
      }
    }
    else
    {
      inventory.cSelectedItem = null;
    }

    Update(iTimeInterval);
  };

  // ----------------
  // CheckRects
  //     Checks if a given x,y  cordinate intersects any item rectangle
  // ----------------
  inventory.CheckRects = function(x=0, y=0)
  {
    var idxContainers;
    var cContainer;
    var iContainers = inventory.arrContainers.length;

    var arrContents;
    var idxItem;
    var cItem;
    var iItems;

    var cRect;
    var cFoundItem = null;
    for (idxContainers = 0; idxContainers < iContainers; ++idxContainers)
    {
      cContainer = inventory.arrContainers[idxContainers];
      if (cContainer != null)
      {
        arrContents = cContainer.arrContents;
        if (arrContents != null && arrContents.length > 0)
        {
          iItems = arrContents.length;
          for (idxItem = 0; idxItem < iItems; ++idxItem)
          {
            cItem = arrContents[idxItem];
            if (cItem != null)
            {
              cRect = cItem.GetRect();
              // console.log("Container contents :", cRect, x, y);
              if (cRect != null && cRect.CheckPoint(x, y))
              {
                cFoundItem = cItem;
                break;
              }
            }
          } // end item for loop
          if (cFoundItem != null) { break; } // found something, return
        }
      }
    } // end container for loop

    return cFoundItem;
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
    var iSelectedItemType = (inventory.cSelectedItem != null) ? inventory.cSelectedItem.GetItemType() : CONST.ITEM_NONE;

    // empty out containers first
    iLength = inventory.arrContainers.length;
    for (idx = 0; idx < iLength; ++idx)
    { inventory.arrContainers[idx].Empty(); }

    var cCurrentTile = cHero.GetTile();
    inventory.cStore = cCurrentTile.GetStore();
    var arrItems;
    if (inventory.cStore != null)
    {
      arrItems = inventory.cStore.GetInventory();
      inventory.cMain.UpdateName(inventory.cStore.GetName());
    }
    else
    {
      arrItems = cCurrentTile.GetEntities();
      inventory.cMain.UpdateName("Ground"); // TODO - const this
    }

    iLength = arrItems.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      cItem = arrItems[idx];
      if (cItem != null && cItem.GetItemType() != CONST.ITEM_NONE)
      {
        inventory.cMain.AddItem(cItem);
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
          if (iItemType == CONST.ITEM_WEAPON) { inventory.cWeapon.AddItem(cItem); } // TODO - do all the items here, or maybe make a dict
        }
        else if (iItemType != CONST.ITEM_NONE)
        {
          inventory.cPack.AddItem(cItem);
        }
      }
    } // end for loop

    // add symbol for things
    if (iSelectedItemType != CONST.ITEM_NONE)
    {
      var cContainer;
      var iContainerType;
      var iFreeSlots;
      iLength = inventory.arrContainers.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cContainer = inventory.arrContainers[idx];
        if (cContainer != null)
        {
          iFreeSlots = cContainer.GetFreeSlots();
          iContainerType = cContainer.GetItemType();
          if (iFreeSlots > 0 && (iContainerType == CONST.ITEM_ANY || iContainerType == iSelectedItemType))
          {
            cContainer.AddItem(new PAWN(CONST.PAWN_ITEM, "Add", "./res/add.gif", CONST.ITEM_ADD));
          }

        }
      } // end for loop
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
