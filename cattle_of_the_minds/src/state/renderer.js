var RENDERER = (function () {
  var renderer = {};

  const GRID_SIZE = 15; // a box of AxA
  const TILE_SIZE = 64; // pixels sized nodes

  renderer.bShowGrid = true;
  renderer.iFocusIdx = 0;

  renderer.arrDrawnTiles   = [];
  renderer.arrVisibleTiles = [];
  renderer.arrVisiblePawns = [];

  renderer.GetGridSize = function() { return GRID_SIZE; };

  // ----------------
  // Init
  //     Inits the renderer
  // ----------------
  renderer.Init = function()
  {
  };

  // ----------------
  // SetVisibleTiles
  //     Sets the tiles to be drawn, the tiles to be "visibile",  and the center tile
  // ----------------
  renderer.SetVisibleTiles = function(arrDrawnTiles, arrSeenTiles, iCenterTileIdx=0)
  {
    renderer.arrDrawnTiles = arrDrawnTiles;
    renderer.arrVisibleTiles = arrSeenTiles;
    renderer.iFocusIdx = iCenterTileIdx;
  };

  // ----------------
  // SetVisiblePawns
  //     Sets the pawns that will be drawn
  // ----------------
  renderer.SetVisiblePawns = function(arrPawns)
  {
    renderer.arrVisiblePawns = arrPawns;
  };

  // ----------------
  // Draw
  //     Draws the main window
  // ----------------
  renderer.Draw = function(ctx, iSizeOverride=0)
  {
    var arrTiles = renderer.arrDrawnTiles;
    var arrVisibleTiles = renderer.arrVisibleTiles;

    var idx;
    var cTile;
    var bIsVisible;

    var arrEntities;
    var iEntityLength;
    var iEntityIdx;
    var cEntity;
    var strIcon;
    var imgEntity;

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

    ctx.beginPath();
    var iTilesLength = arrTiles.length;
    for (idx = 0; idx < iTilesLength; ++idx)
    {
      // probably a better way to do this, but
      iX = ((idx % iWidth) + iStartRow) * TILE_SIZE;
      iY = (Math.floor(idx / iWidth) + iStartRow) * TILE_SIZE;

      cTile = arrTiles[idx];
      if (cTile != null && cTile.IsDiscovered())
      {
        // console.log("Drawing tile at :", iX, iY);
        bIsVisible = (arrVisibleTiles.indexOf(cTile) >= 0);

        strTileColor = cTile.GetColor();
        ctx.fillStyle = (bIsVisible) ? strTileColor : strTileColor + "66";
        ctx.fillRect(iX, iY, TILE_SIZE, TILE_SIZE);

        if (bIsVisible && cTile.HasEntity())
        {
          // for now just draw the first entity
          arrEntities = cTile.GetEntities();
          iEntityLength = (arrEntities != null) ? arrEntities.length : 0;
          for (iEntityIdx = 0; iEntityIdx < iEntityLength; ++iEntityIdx)
          {
            cEntity = arrEntities[iEntityIdx];
            if (cEntity != null && typeof cEntity.GetIcon === 'function')
            {
              imgEntity = new Image();
              imgEntity.iX = iX;
              imgEntity.iY = iY;
              imgEntity.addEventListener('load', function()
              {
                ctx.drawImage(this, this.iX, this.iY);
              }, false);
              imgEntity.src = cEntity.GetIcon();
            }
          } // end of entity for loop
        }
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
