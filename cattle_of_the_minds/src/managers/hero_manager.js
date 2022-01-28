var HERO = (function () {
  // consts
  const DEFAULT_SIGHT_RANGE = 3;
  const DEFAULT_ICON = "./res/hero.gif";
  const DEFAULT_PORTRAIT = "./res/portrait/hero_default.png";
  // main
  var hero = {};

  hero.m_cHero = null;
  hero.m_strPortrait = DEFAULT_PORTRAIT;

  // ----------------
  // Getters and setters
  // ----------------
  hero.Get = function()      { return hero.m_cHero; };
  hero.Set = function(cPawn) { hero.m_cHero = cPawn; };

  hero.GetIcon = function()
  {
    if (hero.m_cHero != null) { return hero.m_cHero.GetIcon(); }
    else                      { return DEFAULT_ICON; }
  };
  hero.SetIcon = function(strIcon)
  {
    if (hero.m_cHero != null)
    {
      // var http = new XMLHttpRequest();
      // http.open('HEAD', strIcon, false);
      // http.send();
      // if (http.status != 404)
      //{
        hero.m_cHero.SetIcon(strIcon);
      // }
    } // null check
  };

  hero.GetPortrait = function() { return hero.m_strPortrait; };
  hero.SetPortrait = function(strPortrait) { hero.m_strPortrait = strPortrait; };

  hero.GetSightRange = function() { return DEFAULT_SIGHT_RANGE; }; // TODO - make this more dynamic

  // ----------------
  // QuickHero
  //     Returns a basic starting hero for testing purposes
  // ----------------
  hero.QuickHero = function()
  {
    var cHero = new PAWN(CONST.PAWN_HERO, "Hero", DEFAULT_ICON);
    var cBaseStats = cHero.cBaseStats;
    // just add the stats for now
    cBaseStats.SetStat(CONST.STAT_LEVEL, 1);
    cBaseStats.SetStat(CONST.STAT_HEALTH, 10);
    cBaseStats.SetStat(CONST.STAT_MANA, 10);
    cBaseStats.SetStat(CONST.STAT_STRENGTH, 10);
    cBaseStats.SetStat(CONST.STAT_DEXTERITY, 10);
    cBaseStats.SetStat(CONST.STAT_INTELLECT, 10);
    cBaseStats.SetStat(CONST.STAT_CONSTITUTION, 10);
    cBaseStats.SetStat(CONST.STAT_POINTS, 40);
    // give the player some gold and a sword
    cHero.AddToInventory(D_WEAPON.Sword(), true);
    cHero.AddToInventory(PAWNUTILS.MakeGoldPile(50));

    hero.Set(cHero);
  };

  // ----------------
  // HealHero
  //     Heals the hero to full health
  // ----------------
  hero.HealHero = function()
  {
    hero.m_cHero.SetStat(CONST.STAT_HEALTH, 0, true); // technically resets the buff
  };

  // ----------------
  // LevelUp
  //     Levels up the hero
  // ----------------
  hero.LevelUp = function()
  {
    var iLevel = hero.m_cHero.GetStat(CONST.STAT_LEVEL);
    var iConst = hero.m_cHero.GetStat(CONST.STAT_CONSTITUTION);
    var iIntellect = hero.m_cHero.GetStat(CONST.STAT_INTELLECT);
    var iTotalHealth = 10 + (Math.floor(iConst/10) * 2 * iLevel);
    var iManaIncrease = Math.floor(iIntellect / 10);
    var cStatBlock = new STATBLOCK();
    cStatBlock.SetStat(CONST.STAT_LEVEL, 1, true);
    // cStatBlock.SetStat(CONST.STAT_HEALTH, iHealthIncrease, true);
    cStatBlock.SetStat(CONST.STAT_MANA, iManaIncrease, true);
    hero.m_cHero.cBaseStats.AddStatBlock(cStatBlock);
    hero.m_cHero.CalculateTotalStats();
    hero.HealHero();
    MBOX.AddInfo("Welcome to level " + hero.m_cHero.GetStat(CONST.STAT_LEVEL)[0]);
  };

  return hero;
}());
