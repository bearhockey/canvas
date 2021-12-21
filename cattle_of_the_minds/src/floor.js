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
  var floor = function(iWidth, strFloorColor = EMPTY_COLOR, strWallColor = WALL_COLOR)
  {
    // constructor
    this.iWidth = iWidth; // the height and width of the tile array
    this.iTimeLastEntered = 0;
    this.iNPCLimit = 0;
    this.iEntranceIdx = -1;

    this.arrTileMap = [];
    this.arrEmptyTiles = []; // useful for placing things
    this.arrStairs = [];
    this.arrSpawnMap = [];
    this.arrNPCs = [];
    this.cNullTile = new TILE(-1, false, false, "#111111");

    this.strFloorColor = strFloorColor;
    this.strWallColor = strWallColor;

    this.GetFloorWidth  = function() { return this.iWidth; };
    this.GetEnteredTime = function() { return this.iTimeLastEntered; };
    this.SetEnteredTime = function(iTime) { this.iTimeLastEntered = iTime; };

    this.GetSpawnMap = function()            { return this.arrSpawnMap; };
    this.SetSpawnMap = function(arrSpawnMap) { this.arrSpawnMap = arrSpawnMap; };

    this.GetNPCLimit = function() { return this.iNPCLimit; };
    this.SetNPCLimit = function(iLimit) { this.iNPCLimit = iLimit; };
    this.GetNPCs = function() { return this.arrNPCs; };
    this.AddNPC = function(cPawn) { this.arrNPCs.push(cPawn); };

    this.GetEntranceIdx = function()    { return this.iEntranceIdx; };
    this.SetEntranceIdx = function(idx) { this.iEntranceIdx = idx; };

    // ----------------
    // UpdateNPCs
    //     Runs the update loop on all NPCs
    // ----------------
    this.UpdateNPCs = function()
    {
      var idx;
      var iLength = this.arrNPCs.length;
      var cNPC;
      for (idx = 0; idx < iLength; ++idx)
      {
        cNPC = this.arrNPCs[idx];
        if (cNPC != null)
        {
          if (cNPC.IsDead())
          {
            this.RemovePawn(cNPC);
          }
          else
          {
            cNPC.Update();
          }
        }
      }
    };

    // ----------------
    // CountStairs
    //     Counts the amount of stairs - type 0 for both
    // ----------------
    this.CountStairs = function(iStairsType = 0)
    {
      var iCount = 0;
      var idx;
      var iLength = this.arrStairs.length;
      var cStairs;
      for (idx = 0; idx < iLength; ++idx)
      {
        cStairs = this.arrStairs[idx];
        if (cStairs != null)
        {
          if (iStairsType < 1 || iStairsType == cStairs.GetItemType()) { iCount++; }
        }
      } // end for loop

      return iCount;
    };

    // ----------------
    // GetStairs
    //     Returns the stairs pawn specified
    // ----------------
    this.GetStairs = function(iStairsType, iStairsID)
    {
      var cStairs = null;
      var idx;
      var iLength = this.arrStairs.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cStairs = this.arrStairs[idx];
        if (cStairs != null && cStairs.GetItemType() == iStairsType && cStairs.GetValue() == iStairsID)
        {
          return cStairs;
        }
      } // end for loop

      return null;
    };

    // ----------------
    // FillFloor
    //     Fills the floor with wall tiles
    // ----------------
    this.FillFloor = function()
    {
      var idx;
      var iSize = this.iWidth * this.iWidth;
      var cTile;
      for (idx = 0; idx < iSize; ++idx)
      {
        cTile = new TILE(idx, false, false, this.strWallColor);
        this.arrTileMap.push(cTile);
      } // end of for loop
    };

    // ----------------
    // FillFloorSection
    //     Fills part of the floor specified with the specified tile
    // ----------------
    this.FillFloorSection = function(x, y, iWidth, iHeight, cTile=null)
    {
      var idx;
      var iOriginalX = x;;
      var cTileCopy = (cTile != null) ? cTile : new TILE(-1, false, false, this.strWallColor);
      var iHeightLimit = y + iHeight;
      var iWidthLimit = x + iWidth;
      var cOldTile;
      var iOldIdx;
      for (; y < iHeightLimit; ++y)
      {
        for (x = iOriginalX; x < iWidthLimit; ++x)
        {
          idx = (y * this.iWidth) + x;
          this.PlaceTile(idx, cTileCopy);
        } // end for loop (x)
      } // end for loop (y)
    };

    // ----------------
    // PlaceTile
    //     Places a single tile at the given idx
    // ----------------
    this.PlaceTile = function(idx, cTile)
    {
      if (this.IsValidIdx(idx))
      {
        var cOldTile = this.arrTileMap[idx];
        var iOldIdx = this.arrEmptyTiles.indexOf(cOldTile);
        if (iOldIdx >= 0)
        {
          this.arrEmptyTiles.splice(iOldIdx, 1);
        }

        this.arrTileMap[idx] = cTile.Copy(idx);
        if (cTile.IsPassable())
        {
          this.arrEmptyTiles.push(this.arrTileMap[idx]);
        }
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
    // AddPawnToTile
    //     Adds a pawn to a specified tile idx
    // ----------------
    this.AddPawnToTile = function(cPawn, idx)
    {
      var iEmptyIdx;
      var cTile;
      if (this.IsValidIdx(idx))
      {
        cTile = this.arrTileMap[idx];
        cTile.PlaceEntity(cPawn);
        iEmptyIdx = this.arrEmptyTiles.indexOf(cTile);
        if (iEmptyIdx >= 0)
        {
          this.arrEmptyTiles.splice(iEmptyIdx, 1);
        }
        if (cPawn.GetPawnType() == CONST.PAWN_STAIRS)
        {
          this.arrStairs.push(cPawn);
        }
      }
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
          if (cPawn.GetPawnType() == CONST.PAWN_STAIRS)
          {
            this.arrStairs.push(cPawn);
          }

          return true;
        }
      }

      return false;
    };

    // ----------------
    // RemovePawn
    //     Removes a pawn from the floor
    // ----------------
    this.RemovePawn = function(cPawn)
    {
      var idx = this.arrNPCs.indexOf(cPawn);
      if (idx >= 0)
      {
        var cFound = this.arrNPCs[idx];
        this.arrNPCs.splice(idx, 1);
        cFound.Dead();
      }
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
