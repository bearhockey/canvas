var LEVEL = (function () {
  // TODO: maybe put these in a better const location
  const NORTH = 0;
  const EAST = 1;
  const SOUTH = 2;
  const WEST = 3;

  var level = {};
  level.arrTiles = [];
  level.iRowLength = 0;

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
  level.GetNorth = function(idx) { return idx - level.iRowLength; }
  level.GetSouth = function(idx)
  {
    if (idx + level.iRowLength >= level.arrTiles.length) { return -1; }
    else                                                 { return idx + level.iRowLength; }
  }
  level.GetEast  = function(idx)
  {
    if ((idx + 1) % level.iRowLength == 0) { return -1; }
    else                                   { return idx + 1; }
  }
  level.GetWest  = function(idx)
  {
    if (idx % level.iRowLength == 0) { return -1; }
    else                             {} return idx - 1; }

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

  level.GenerateTile = function(idx = -1)
  {
    if (idx < 0) { return; }
    var objTile = level.arrTiles[idx];
    var objNeighbor;
    var bHasExit = false;
    // connect doors if you can
    if (level.GetNorth(idx) >= 0)
    {
      objNeighbor = level.arrTiles[level.GetNorth(idx)];
      if (objNeighbor.value > 0 && objNeighbor.doors[SOUTH])
      {
        bHasExit = objTile.doors[NORTH] = true;
      }
    }

    if (level.GetEast(idx) >= 0)
    {
      objNeighbor = level.arrTiles[level.GetEast(idx)];
      if (objNeighbor.value > 0 && objNeighbor.doors[WEST])
      {
        bHasExit = objTile.doors[EAST] = true;
      }
    }

    if (level.GetSouth(idx) >= 0)
    {
      objNeighbor = level.arrTiles[level.GetSouth(idx)];
      if (objNeighbor.value > 0 && objNeighbor.doors[NORTH])
      {
        bHasExit = objTile.doors[SOUTH] = true;
      }
    }

    if (level.GetWest(idx) >= 0)
    {
      objNeighbor = level.arrTiles[level.GetWest(idx)];
      if (objNeighbor.value > 0 && objNeighbor.doors[EAST])
      {
        bHasExit = objTile.doors[WEST] = true;
      }
    }

    // if no exits then open all doors
    if (!bHasExit)
    {
      objTile.doors = [true, true, true, true];
    }
    else
    {
      var idx;
      for (idx = 0; idx < objTile.doors.length; ++idx)
      {
        if (!objTile.doors[idx])
        {
          var iRand = Math.floor(Math.random() * 100);
          if (iRand < 50) { objTile.doors[idx] = true; }
        }
      }
    }

    // show discovered state
    objTile.value = 1;
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

            ctx.fillRect(iX, iY, iSize, iSize);

            if (objTile.value > 0 && objTile.doors)
            {
              ctx.fillStyle = "yellow";
              if (objTile.doors[NORTH])
              {
                ctx.fillRect(iX + iSize/8, iY, iSize * (3/4), iDoorWidth);
              }
              if (objTile.doors[EAST])
              {
                ctx.fillRect(iX + iSize - iDoorWidth, iY + iSize/8, iDoorWidth, iSize * (3/4));
              }
              if (objTile.doors[SOUTH])
              {
                ctx.fillRect(iX + iSize/8, iY + iSize - iDoorWidth, iSize * (3/4), iDoorWidth);
              }
              if (objTile.doors[WEST])
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
