var CAMERA = (function () {
  var cam = {};

  cam.iPosX = 0;
  cam.iPosY = 0;
  cam.iFocusedTile = -1;

  cam.CenterOnPos = function(cCords)
  {
    // GRID.iFactor should always = Math.floor(GRID.iWidth)
    cam.iPosX = cCords[0] - GRID.iFactor;
    cam.iPosY = cCords[1] - GRID.iFactor;
  };

  cam.CenterOn = function(idx)
  {
    self.iFocusedTile = idx;
    cam.CenterOnPos(LEVEL.GetTileCords(idx));
  };

  cam.GetFocusedTile = function()
  {
    return cam.iFocusedTile;
  };

  return cam;
}());
