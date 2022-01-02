var D_FLOOR = (function () {
  // consts -- move these to a file probably
  const MINIMUM_ROOM_WIDTH = 4;
  const MAXIMUM_ROOM_WDTH = 10;
  const EMPTY_PERCENTAGE = 0.4;
  const ROOM_GENERATION_RETRIES = 10;
  const ROOM_LIT_CHANCE = 0.3;

  var df = {};

  // ----------------
  // DebugFloor
  //     Makes a debug floor
  // ----------------
  df.DebugFloor = function(iFloorWidth=13)
  {
    var iBorder = 4;
    var cFloor = new FLOOR(iFloorWidth);
    cFloor.SetSpawnMap([D_ENEMY.ID_GOBLIN, D_ENEMY.ID_HOBGOBLIN, D_ENEMY.ID_BEAR]);
    cFloor.SetNPCLimit(3);

    // make a border around the room
    cFloor.FillFloor();
    var cRoomTile = new TILE(-1, true, true, CONST.SHAPE_SQUARE, CONST.TILE_LIT);
    cFloor.FillFloorSection(iBorder, iBorder, iFloorWidth-(iBorder*2), iFloorWidth-(iBorder*2), cRoomTile);

    cFloor.AddPawnToEmptyTile(PAWNUTILS.MakeStairs(CONST.DOOR_DOWNSTAIRS, 0));
    return cFloor;
  };

  // ----------------
  // RandomFloor
  //     Builds a random floor
  // ----------------
  df.RandomFloor = function(iWidth, iStairEntrances=1)
  {
    var cFloor = new FLOOR(iWidth);
    var cWallTile = new TILE(-1, false, false, CONST.SHAPE_SQUARE, CONST.TILE_WALL);
    cFloor.SetSpawnMap([D_ENEMY.ID_GOBLIN, D_ENEMY.ID_GOBLIN, D_ENEMY.ID_GOBLIN,
                        D_ENEMY.ID_HOBGOBLIN, D_ENEMY.ID_HOBGOBLIN, D_ENEMY.ID_BEAR]);
    cFloor.SetNPCLimit(8);

    var iSize = cFloor.iWidth * cFloor.iWidth;
    var idx;
    var iLength;
    var color;
    var cTile;

    // step one - fill the room with walls
    cFloor.FillFloor();

    // step two - generate rooms
    var iRoomIdx;
    var iRoomX;
    var iRoomY;
    var iRoomHeight;
    var iRoomWidth;

    var arrRoom;
    var iRoomLength;
    var bValidRoom;
    var arrCenterTiles = [];

    var x;
    var y;
    var nEmptyPercentage = 0;
    var iTries = 0;

    // 2a - pregen rooms
    var iExitPoint = -1;
    // iExitPoint = D_ROOM.CrossRoom(cFloor,
    //                               Math.floor(Math.random()*(cFloor.iWidth-9))+1,
    //                              Math.floor(Math.random()*(cFloor.iWidth-9))+1);
    iExitPoint = D_ROOM.RandomPregenRoom(cFloor,
                                         Math.floor(Math.random()*(cFloor.iWidth-9))+1,
                                         Math.floor(Math.random()*(cFloor.iWidth-9))+1,
                                         (Math.random() > 0.5));
    if (iExitPoint >= 0)
    {
      arrCenterTiles.push(iExitPoint);
    }
    // 2b - random rooms
    while (nEmptyPercentage < EMPTY_PERCENTAGE && iTries < ROOM_GENERATION_RETRIES)
    {
      arrRoom = [];
      bValidRoom = true;

      iRoomX = Math.floor(Math.random()*cFloor.iWidth);
      iRoomY = Math.floor(Math.random()*cFloor.iWidth)*cFloor.iWidth;
      iRoomIdx = iRoomY+iRoomX;
      iRoomHeight = Math.floor(Math.random()*(MAXIMUM_ROOM_WDTH-MINIMUM_ROOM_WIDTH)) + MINIMUM_ROOM_WIDTH;
      iRoomWidth = Math.floor(Math.random()*(MAXIMUM_ROOM_WDTH-MINIMUM_ROOM_WIDTH)) + MINIMUM_ROOM_WIDTH;
      for (y = 0; y < iRoomHeight; ++y)
      {
        for (x = 0; x < iRoomWidth; ++x)
        {
          idx = iRoomIdx + x + (y * cFloor.iWidth);
          // first check if idx is valid
          if (!cFloor.IsValidIdx(idx))
          {
            bValidRoom = false;
            break;
          }
          else if (cFloor.arrTileMap[idx].bIsPassable)
          {
            bValidRoom = false;
            break;
          }
          else
          {
            arrRoom.push(idx);
          }

        } // end x loop
      } // end y loop

      if (bValidRoom)
      {
        color = Math.random() < ROOM_LIT_CHANCE ? CONST.TILE_LIT : cFloor.strFloorColor;
        iRoomLength = arrRoom.length;
        for (x = 0; x < iRoomLength; ++x)
        {
          idx = arrRoom[x];
          cTile = new TILE(idx, true, (color == CONST.TILE_LIT), CONST.SHAPE_SQUARE, color);
          cFloor.arrTileMap[idx] = cTile;
          cFloor.arrEmptyTiles.push(cTile);
          // estimate trying to find the middle of trhe room
          if (x == Math.floor(iRoomLength*0.5))
          {
            arrCenterTiles.push(idx);
          }
        } // end for loop
      }
      else
      {
        iTries++;
      }

      nEmptyPercentage = cFloor.arrEmptyTiles.length / cFloor.arrTileMap.length;
    } // end while loop

    // step three - connect the rooms
    var iDestination;
    var iHandbreak;
    var cEmptyTile = new TILE(idx, true, false, CONST.SHAPE_SQUARE, cFloor.strFloorColor);
    while (arrCenterTiles.length > 0)
    {
      idx = arrCenterTiles.shift();
      iDestination = (arrCenterTiles.length > 0) ? arrCenterTiles[0] : idx;
      iHandbreak = 100; // stop infinite generation
      while (idx != iDestination && iHandbreak > 0)
      {
        if      (idx < iDestination && idx + cFloor.iWidth < iDestination) { idx += cFloor.iWidth; }
        else if (idx > iDestination && idx - cFloor.iWidth > iDestination) { idx -= cFloor.iWidth; }
        if (idx % cFloor.iWidth < iDestination % cFloor.iWidth)      { idx += 1; }
        else if (idx % cFloor.iWidth > iDestination % cFloor.iWidth) { idx -= 1;}

        cTile = cFloor.arrTileMap[idx];
        if (cFloor.IsValidIdx(idx) && cFloor.arrTileMap[idx] != null && !cFloor.arrTileMap[idx].bIsPassable)
        {
          cFloor.PlaceTile(idx, cEmptyTile);
        }

        iHandbreak--;
      } // end idx while loop
    } // end arrCenterTiles while loop

    // step four - make some diagonals (TODO - maybe make this a function somewhere else)
    var cTopLeftCorner     = new TILE(-1, false, false, CONST.SHAPE_TOPLEFT_CORNER, cFloor.strWallColor, cFloor.strFloorColor);
    var cTopRightCorner    = new TILE(-1, false, false, CONST.SHAPE_TOPRIGHT_CORNER, cFloor.strWallColor, cFloor.strFloorColor);
    var cBottomRightCorner = new TILE(-1, false, false, CONST.SHAPE_BOTTOMRIGHT_CORNER, cFloor.strWallColor, cFloor.strFloorColor);
    var cBottomLeftCorner  = new TILE(-1, false, false, CONST.SHAPE_BOTTOMLEFT_CORNER, cFloor.strWallColor, cFloor.strFloorColor);
    var arrEmptyDir = []; // empty direction
    var iDirection;
    var arrAllTiles = cFloor.GetAllTiles();
    var arrNeighbors;
    var iWalls;
    var cCurrentTile;
    iLength = arrAllTiles.length;
    for (idx = 0; idx < iLength; ++idx)
    {
      cCurrentTile = cFloor.GetTile(idx);
      arrNeighbors = cFloor.GetAdjacentTiles(idx);
      // start the big checklist of how to fix walls and floors
      if (cCurrentTile != null)
      {
        iWalls = UTILS.CountWalls(arrNeighbors, cFloor);
        for (iDirection = 0; iDirection < arrNeighbors.length; ++iDirection)
        {
          arrEmptyDir[iDirection] = (arrNeighbors[iDirection] != null) ?
                                    (arrNeighbors[iDirection].IsPassable() && !arrNeighbors[iDirection].HasEntity()) :
                                    false;
        } // end for loop`

        if (!cCurrentTile.IsPassable())
        {
          if (iWalls >= 2)
          {
            if      (arrEmptyDir[CONST.NORTH] && arrEmptyDir[CONST.EAST])  { cFloor.PlaceTile(idx, cBottomLeftCorner); }
            else if (arrEmptyDir[CONST.EAST]  && arrEmptyDir[CONST.SOUTH]) { cFloor.PlaceTile(idx, cTopLeftCorner); }
            else if (arrEmptyDir[CONST.SOUTH] && arrEmptyDir[CONST.WEST])  { cFloor.PlaceTile(idx, cTopRightCorner); }
            else if (arrEmptyDir[CONST.WEST]  && arrEmptyDir[CONST.NORTH]) { cFloor.PlaceTile(idx, cBottomRightCorner); }
          }
          else if (iWalls == 0)
          {
            cFloor.PlaceTile(idx, cEmptyTile);
          }
        }
        else if (cCurrentTile.IsPassable())
        {
          if (iWalls <=4 && iWalls >= 2)
          {
            if (arrEmptyDir[CONST.NORTH] && arrEmptyDir[CONST.SOUTH] && !arrEmptyDir[CONST.EAST] && !arrEmptyDir[CONST.WEST])
            {
              if ( (arrEmptyDir[CONST.NORTHEAST] && arrEmptyDir[CONST.NORTHWEST]) ||
                   (arrEmptyDir[CONST.SOUTHEAST] && arrEmptyDir[CONST.SOUTHWEST]) )
              {
                cFloor.AddPawnToTile(PAWNUTILS.MakeDoor(), idx);
                cFloor.PlaceTile(idx-1, cWallTile);
                cFloor.PlaceTile(idx+1, cWallTile);
              }
            }
            else if (arrEmptyDir[CONST.EAST] && arrEmptyDir[CONST.WEST] && !arrEmptyDir[CONST.NORTH] && !arrEmptyDir[CONST.SOUTH])
            {
              if ( (arrEmptyDir[CONST.NORTHEAST] && arrEmptyDir[CONST.SOUTHEAST]) ||
                   (arrEmptyDir[CONST.NORTHWEST] && arrEmptyDir[CONST.SOUTHWEST]) )
              {
                cFloor.AddPawnToTile(PAWNUTILS.MakeDoor(), idx);
                cFloor.PlaceTile(idx-iWidth, cWallTile);
                cFloor.PlaceTile(idx+iWidth, cWallTile);
              }
            }
          }
        }
      }
    } // end for loop

    // add upstairs
    var iNumberOfUpstairs = iStairEntrances;
    var bKeepGoing = true;
    while (iNumberOfUpstairs > 0 && bKeepGoing)
    {
      bKeepGoing = cFloor.AddPawnToEmptyTile(PAWNUTILS.MakeStairs(CONST.DOOR_UPSTAIRS, iNumberOfUpstairs-1));
      if (bKeepGoing) { iNumberOfUpstairs--; }
    }

    // add downstairs
    var iNumberOfDownstairs = Math.floor(Math.random()*3) + 1;
    while (iNumberOfDownstairs > 0)
    {
      cFloor.AddPawnToEmptyTile(PAWNUTILS.MakeStairs(CONST.DOOR_DOWNSTAIRS, iNumberOfDownstairs-1));
      iNumberOfDownstairs--;
    }

    return cFloor;
  };

  // ----------------
  // TownOne
  //     Builds the starting town
  // ----------------
  df.TownOne = function()
  {
    var cFloor = new FLOOR(21);
    cFloor.FillFloor();
    var cGrassTile = new TILE(-1, true, true, CONST.SHAPE_SQUARE, CONST.TILE_GRASS);
    cFloor.FillFloorSection(2, 1, 16, 18, cGrassTile);

    cFloor.FillFloorSection(8, 2, 3, 2);
    cFloor.PlaceTile(72, new TILE(-1, true, true, CONST.SHAPE_SQUARE, CONST.TILE_EMPTY));

    var cPathTile = new TILE(-1, true, true, CONST.SHAPE_SQUARE, CONST.TILE_PATH);
    var cPathCornerBL = new TILE(-1, true, true, CONST.SHAPE_BOTTOMLEFT_CORNER, CONST.TILE_PATH, CONST.TILE_GRASS);
    var cPathCornerBR = new TILE(-1, true, true, CONST.SHAPE_BOTTOMRIGHT_CORNER, CONST.TILE_PATH, CONST.TILE_GRASS);
    cFloor.FillFloorSection(9, 4, 1, 11, cPathTile);
    cFloor.FillFloorSection(7, 11, 5, 1, cPathTile);
    cFloor.FillFloorSection(8, 15, 3, 3, cPathTile);
    cFloor.FillFloorSection(7, 16, 1, 1, cPathTile);
    cFloor.FillFloorSection(11, 16, 1, 1, cPathTile);
    cFloor.PlaceTile(302, cPathCornerBR);
    cFloor.PlaceTile(304, cPathCornerBL);

    // houses
    var cHouseGrass = new TILE(-1, false, true, CONST.SHAPE_SQUARE, CONST.TILE_GRASS); // impassible grass

    cFloor.FillFloorSection(5, 11, 2, 2, cHouseGrass);
    cFloor.PlaceTile(237, cPathTile);
    cFloor.AddPawnToTile(PAWNUTILS.MakeHouse("Junk", 2), 236);
    cFloor.AddPawnToTile(PAWNUTILS.MakeSign(), 259);

    cFloor.FillFloorSection(12, 10, 3, 3, cHouseGrass);
    cFloor.PlaceTile(243, cPathTile);
    cFloor.AddPawnToTile(PAWNUTILS.MakeHouse("What"), 222);
    cFloor.AddPawnToTile(PAWNUTILS.MakeSign(), 221);

    cFloor.FillFloorSection(4, 15, 3, 3, cHouseGrass);
    cFloor.PlaceTile(342, cPathTile);
    var cBlacksmith = PAWNUTILS.MakeStore("Blacksmith");
    cFloor.AddPawnToTile(cBlacksmith, 342, true);
    cFloor.AddPawnToTile(PAWNUTILS.MakeHouse(), 319);
    cFloor.AddPawnToTile(PAWNUTILS.MakeSign(), 322);

    cFloor.FillFloorSection(12, 15, 3, 3, cHouseGrass);
    cFloor.PlaceTile(348, cPathTile);
    cFloor.AddPawnToTile(PAWNUTILS.MakeHouse(), 327);
    cFloor.AddPawnToTile(PAWNUTILS.MakeSign(), 326);

    cFloor.AddPawnToTile(PAWNUTILS.MakeWell(), 345);

    STORE.SetStore("Blacksmith", cBlacksmith);
    cBlacksmith.AddToInventory(D_WEAPON.Sword()); // TODO - have stores not be defined like this (need to be static)
    cBlacksmith.AddToInventory(D_WEAPON.Spear());
    cBlacksmith.AddToInventory(D_WEAPON.Axe());
    cBlacksmith.AddToInventory(D_WEAPON.Hammer());
    cBlacksmith.AddToInventory(D_ARMOR.Leather());

    cFloor.AddPawnToTile(PAWNUTILS.MakeStairs(CONST.DOOR_DOWNSTAIRS, 0), 72);

    cFloor.SetEntranceIdx(324);
    return cFloor;
  };

  return df;
}());
