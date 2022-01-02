var DUNGEON = (function () {
  // consts
  const FLOOR_WIDTH = 50;
  // main
  var dungeon = {};

  dungeon.m_iCurrentFloor = 0;
  dungeon.m_arrFloors = [];

  // ----------------
  // GetCurrentFloorIdx
  //     Gets the idx of the current floor
  // ----------------
  dungeon.GetCurrentFloorIdx = function() { return dungeon.m_iCurrentFloor; };

  // ----------------
  // GetFloor
  //     Gets a specified floor or the current floor if unspecified - if it exists
  // ----------------
  dungeon.GetFloor = function(idx=-1)
  {
    var cFloor = null;
    if (idx < 0) { idx = dungeon.m_iCurrentFloor; }

    if (idx >= 0 && idx < dungeon.m_arrFloors.length)
    {
      cFloor = dungeon.m_arrFloors[idx];
    }

    return cFloor;
  };

  // ----------------
  // GetAllFloors
  //     Returns all floors - probably don't need this honestly
  // ----------------
  dungeon.GetAllFloors = function() { return dungeon.m_arrFloors; };

  // ----------------
  // GoToFloor
  //     Goes to a specified floor - creates the floor if it doesn't exist
  // ----------------
  dungeon.GoToFloor = function(idx, iDoorType, iDoor=-1)
  {
    var cFloor = dungeon.GetFloor(idx);
    if (cFloor == null)
    {
      cFloor = D_FLOOR.RandomFloor(FLOOR_WIDTH, dungeon.GetFloor().CountStairs(iDoorType));
      dungeon.m_arrFloors.push(cFloor);
    }

    if (cFloor != null)
    {
      var cEntranceTile;
      if (iDoor >= 0)
      {
        var iDestinationStairsType = (iDoorType == CONST.DOOR_UPSTAIRS) ? CONST.DOOR_DOWNSTAIRS : CONST.DOOR_UPSTAIRS;
        var cStairs = cFloor.GetStairs(iDestinationStairsType, iDoor);
        cEntranceTile = (cStairs != null) ? cStairs.GetTile() : cFloor.GetEmptyTile();
      }
      else
      {
        cEntranceTile = cFloor.GetEmptyTile();
      }

      // spawn enemies -- TODO: make a timer to spawn them staggered
      var arrSpawnMap = [...cFloor.GetSpawnMap()]; // returns a shallow copy for altering the data
      var idx;
      var iSpawns = cFloor.GetNPCLimit() - cFloor.GetNPCs().length;
      var iEnemyID;
      var cEnemy;
      for (idx = 0; idx < iSpawns; ++idx)
      {
        iEnemyID = arrSpawnMap[Math.floor(Math.random() * arrSpawnMap.length)];
        cEnemy = D_ENEMY.MakeEnemy(iEnemyID);
        cFloor.GetEmptyTile().PlaceEntity(cEnemy);
        cFloor.AddNPC(cEnemy);
      } // end for loop

      cEntranceTile.PlaceEntity(HERO.Get());
      dungeon.m_iCurrentFloor = dungeon.m_arrFloors.indexOf(cFloor);
    }
  };

  // ----------------
  // UpdateNPCs
  //     Updates the NPCs on the current floor
  // ----------------
  dungeon.UpdateNPCs = function()
  {
    var cFloor = dungeon.GetFloor();
    if (cFloor != null)
    {
      cFloor.UpdateNPCs();
    }
  };

  return dungeon;
}());
