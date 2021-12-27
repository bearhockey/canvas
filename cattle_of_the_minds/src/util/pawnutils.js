var PAWNUTILS = (function () {
  const TERRAIN_ICON_DIR = "./res/terrain/";
  const ITEM_ICON_DIR = "./res/item/";

  var pu = {};

  // ----------------
  // MakeHero
  //     Returns a starting hero - probably move this and make it more dynamic
  // ----------------
  pu.MakeHero = function()
  {
    var cHero = new PAWN(CONST.PAWN_HERO, "Hero", "./res/hero.gif");
    // just add the stats for now
    cHero.cBaseStats.SetStat(CONST.STAT_LEVEL, 1, true);
    cHero.cBaseStats.SetStat(CONST.STAT_HEALTH, 20, true);
    cHero.cBaseStats.SetStat(CONST.STAT_MANA, 10, true);
    cHero.cBaseStats.SetStat(CONST.STAT_BRAWN, 10, true);
    cHero.cBaseStats.SetStat(CONST.STAT_AGILITY, 30, true);
    // give the player some gold and a sword
    cHero.AddToInventory(D_WEAPON.Sword(), true);
    cHero.AddToInventory(PAWNUTILS.MakeGoldPile(90));

    return cHero;
  };

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
    var cStore = new PAWN(CONST.PAWN_STORE, strName, strIcon);
    cStore.cBaseStats.SetStat(CONST.STAT_HEALTH, 999, true);
    cStore.CalculateTotalStats(); // have to give stores health so they don't "die" and drop their inventory
    cStore.cController = new TRIGGER(STORE.VisitStore);
    return cStore;
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
  pu.MakeHouse = function(strName="House", iSize=3)
  {
    var strHouseIcon = (iSize == 2) ? "house2x2.gif" : "house3x3.gif";
    return new PAWN(CONST.PAWN_DECOR, strName, TERRAIN_ICON_DIR+strHouseIcon);
  };

  return pu;
}());
