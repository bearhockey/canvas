var GRID = (function () {
  var grid = {};

  grid.iSize = 64; // size of each grid element
  grid.iWidth = 8;
  grid.iHeight = 8;
  grid.iPadding = 16;

  grid.Draw = function(ctx)
  {
    var idx, x;
    x = grid.iPadding;
    ctx.beginPath();

    // for (idx = 0; idx <= grid.iWidth, 
  };

  grid.Normalize = function(x)
  {
    return (x * grid.iSize) - (grid.iPadding * 2);
  };

  return grid;
}());
