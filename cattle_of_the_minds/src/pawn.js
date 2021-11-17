var PAWN = (function () {
  // privates
  const PAWN_HEALTH = 100;
  const PAWN_DAMAGE = 2;
  // main
  var pawn = function(iType, strName = "Pawn", strIcon = "")
  {
    // pawn specific data
    this.iType = iType;
    this.strName = strName;
    this.strIcon = strIcon;
    this.cTile = null;

    this.iLevel = 1;
    this.iHP = 20;
    this.iMP = 10;
    // this.cInventory = new INVENTORY();

    this.GetIcon = function() { return this.strIcon; };

    this.GetTile = function() { return this.cTile; };
    this.SetTile = function(cTile) { this.cTile = cTile; };

    // --------
    // Move
    //     Moves the pawn one space in the direcction specified
    // --------
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
  };

  return pawn;
}());
