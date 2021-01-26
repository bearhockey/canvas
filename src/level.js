var LEVEL = (function () {
  // landings positions
  const GROUND_FRONT_DOOR = 0;
  const GROUND_STAIRS = 1;
  // door states
  const DOOR_BLOCKED = -1; // cannot make a door in this direction
  const DOOR_OPEN    = 0;  // a door can be made here
  const DOOR_EXISTS  = 1;  // a door already exists here
  // defaults
  const ROOM_SRC      = "./res/"; // TODO: make this a const somewhere else
  const DEFAULT_THUMB = "room_default.png";

  const TILE_PADDING = 2;
  var level = {};
  level.arrTiles = [];
  level.iRowLength = 0;
  level.iRevealedRooms = 0;

  level.arrLandings = [];
  level.arrGroundRooms = [];

  // ----------------
  // LoadRoomXML
  //     Loads the room data from room_data.xml and parses them into arrays
  // ----------------
  level.LoadRoomXML = function()
  {
    var idx;
    var arrFloorData;
    var xmlData;
    var objRoom;
    var xmlRoomData = XML.xmlDoc;
    if (xmlRoomData)
    {
      // landings first
      arrFloorData = xmlRoomData.getElementsByTagName("landing")[0].getElementsByTagName("room");
      if (arrFloorData && arrFloorData.length > 0)
      {
        for (idx = 0; idx < arrFloorData.length; ++idx)
        {
          xmlData = arrFloorData[idx];
          switch (xmlData.getAttribute("category"))
          {
            case "ground":
            {
              level.arrLandings[GROUND_FRONT_DOOR] = XML.ParseRoom(xmlData);
              break;
            }
            case "ground_stairs":
            {
              level.arrLandings[GROUND_STAIRS] = XML.ParseRoom(xmlData);
              break;
            }
            default: break;
          } // end switch
        }
      }
      // ground floor
      arrFloorData = xmlRoomData.getElementsByTagName("ground")[0].getElementsByTagName("room");
      if (arrFloorData && arrFloorData.length > 0)
      {
        for (idx = 0; idx < arrFloorData.length; ++idx)
        {
          xmlData = arrFloorData[idx];
          level.arrGroundRooms.push(XML.ParseRoom(xmlData));
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
  // @params - iTileIdx     :int - Index of the tile to generate
  // @params - iForcedResult:int - Force a specific landing tile to generate
  // ----------------
  level.GenerateTile = function(iTileIdx = -1, iForcedResult = -1)
  {
    if (iTileIdx < 0) { return; }

    var iRando;
    var objRoom = null;
    var bGroundLanding = false;
    if (iForcedResult > -1)
    {
      objRoom = level.arrLandings[iForcedResult];
    }
    else if (level.iRevealedRooms == 0)
    {
      objRoom = level.arrLandings[GROUND_FRONT_DOOR];
      bGroundLanding = true;
    }
    else
    {
      if (level.arrGroundRooms.length > 0)
      {
        iRando = Math.floor(Math.random() * level.arrGroundRooms.length);
        objRoom = level.arrGroundRooms.splice(iRando, 1)[0];
      }
    }

    level.arrTiles[iTileIdx] = level.LoadRoom(objRoom, iTileIdx);
    level.iRevealedRooms++;
    if (bGroundLanding)
    {
      level.GenerateTile(level.GetNorth(iTileIdx), GROUND_STAIRS);
    }
  };

  // ----------------
  // GenerateDoor
  //     Generates a door
  // @params - idx       :int     - Index of level tiles to generate a door on
  // @params - iDirection:int     - Direction to check against making a door
  // @params - bUseRandom:Boolean - If true, generate door randomly
  // @return - int                - The state of the door
  // ----------------
  level.GenerateDoor = function(idx, iDirection, bUseRandom = true)
  {
    var objNeighbor;
    var iDoorState = DOOR_OPEN;
    var bMadeDoor = false;

    var iNeighborIdx = level.GetDirection(idx, iDirection);
    if (iNeighborIdx >= 0)
    {
      objNeighbor = level.arrTiles[iNeighborIdx];
      if (objNeighbor.value > 0)
      {
        if (objNeighbor.doors[DIRECTION.GetOpposite(iDirection)])
        {
          iDoorState = DOOR_EXISTS;
        }
        else
        {
          iDoorState = DOOR_BLOCKED;
        }
      } // objNeighbor check
    } // iNeighbotIdx check

    return iDoorState;
  };

  // ----------------
  // LoadRoom
  //     Generates a tile from a loaded room
  // ----------------
  level.LoadRoom = function(objRoom, iTileIdx)
  {
    var idx;
    var iRandom;
    var iDirection;
    var iDoors = 0;
    var bMakeDoor = false;
    var bHasExit = false;

    var objTile = { value:1, doors:[false, false, false, false] }; // it is revealed
    var strLabel = "Room # " + level.iRevealedRooms;
    var strImage = DEFAULT_THUMB;
    if (objRoom)
    {
      if (objRoom.label) { strLabel = objRoom.label; }
      if (objRoom.image) { strImage = objRoom.image; }
      iDoors = parseInt(objRoom.doors);
      if (objRoom.defined_doors)
      {
        var arrDefinedDoors = objRoom.defined_doors.split(",");
        // have to iterate through array since JS considers "0" as true
        for (idx = 0; idx < arrDefinedDoors.length; ++idx)
        {
          objTile.doors[idx] = (parseInt(arrDefinedDoors[idx]) > 0);
        }

        bHasExit = true;
      }
    }

    objTile.label = strLabel;
    objTile.image = strImage;
    var iMadeDoors = 0;
    var iDoorState;
    var arrPossibleDoors = [];
    for (iDirection = 0; iDirection < objTile.doors.length; ++iDirection)
    {
      if (objTile.doors[iDirection])
      {
        iMadeDoors++; // already a door there
        continue;
      }
      iDoorState = level.GenerateDoor(iTileIdx, iDirection);
      if (iDoorState == DOOR_EXISTS)
      {
        objTile.doors[iDirection] = true;
        iMadeDoors++;
      }
      else if (iDoorState != DOOR_BLOCKED)
      {
        arrPossibleDoors.push(iDirection);
      }
    }

    while (iMadeDoors < iDoors && arrPossibleDoors.length > 0)
    {
      iRandom = Math.floor(Math.random() * arrPossibleDoors.length);
      objTile.doors[arrPossibleDoors.shift(iRandom)] = true;
      iMadeDoors++;
    }

    return objTile;
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

  // ----------------
  // Update
  //     Run any time an action is d one on the game screen
  // ----------------
  level.Update = function(idx = -1)
  {
    var objTile;
    var bNewTile = false;
    if (idx > -1 && idx < level.arrTiles.length)
    {
      objTile = level.arrTiles[idx];
      if (objTile.value < 1)
      {
        level.GenerateTile(idx);
        bNewTile = true;
      }
      objTile = level.arrTiles[idx];

      var strRoomImage = ROOM_SRC;
      if (objTile.image != null)
      {
        strRoomImage += objTile.image;
        UpdateRoomImage(strRoomImage);
        if (bNewTile)
        {
          SCENE.SetScene(strRoomImage);
        }
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
            ctx.fillStyle = (objTile.value > 0) ? "darkgrey" : "black";
            ctx.fillRect(iX + TILE_PADDING,
                         iY + TILE_PADDING,
                         iSize - TILE_PADDING*2,
                         iSize - TILE_PADDING*2);

            if (objTile.value > 0)
            {
              if (objTile.doors)
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

              if (objTile.label && GRID.iFactor < 3)
              {
                ctx.fillStyle = "white";
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowColor = "black";
                ctx.shadowBlur = 1;
                ctx.font = (GRID.iFactor == 1) ? "24px Arial ": "12px Arial";
                ctx.fillText(objTile.label, iX+10, iY+iSize - 10);
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
