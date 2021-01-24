var PLAYER = (function () {
  var player = function(idx, color = "black")
  {
    this.idx = idx;
    this.color = color;

    this.Move = function(iDirection)
    {
      var iTileIdx = LEVEL.GetDirection(this.idx, iDirection);
      var objTile;
      if (iTileIdx > -1)
      {
        objTile = LEVEL.GetTile(this.idx);
        if (objTile.doors[iDirection])
        {
          this.idx = iTileIdx;
        }
      }
    };

    this.Update = function()
    {
      LEVEL.Update(this.idx);
    };

    this.Draw = function(ctx)
    {
      var cCords = LEVEL.GetTileCords(this.idx);
      var x = cCords.x - CAMERA.iPosX;
      var y = cCords.y - CAMERA.iPosY;
      ctx.fillStyle = this.color;
      var iSize = GRID.iSize / 2;
      ctx.fillRect(GRID.Normalize(x, iSize/2), GRID.Normalize(y, iSize/2), iSize, iSize);
    };
  };

  return player;
}());
