var COMBAT = (function () {
  var combat = {};

  // ----------------
  // CheckHit
  //     Checks if an attack hits
  // ----------------
  combat.CheckHit = function(iAttackerAgility, iAttackerAccuracy, iDefenderAgility)
  {
    var iAttackerCheck = UTILS.Roll2d6() + iAttackerAgility;
    var iDefenderCheck = UTILS.Roll2d6() + iDefenderAgility;
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
