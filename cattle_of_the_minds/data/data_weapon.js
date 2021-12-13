var D_WEAPON = (function () {

  var dw = {};

  dw.Sword = function(strName="Sword")
  {
    var cSword = new PAWN(CONST.PAWN_ITEM, strName, "./res/sword.gif", CONST.ITEM_WEAPON, 50);
    cSword.cBaseStats.SetStat(CONST.STAT_ATTACK, 2, true);
    cSword.cBaseStats.SetStat(CONST.STAT_ACCURACY, 1, true);

    return cSword;
  };

  return dw;
}());
