var PAWNUTILS = (function () {
  var pu = {};

  // ----------------
  // MakeGoblin
  //     Returns a new goblin
  // ----------------
  pu.MakeGoblin = function()
  {
    var cEnemy = new PAWN(CONST.PAWN_ENEMY, "Goblin", "./res/goblin.gif");
    cEnemy.cBaseStats.SetStat(CONST.STAT_HEALTH, Math.floor(Math.random()*4)+4, true);
    cEnemy.cBaseStats.SetStat(CONST.STAT_BRAWN, 2, true);
    cEnemy.cBaseStats.SetStat(CONST.STAT_AGILITY, 1, true);
    cEnemy.CalculateTotalStats(); // for now because we aren't equipping anything
    // give the goblin some gold
    cEnemy.AddToInventory(pu.MakeGoldPile(Math.floor(Math.random()*10) + 5));
    return cEnemy;
  };

  // ----------------
  // MakeGoldPile
  //     Returns a pile of gold
  // ----------------
  pu.MakeGoldPile = function(iAmount=0)
  {
    var iValue = (iAmount > 0) ? iAmount : 1;
    var cGoldPile = new PAWN(CONST.PAWN_ITEM, "Gold", "./res/gold.gif", CONST.ITEM_MONEY);
    cGoldPile.iQuantity = iValue;
    return cGoldPile;
  };

  return pu;
}());
