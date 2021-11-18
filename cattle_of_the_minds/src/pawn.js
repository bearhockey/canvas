var PAWN = (function () {
  // privates
  const PAWN_HEALTH = 100;
  const PAWN_DAMAGE = 2;
  // main
  var pawn = function(iPawnType, strName = "Pawn", strIcon = "", iItemType=CONST.ITEM_NONE)
  {
    // pawn specific data
    this.iPawnType = iPawnType;
    this.iItemType = iItemType;
    this.iQuantity = 0; // assume that any value less than one means its not an item
    this.iBulk     = 0;
    this.iCapacity = 0;

    this.strName = strName;
    this.strIcon = strIcon;
    this.cTile = null;

    this.cStatBlock = new STATBLOCK();
    this.arrInventory = [];
    this.arrEquipped = [];

    // ---- Getters and setters ----
    this.GetIcon      = function() { return this.strIcon; };
    this.GetInventory = function() { return this.arrInventory; };
    this.GetEquipment = function() { return this.arrEquipped; };
    this.GetItemType  = function() { return this.iItemType; };

    this.GetTile = function()          { return this.cTile; };
    this.SetTile = function(cTile)     { this.cTile = cTile; };
    this.IsPassable = function()       { return (this.iPawnType != CONST.PAWN_ENEMY); };
    this.GetStat = function(iStatName) { return this.cStatBlock.GetStat(iStatName); };

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
    // AddToInventory
    //     Adds a pawn to this pawns inventory - combines currency if it can
    // ----------------
    this.AddToInventory = function(cPawn)
    {
      if (cPawn.GetItemType() == CONST.ITEM_MONEY && cPawn.iQuantity > 0)
      {
        var idx;
        var iLength = this.arrInventory.length;
        var cMoney;
        var bFoundMoney = false;
        for (idx = 0; idx < iLength; ++idx)
        {
          cMoney = this.arrInventory[idx];
          if (cMoney != null && cMoney.GetItemType() == CONST.ITEM_MONEY && cMoney.strName == cPawn.strName)
          {
            cMoney.iQuantity += cPawn.iQuantity;
            bFoundMoney = true;
            break;
          }
        } // end for loop
        if (!bFoundMoney) { this.arrInventory.push(cPawn); }
      }
      else
      {
        this.arrInventory.push(cPawn);
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
    };

    // ----------------
    // IsItemEquipped
    //     Checks if the specified item is equipped
    // ----------------
    this.IsItemEquipped = function(cPawn)
    {
      return (this.arrEquipped.indexOf(cPawn) >= 0);
    };

    this.Dead = function()
    {
      var cTile = this.GetTile();
      cTile.RemoveEntity(this);
      // drop items
      var idx;
      var iLength = this.arrInventory.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cTile.PlaceEntity(this.arrInventory[idx]);
      }
    };
  }; // end of class

  return pawn;
}());
