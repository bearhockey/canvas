var LEVEL = (function () {
  var level = {};
  level.arrTiles = [];
  level.iRowLength = 0;

  // move these to CAMERA
  var camera = {};
  camera.iPosX = 0;
  camera.iPosY = 0;

  level.Generate = function(iSize)
  {
    level.arrTiles.length = 0;
    var idx;
    for (idx = 0; idx < iSize; ++idx)
    {
      level.arrTiles.push(idx % 2);
    }

    level.iRowLength = Math.sqrt(iSize);
  };

  level.Update = function()
  {

  };

  level.Draw = function(ctx)
  {
    var xdx, ydx;
    var iRowOffset;
    var iTileIdx;
    var iTileLength = level.arrTiles.length;

    var iGridX;
    var iGridY = 0;

    for (ydx = camera.iPosY; ydx < camera.iPosY + GRID.iHeight; ++ydx)
    {
      iRowOffset = ydx * level.iRowLength;
      iGridX = 0;
      if (iRowOffset >= 0 && iRowOffset < iTileLength)
      {
        for (xdx = camera.iPosX; xdx < camera.iPosX + GRID.iWidth; ++xdx)
        {
          iTileIdx = iRowOffset + xdx;
          if (iTileIdx < iTileLength)
          {
            if (level.arrTiles[iTileIdx] > 0)
            {
              ctx.fillStyle = "grey";
            }
            else
            {
              ctx.fillStyle = "darkgrey";
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
