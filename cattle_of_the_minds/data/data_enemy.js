var D_ENEMY = (function () {
  const ENEMY_ICON_DIR = "./res/enemy/";
  var de = {};

  // enemy consts
  de.ID_GOBLIN    = 1;
  de.ENEMY_GOBLIN =
  {
    id      : de.ID_GOBLIN,
    strName : "Goblin",
    strIcon : "goblin.gif",
    arrStats: [ [CONST.STAT_HEALTH, 4], [CONST.STAT_BRAWN, 20], [CONST.STAT_AGILITY, 10] ]
  };

  de.ID_HOBGOBLIN    = 2;
  de.ENEMY_HOBGOBLIN =
  {
    id      : de.ID_HOBGOBLIN,
    strName : "Hobgoblin",
    strIcon : "hobgoblin.gif",
    arrStats: [ [CONST.STAT_HEALTH, 8], [CONST.STAT_BRAWN, 30], [CONST.STAT_AGILITY, 20] ]
  };

  de.ID_BEAR    = 3;
  de.ENEMY_BEAR =
  {
    id      : de.ID_BEAR,
    strName : "Bear",
    strIcon : "bear.gif",
    arrStats: [ [CONST.STAT_HEALTH, 12], [CONST.STAT_BRAWN, 50], [CONST.STAT_AGILITY, 30] ]
  };

  de.ID_RAT    = 4;
  de.ENEMY_RAT =
  {
    id      : de.ID_RAT,
    strName : "Rat",
    strIcon : "rat.gif",
    arrStats: [ [CONST.STAT_HEALTH, 2], [CONST.STAT_BRAWN, 10], [CONST.STAT_AGILITY, 30] ]
  };

  de.ID_SKELETON    = 5;
  de.ENEMY_SKELETON =
  {
    id      : de.ID_SKELETON,
    strName : "Skeleton",
    strIcon : "skeleton.gif",
    arrStats: [ [CONST.STAT_HEALTH, 11], [CONST.STAT_BRAWN, 20], [CONST.STAT_AGILITY, 20] ]
  };

  de.ID_GHOST    = 6;
  de.ENEMY_GHOST =
  {
    id      : de.ID_GHOST,
    strName : "Ghost",
    strIcon : "ghost.gif",
    arrStats: [ [CONST.STAT_HEALTH, 14], [CONST.STAT_BRAWN, 10], [CONST.STAT_AGILITY, 30] ]
  };

  de.m_arrEnemyBank =
  [
    de.ENEMY_GOBLIN,
    de.ENEMY_HOBGOBLIN,
    de.ENEMY_BEAR,
    de.ENEMY_RAT,
    de.ENEMY_SKELETON,
    de.ENEMY_GHOST
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
      var strIconPath = ENEMY_ICON_DIR + objEnemyInfo.strIcon;
      cEnemy = new PAWN(CONST.PAWN_ENEMY, objEnemyInfo.strName, strIconPath);
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
