var PAWNUTILS = (function () {
  const TERRAIN_ICON_DIR = "./res/terrain/";
  const ITEM_ICON_DIR = "./res/item/";

  var pu = {};

  // ----------------
  // MakeStairs
  //     Returns a set of stairs
  // ----------------
  pu.MakeStairs = function(iStairsType, iStairsID)
  {
    var strName = (iStairsType == CONST.DOOR_UPSTAIRS) ? "Stairs (up)" : "Stairs (down)";
    var strIcon = TERRAIN_ICON_DIR;
    strIcon += (iStairsType == CONST.DOOR_UPSTAIRS) ? "upstairs.gif" : "downstairs.gif";
    var cStairs = new PAWN(CONST.PAWN_STAIRS, strName, strIcon, iStairsType, iStairsID);

    return cStairs;
  };

  // ----------------
  // MakeGoldPile
  //     Returns a pile of gold
  // ----------------
  pu.MakeGoldPile = function(iAmount=0)
  {
    var iValue = (iAmount > 0) ? iAmount : 1;
    var cGoldPile = new PAWN(CONST.PAWN_ITEM, "Gold", "./res/item/gold.gif", CONST.ITEM_MONEY);
    cGoldPile.iQuantity = iValue;
    return cGoldPile;
  };

  // ----------------
  // MakeStore
  //     Returns a store
  // ----------------
  pu.MakeStore = function(strName="Store", strIcon="")
  {
    return new PAWN(CONST.PAWN_STORE, strName, strIcon);
  };

  // ----------------
  // MakeWell
  //     Returns a well
  // ----------------
  pu.MakeWell = function(strName="Well")
  {
    return new PAWN(CONST.PAWN_DECOR, strName, TERRAIN_ICON_DIR+"well.gif");
  };

  // ----------------
  // MakeSign
  //     Returns a sign
  // ----------------
  pu.MakeSign = function(strName="Sign", strDescr="")
  {
    return new PAWN(CONST.PAWN_DECOR, strName, TERRAIN_ICON_DIR+"sign.gif");
  };

  // ----------------
  // MakeHouse
  //     Returns a house
  // ----------------
  pu.MakeHouse = function(strName="House")
  {
    return new PAWN(CONST.PAWN_DECOR, strName, TERRAIN_ICON_DIR+"house3x3.gif");
  };

  return pu;
}());
