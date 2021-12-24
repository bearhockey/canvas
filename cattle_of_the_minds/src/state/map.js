var MINIMAP = (function () {
  var mmap = {};

  // ----------------
  // Draw
  //     Draws the main window
  // ----------------
  mmap.Draw = function(ctx, cFloor)
  {
    if (cFloor == null) { return; }

    var arrFloorTiles = cFloor.GetAllTiles();
    var iWidth = cFloor.GetFloorWidth();
    var iSize = Math.floor(GetCanvasWidth() / iWidth);

    var idx;
    var cTile;

    var arrEntities;
    var iEntityLength;
    var iEntityIdx;
    var cEntity;

    var iX, iY;

    var iTilesLength = arrFloorTiles.length;
    for (idx = 0; idx < iTilesLength; ++idx)
    {
      // probably a better way to do this, but
      iX = (idx % iWidth) * iSize;
      iY = Math.floor(idx / iWidth) * iSize;

      cTile = arrFloorTiles[idx];
      if (cTile != null && cTile.IsDiscovered())
      {
        // bIsVisible = (arrVisibleTiles.indexOf(cTile) >= 0);
        cTile.DrawTile(ctx, iX, iY, iSize, "FF", true);

        if (cTile.HasEntity()) // draw static entities maybe
        {
          // for now just draw the first entity
          arrEntities = cTile.GetEntities();
          iEntityLength = (arrEntities != null) ? arrEntities.length : 0;
          for (iEntityIdx = 0; iEntityIdx < iEntityLength; ++iEntityIdx)
          {
            cEntity = arrEntities[iEntityIdx];
            if (cEntity != null && cEntity.GetPawnType() == CONST.PAWN_STAIRS && typeof cEntity.GetIcon === 'function')
            {
              ctx.fillStyle = "#CCCC00";
              ctx.fillRect(iX, iY, iSize, iSize);
              break;
            }
          } // end of entity for loop
        }
      }
    } // end for loop
  };

  return mmap;
}());
