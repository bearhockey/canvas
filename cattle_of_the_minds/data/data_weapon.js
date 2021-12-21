var D_WEAPON = (function () {
  const WEAPON_ICON_DIR = "./res/item/weapon/";

  var dw = {};

  dw.Axe = function(strName="Axe")
  {
    var cAxe = new PAWN(CONST.PAWN_ITEM, strName, WEAPON_ICON_DIR+"axe.gif", CONST.ITEM_WEAPON, 60);
    cAxe.cBaseStats.SetStat(CONST.STAT_ATTACK, 3, true);
    cAxe.cBaseStats.SetStat(CONST.STAT_ACCURACY, 1, true);

    return cAxe;
  };

  dw.Hammer = function(strName="Hammer")
  {
    var cHammer = new PAWN(CONST.PAWN_ITEM, strName, WEAPON_ICON_DIR+"hammer.gif", CONST.ITEM_WEAPON, 30);
    cHammer.cBaseStats.SetStat(CONST.STAT_ATTACK, 2, true);
    cHammer.cBaseStats.SetStat(CONST.STAT_ACCURACY, 1, true);

    return cHammer;
  };

  dw.Spear = function(strName="Spear")
  {
    var cSpear = new PAWN(CONST.PAWN_ITEM, strName, WEAPON_ICON_DIR+"spear.gif", CONST.ITEM_WEAPON, 70);
    cSpear.cBaseStats.SetStat(CONST.STAT_ATTACK, 1, true);
    cSpear.cBaseStats.SetStat(CONST.STAT_ACCURACY, 3, true);

    return cSpear;
  };

  dw.Sword = function(strName="Sword")
  {
    var cSword = new PAWN(CONST.PAWN_ITEM, strName, WEAPON_ICON_DIR+"sword.gif", CONST.ITEM_WEAPON, 50);
    cSword.cBaseStats.SetStat(CONST.STAT_ATTACK, 2, true);
    cSword.cBaseStats.SetStat(CONST.STAT_ACCURACY, 2, true);

    return cSword;
  };

  return dw;
}());
