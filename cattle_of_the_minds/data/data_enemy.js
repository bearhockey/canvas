var D_ENEMY = (function () {

  var de = {};

  // enemy consts
  de.ID_GOBLIN = 1;
  de.ENEMY_GOBLIN = { id:de.ID_GOBLIN, strName:"Goblin", strIcon:"./res/goblin.gif",
                      arrStats:[ [CONST.STAT_HEALTH, 4], [CONST.STAT_BRAWN, 2], [CONST.STAT_AGILITY, 1] ] };

  de.ID_HOBGOBLIN = 2;
  de.ENEMY_HOBGOBLIN = {id:de.ID_HOBGOBLIN, strName:"Hobgoblin", strIcon:"./res/hobgoblin.gif",
                      arrStats:[ [CONST.STAT_HEALTH, 8], [CONST.STAT_BRAWN, 3], [CONST.STAT_AGILITY, 2] ] };

  de.ID_BEAR = 3;
  de.ENEMY_BEAR = {id:de.ID_BEAR, strName:"Bear", strIcon:"./res/bear.gif",
                      arrStats:[ [CONST.STAT_HEALTH, 12], [CONST.STAT_BRAWN, 5], [CONST.STAT_AGILITY, 3] ] };

  de.m_arrEnemyBank =
  [
    de.ENEMY_GOBLIN,
    de.ENEMY_HOBGOBLIN,
    de.ENEMY_BEAR
  ];

  // ----------------
  // GetEnemyData
  //     Returns the enemy data from the given id
  // ----------------
  de.GetEnemyData = function(id)
  {
    var idx;
    var iLength = de.m_arrEnemyBank.length;
    var cEnemy;
    for (idx = 0; idx < iLength; ++idx)
    {
      cEnemy = de.m_arrEnemyBank[idx];
      if (cEnemy != null && cEnemy.id == id)
      {
        return cEnemy;
        break;
      }
    } // end for loop

    return null;
  };

  // ----------------
  // MakeEnemy
  //     Makes an enemy pawn
  // ----------------
  de.MakeEnemy = function(id)
  {
    var cEnemy = null;
    var objEnemyInfo = de.GetEnemyData(id);
    if (objEnemyInfo != null)
    {
      cEnemy = new PAWN(CONST.PAWN_ENEMY, objEnemyInfo.strName, objEnemyInfo.strIcon);
      // TODO - make this better
      var arrStatPairs = objEnemyInfo.arrStats;
      var idx;
      var iStatPairs = arrStatPairs.length;
      var arrStat;
      var iRandom;
      for (idx = 0; idx < iStatPairs; ++idx)
      {
        arrStat = arrStatPairs[idx];
        iRandom = (arrStat[0] == CONST.STAT_HEALTH) ? Math.floor(Math.random()*4) : 0;
        cEnemy.cBaseStats.SetStat(arrStat[0], arrStat[1]+iRandom, true);
      } // end for loop
      cEnemy.CalculateTotalStats(); // for now because we aren't equipping anything

      cEnemy.AddToInventory(PAWNUTILS.MakeGoldPile(Math.floor(Math.random()*10) + 5));
      cEnemy.cController = new NPC();
    }

    return cEnemy;
  };

  return de;
}());
