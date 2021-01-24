var LEVEL = (function () {
  var level = {};
  level.arrTiles = [];
  level.iRowLength = 0;

  // move these to CAMERA
  var camera = {};
  camera.iPosX = 0;
  camera.iPosY = 0;

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
      level.arrTiles.push(0);
    }

    level.iRowLength = Math.sqrt(iSize);
  };

  level.Update = function(idx = -1)
  {
    if (idx > -1 && idx < level.arrTiles.length)
    {
      level.arrTiles[idx] = 1;
    }
  };

  level.Draw = function(ctx)
  {
    var xdx, ydx;
    var iRowOffset;
    var iTileIdx;
    var iTileLength = level.arrTiles.length;

    var iGridX;
    var iGridY = 0;

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
            if (level.arrTiles[iTileIdx] > 0)
            {
              ctx.fillStyle = "darkgrey";
            }
            else
            {
              ctx.fillStyle = "black";
            }

            ctx.fillRect(GRID.Normalize(iGridX),
                         GRID.Normalize(iGridY),
                         GRID.iSize,
                         GRID.iSize);
          }
          iGridX++;
        } // end x loop
      } // end y check
      iGridY++;
    } // end y loop
  };

  return level;
}());
