var PLAYER = (function () {
  var player = function(idx, color = "black")
  {
    this.idx = idx;
    this.color = color;

    this.MoveNorth = function()
    {
      if (LEVEL.GetNorth(this.idx) > -1) { this.idx = LEVEL.GetNorth(this.idx); }
    }
    this.MoveSouth = function()
    {
      if (LEVEL.GetSouth(this.idx) > -1) { this.idx = LEVEL.GetSouth(this.idx); }
    }
    this.MoveEast = function()
    {
      if (LEVEL.GetEast(this.idx) > -1) { this.idx = LEVEL.GetEast(this.idx); }
    }
    this.MoveWest = function()
    {
      if (LEVEL.GetWest(this.idx) > -1) { this.idx = LEVEL.GetWest(this.idx); }
    }

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
