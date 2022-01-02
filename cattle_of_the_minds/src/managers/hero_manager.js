var HERO = (function () {
  // consts
  const DEFAULT_SIGHT_RANGE = 3;
  // main
  var hero = {};

  hero.m_cHero = null;

  // ----------------
  // Getters and setters
  // ----------------
  hero.Get = function()      { return hero.m_cHero; };
  hero.Set = function(cPawn) { hero.m_cHero = cPawn; };

  hero.GetSightRange = function() { return DEFAULT_SIGHT_RANGE; }; // TODO - make this more dynamic

  // ----------------
  // QuickHero
  //     Returns a basic starting hero for testing purposes
  // ----------------
  hero.QuickHero = function()
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

    hero.Set(cHero);
  };

  // ----------------
  // LevelUp
  //     Levels up the hero
  // ----------------
  hero.LevelUp = function()
  {
    var iBrawn = hero.m_cHero.GetStat(CONST.STAT_BRAWN)[1];
    var iIntellect = hero.m_cHero.GetStat(CONST.STAT_INTELLECT)[1];
    var iHealthIncrease = Math.floor(iBrawn / 10) * 2;
    var iManaIncrease = Math.floor(iIntellect / 10);
    var cStatBlock = new STATBLOCK();
    cStatBlock.SetStat(CONST.STAT_LEVEL, 1, true);
    cStatBlock.SetStat(CONST.STAT_HEALTH, iHealthIncrease, true);
    cStatBlock.SetStat(CONST.STAT_MANA, iManaIncrease, true);
    hero.m_cHero.cBaseStats.AddStatBlock(cStatBlock);
    hero.m_cHero.CalculateTotalStats();
    MBOX.AddInfo("Welcome to level " + hero.m_cHero.GetStat(CONST.STAT_LEVEL)[0]);
  };

  return hero;
}());
