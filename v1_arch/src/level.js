var LEVEL = (function () {
  // floors
  const FLOOR_BASEMENT = 0;
  const FLOOR_GROUND = 1;
  const FLOOR_UPPER = 2;
  // landings positions
  const GROUND_FRONT_DOOR = 0;
  const GROUND_STAIRS = 1;
  const GROUND_FOYER = 2;
  const UPPER_STAIRS = 3;
  // door states
  const DOOR_BLOCKED = -1; // cannot make a door in this direction
  const DOOR_OPEN    = 0;  // a door can be made here
  const DOOR_EXISTS  = 1;  // a door already exists here
  // event types
  const EVENT_NONE     = 0;
  const EVENT_STANDARD = 1;
  const EVENT_OMEN     = 2;
  const EVENT_ITEM     = 3;
  // event strings
  const EVENT_NONE_STRING = "You find nothing out of the ordinary in this room.";
  const EVENT_ITEM_STRING = "Within you room you find an item:";
  // defaults
  const ROOM_SRC      = "./res/"; // TODO: make this a const somewhere else
  const DEFAULT_THUMB = "room_default.png";
  const DEFAULT_DESC  = "This room looks like it was never finished.";

  const TILE_PADDING = 2;
  var level = {};
  level.arrFloors = [[],[],[]];
  level.iRowLength = 0; // length of a row
  level.iNumTiles = 0; // number of tiles in a floor
  level.iRevealedRooms = 0;
  level.iCurrentFloor = 1;

  level.arrLandings = [];
  level.arrBasementRooms = [];
  level.arrGroundRooms = [];
  level.arrUpperRooms = [];

  // ----------------
  // LoadRoomXML
  //     Loads the room data from room_data.xml and parses them into arrays
  // ----------------
  level.LoadRoomXML = function()
  {
    var idx;
    var jdx;
    var iLanding = -1;
    var arrFloorData;
    var xmlData;
    var objRoom;
    var arrRooms;
    var xmlRoomData = XML.GetXMLData(XML.XML_ROOMS);
    if (xmlRoomData)
    {
      // landings first
      arrFloorData = xmlRoomData.getElementsByTagName("landing")[0].getElementsByTagName("room");
      if (arrFloorData && arrFloorData.length > 0)
      {
        for (idx = 0; idx < arrFloorData.length; ++idx)
        {
          xmlData = arrFloorData[idx];
          iLanding = -1;
          switch (xmlData.getAttribute("category"))
          {
            case "ground": { iLanding = GROUND_FRONT_DOOR; break; }
            case "ground_foyer": { iLanding = GROUND_FOYER; break; }
            case "ground_stairs": { iLanding = GROUND_STAIRS; break; }
            case "upper_stairs": { iLanding = UPPER_STAIRS; break; }
            default: break;
          } // end switch
          if (iLanding >= 0) { level.arrLandings[iLanding] = XML.ParseRoom(xmlData); }
        } // end for loop
      }

      arrFloorData = xmlRoomData.getElementsByTagName("general")[0].getElementsByTagName("room");
      if (arrFloorData && arrFloorData.length > 0)
      {
        for (idx = 0; idx < arrFloorData.length; ++idx)
        {
          xmlData = arrFloorData[idx];
          objRoom = XML.ParseRoom(xmlData);
          for (jdx = 0; jdx < objRoom.arrFloors.length; ++jdx)
          {
            arrRooms = level.GetRoomArray(objRoom.arrFloors[jdx]);
            arrRooms.push(objRoom);
          }

          // level.arrGroundRooms.push(XML.ParseRoom(xmlData));
        } // end for loop
      } // end arrFloorData check
    } // end xmlRoomData check
  };

  level.GetRoomArray = function(iFloor)
  {
    var arrFloors = [];
    switch (iFloor)
    {
      case FLOOR_BASEMENT: { arrFloors = level.arrBasementRooms; break; }
      case FLOOR_GROUND:   { arrFloors = level.arrGroundRooms;   break; }
      case FLOOR_UPPER:    { arrFloors = level.arrUpperRooms;    break; }
      default: break;
    } // end of switch

    return arrFloors;
  };

  // ----------------
  // GetTile
  //     Returns the tile object at the given index, or empty object if out
  //    of bounds
  // ----------------
  level.GetTile = function(idx, iFloor = -1)
  {
    if (iFloor >= level.arrFloors.length)
    {
      console.error("level.GetTile called with invalid floor : " + iFloor);
      return;
    }
    else if (iFloor < 0)
    {
      iFloor = level.iCurrentFloor;
    }
    var arrTiles = level.arrFloors[iFloor];
    if (idx > -1 && idx < level.iNumTiles)
    {
      return arrTiles[idx];
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
    if (idx + level.iRowLength >= level.iNumTiles) { return -1; }
    else                                           { return idx + level.iRowLength; }
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
  // Init
  //     Builds all the tiles
  // ----------------
  level.Init = function(iSize)
  {
    level.iRowLength = Math.sqrt(iSize);
    level.iNumTiles = iSize;

    var iFloor = 1;
    var idx;
    var arrTiles;
    for (iFloor = 0; iFloor < level.arrFloors.length; ++iFloor)
    {
      arrTiles = level.arrFloors[iFloor];
      for (idx = 0; idx < iSize; ++idx)
      {
        arrTiles.push({value:0, doors:[false, false, false, false]});
      }
    }
  };

  // ----------------
  // GenerateTile
  //     Generates a tile
  // @params - iTileIdx     :int - Index of the tile to generate
  // @params - iForcedResult:int - Force a specific landing tile to generate
  // ----------------
  level.GenerateTile = function(iTileIdx = -1, iForcedResult = -1, iFloor = -1)
  {
    if (iTileIdx < 0) { return; }

    var arrRooms; // pointer to the array of rooms to grab from
    var iRando;
    var objRoom = null;
    var bGroundLanding = false; // used to set the initial floors
    if (iFloor < 0) { iFloor = level.iCurrentFloor; }

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
      switch (iFloor)
      {
        case FLOOR_BASEMENT: { arrRooms = level.arrBasementRooms; break; }
        case FLOOR_UPPER:    { arrRooms = level.arrUpperRooms;    break; }
        case FLOOR_GROUND:
        default:             { arrRooms = level.arrGroundRooms;   break; }
      }
      if (arrRooms.length > 0)
      {
        iRando = Math.floor(Math.random() * arrRooms.length);
        objRoom = arrRooms.splice(iRando, 1)[0];
      }
    }

    level.arrFloors[iFloor][iTileIdx] = level.LoadRoom(objRoom, iTileIdx);
    level.iRevealedRooms++;
    if (bGroundLanding)
    {
      var iNorthIdx = level.GetNorth(iTileIdx);
      level.GenerateTile(iNorthIdx, GROUND_FOYER);
      level.GenerateTile(level.GetNorth(iNorthIdx), GROUND_STAIRS);
      level.GenerateTile(level.GetNorth(iNorthIdx), UPPER_STAIRS, FLOOR_UPPER);
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
      objNeighbor = level.arrFloors[level.iCurrentFloor][iNeighborIdx];
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
    var strDesc = DEFAULT_DESC;
    var strImage = DEFAULT_THUMB;
    var iStairs = 0;
    var iEventType = EVENT_NONE;
    if (objRoom)
    {
      if (objRoom.label)  { strLabel = objRoom.label; }
      if (objRoom.desc)   { strDesc = objRoom.desc; }
      if (objRoom.image)  { strImage = objRoom.image; }
      if (objRoom.stairs) { iStairs = parseInt(objRoom.stairs); }
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
      if (objRoom.event) { iEventType = parseInt(objRoom.event); }
    }

    objTile.label      = strLabel;
    objTile.desc       = strDesc;
    objTile.image      = strImage;
    objTile.iStairs    = iStairs;
    objTile.iEventType = iEventType;
    objTile.bHasEvent  = (iEventType > 0);
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
  // UseStairs
  //     Gets the stairs value from a tile and assigns level.iCurrentFloor to
  //    the new floor level
  // @params - idx:int - Tile index to check for stairs
  // @return - int     - The new current floor
  // ----------------
  level.UseStairs = function(idx)
  {
    var objTile = level.GetTile(idx, level.iCurrentFloor);
    level.GotoFloor(level.iCurrentFloor + objTile.iStairs);
    return level.iCurrentFloor;
  }

  level.GotoFloor = function(iFloor)
  {
    if (iFloor > -1 && iFloor < level.arrFloors.length)
    {
      level.iCurrentFloor = iFloor;
    }
  };

  // ----------------
  // Update
  //     Run any time an action is done on the game screen
  // ----------------
  level.Update = function(idx = -1)
  {
    var objTile;
    var objEvent;
    var divEvent;
    var bNewTile = false;
    var arrTiles;
    if (idx > -1 && idx < level.iNumTiles)
    {
      arrTiles = level.arrFloors[level.iCurrentFloor];
      if (arrTiles[idx].value < 1)
      {
        level.GenerateTile(idx);
        bNewTile = true;
      }

      objTile = arrTiles[idx];

      var strRoomImage = ROOM_SRC;
      if (objTile.image != null)
      {
        strRoomImage += objTile.image;
        INFO_PANEL.UpdateRoomImage(strRoomImage);
      }

      if (bNewTile)
      {
        var strSceneDescription = EVENT_NONE_STRING;
        switch (objTile.iEventType)
        {
          case EVENT_ITEM:
          {
            strSceneDescription = EVENT_ITEM_STRING;
            objEvent = ITEM.GetItem();
            GetCurrentPlayer().AddItem(objEvent);
            divEvent = SCENE.FindItemDiv(objEvent);
            break;
          }
          default: break;
        }

        SCENE.SetScene(objTile.label, strRoomImage, strSceneDescription, divEvent);
      }

      UpdateStairsButton(objTile.iStairs != 0);

      if (objTile.bHasEvent)
      {
        console.log("This tile has an event of type " + objTile.iEventType);
      }
    }
  };

  // ----------------
  // DrawCurrentFloorName
  //     Draws a string of the current floor for display
  // ----------------
  level.DrawCurrentFloorName = function(ctx)
  {
    var strReturn = "";
    switch(level.iCurrentFloor)
    {
      case FLOOR_BASEMENT: strReturn = "Basement"; break;
      case FLOOR_GROUND: strReturn = "Ground Floor"; break;
      case FLOOR_UPPER: strReturn = "Upper Floor"; break;
      default: break;
    } // end switch

    ctx.fillStyle = "#666666";
    ctx.fillRect(0, 0, 160, 40);
    ctx.fillStyle = "#DDDDDD";
    ctx.font = "24px Arial";
    ctx.fillText(strReturn, 10, 24);
  };

  level.Draw = function(ctx)
  {
    var idx;
    var xdx, ydx;
    var iRowOffset;
    var iTileIdx;

    var iGridX;
    var iGridY = 0;

    var iX, iY; // absolute pixel positions on the canvas
    var iSize = GRID.iSize;
    var iDoorWidth = iSize/32;

    var objTile;

    for (ydx = CAMERA.iPosY; ydx < CAMERA.iPosY + GRID.iHeight; ++ydx)
    {
      iRowOffset = ydx * level.iRowLength;
      iGridX = 0;
      if (iRowOffset >= 0 && iRowOffset < level.iNumTiles)
      {
        for (xdx = CAMERA.iPosX; xdx < CAMERA.iPosX + GRID.iWidth; ++xdx)
        {
          iTileIdx = level.GetTileIndex(xdx, ydx);
          if (xdx >= 0 && xdx < level.iRowLength && iTileIdx < level.iNumTiles)
          {
            objTile = level.arrFloors[level.iCurrentFloor][iTileIdx];
            iX = GRID.Normalize(iGridX);
            iY = GRID.Normalize(iGridY);
            if (objTile.value > 0)
            {
              switch (objTile.iStairs)
              {
                case -1: ctx.fillStyle = "#AA8888"; break;
                case 1:  ctx.fillStyle = "#88AA88"; break
                default: ctx.fillStyle = "#888888"; break;
              } // end of switch
            }
            else
            {
              ctx.fillStyle = "black";
            }

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
