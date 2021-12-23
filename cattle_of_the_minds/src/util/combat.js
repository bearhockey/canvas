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
  combat.CheckHit = function(iAttackerAgility, iAttackerAccuracy, iDefenderAgility)
  {
    var iAttackerCheck = combat.RollStat(iAttackerAgility);
    var iDefenderCheck = combat.RollStat(iDefenderAgility);
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
  // AttackPawn
  //     Pawn 1 (attacker) attacks Pawn 2 (defender)
  // ----------------
  combat.AttackPawn = function(cAttacker, cDefender, bIsHeroAttacker=true)
  {
    if (cDefender.IsDead()) { return; } // don't beat a dead horse

    var bHit = combat.CheckHit(cAttacker.GetStat(CONST.STAT_AGILITY)[0],
                               cAttacker.GetStat(CONST.STAT_ACCURACY)[0],
                               cDefender.GetStat(CONST.STAT_AGILITY)[0]);
    var strAttacker = (bIsHeroAttacker) ? "You" : cAttacker.strName;
    var strDefender = (bIsHeroAttacker) ? cDefender.strName : "you";
    if (bHit)
    {
      var iDamage = combat.CheckDamage(cAttacker.GetStat(CONST.STAT_ATTACK)[0],
                                       cDefender.GetStat(CONST.STAT_BRAWN)[0]);
      var iEnemyHealth = cDefender.GetStat(CONST.STAT_HEALTH)[0] - iDamage;
      cDefender.SetStat(CONST.STAT_HEALTH, iEnemyHealth, false);
      if (iEnemyHealth > 0)
      {
        MBOX.AddInfo(strAttacker + " dealt " + iDamage.toString() + " damage to " + strDefender + "!");
        if (cDefender != GetHero())
        {
          var arrNewHealth = cDefender.GetStat(CONST.STAT_HEALTH);
          MBOX.AddInfo(UTILS.GetHealthLevel(arrNewHealth[0], arrNewHealth[1]));
        }
      }
      else
      {
        MBOX.AddInfo(cDefender.strName + " is the dead.");
      }
    }
    else
    {
      MBOX.AddInfo("The attack from " + strAttacker + " misses " + strDefender + "!");
    }
  };

  return combat;
}());
