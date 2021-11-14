var RENDERER = (function () {
  var renderer = {};

  const GRID_SIZE = 12; // a box of AxA
  const TILE_SIZE = 64; // pixels sized nodes

  renderer.iBorder = 0; // size of the border (in pixels)
  renderer.bShowGrid = true;

  renderer.arrVisibleTiles = [];

  // ----------------
  // Init
  //     Inits the renderer
  // ----------------
  renderer.Init = function()
  {
  };

  // ----------------
  // Draw
  //     Draws the main window
  // ----------------
  renderer.Draw = function(ctx, bShowImpassible=false)
  {
    var arrNodes = renderer.arrVisibleNodes;
    if (renderer.bShowGrid)
    {
      renderer.DrawGrid(ctx);
    }

    var idx;
    // var iNodesLength = arrNodes.length;
    var cNode;
    var cEntity;

    //for (idx = 0; idx < iNodesLength; ++idx)
    //{
      //cNode = arrNodes[idx];
      //if (cNode != null)
      //{
        //if (bShowImpassible && !cNode.IsPassable())
        //{
        //  cNode.Draw(ctx, IMPASS_COLOR);
        //}
        //else
        //{
        //  cNode.Draw(ctx);
        //}
      //}
    //} // end for loop
  };

  // ----------------
  // DrawGrid
  //     Draws the grid of the map - used for debug purposes
  // ----------------
  renderer.DrawGrid = function(ctx)
  {
    console.log("DrawGrid");
    var idx, x;
    var iOffset = renderer.iBorder;
    ctx.beginPath();

    x = iOffset;
    for (idx = 0; idx <= GRID_SIZE; ++idx)
    {
      ctx.moveTo(x, iOffset);
      console.log("DrawGrid --->", x, iOffset);
      ctx.lineTo(x, GRID_SIZE*TILE_SIZE + iOffset);
      x += TILE_SIZE;
    }

    x = iOffset;
    for (idx = 0; idx <= GRID_SIZE; ++idx)
    {
      ctx.moveTo(iOffset, x);
      ctx.lineTo(GRID_SIZE*TILE_SIZE + iOffset, x);
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
