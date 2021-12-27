var PAWN = (function () {
  // privates
  const PAWN_HEALTH = 100;
  const PAWN_DAMAGE = 2;
  // main
  var pawn = function(iPawnType, strName = "Pawn", strIcon = "", iItemType=CONST.ITEM_NONE, iValue=0)
  {
    // pawn specific data
    this.iPawnType = iPawnType;
    this.iItemType = iItemType;
    this.iValue    = iValue; // value of the item for buying and selling
    this.iQuantity = 0; // assume that any value less than one means its not an item
    this.iBulk     = 0;
    this.iCapacity = 0;
    this.iLastTime = 0; // timestamp of the last action taken

    this.strName = strName;
    this.strIcon = strIcon;
    this.cTile = null;
    this.cRect = null; // used to determine absolute positioning for mouse
    this.cParentContainer = null;

    this.cBaseStats = new STATBLOCK();
    this.cTotalStats = new STATBLOCK();
    this.arrInventory = [];
    this.arrEquipped = [];

    this.cController = null; // controls actions for AI - left null for items and characters

    // ---- Getters and setters ----
    this.GetName      = function() { return this.strName; };
    this.GetIcon      = function() { return this.strIcon; };
    this.GetInventory = function() { return this.arrInventory; };
    this.GetEquipment = function() { return this.arrEquipped; };
    this.GetPawnType  = function() { return this.iPawnType; };
    this.GetItemType  = function() { return this.iItemType; };
    this.GetValue     = function() { return this.iValue; };

    this.GetTile    = function()          { return this.cTile; };
    this.SetTile    = function(cTile)     { this.cTile = cTile; };
    this.RemoveTile = function()
    {
      if (this.cTile != null)
      {
        this.cTile.RemoveEntity(this);
        this.cTile = null;
      }
    };

    this.IsPassable = function()
    {
      return (this.iPawnType != CONST.PAWN_ENEMY && this.iPawnType != CONST.PAWN_HERO);
    };

    this.GetRect  = function()            { return this.cRect; };
    this.SetRect  = function(cRectBounds) { this.cRect = cRectBounds; };
    this.IsInRect = function(x, y)        { return this.cRect.CheckPoint(x, y); };

    this.GetParent = function()                  { return this.cParentContainer; };
    this.SetParent = function(cContainer = null) { this.cParentContainer = cContainer; };

    // ----------------
    // GetStat
    //     Retrieves a stat for the pawn - either the modified or the base
    // ----------------
    this.GetStat = function(iStatName, bUseBase=false)
    {
      var arrStat = (bUseBase) ? this.cBaseStats.GetStat(iStatName) : this.cTotalStats.GetStat(iStatName);
      // console.log("GetStat -> ", iStatName, arrStat);
      return arrStat;
    };

    // ----------------
    // SetStat
    //     Sets the stat for the pawn - always the base
    // ----------------
    this.SetStat = function(iStatName, iStatValue, bUseCurrent=true)
    {
      this.cBaseStats.SetStat(iStatName, iStatValue, bUseCurrent);
      this.CalculateTotalStats();
    };

    // ----------------
    // CalculateTotalStats
    //     Goes through equipped items and adds them to the total stats
    // ----------------
    this.CalculateTotalStats = function()
    {
      this.cTotalStats = new STATBLOCK();
      this.cTotalStats.AddStatBlock(this.cBaseStats);
      var cItem;
      var idx;
      var iEquippedItems = this.arrEquipped.length;
      for (idx = 0; idx < iEquippedItems; ++idx)
      {
        cItem = this.arrEquipped[idx];
        if (cItem != null)
        {
          this.cTotalStats.AddStatBlock(cItem.cBaseStats);
        }
      } // end for loop
    };

    // ----------------
    // Copy
    //     Makes a type-copy of the pawn - if you want every aspect copied use DeepCopy
    // ----------------
    this.Copy = function()
    {
      var cNewPawn = new PAWN(this.iPawnType, this.strName, this.strIcon, this.iItemType);
      return cNewPawn;
    };

    // ----------------
    // Move
    //     Moves the pawn one space in the direcction specified
    // ----------------
    this.Move = function(iDirection, cFloor)
    {
      var bHandled = false;
      var iTargetIdx;
      if (cFloor != null)
      {
        iTargetIdx = cFloor.GetDirectionalTile(this.GetTile(), iDirection);
        if (iTargetIdx != this.GetTile().GetIdx())
        {
          var cTargetTile = cFloor.GetTile(iTargetIdx);
          cTargetTile.PlaceEntity(this);
          bHandled = true;
        }
      }

      return bHandled;
    };

    // ----------------
    // IsTileAdjacent
    //     Returns true if the given tile is adjacent to this pawn
    // ----------------
    this.IsTileAdjacent = function(cTile, cFloor, bIncludeSelf=false)
    {
      var bAdjacent = false;
      if (bIncludeSelf && cTile == this.cTile) { return true; } // easy return

      var iThisIdx = this.cTile.GetIdx();
      var iCheckIdx;
      var idx;
      var iLength = CONST.DIRECTIONS.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        iCheckIdx = cFloor.GetDirectionIdx(iThisIdx, CONST.DIRECTIONS[idx]);
        if (iCheckIdx == cTile.GetIdx())
        {
          bAdjacent = true;
          break;
        }
      } // end for loop

      return bAdjacent;
    };

    // ----------------
    // GetGoldItem
    //     Returns the item that represents the pawn's gold pile
    // ----------------
    this.GetGoldItem = function()
    {
      var idx;
      var iLength = this.arrInventory.length;
      var cMoney = null;
      for (idx = 0; idx < iLength; ++idx)
      {
        cMoney = this.arrInventory[idx];
        if (cMoney != null && cMoney.GetItemType() == CONST.ITEM_MONEY)
        {
          return cMoney;
        }
      } // end for loop

      return null;
    };


    // ----------------
    // GetGold
    //     Returns the amount of gold this pawn has
    // ----------------
    this.GetGold = function()
    {
      var cMoney = this.GetGoldItem();
      var iAmount = (cMoney != null) ? cMoney.iQuantity : 0;
      return iAmount;
    };

    // ----------------
    // DeductGold
    //     Removes a specified amount of gold from the pawn - if it can
    // ----------------
    this.DeductGold = function(iAmount)
    {
      var cMoney = this.GetGoldItem();
      var iDiff = -1;
      if (cMoney != null)
      {
        if (cMoney.iQuantity >= iAmount)
        {
          cMoney.iQuantity -= iAmount;
          return iAmount;
        }
        else
        {
          iDiff = cMoney.iQuantity;
          cMoney.iQuantity = 0;
          return iDiff;
        }
      }

      return -1;
    };

    // ----------------
    // AddToInventory
    //     Adds a pawn to this pawns inventory - combines currency if it can
    // ----------------
    this.AddToInventory = function(cItem, bEquip=false)
    {
      if (cItem == null) { return; }
      cItem.RemoveTile(); // clear out any tile information when it enters the inventory

      if (cItem.GetItemType() == CONST.ITEM_MONEY && cItem.iQuantity > 0)
      {
        var idx;
        var iLength = this.arrInventory.length;
        var cMoney;
        var bFoundMoney = false;
        for (idx = 0; idx < iLength; ++idx)
        {
          cMoney = this.arrInventory[idx];
          if (cMoney != null && cMoney.GetItemType() == CONST.ITEM_MONEY && cMoney.strName == cItem.strName)
          {
            cMoney.iQuantity += parseInt(cItem.iQuantity);
            bFoundMoney = true;
            break;
          }
        } // end for loop
        if (!bFoundMoney) { this.arrInventory.push(cItem); }
      }
      else
      {
        this.arrInventory.push(cItem);
        if (bEquip) { this.EquipItem(cItem); }
      }
    };

    // ----------------
    // EquipItem
    //     Equips an item - currently assumes the item is in the inventory already - bad things will happen if it isn't
    // ----------------
    this.EquipItem = function(cPawn)
    {
      var iItemType = cPawn.GetItemType();
      var bCanEquip = true;
      var cItem;
      var idx;
      var iLength = this.arrEquipped.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cItem = this.arrEquipped[idx];
        if (cItem != null && cItem.GetItemType() != CONST.ITEM_NONE && cItem.GetItemType() == iItemType)
        {
          bCanEquip = false;
        }
      } // end for loop

      if (bCanEquip) { this.arrEquipped.push(cPawn); }

      this.CalculateTotalStats();
    };

    // ----------------
    // UnequipItem
    //     Unequips the item - but it is still owned
    // ----------------
    this.UnequipItem = function(cItem)
    {
      if (cItem != null)
      {
        var idx = this.arrEquipped.indexOf(cItem);
        if (idx >= 0) { this.arrEquipped.splice(idx, 1); }
        this.CalculateTotalStats();
      }
    };

    // ----------------
    // IsItemEquipped
    //     Checks if the specified item is equipped
    // ----------------
    this.IsItemEquipped = function(cItem) { return (cItem != null && this.arrEquipped.indexOf(cItem) >= 0); };

    // ----------------
    // IsItemOwned
    //     Checks if the specified item is in the inventory
    // ----------------
    this.IsItemOwned = function(cItem) { return (cItem != null && this.arrInventory.indexOf(cItem) >= 0); };

    // ----------------
    // DropItem
    //     Drops a specific item onto the floor of the pawn's current tile, if it exists
    // ----------------
    this.DropItem = function(cItem)
    {
      var idx;
      if (cItem != null)
      {
        idx = this.arrInventory.indexOf(cItem);
        if (idx >= 0)
        {
          if (this.cTile != null) { this.cTile.PlaceEntity(cItem); }
          this.arrInventory.splice(idx, 1);
        }
        // remove from equipment as well
        this.UnequipItem(cItem);
      }
    };

    // ----------------
    // TransferItem
    //     Moves one item to this pawn to another pawn's inventory - useful for store transactions
    // ----------------
    this.TransferItem = function(cItem, cPawn)
    {
      var idx;
      if (cItem != null && cPawn != null)
      {
        idx = this.arrInventory.indexOf(cItem);
        if (idx >= 0)
        {
          cPawn.AddToInventory(cItem);
          this.arrInventory.splice(idx, 1);
        }
        // remove from equipment as well
        this.UnequipItem(cItem);
      }
    };

    // ----------------
    // Dead
    //     Causes the pawn to "die" - which removes it from the board and drops its inventory
    // ----------------
    this.Dead = function()
    {
      var cTile = this.GetTile(); // get the tile before it goes away
      this.RemoveTile();
      // drop items
      var idx;
      var iLength = this.arrInventory.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cTile.PlaceEntity(this.arrInventory[idx]);
      }
    };

    this.IsDead = function() { return (this.GetStat(CONST.STAT_HEALTH)[0] < 1); };

    // ----------------
    // Update
    //     Runs updates - runs the controller script if it exists
    // ----------------
    this.Update = function()
    {
      if (this.cController != null && !this.IsDead())
      {
        var iDelta = GetTime() - this.iLastTime;
        if (iDelta > this.cController.iReactionTime)
        {
          this.cController.Act(this);
          this.iLastTime = GetTime();
        }
      }
    };
  }; // end of class

  return pawn;
}());
