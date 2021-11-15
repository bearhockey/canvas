var RENDERER = (function () {
  var renderer = {};

  const GRID_SIZE = 15; // a box of AxA
  const TILE_SIZE = 64; // pixels sized nodes

  renderer.bShowGrid = true;
  renderer.iFocusIdx = 0;

  renderer.arrVisibleTiles = [];

  renderer.GetGridSize = function() { return GRID_SIZE; };

  // ----------------
  // Init
  //     Inits the renderer
  // ----------------
  renderer.Init = function()
  {
  };

  renderer.SetVisibleTiles = function(arrTiles, iCenterTileIdx)
  {
    renderer.arrVisibleTiles = arrTiles;
    renderer.iFocusIdx = iCenterTileIdx;
  };

  // ----------------
  // Draw
  //     Draws the main window
  // ----------------
  renderer.Draw = function(ctx, bShowImpassible=false, iSizeOverride=0)
  {
    var arrTiles = renderer.arrVisibleTiles;


    var idx;
    var iTilesLength = arrTiles.length;
    var cTile;
    var cEntity;

    var strTileColor;
    var iX, iY;

    var iGridSize = GRID_SIZE;
    if (iSizeOverride > 0 && iSizeOverride < GRID_SIZE)
    {
      iGridSize = iSizeOverride;
    }
    // because its a square, row == collumn
    var iDiff = GRID_SIZE - iGridSize;
    var iStartRow = Math.floor(iDiff / 2);
    var iEndRow = GRID_SIZE - Math.floor((iDiff + 1)/2);
    var iWidth = iEndRow - iStartRow;
    console.log("Stuff :", iStartRow, iEndRow, iWidth);

    ctx.beginPath();
    for (idx = 0; idx < iTilesLength; ++idx)
    {
      // probably a better way to do this, but
      iX = ((idx % iWidth) + iStartRow) * TILE_SIZE;
      iY = (Math.floor(idx / iWidth) + iStartRow) * TILE_SIZE;

      cTile = arrTiles[idx];
      if (cTile != null && cTile.IsDiscovered())
      {
        strTileColor = cTile.GetColor();
        ctx.fillStyle = strTileColor;
        ctx.fillRect(iX, iY, TILE_SIZE, TILE_SIZE);

        //if (bShowImpassible && !cNode.IsPassable())
        //{
        //  cNode.Draw(ctx, IMPASS_COLOR);
        //}
        //else
        //{
        //  cNode.Draw(ctx);
        //}
      }
    } // end for loop

    ctx.stroke();

    // draw the grid last so its on top
    if (renderer.bShowGrid)
    {
      renderer.DrawGrid(ctx);
    }
  };

  // ----------------
  // DrawGrid
  //     Draws the grid of the map - used for debug purposes
  // ----------------
  renderer.DrawGrid = function(ctx)
  {
    var idx, x;
    var iOffset = 0;
    var iEdge = GRID_SIZE * TILE_SIZE + iOffset;

    ctx.beginPath();
    x = iOffset;
    for (idx = 0; idx <= GRID_SIZE; ++idx)
    {
      ctx.moveTo(x, iOffset);
      ctx.lineTo(x, iEdge);
      x += TILE_SIZE;
    }

    x = iOffset;
    for (idx = 0; idx <= GRID_SIZE; ++idx)
    {
      ctx.moveTo(iOffset, x);
      ctx.lineTo(iEdge, x);
      x += TILE_SIZE;
    }

    ctx.strokeStyle = "#EEEEEE";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.stroke();

    ctx.setLineDash([]); // reset line dash
  };

  return renderer;
}());
