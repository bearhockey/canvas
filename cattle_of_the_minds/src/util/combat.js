var COMBAT = (function () {
  var combat = {};

  // ----------------
  // RollStat
  //     Rolls a given stat and returns a value back
  // ----------------
  combat.RollStat = function(iStat)
  {
    var iHits = 0;
    var idx;
    for (idx = 0; idx < (iStat/10); ++idx)
    {
      iHits += (UTILS.Roll1d6() == 6) ? 1 : 0;
    }

    return iHits;
  };

  // ----------------
  // CheckHit
  //     Checks if an attack hits
  // ----------------
  combat.CheckHit = function(iAttackerDex, iAttackerAccuracy, iDefenderDex)
  {
    var iAttackerCheck = combat.RollStat(iAttackerDex);
    var iDefenderCheck = combat.RollStat(iDefenderDex);
    return (iAttackerCheck + iAttackerAccuracy >= iDefenderCheck);
  };

  // ----------------
  // CheckDamage
  //     Checks the damage dealt - minimum of 1 damage always delt
  // ----------------
  combat.CheckDamage = function(iAttackerAttack, iDefenderBrawn, iArmorValue=0)
  {
    return Math.max(iAttackerAttack-(Math.floor(Math.random()*iDefenderBrawn)+iArmorValue), 1);
  };

  // ----------------
  // AddXPFromEnemy
  //     Adds the XP value from the enemy to the hero
  // ----------------
  combat.AddXPFromEnemy = function(cEnemy)
  {
    var cHero = HERO.Get();
    var cStatBlock = new STATBLOCK();
    cStatBlock.SetStat(CONST.STAT_XP, cEnemy.GetStat(CONST.STAT_XP)[0]);
    cHero.cBaseStats.AddStatBlock(cStatBlock);
    cHero.CalculateTotalStats();
    // check if level
    var iLevel = cHero.GetStat(CONST.STAT_LEVEL)[0];
    if (cHero.GetStat(CONST.STAT_XP)[0] > iLevel*10)
    {
      HERO.LevelUp();
    }
  }

  // ----------------
  // AttackPawn
  //     Pawn 1 (attacker) attacks Pawn 2 (defender)
  // ----------------
  combat.AttackPawn = function(cAttacker, cDefender, bIsHeroAttacker=true)
  {
    if (cDefender.IsDead()) { return; } // don't beat a dead horse

    var bHit = combat.CheckHit(cAttacker.GetStat(CONST.STAT_DEXTERITY)[0],
                               cAttacker.GetStat(CONST.STAT_ACCURACY)[0],
                               cDefender.GetStat(CONST.STAT_DEXTERITY)[0]);
    var strAttacker = (bIsHeroAttacker) ? "You" : cAttacker.strName;
    var strDefender = (bIsHeroAttacker) ? cDefender.strName : "you";
    if (bHit)
    {
      var iDamage = combat.CheckDamage(cAttacker.GetStat(CONST.STAT_ATTACK)[0],
                                       cDefender.GetStat(CONST.STAT_STRENGTH)[0]);
      var iEnemyHealth = cDefender.GetStat(CONST.STAT_HEALTH)[0] - iDamage;
      cDefender.SetStat(CONST.STAT_HEALTH, iEnemyHealth, false);
      var cHero = HERO.Get();
      if (iEnemyHealth > 0)
      {
        MBOX.AddInfo(strAttacker + " dealt " + iDamage.toString() + " damage to " + strDefender + "!");
        if (cDefender != cHero)
        {
          var arrNewHealth = cDefender.GetStat(CONST.STAT_HEALTH);
          MBOX.AddInfo(UTILS.GetHealthLevel(arrNewHealth[0], arrNewHealth[1]));
        }
      }
      else
      {
        MBOX.AddInfo(cDefender.strName + " is the dead.");
        if (cAttacker == cHero)
        {
          combat.AddXPFromEnemy(cDefender);
        }
      }
    }
    else
    {
      MBOX.AddInfo("The attack from " + strAttacker + " misses " + strDefender + "!");
    }
  };

  return combat;
}());
