var D_FLOOR = (function () {
  // consts -- move these to a file probably
  const MINIMUM_ROOM_WIDTH = 4;
  const MAXIMUM_ROOM_WDTH = 10;
  const EMPTY_PERCENTAGE = 0.4;
  const ROOM_GENERATION_RETRIES = 10;
  const ROOM_LIT_CHANCE = 0.3;

  const EMPTY_COLOR = "#CCCCCC";
  const LIT_COLOR   = "#EEEEFF";
  const WALL_COLOR = "#444444";

  var df = {};

  // ----------------
  // DebugFloor
  //     Makes a debug floor
  // ----------------
  df.DebugFloor = function(iFloorWidth=13)
  {
    var cFloor = new FLOOR(iFloorWidth);

    // make a border around the room
    cFloor.FillFloor();
    var cTile;
    var idx;
    var iSize = iFloorWidth * iFloorWidth;
    var color;
    for (idx = 0; idx < iSize; ++idx)
    {
      if (idx < iFloorWidth || idx > iSize-iFloorWidth || idx % iFloorWidth == 0 || idx % iFloorWidth == iFloorWidth -1)
      {
        continue;
      }
      else
      {
        color = LIT_COLOR
        cTile = new TILE(idx, true, (color == LIT_COLOR), color);
        cFloor.arrTileMap[idx] = cTile;
        cFloor.arrEmptyTiles.push(cTile);
      }
    }

    return cFloor;

  };

  // ----------------
  // RandomFloor
  //     Builds a random floor
  // ----------------
  df.RandomFloor = function(iWidth)
  {
    var cFloor = new FLOOR(iWidth);
    var iSize = cFloor.iWidth * cFloor.iWidth;
    var idx;
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
        color = Math.random() < ROOM_LIT_CHANCE ? LIT_COLOR : cFloor.strFloorColor;
        iRoomLength = arrRoom.length;
        for (x = 0; x < iRoomLength; ++x)
        {
          idx = arrRoom[x];
          cTile = new TILE(idx, true, (color == LIT_COLOR), color);
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
    while (arrCenterTiles.length > 0)
    {
      idx = arrCenterTiles.shift();
      iDestination = (arrCenterTiles.length > 0) ? arrCenterTiles[0] : idx;
      while (idx != iDestination)
      {
        if (idx < iDestination)
        {
          if (idx + cFloor.iWidth < iDestination) { idx += cFloor.iWidth; }
          else                                  { idx += 1;}
        }
        else if (idx > iDestination)
        {
          if (idx - cFloor.iWidth > iDestination) { idx -= cFloor.iWidth; }
          else                                  { idx -= 1; }
        }

        cTile = cFloor.arrTileMap[idx];
        if (cFloor.IsValidIdx(idx) && cFloor.arrTileMap[idx] != null && !cFloor.arrTileMap[idx].bIsPassable)
        {
          cTile = new TILE(idx, true, false, cFloor.strFloorColor);
          cFloor.arrTileMap[idx] = cTile;
          cFloor.arrEmptyTiles.push(cTile);
        }
      } // end idx while loop
    } // end arrCenterTiles while loop

    // add upstairs
    var iNumberOfUpstairs = cFloor.iUpstairs;
    var bKeepGoing = true;
    while (iNumberOfUpstairs > 0 && bKeepGoing)
    {
      bKeepGoing = cFloor.AddPawnToEmptyTile(new PAWN(CONST.PAWN_STAIRS, "Stairs", "./res/upstairs.gif", CONST.DOOR_UPSTAIRS));
      if (bKeepGoing) { iNumberOfUpstairs--; }
    }

    // add downstairs
    var iNumberOfDownstairs = Math.floor(Math.random()*3) + 1;
    while (iNumberOfDownstairs > 0)
    {
      cFloor.AddPawnToEmptyTile(new PAWN(CONST.PAWN_STAIRS, "Stairs", "./res/downstairs.gif", CONST.DOOR_DOWNSTAIRS));
      iNumberOfDownstairs--;
    }

    return cFloor;
  };

  return df;
}());
