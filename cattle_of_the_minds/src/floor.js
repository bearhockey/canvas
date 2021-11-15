var FLOOR = (function () {
  // consts -- move these to a file probably
  const EMPTY_COLOR = "#DDDDDD";
  const WALL_COLOR = "#444444";
  var floor = function(iWidth, iSize=0)
  {
    this.iWidth = iWidth; // the height and width of the tile array
    this.arrTileMap = [];
    this.cNullTile = new TILE(-1, false, "#111111");

    var idx;
    var color;
    for (idx = 0; idx < iSize; ++idx)
    {
      color = (Math.random() > 0.8) ? WALL_COLOR : EMPTY_COLOR;
      this.arrTileMap.push(new TILE(idx, true, color));
    } // end of for loop

    // ----------------
    // GetAllTiles
    //     Returns the array of tile objects
    // ----------------
    this.GetAllTiles = function() { return this.arrTileMap; };

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
  }; // end of class

  return floor;
}());
