var FLOOR = (function () {
  // consts -- move these to a file probably
  const MINIMUM_ROOM_WIDTH = 4;
  const MAXIMUM_ROOM_WDTH = 10;
  const EMPTY_PERCENTAGE = 0.4;
  const ROOM_GENERATION_RETRIES = 10;
  const ROOM_LIT_CHANCE = 0.3;

  const EMPTY_COLOR = "#CCCCCC";
  const LIT_COLOR   = "#EEEEFF";
  const WALL_COLOR = "#444444";
  var floor = function(iWidth, iUpstairs=1, strFloorColor = EMPTY_COLOR, strWallColor = WALL_COLOR)
  {
    // constructor
    this.iWidth = iWidth; // the height and width of the tile array
    this.iUpstairs = iUpstairs;
    this.arrTileMap = [];
    this.arrEmptyTiles = []; // useful for placing things
    this.cNullTile = new TILE(-1, false, false, "#111111");

    this.strFloorColor = strFloorColor;
    this.strWallColor = strWallColor;

    // ----------------
    // GenerateFloor
    //     Builds a random floor
    // ----------------
    this.GenerateFloor = function()
    {
      var iSize = this.iWidth * this.iWidth;
      var idx;
      var color;
      var cTile;

      // step one - fill the room with walls
      for (idx = 0; idx < iSize; ++idx)
      {
        cTile = new TILE(idx, false, false, this.strWallColor);
        this.arrTileMap.push(cTile);
      } // end of for loop

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

        iRoomX = Math.floor(Math.random()*this.iWidth);
        iRoomY = Math.floor(Math.random()*this.iWidth)*this.iWidth;
        iRoomIdx = iRoomY+iRoomX;
        iRoomHeight = Math.floor(Math.random()*(MAXIMUM_ROOM_WDTH-MINIMUM_ROOM_WIDTH)) + MINIMUM_ROOM_WIDTH;
        iRoomWidth = Math.floor(Math.random()*(MAXIMUM_ROOM_WDTH-MINIMUM_ROOM_WIDTH)) + MINIMUM_ROOM_WIDTH;
        for (y = 0; y < iRoomHeight; ++y)
        {
          for (x = 0; x < iRoomWidth; ++x)
          {
            idx = iRoomIdx + x + (y * this.iWidth);
            // first check if idx is valid
            if (!this.IsValidIdx(idx))
            {
              bValidRoom = false;
              break;
            }
            else if (this.arrTileMap[idx].bIsPassable)
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
          color = Math.random() < ROOM_LIT_CHANCE ? LIT_COLOR : this.strFloorColor;
          iRoomLength = arrRoom.length;
          for (x = 0; x < iRoomLength; ++x)
          {
            idx = arrRoom[x];
            cTile = new TILE(idx, true, (color == LIT_COLOR), color);
            this.arrTileMap[idx] = cTile;
            this.arrEmptyTiles.push(cTile);
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

        nEmptyPercentage = this.arrEmptyTiles.length / this.arrTileMap.length;
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
            if (idx + this.iWidth < iDestination) { idx += this.iWidth; }
            else                                  { idx += 1;}
          }
          else if (idx > iDestination)
          {
            if (idx - this.iWidth > iDestination) { idx -= this.iWidth; }
            else                                  { idx -= 1; }
          }

          cTile = this.arrTileMap[idx];
          if (this.IsValidIdx(idx) && this.arrTileMap[idx] != null && !this.arrTileMap[idx].bIsPassable)
          {
            cTile = new TILE(idx, true, false, this.strFloorColor);
            this.arrTileMap[idx] = cTile;
            this.arrEmptyTiles.push(cTile);
          }
        } // end idx while loop
      } // end arrCenterTiles while loop

      // add upstairs
      var iNumberOfUpstairs = this.iUpstairs;
      var bKeepGoing = true;
      while (iNumberOfUpstairs > 0 && bKeepGoing)
      {
        bKeepGoing = this.AddPawnToEmptyTile(new PAWN(CONST.PAWN_STAIRS, "Stairs", "./res/upstairs.gif", CONST.DOOR_UPSTAIRS));
        if (bKeepGoing) { iNumberOfUpstairs--; }
      }

      // add downstairs
      var iNumberOfDownstairs = Math.floor(Math.random()*3) + 1;
      while (iNumberOfDownstairs > 0)
      {
        this.AddPawnToEmptyTile(new PAWN(CONST.PAWN_STAIRS, "Stairs", "./res/downstairs.gif", CONST.DOOR_DOWNSTAIRS));
        iNumberOfDownstairs--;
      }
    };

    // ----------------
    // IsValidIdx
    //     Checks if the idx is valid - leaving a border of tiles around the edges
    // ----------------
    this.IsValidIdx = function(idx)
    {
      var iSize = this.iWidth * this.iWidth;
      return !(idx - this.iWidth < 0 || idx + this.iWidth > iSize || idx % this.iWidth == 0 || idx % this.iWidth == this.iWidth-1);
    };

    // ----------------
    // AddPawnToEmptyTile
    //     Adds a pawn to a random empty tile
    // ----------------
    this.AddPawnToEmptyTile = function(cPawn)
    {
      var idx;
      var iLength = this.arrEmptyTiles.length;
      var cTile;
      if (iLength > 0)
      {
        idx = Math.floor(Math.random()*iLength);
        cTile = this.arrEmptyTiles[idx];
        if (cTile != null)
        {
          cTile.PlaceEntity(cPawn);
          this.arrEmptyTiles.splice(idx, 1);
          return true;
        }
      }

      return false;
    };

    // ----------------
    // GetEmptyTile
    //     Returns a random empty tile from the map
    // ----------------
    this.GetEmptyTile = function()
    {
      var iLength = this.arrEmptyTiles.length;
      var cTile = null;
      if (iLength > 0)
      {
        cTile = this.arrEmptyTiles[Math.floor(Math.random()*iLength)];
      }

      return cTile;
    };

    // ----------------
    // GetAllTiles
    //     Returns the array of tile objects
    // ----------------
    this.GetAllTiles = function() { return this.arrTileMap; };

    this.GetTile = function(idx)
    {
      if (idx >= 0 && idx < this.arrTileMap.length)
      {
        return this.arrTileMap[idx];
      }
    }

    // ----------------
    // GetTileArea
    //     Returns an array of tile objects centered around a certain point given an area
    // ----------------
    this.GetTileArea = function(iCenterPoint, iDiameter)
    {
      var iRadius = Math.floor(iDiameter/2);
      var arrReturnTiles = [];
      var cTile;
      var x, y, idx;

      var iWidth = this.iWidth * iRadius;
      var iRadiusEnd = iCenterPoint % this.iWidth + iRadius;
      var iRadiusStart = iCenterPoint %this.iWidth - iRadius;
      for (y = iCenterPoint - iWidth; y <= iCenterPoint + iWidth; y += this.iWidth)
      {
        for (x = 0 - iRadius; x <= iRadius; ++x)
        {
          idx = y+x;
          if ((idx < y && idx % this.iWidth > iRadiusEnd) ||
              (idx > y && idx % this.iWidth < iRadiusStart))
          {
            arrReturnTiles.push(this.cNullTile);
          }
          else
          {
            cTile = this.arrTileMap[idx];
            if (cTile != null) { arrReturnTiles.push(cTile); }
            else               { arrReturnTiles.push(this.cNullTile); }
          }
        } // end inner loop
      } // end outer loop

      return arrReturnTiles;
    };

    // ----------------
    // GetDirectionIdx
    //     Returns the idx adjacent to the idx provided - or '-1' if the idx is invalid
    // ----------------
    this.GetDirectionIdx = function(idx, iDirection)
    {
      var iTarget = -1;
      var bIsValidTile = false;
      switch (iDirection)
      {
        case CONST.NORTH:
        {
          iTarget = idx - this.iWidth;
          bIsValidTile = (iTarget >= 0);
          break;
        }
        case CONST.SOUTH:
        {
          iTarget = idx + this.iWidth;
          bIsValidTile = (iTarget < this.arrTileMap.length)
          break;
        }
        case CONST.EAST:
        {
          iTarget = idx + 1;
          bIsValidTile = (iTarget % this.iWidth > idx % this.iWidth);
          break;
        }
        case CONST.WEST:
        {
          iTarget = idx - 1;
          bIsValidTile = (iTarget % this.iWidth < idx % this.iWidth);
          break;
        }
        default: break;
      } // end switch

      return (bIsValidTile) ? iTarget : -1;
    };

    // ----------------
    // GetDirectionalTile
    //     Gets the tile adjacent to the one specified in the direcetion specified
    // ----------------
    this.GetDirectionalTile = function(cTile, iDirection, bCheckPassible=true)
    {
      var idx = cTile.GetIdx();
      var iReturnIdx = idx;
      var cTargetTile;
      var iTarget = this.GetDirectionIdx(idx, iDirection);

      if (iTarget >= 0)
      {
        cTargetTile = this.GetTile(iTarget);
        if (cTargetTile != null)
        {
          if (bCheckPassible)
          {
            if (cTargetTile.IsPassable()) { iReturnIdx = iTarget; }
            else if (cTargetTile.HasEntity())
            {
              var cEnemy = cTargetTile.GetFirstEnemy();
              if (cEnemy != null)
              {
                FightGuy(cEnemy);
              }
            }
          }
          else
          {
            iReturnIdx = iTarget;
          }
        }
      } // if iTarget check

      return iReturnIdx;
    };

    // ----------------
    // GetVisualTiles
    //     Gets the tiles the player can see
    // ----------------
    this.GetVisualTiles = function(iPosition, iRadius)
    {
      var arrTiles = this.GetTileArea(iPosition, iRadius);
      var idx;
      var iLength = arrTiles.length;
      var arrCheckedTiles = [];
      var cTile;
      var iTileIdx;
      for (idx = 0; idx < iLength; ++idx)
      {
        cTile = arrTiles[idx];
        if (cTile != null)
        {
          iTileIdx = cTile.GetIdx();
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(iTileIdx, CONST.NORTH), arrTiles);
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(iTileIdx, CONST.EAST), arrTiles);
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(iTileIdx, CONST.SOUTH), arrTiles);
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(iTileIdx, CONST.WEST), arrTiles);
        }
      } // end for loop

      return arrTiles;
    };

    // ----------------
    // GetLitTiles
    //     Returns an array of tiles that are lit and concurrent
    // ----------------
    this.GetLitTiles = function(idx, arrTiles)
    {
      if (arrTiles == null) { return []; } // early return
      var cTile = this.GetTile(idx);
      if (cTile != null && arrTiles.indexOf(cTile) < 0)
      {
        arrTiles.push(cTile);
        if (cTile.bIsLit)
        {
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(idx, CONST.NORTH), arrTiles);
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(idx, CONST.EAST), arrTiles);
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(idx, CONST.SOUTH), arrTiles);
          arrTiles = this.GetLitTiles(this.GetDirectionIdx(idx, CONST.WEST), arrTiles);
        }
      }

      return arrTiles;
    };
  }; // end of class

  return floor;
}());
