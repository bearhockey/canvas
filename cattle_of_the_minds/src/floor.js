var FLOOR = (function () {
  // consts -- move these to a file probably
  const EMPTY_COLOR = "#DDDDDD";
  const WALL_COLOR = "#444444";
  var floor = function(iWidth)
  {
    this.iWidth = iWidth; // the height and width of the tile array
    this.arrTileMap = [];
    this.cNullTile = new TILE(-1, false, "#111111");

    var iSize = this.iWidth * this.iWidth;
    var idx;
    var color;
    for (idx = 0; idx < iSize; ++idx)
    {
      color = (Math.random() > 0.8) ? WALL_COLOR : EMPTY_COLOR;
      this.arrTileMap.push(new TILE(idx, (color == EMPTY_COLOR), color));
    } // end of for loop

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
    // GetNorthTile
    //     Gets the tile north of the one passed in
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
