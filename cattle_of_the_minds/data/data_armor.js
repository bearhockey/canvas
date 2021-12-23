var D_ARMOR = (function () {
  const ARMOR_ICON_DIR = "./res/item/armor/";

  var da = {};

  da.Leather = function(strName="Leather Armor")
  {
    var cLeather = new PAWN(CONST.PAWN_ITEM, strName, ARMOR_ICON_DIR+"leather_armor.gif", CONST.ITEM_ARMOR, 100);
    cLeather.cBaseStats.SetStat(CONST.STAT_ARMOR, 4, true);
    cLeather.cBaseStats.SetStat(CONST.STAT_AGILITY, -2, true);

    return cLeather;
  };

  return da;
}());
