var LEVEL = (function () {
  const TILE_PADDING = 2;
  var level = {};
  level.arrTiles = [];
  level.iRowLength = 0;
  level.iRevealedRooms = 0;

  level.arrGroundRooms = [];

  // ----------------
  // LoadRoomXML
  //     Loads the room data from room_data.xml and parses them into arrays
  // ----------------
  level.LoadRoomXML = function()
  {
    var idx;
    var xmlData;
    var objRoom;
    // var xmlRoomData = XML.xhttp.responseXML;
    var xmlRoomData = XML.xmlDoc;
    console.log(XML.xhttp);
    console.log(XML.xhttp.responseXML);
    console.log(xmlRoomData);
    if (xmlRoomData)
    {
      console.log("LOADROMXML 2");
      var arrFloorData = xmlRoomData.getElementsByTagName("ground")[0].getElementsByTagName("room");
      if (arrFloorData && arrFloorData.length > 0)
      {
        console.log("LOADROMXML 3");
        for (idx = 0; idx < arrFloorData.length; ++idx)
        {
          xmlData = arrFloorData[iRando];
          objRoom =
          {
            label: xmlData.getElementsByTagName("label")[0].innerHTML,
            doors: xmlData.getElementsByTagName("doors")[0].innerHTML
          };

          level.arrGroundRooms.push(objRoom);
        } // end for loop
      } // end arrFloorData check
    } // end xmlRoomData check
  };

  // ----------------
  // GetTile
  //     Returns the tile object at the given index, or empty object if out
  //    of bounds
  // ----------------
  level.GetTile = function(idx)
  {
    if (idx > -1 && idx < level.arrTiles.length)
    {
      return level.arrTiles[idx];
    }
    else
    {
      return {};
    }
  }

  level.GetTileIndex = function(xPos, yPos)
  {
    return ((yPos * level.iRowLength) + xPos);
  };

  level.GetTileCords = function(idx)
  {
    var y = Math.floor(idx/level.iRowLength);
    var x = idx - (y * level.iRowLength);
    return {x:x, y:y};
  };

  // Directional functions
  level.GetDirection = function(idx, iDirection)
  {
    var fnCheck;
    switch (iDirection)
    {
      case DIRECTION.NORTH: { fnCheck = level.GetNorth; break; }
      case DIRECTION.EAST:  { fnCheck = level.GetEast;  break; }
      case DIRECTION.SOUTH: { fnCheck = level.GetSouth; break; }
      case DIRECTION.WEST:  { fnCheck = level.GetWest;  break; }
      default: break;
    } // end switch

    if (fnCheck) { return fnCheck(idx); }
    else         { return -1; }
  };

  level.GetNorth = function(idx) { return idx - level.iRowLength; };
  level.GetSouth = function(idx)
  {
    if (idx + level.iRowLength >= level.arrTiles.length) { return -1; }
    else                                                 { return idx + level.iRowLength; }
  };
  level.GetEast  = function(idx)
  {
    if ((idx + 1) % level.iRowLength == 0) { return -1; }
    else                                   { return idx + 1; }
  };
  level.GetWest  = function(idx)
  {
    if (idx % level.iRowLength == 0) { return -1; }
    else                             { return idx - 1; }
  };

  // ----------------
  // Generate
  //     Builds all the tiles
  // ----------------
  level.Generate = function(iSize)
  {
    level.arrTiles.length = 0;
    var idx;
    for (idx = 0; idx < iSize; ++idx)
    {
      level.arrTiles.push({value:0, doors:[false, false, false, false]});
    }

    level.iRowLength = Math.sqrt(iSize);
  };

  // ----------------
  // GenerateTile
  //     Generates a tile
  // ----------------
  level.GenerateTile = function(iTileIdx = -1)
  {
    if (iTileIdx < 0) { return; }
    var objTile = level.arrTiles[iTileIdx];
    var bHasExit = false;

    var iDirection;
    var bMakeDoor = false;
    for (iDirection = 0; iDirection < objTile.doors.length; ++iDirection)
    {
      bMakeDoor = objTile.doors[iDirection] = level.GenerateDoor(iTileIdx, iDirection);
      if (bMakeDoor) { bHasExit = true; }
    }

    // if no exits then open all doors
    if (!bHasExit)
    {
      objTile.doors = [true, true, true, true];
    }
    // show discovered state
    objTile.value = 1;
    level.iRevealedRooms++;

    var strLabel = "Room # " + level.iRevealedRooms;
    var iRando;
    var objRoom;
    console.log(level.arrGroundRooms.length);
    if (level.arrGroundRooms.length > 0)
    {
      console.log("yay");
      iRando = Math.floor(Math.random() * level.arrGroundRooms.length);
      objRoom = level.arrGroundRooms.splice(iRando, 1);
      if (objRoom)
      {
        strLabel = objRoom.label;
      }
    }

    objTile.label = strLabel;
  };

  // ----------------
  // GenerateDoor
  //     Generates a door
  // @param  - idx       :int - Index of level tiles to generate a door on
  // @param  - iDirection:int - Direction to check against making a door
  // @return - Boolean        - Returns true to make a door in this direction
  // ----------------
  level.GenerateDoor = function(idx, iDirection)
  {
    var objNeighbor;
    var bMadeDoor = false;

    var iNeighborIdx = level.GetDirection(idx, iDirection);
    if (iNeighborIdx >= 0)
    {
      objNeighbor = level.arrTiles[iNeighborIdx];
      if (objNeighbor.value > 0)
      {
        if (objNeighbor.doors[DIRECTION.GetOpposite(iDirection)])
        {
          bMadeDoor = true;
        }
      }
      else
      {
        bMadeDoor = level.RandomCheck(40);
      }
    }

    return bMadeDoor;
  };

  // ----------------
  // RandomCheck - TODO: move this to a generic MODULE
  //     Returns true if the random roll is lower than the chance
  // ----------------
  level.RandomCheck = function(iChance = 0)
  {
    var iRand = Math.floor(Math.random() * 100);
    return (iRand < iChance);
  };

  level.Update = function(idx = -1)
  {
    if (idx > -1 && idx < level.arrTiles.length)
    {
      if (level.arrTiles[idx].value < 1)
      {
        level.GenerateTile(idx);
      }
    }
  };

  level.Draw = function(ctx)
  {
    var idx;
    var xdx, ydx;
    var iRowOffset;
    var iTileIdx;
    var iTileLength = level.arrTiles.length;

    var iGridX;
    var iGridY = 0;

    var iX, iY; // absolute pixel positions on the canvas
    var iSize = GRID.iSize;
    var iDoorWidth = iSize/16;

    var objTile;

    for (ydx = CAMERA.iPosY; ydx < CAMERA.iPosY + GRID.iHeight; ++ydx)
    {
      iRowOffset = ydx * level.iRowLength;
      iGridX = 0;
      if (iRowOffset >= 0 && iRowOffset < iTileLength)
      {
        for (xdx = CAMERA.iPosX; xdx < CAMERA.iPosX + GRID.iWidth; ++xdx)
        {
          iTileIdx = level.GetTileIndex(xdx, ydx);
          if (xdx >= 0 && xdx < level.iRowLength && iTileIdx < iTileLength)
          {
            objTile = level.arrTiles[iTileIdx];
            iX = GRID.Normalize(iGridX);
            iY = GRID.Normalize(iGridY);
            if (objTile.value > 0)
            {
              ctx.fillStyle = "darkgrey";
            }
            else
            {
              ctx.fillStyle = "black";
            }

            ctx.fillRect(iX + TILE_PADDING,
                         iY + TILE_PADDING,
                         iSize - TILE_PADDING*2,
                         iSize - TILE_PADDING*2);

            if (objTile.value > 0 && objTile.doors)
            {
              ctx.fillStyle = "yellow";
              if (objTile.doors[DIRECTION.NORTH])
              {
                ctx.fillRect(iX + iSize/8, iY, iSize * (3/4), iDoorWidth);
              }
              if (objTile.doors[DIRECTION.EAST])
              {
                ctx.fillRect(iX + iSize - iDoorWidth, iY + iSize/8, iDoorWidth, iSize * (3/4));
              }
              if (objTile.doors[DIRECTION.SOUTH])
              {
                ctx.fillRect(iX + iSize/8, iY + iSize - iDoorWidth, iSize * (3/4), iDoorWidth);
              }
              if (objTile.doors[DIRECTION.WEST])
              {
                ctx.fillRect(iX, iY + iSize/8, iDoorWidth, iSize * (3/4));
              }
            }
          }
          iGridX++;
        } // end x loop
      } // end y check
      iGridY++;
    } // end y loop
  };

  return level;
}());
