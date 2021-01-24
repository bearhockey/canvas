var GRID = (function () {
  var grid = {};

  grid.iSize = 64; // size of each grid element
  grid.iWidth = 9;
  grid.iHeight = 9;
  grid.iPadding = 0;

  grid.Init = function(iCanvasWidth = 0)
  {
    if (iCanvasWidth > 0)
    {
      grid.iPadding = (iCanvasWidth- (grid.iWidth * grid.iSize)) / 2;
    }
  };

  grid.Draw = function(ctx)
  {
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
