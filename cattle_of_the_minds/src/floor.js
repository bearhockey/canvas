var FLOOR = (function () {
  // consts -- move these to a file probably
  const EMPTY_COLOR = "#DDDDDD";
  const WALL_COLOR = "#444444";
  var floor = function(iWidth, iUpstairs=1, strFloorColor = EMPTY_COLOR, strWallColor = WALL_COLOR)
  {
    // pre-define functions here to use in the constructor
    // ----------------
    // AddPawnToEmptyTile
    //     Adds a pawn to a random empty tile
    // ----------------
    this.AddPawnToEmptyTile = function(cPawn)
    {
      console.log("HEYH");
      var idx;
      var iLength = this.arrEmptyTiles.length;
      var cTile;
      if (iLength > 0)
      {
        idx = Math.floor(Math.random()*iLength);
        cTile = this.arrEmptyTiles[idx];
        if (cTile != null)
        {
          console.log("Adding to this tile: ", cTile);
          cTile.PlaceEntity(cPawn);
          this.arrEmptyTiles.splice(idx, 1);
          return true;
        }
      }

      console.log("OOPS");
      return false;
    };
    
    // constructor
    this.iWidth = iWidth; // the height and width of the tile array
    this.iUpstairs = iUpstairs;
    this.arrTileMap = [];
    this.arrEmptyTiles = []; // useful for placing things
    this.cNullTile = new TILE(-1, false, "#111111");

    this.strFloorColor = strFloorColor;
    this.strWallColor = strWallColor;

    // build base room
    var iSize = this.iWidth * this.iWidth;
    var idx;
    var color;
    var cTile;
    for (idx = 0; idx < iSize; ++idx)
    {
      if (idx % this.iWidth == 0 || idx % this.iWidth == this.iWidth -1)
      {
        color = this.strWallColor;
      }
      else if (idx - this.iWidth < 0 || idx + this.iWidth > iSize)
      {
        color = this.strWallColor;
      }
      else
      {
        color = (Math.random() > 0.85) ? this.strWallColor : this.strFloorColor;
      }
      cTile = new TILE(idx, (color == this.strFloorColor), color);
      this.arrTileMap.push(cTile);
      if (color == this.strFloorColor) { this.arrEmptyTiles.push(cTile); }
    } // end of for loop
    // add stairs
    var iNumberOfUpstairs = this.iUpstairs;
    var bKeepGoing = true;
    while (iNumberOfUpstairs > 0 && bKeepGoing)
    {
      bKeepGoing = this.AddPawnToEmptyTile(new PAWN(CONST.PAWN_STAIRS, "Stairs", "./res/upstairs.gif", CONST.DOOR_UPSTAIRS));
      if (bKeepGoing) { iNumberOfUpstairs--; }
    }

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
    // GetDirectionalTile
    //     Gets the tile adjacent to the one specified in the direcetion specified
    // ----------------
    this.GetDirectionalTile = function(cTile, iDirection, bCheckPassible=true)
    {
      var idx = cTile.GetIdx();
      var iReturnIdx = idx;
      var cTargetTile;
      var iTarget;
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

      if (bIsValidTile)
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
  }; // end of class

  return floor;
}());
