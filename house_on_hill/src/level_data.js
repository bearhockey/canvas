var LEVEL = (function () {
  const TILE_PADDING = 2;

  var level = {};
  level.bInit = false;
  level.iRowLength = 0;
  level.arrTiles = [];

  level.GetTileByIndex = function(iTileIdx)
  {
    var bFound = false;
    var objTile = null;
    var idx;
    var iTiles = level.arrTiles.length;
    for (idx = 0; idx < iTiles; ++idx)
    {
      objTile = level.arrTiles[idx];
      if (objTile.idx == iTileIdx)
      {
        bFound = true;
        break;
      }
    } // end for loop

    return (bFound) ? objTile : null;
  };

  level.GetTileCords = function(iTileIdx)
  {
    var arrCords = [-1, -1];
    var objTile = level.GetTileByIndex(iTileIdx);
    if (objTile)
    {
      arrCords = [objTile.x, objTile.y];
    }
    var objTile = null;
    return arrCords;
  };

  level.Init = function()
  {
    bInit = true;
    // if (objData['iRowLength']) { level.iRowLength = parseInt(objData['iRowLength']); }
  };

  level.Update = function(arrTiles)
  {
    if (arrTiles) { level.arrTiles = arrTiles; }
    // console.log(level.arrTiles.length);
  };

  level.Draw = function(ctx)
  {
    // console.log("draw!");
    // console.log(CAMERA.iPosY);
    var idx;
    var iTileIdx;

    var iX, iY; // absolute pixel positions on the canvas
    var iSize = GRID.iSize;
    var iDoorWidth = iSize/32;
    var iDoorLength = iSize * (3/4);

    var objTile;
    var iNumTiles = level.arrTiles.length;
    for (idx = 0; idx < iNumTiles; ++idx)
    {
      objTile = level.arrTiles[idx];
      // console.log(objTile.x + iCamX);
      iX = GRID.Normalize(objTile.x - CAMERA.iPosX);
      iY = GRID.Normalize(objTile.y - CAMERA.iPosY);
      ctx.fillStyle = "#888888";
      ctx.fillRect(iX + TILE_PADDING,
                   iY + TILE_PADDING,
                   iSize - TILE_PADDING*2,
                   iSize - TILE_PADDING*2);
      if (objTile.arrDoors)
      {
        ctx.fillStyle = "#DDDD44";
        if (objTile.arrDoors[DIRECTION.NORTH])
        {
          ctx.fillRect(iX + iSize/8, iY, iDoorLength, iDoorWidth);
        }
        if (objTile.arrDoors[DIRECTION.EAST])
        {
          ctx.fillRect(iX + iSize - iDoorWidth, iY + iSize/8, iDoorWidth, iDoorLength);
        }
        if (objTile.arrDoors[DIRECTION.SOUTH])
        {
          ctx.fillRect(iX + iSize/8, iY + iSize - iDoorWidth, iDoorLength, iDoorWidth);
        }
        if (objTile.arrDoors[DIRECTION.WEST])
        {
          ctx.fillRect(iX, iY + iSize/8, iDoorWidth, iDoorLength);
        }
      }
    }

    /*
    for (ydx = CAMERA.iPosY; ydx < CAMERA.iPosY + GRID.iHeight; ++ydx)
    {
      iRowOffset = ydx * level.iRowLength;
      iGridX = 0;
      if (iRowOffset >= 0 && iRowOffset < level.iNumTiles)
      {
        for (xdx = CAMERA.iPosX; xdx < CAMERA.iPosX + GRID.iWidth; ++xdx)
        {
          iTileIdx = level.GetTileIndex(xdx, ydx);
          if (xdx >= 0 && xdx < level.iRowLength && iTileIdx < level.iNumTiles)
          {
            objTile = level.arrFloors[level.iCurrentFloor][iTileIdx];
            iX = GRID.Normalize(iGridX);
            iY = GRID.Normalize(iGridY);
            if (objTile.value > 0)
            {
              switch (objTile.iStairs)
              {
                case -1: ctx.fillStyle = "#AA8888"; break;
                case 1:  ctx.fillStyle = "#88AA88"; break
                default: ctx.fillStyle = "#888888"; break;
              } // end of switch
            }
            else
            {
              ctx.fillStyle = "black";
            }

            ctx.fillRect(iX + TILE_PADDING,
                         iY + TILE_PADDING,
                         iSize - TILE_PADDING*2,
                         iSize - TILE_PADDING*2);

            if (objTile.value > 0)
            {
              if (objTile.doors)
              ctx.fillStyle = "yellow";
              if (objTile.doors[DIRECTION.NORTH])
              {
                ctx.fillRect(iX + iSize/8, iY, iSize * (3/4), iDoorWidth);
              }
              if (objTile.doors[DIRECTION.EAST])
              {
                ctx.fillRect(iX + iSize - iDoorWidth, iY + iSize/8, iDoorWidth, iSize * (3/4));
              }
              if (objTile.doors[DIRECTION.SOUTH])
              {
                ctx.fillRect(iX + iSize/8, iY + iSize - iDoorWidth, iSize * (3/4), iDoorWidth);
              }
              if (objTile.doors[DIRECTION.WEST])
              {
                ctx.fillRect(iX, iY + iSize/8, iDoorWidth, iSize * (3/4));
              }

              if (objTile.label && GRID.iFactor < 3)
              {
                ctx.fillStyle = "white";
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowColor = "black";
                ctx.shadowBlur = 1;
                ctx.font = (GRID.iFactor == 1) ? "24px Arial ": "12px Arial";
                ctx.fillText(objTile.label, iX+10, iY+iSize - 10);
              }
            }
          }
          iGridX++;
        } // end x loop
      } // end y check
      iGridY++;
    } // end y loop
    */
  };

  return level;
}());
