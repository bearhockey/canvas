var GRID = (function () {
  var grid = {};

  // at zoom level 1
  const GRID_SIZE = 256;
  const GRID_WIDTH = 3;

  grid.iCanvasWidth = 0; // should never change after init
  grid.iSize = GRID_SIZE; // size of each grid element
  grid.iWidth = GRID_WIDTH;
  grid.iHeight = GRID_WIDTH;
  grid.iPadding = 0;
  grid.iFactor = 2;
  grid.bShow = false;

  grid.Init = function(iCanvasWidth = 0)
  {
    grid.iCanvasWidth = iCanvasWidth;
    grid.Zoom();
  };

  grid.Zoom = function(iFactor = -1)
  {
    if (iFactor > 0)
    {
      grid.iFactor = iFactor;
    }
      grid.iSize = GRID_SIZE / grid.iFactor;
      var iWidth = GRID_WIDTH * grid.iFactor;
      // make sure the grid is always odd so there is a center
      if (iWidth % 2 == 0) { iWidth--; }
      grid.iWidth = grid.iHeight = iWidth;
      if (grid.iCanvasWidth > 0)
      {
        grid.iPadding = (grid.iCanvasWidth- (grid.iWidth * grid.iSize)) / 2;
      }
  };

  grid.Draw = function(ctx)
  {
    if (!grid.bShow) { return; } // early return - don't draw GRID

    var idx, x;
    x = grid.iPadding;
    ctx.beginPath();

    x = grid.iPadding;
    for (idx = 0; idx <= grid.iWidth; ++idx)
    {
      ctx.moveTo(x, grid.iPadding);
      ctx.lineTo(x, grid.iHeight*grid.iSize + grid.iPadding);
      x += grid.iSize;
    }

    x = grid.iPadding;
    for (idx = 0; idx <= grid.iHeight; ++idx)
    {
      ctx.moveTo(grid.iPadding, x);
      ctx.lineTo(grid.iWidth*grid.iSize + grid.iPadding, x);
      x += grid.iSize;
    }

    ctx.strokeStyle = "#EEEEEE";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.stroke();
  };

  grid.Normalize = function(x, iOffset = 0)
  {
    return grid.iPadding + (x * grid.iSize) + iOffset;
  };

  return grid;
}());
